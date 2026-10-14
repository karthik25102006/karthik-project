/**
 * Life Translator - Document Content Extractor
 * 
 * Safely extracts text and processes document payloads for:
 * - Plain text (.txt) and pasted text
 * - PDF documents (.pdf) using pdf-parse
 * - Images (.png, .jpg, .jpeg) for multimodal AI processing
 */

import { PDFParse } from 'pdf-parse';

// Max document character limit to prevent token overflows and runaway costs
const MAX_TEXT_CHARACTERS = 50000;

/**
 * Extract readable content from uploaded file or text payload
 * @param {Object} input
 * @param {string} [input.text] - Raw pasted text or client-read text
 * @param {string} [input.fileBase64] - Base64 encoded file data (without data URL prefix)
 * @param {string} [input.fileName] - Original file name
 * @param {string} [input.mimeType] - MIME type of the document
 * @param {string} [input.category] - 'text' | 'pdf' | 'image'
 * @returns {Promise<Object>} Extracted document content and metadata
 */
export async function extractDocumentContent(input) {
  const { text, fileBase64, fileName = 'document', mimeType = 'text/plain', category = 'text' } = input;

  // 1. Pasted Text or Client-Provided Text
  if (text && typeof text === 'string' && text.trim().length > 0) {
    const trimmed = text.trim();
    const isTruncated = trimmed.length > MAX_TEXT_CHARACTERS;
    const processedText = isTruncated ? trimmed.slice(0, MAX_TEXT_CHARACTERS) : trimmed;

    return {
      success: true,
      category: 'text',
      fileName,
      mimeType: 'text/plain',
      extractedText: processedText,
      charCount: processedText.length,
      wordCount: countWords(processedText),
      isTruncated,
      truncationNotice: isTruncated
        ? `Document exceeded ${MAX_TEXT_CHARACTERS} characters. Content was truncated safely to avoid context window limits.`
        : null,
      multimodalPart: null,
      needsOcr: false,
    };
  }

  // 2. Base64 File Processing (PDF or Image)
  if (fileBase64) {
    // Strip data URI scheme prefix if present (e.g. "data:application/pdf;base64,")
    const cleanBase64 = fileBase64.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');

    // 2A. PDF Document Processing
    if (category === 'pdf' || mimeType === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf')) {
      try {
        const parser = new PDFParse({ data: buffer });
        await parser.load();
        const textResult = await parser.getText();
        const pdfText = (textResult.text || '').replace(/-- \d+ of \d+ --/g, '').trim();
        const pageCount = textResult.total || 1;

        // Check if PDF contains readable text or is a scanned image
        const hasSufficientText = pdfText.length >= 25;

        if (hasSufficientText) {
          const isTruncated = pdfText.length > MAX_TEXT_CHARACTERS;
          const processedText = isTruncated ? pdfText.slice(0, MAX_TEXT_CHARACTERS) : pdfText;

          return {
            success: true,
            category: 'pdf',
            fileName,
            mimeType: 'application/pdf',
            extractedText: processedText,
            charCount: processedText.length,
            wordCount: countWords(processedText),
            pageCount,
            isTruncated,
            truncationNotice: isTruncated
              ? `PDF text exceeded ${MAX_TEXT_CHARACTERS} characters. First ${MAX_TEXT_CHARACTERS} characters extracted.`
              : null,
            // Gemini also accepts raw PDF base64 for layout/visual analysis
            multimodalPart: {
              mimeType: 'application/pdf',
              data: cleanBase64,
            },
            needsOcr: false,
          };
        } else {
          // Scanned PDF / Image-based PDF
          return {
            success: true,
            category: 'pdf',
            fileName,
            mimeType: 'application/pdf',
            extractedText: '',
            charCount: 0,
            wordCount: 0,
            pageCount,
            isTruncated: false,
            needsOcr: true,
            ocrNotice: 'This PDF contains scanned image pages with little selectable text. Multimodal vision reading will be used to extract text and meaning.',
            multimodalPart: {
              mimeType: 'application/pdf',
              data: cleanBase64,
            },
          };
        }
      } catch (pdfErr) {
        // If pdf-parse fails on malformed PDF, fall back to multimodal binary
        return {
          success: true,
          category: 'pdf',
          fileName,
          mimeType: 'application/pdf',
          extractedText: '',
          charCount: 0,
          wordCount: 0,
          needsOcr: true,
          ocrNotice: `PDF text parser encountered formatting issues (${pdfErr.message}). Routing via multimodal document reader.`,
          multimodalPart: {
            mimeType: 'application/pdf',
            data: cleanBase64,
          },
        };
      }
    }

    // 2B. Image Documents (PNG, JPG, JPEG)
    if (category === 'image' || mimeType.startsWith('image/') || /\.(png|jpe?g)$/i.test(fileName)) {
      const normalizedMime = mimeType.startsWith('image/') ? mimeType : (
        fileName.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg'
      );

      return {
        success: true,
        category: 'image',
        fileName,
        mimeType: normalizedMime,
        extractedText: '', // Text will be extracted by the multimodal vision model
        charCount: 0,
        wordCount: 0,
        needsOcr: true,
        ocrNotice: 'Document image received. Multimodal OCR and visual comprehension will process the visual content directly.',
        multimodalPart: {
          mimeType: normalizedMime,
          data: cleanBase64,
        },
      };
    }
  }

  // If no content could be recognized
  throw new Error('No readable document content or file data was provided.');
}

/**
 * Word count helper
 */
function countWords(str) {
  if (!str || !str.trim()) return 0;
  return str.trim().split(/\s+/).length;
}
