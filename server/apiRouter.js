/**
 * Life Translator - Backend API Router & Middleware
 * 
 * Provides secure endpoints for document extraction, health checks,
 * session configuration, and AI-powered explanations.
 */

import { extractDocumentContent } from './extractor.js';
import { generateDocumentExplanation, answerDocumentQuestion, getSessionConfig, setSessionConfig } from './aiService.js';

/**
 * Middleware factory for Vite connect server or Express
 */
export function createApiMiddleware() {
  return async (req, res, next) => {
    // Only handle routes starting with /api/
    if (!req.url || !req.url.startsWith('/api/')) {
      return next ? next() : undefined;
    }

    // Set CORS and JSON response headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    const method = req.method.toUpperCase();
    if (method === 'OPTIONS') {
      res.statusCode = 204;
      return res.end();
    }

    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let pathname = url.pathname;

    // Normalize path for Vercel Serverless Function rewrites & query routes
    if (req.query && req.query.route) {
      const r = Array.isArray(req.query.route) ? req.query.route.join('/') : req.query.route;
      pathname = `/api/${r}`;
    } else if (url.searchParams.has('route')) {
      pathname = `/api/${url.searchParams.get('route')}`;
    }
    // Remove trailing slash if present (except root '/')
    if (pathname.length > 1 && pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1);
    }

    try {
      // 1. GET /api/health
      if (pathname === '/api/health' && method === 'GET') {
        const config = getSessionConfig();
        return sendJson(res, 200, {
          status: 'ok',
          service: 'Life Translator AI Backend',
          version: '1.0.0',
          provider: config.provider,
          model: config.model,
          isConfigured: config.isConfigured,
          hasSessionKey: config.hasSessionKey,
          hasEnvKey: config.hasEnvKey,
          timestamp: new Date().toISOString(),
        });
      }

      // 2. GET /api/models (List supported models)
      if (pathname === '/api/models' && method === 'GET') {
        const config = getSessionConfig();
        return sendJson(res, 200, {
          success: true,
          activeModel: config.model,
          supportedModels: ['gemini-3.8-flash', 'gemini-2.5-flash', 'gemini-1.5-flash-latest'],
        });
      }

      // 3. POST /api/configure-key (Session key configuration for hackathon testing)
      if (pathname === '/api/configure-key' && method === 'POST') {
        const body = await parseJsonBody(req);
        const { apiKey, provider } = body;

        setSessionConfig({ apiKey, provider });
        const config = getSessionConfig();

        return sendJson(res, 200, {
          success: true,
          message: apiKey 
            ? `API key configured in server memory for ${config.provider}.`
            : 'Session API key cleared. Reverting to environment variables.',
          provider: config.provider,
          isConfigured: config.isConfigured,
        });
      }

      // 3. POST /api/explain (Primary document explanation endpoint)
      if (pathname === '/api/explain' && method === 'POST') {
        const body = await parseJsonBody(req);
        const rawText = body.text || body.pastedText;
        const text = typeof rawText === 'string' ? rawText : '';
        const {
          fileBase64,
          fileName = 'document',
          mimeType = 'text/plain',
          category = 'text',
          sourceLang = 'auto',
          targetLang = 'en',
          sourceLangName = 'Auto-detected',
          targetLangName = 'English',
        } = body;

        // Validation: Ensure input exists
        const hasText = text && text.trim().length > 0;
        const hasFile = fileBase64 && typeof fileBase64 === 'string' && fileBase64.length > 0;

        if (!hasText && !hasFile) {
          return sendJson(res, 400, {
            success: false,
            error: 'EMPTY_INPUT',
            message: 'No document text or file data was provided. Please upload a file or paste text.',
          });
        }

        // Step 1: Content Extraction
        let extraction;
        try {
          extraction = await extractDocumentContent({
            text,
            fileBase64,
            fileName,
            mimeType,
            category,
          });
        } catch (extractErr) {
          return sendJson(res, 422, {
            success: false,
            error: 'EXTRACTION_FAILED',
            message: `Document content could not be extracted: ${extractErr.message}`,
          });
        }

        // Step 2: AI Explanation Generation
        let explanation;
        try {
          explanation = await generateDocumentExplanation({
            extractedText: extraction.extractedText,
            multimodalPart: extraction.multimodalPart,
            sourceLang,
            targetLang,
            sourceLangName,
            targetLangName,
            documentTitle: fileName || 'Uploaded Document',
          });
        } catch (aiErr) {
          // If API key is missing, return a structured, actionable 503 response
          if (aiErr.code === 'API_KEY_REQUIRED') {
            return sendJson(res, 503, {
              success: false,
              error: 'API_KEY_REQUIRED',
              provider: aiErr.provider,
              message: aiErr.message,
              setupSteps: [
                '1. Create a free API key at https://aistudio.google.com/app/apikey',
                '2. Add GEMINI_API_KEY=your_key to your .env file in the project root',
                '3. Or enter your key in the secure session settings on the website.',
              ],
              extractionMeta: {
                fileName: extraction.fileName,
                category: extraction.category,
                charCount: extraction.charCount,
                wordCount: extraction.wordCount,
                needsOcr: extraction.needsOcr,
                ocrNotice: extraction.ocrNotice,
              },
            });
          }

          if (aiErr.code === 'TIMEOUT') {
            return sendJson(res, 504, {
              success: false,
              error: 'TIMEOUT',
              message: aiErr.message,
            });
          }

          return sendJson(res, aiErr.status || 500, {
            success: false,
            error: 'AI_GENERATION_FAILED',
            message: aiErr.message || 'An unexpected error occurred while communicating with the AI service.',
            provider: aiErr.provider || 'gemini',
          });
        }

        // Success: Return structured explanation + extraction metadata
        return sendJson(res, 200, {
          success: true,
          explanation,
          extractionMeta: {
            fileName: extraction.fileName,
            category: extraction.category,
            mimeType: extraction.mimeType,
            charCount: extraction.charCount,
            wordCount: extraction.wordCount,
            pageCount: extraction.pageCount,
            isTruncated: extraction.isTruncated,
            truncationNotice: extraction.truncationNotice,
            needsOcr: extraction.needsOcr,
            ocrNotice: extraction.ocrNotice,
          },
          processedAt: new Date().toISOString(),
        });
      }

      // 4. POST /api/ask (Ask My Document grounded Q&A endpoint)
      if (pathname === '/api/ask' && method === 'POST') {
        const body = await parseJsonBody(req);
        const {
          question,
          fileBase64,
          fileName = 'document',
          mimeType = 'text/plain',
          category = 'text',
          sourceLang = 'auto',
          targetLang = 'en',
          sourceLangName = 'Auto-detected',
          targetLangName = 'English',
        } = body;

        const rawText = body.text || body.pastedText;
        const text = typeof rawText === 'string' ? rawText : '';

        // Validation: question must be present
        if (!question || typeof question !== 'string' || !question.trim()) {
          return sendJson(res, 400, {
            success: false,
            error: 'MISSING_QUESTION',
            message: 'Please provide a valid question to ask about the document.',
          });
        }

        const hasText = text && text.trim().length > 0;
        const hasFile = fileBase64 && typeof fileBase64 === 'string' && fileBase64.length > 0;

        if (!hasText && !hasFile) {
          return sendJson(res, 400, {
            success: false,
            error: 'EMPTY_INPUT',
            message: 'No document text or file data was provided for Q&A.',
          });
        }

        // Content Extraction
        let extraction;
        try {
          extraction = await extractDocumentContent({
            text,
            fileBase64,
            fileName,
            mimeType,
            category,
          });
        } catch (extractErr) {
          return sendJson(res, 422, {
            success: false,
            error: 'EXTRACTION_FAILED',
            message: `Document content could not be extracted: ${extractErr.message}`,
          });
        }

        // Q&A Execution
        try {
          const answerData = await answerDocumentQuestion({
            question: question.trim(),
            extractedText: extraction.extractedText,
            multimodalPart: extraction.multimodalPart,
            sourceLang,
            targetLang,
            sourceLangName,
            targetLangName,
            documentTitle: fileName || 'Document',
          });

          return sendJson(res, 200, {
            success: true,
            question: question.trim(),
            answer: answerData,
            targetLang,
            targetLangName,
            answeredAt: new Date().toISOString(),
          });
        } catch (aiErr) {
          if (aiErr.code === 'API_KEY_REQUIRED') {
            return sendJson(res, 503, {
              success: false,
              error: 'API_KEY_REQUIRED',
              provider: aiErr.provider,
              message: aiErr.message,
              setupSteps: [
                '1. Create a free API key at https://aistudio.google.com/app/apikey',
                '2. Add GEMINI_API_KEY=your_key to your .env file in the project root',
                '3. Or enter your key in the secure session settings on the website.',
              ],
            });
          }

          if (aiErr.code === 'TIMEOUT') {
            return sendJson(res, 504, {
              success: false,
              error: 'TIMEOUT',
              message: aiErr.message,
            });
          }

          return sendJson(res, aiErr.status || 500, {
            success: false,
            error: 'AI_QNA_FAILED',
            message: aiErr.message || 'An error occurred while answering your question.',
            provider: aiErr.provider || 'gemini',
          });
        }
      }

      // Route not found
      return sendJson(res, 404, {
        success: false,
        error: 'NOT_FOUND',
        message: `API endpoint '${pathname}' not found.`,
      });
    } catch (err) {
      return sendJson(res, 500, {
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: err.message || 'Internal server error occurred.',
      });
    }
  };
}

/**
 * Helper to safely parse JSON body from incoming stream
 */
function parseJsonBody(req) {
  // If body is already parsed by Vercel Serverless runtime or Express
  if (req.body && typeof req.body === 'object') {
    return Promise.resolve(req.body);
  }
  if (typeof req.body === 'string' && req.body.trim()) {
    try {
      return Promise.resolve(JSON.parse(req.body));
    } catch {
      // fallback to reading stream
    }
  }

  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      // Safeguard: reject payloads exceeding 15MB
      if (data.length > 15 * 1024 * 1024) {
        reject(new Error('Payload too large. Maximum size is 15MB.'));
      }
    });
    req.on('end', () => {
      if (!data.trim()) return resolve({});
      try {
        const json = JSON.parse(data);
        resolve(json);
      } catch (err) {
        reject(new Error(`Invalid JSON request body: ${err.message}`));
      }
    });
    req.on('error', (err) => reject(err));
  });
}

/**
 * Helper to write JSON HTTP response
 */
function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.end(JSON.stringify(data));
}
