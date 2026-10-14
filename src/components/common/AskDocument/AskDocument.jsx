import React, { useState } from 'react';
import Card from '../Card/Card';
import Badge from '../Badge/Badge';
import Button from '../Button/Button';
import './AskDocument.css';

/**
 * Ask My Document Component (Stage 6 Feature)
 * 
 * Simple, strictly-grounded question-and-answer interface that queries
 * the current document text using the backend AI service.
 */
export function AskDocument({
  preparedDocument,
  sourceLang = 'auto',
  targetLang = 'en',
  sourceLangName = 'Auto-detected',
  targetLangName = 'English',
  isTelugu = false,
  documentTitle = 'Document',
}) {
  const [questionInput, setQuestionInput] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [qnaList, setQnaList] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  // Suggested quick questions (frequently asked by citizens/farmers/students)
  const quickQuestions = isTelugu
    ? [
        'దరఖాస్తుకు చివరి తేదీ ఎప్పుడు?',
        'సమర్పించాల్సిన ముఖ్యమైన పత్రాలు ఏమిటి?',
        'ఏవైనా ఫీజులు లేదా జరిమానాలు ఉన్నాయా?',
        'ఈ పథకానికి ఎవరు అర్హులు?',
        'ఎక్కడ దరఖాస్తు చేయాలి లేదా ఎవరిని కలవాలి?',
      ]
    : [
        'What is the final application deadline?',
        'What documents or certificates are required?',
        'Are there any fees, amounts, or late penalties?',
        'Who is eligible according to this notice?',
        'Where do I submit or visit in person?',
      ];

  const handleAskQuestion = async (qText) => {
    const query = (qText || questionInput).trim();
    if (!query) return;

    setIsAsking(true);
    setErrorMsg(null);

    // Build payload using current document state (full text preferred over preview snippet)
    const docText = preparedDocument?.textContent || preparedDocument?.previewSnippet || '';
    const payload = {
      question: query,
      text: docText,
      fileName: preparedDocument?.title || documentTitle,
      sourceLang,
      targetLang,
      sourceLangName,
      targetLangName,
    };

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(
          data.message || (isTelugu ? 'సమాధానం పొందడంలో సమస్య ఎదురైంది.' : 'Could not retrieve answer.')
        );
      } else {
        const newEntry = {
          id: Date.now(),
          question: query,
          answer: data.answer?.answer || data.answer,
          isFoundInDocument: data.answer?.isFoundInDocument !== false,
          sourceQuote: data.answer?.sourceQuote || null,
          verificationTip: data.answer?.verificationTip || null,
          unclearAspect: data.answer?.unclearAspect || null,
          timestamp: new Date().toLocaleTimeString(),
        };

        setQnaList((prev) => [newEntry, ...prev]);
        setQuestionInput('');
      }
    } catch (err) {
      setErrorMsg(
        err.message || (isTelugu ? 'నెట్‌వర్క్ సమస్య ఏర్పడింది.' : 'Network error communicating with AI server.')
      );
    } finally {
      setIsAsking(false);
    }
  };

  const handleClearQna = () => {
    setQnaList([]);
    setErrorMsg(null);
  };

  return (
    <Card variant="default" padding="lg" className="lt-ask-card">
      <div className="lt-ask__header">
        <div className="lt-ask__icon-wrap" aria-hidden="true">💬</div>
        <div>
          <div className="lt-ask__badge-row">
            <Badge variant="primary">
              {isTelugu ? 'దశ 6: పత్రంపై సందేహాలు (Q&A)' : 'Stage 6: Ask My Document'}
            </Badge>
            <Badge variant="warning">
              {isTelugu ? 'పత్రం ఆధారంగా మాత్రమే సమాధానం' : 'Strictly Grounded Answers'}
            </Badge>
          </div>
          <h3 className="lt-ask__title">
            {isTelugu ? 'పత్రం గురించి నిర్దిష్ట ప్రశ్నలు అడగండి' : 'Ask Questions About This Document'}
          </h3>
          <p className="lt-ask__subtitle">
            {isTelugu
              ? `ఈ పత్రం ("${documentTitle}") లోని వాస్తవాల ఆధారంగా మాత్రమే సమాధానాలు ఇవ్వబడతాయి. పత్రంలో లేని సమాచారాన్ని ఊహించము.`
              : `Ask direct questions about "${documentTitle}". Answers are grounded strictly in the source text, never invented.`}
          </p>
        </div>
      </div>

      {/* Suggested Quick Questions */}
      <div className="lt-ask__quick-section">
        <span className="lt-ask__quick-label">
          {isTelugu ? 'త్వరిత ప్రశ్నలు:' : 'Suggested Questions:'}
        </span>
        <div className="lt-ask__pills">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              className="lt-ask__pill"
              onClick={() => {
                setQuestionInput(q);
                handleAskQuestion(q);
              }}
              disabled={isAsking}
            >
              <span>❓</span> {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        className="lt-ask__form"
        onSubmit={(e) => {
          e.preventDefault();
          handleAskQuestion();
        }}
      >
        <div className="lt-ask__input-row">
          <input
            type="text"
            className="lt-ask__input"
            placeholder={
              isTelugu
                ? 'ఉదాహరణ: చివరి తేదీ ఎప్పుడు? ఫీజు ఎంత? ఎవరు దరఖాస్తు చేయవచ్చు?'
                : 'e.g. When is the last date? What documents must I attach? Who is eligible?'
            }
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            disabled={isAsking}
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isAsking || !questionInput.trim()}
          >
            {isAsking ? (
              <span>⏳ {isTelugu ? 'పరిశీలిస్తోంది...' : 'Thinking...'}</span>
            ) : (
              <span>🔍 {isTelugu ? 'అడగండి' : 'Ask Document'}</span>
            )}
          </Button>
        </div>
      </form>

      {/* Error Notice */}
      {errorMsg && (
        <div className="lt-ask__error" role="alert">
          <span aria-hidden="true">⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Q&A List */}
      {qnaList.length > 0 && (
        <div className="lt-ask__results">
          <div className="lt-ask__results-header">
            <span className="lt-ask__results-title">
              {isTelugu ? 'సమాధానాలు' : 'Answers from Document'} ({qnaList.length})
            </span>
            <button
              type="button"
              className="lt-ask__clear-btn"
              onClick={handleClearQna}
            >
              🗑️ {isTelugu ? 'జాబితాను క్లియర్ చేయండి' : 'Clear History'}
            </button>
          </div>

          <div className="lt-ask__list">
            {qnaList.map((item) => (
              <div
                key={item.id}
                className={`lt-ask__item ${!item.isFoundInDocument ? 'lt-ask__item--not-found' : ''}`}
              >
                <div className="lt-ask__item-q">
                  <span className="lt-ask__q-tag">Q:</span>
                  <strong>{item.question}</strong>
                  <span className="lt-ask__item-time">{item.timestamp}</span>
                </div>

                <div className="lt-ask__item-a">
                  <span className="lt-ask__a-tag">A:</span>
                  <p className="lt-ask__a-text">{item.answer}</p>
                </div>

                {item.sourceQuote && item.sourceQuote !== 'Not stated in the document' && (
                  <div className="lt-ask__item-quote">
                    <span className="lt-ask__quote-badge">
                      {isTelugu ? 'మూల వాక్యం' : 'Document Evidence'}:
                    </span>{' '}
                    "{item.sourceQuote}"
                  </div>
                )}

                {!item.isFoundInDocument && (
                  <div className="lt-ask__not-found-badge">
                    <span>ℹ️</span>{' '}
                    {isTelugu
                      ? 'ఈ వివరాలు సమర్పించిన పత్రంలో స్పష్టంగా పేర్కొనబడలేదు.'
                      : 'This specific detail is not explicitly stated in the uploaded document text.'}
                  </div>
                )}

                {item.verificationTip && (
                  <div className="lt-ask__verification-tip">
                    <span>💡 {isTelugu ? 'సూచన:' : 'Verification Tip:'}</span> {item.verificationTip}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

export default AskDocument;
