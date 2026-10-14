import React, { useState } from 'react';
import Card from '../Card/Card';
import Badge from '../Badge/Badge';
import Button from '../Button/Button';
import LifeActionMap from '../LifeActionMap/LifeActionMap';
import AskDocument from '../AskDocument/AskDocument';
import './ExplanationView.css';

/**
 * Stage 4 - AI-Powered Document Explanation Component
 * With Stages 5 (Life Action Map), 6 (Ask My Document), and Accessibility Read-Aloud
 */
export function ExplanationView({
  explanation,
  extractionMeta,
  preparedDocument,
  isLoading,
  error,
  onRetry,
  onReset,
  onConfigureKey,
  isTelugu = false,
  sourceLang = 'auto',
  targetLang = 'en',
  sourceLangName = 'Auto-detected',
  targetLangName = 'English',
}) {
  const [sessionKeyInput, setSessionKeyInput] = useState('');
  const [isConfiguringKey, setIsConfiguringKey] = useState(false);
  const [configSuccessMsg, setConfigSuccessMsg] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="lt-explanation-loading" role="status" aria-live="polite">
        <div className="lt-spinner" aria-hidden="true"></div>
        <h3 className="lt-explanation-loading__title">
          {isTelugu ? 'మీ పత్రాన్ని చదువుతున్నాము మరియు వివరణను సిద్ధం చేస్తున్నాము...' : 'Reading your document and preparing your explanation...'}
        </h3>
        <p className="lt-explanation-loading__sub">
          {isTelugu
            ? 'ఏఐ మోడల్ ముఖ్యమైన వివరాలు, గడువు తేదీలు మరియు తదుపరి చర్యలను సేకరిస్తోంది. దయచేసి వేచి ఉండండి.'
            : 'Connecting to AI model to extract verified facts, dates, requirements, and next steps. Please wait...'}
        </p>
      </div>
    );
  }

  // 2. Error State / Missing API Key State
  if (error) {
    const isKeyRequired = error.error === 'API_KEY_REQUIRED' || error.code === 'API_KEY_REQUIRED';

    const handleSaveKey = async (e) => {
      e.preventDefault();
      if (!sessionKeyInput.trim()) return;
      setIsConfiguringKey(true);
      setConfigSuccessMsg(null);
      try {
        const res = await fetch('/api/configure-key', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ apiKey: sessionKeyInput.trim() }),
        });
        const data = await res.json();
        if (data.success) {
          setConfigSuccessMsg(
            isTelugu
              ? 'ఏపీఐ కీ విజయవంతంగా కాన్ఫిగర్ చేయబడింది! ఇప్పుడు "మళ్లీ ప్రయత్నించండి" క్లిక్ చేయండి.'
              : 'API key configured in server memory! Click "Retry Explanation" below to run the real AI analysis.'
          );
          if (onConfigureKey) onConfigureKey(sessionKeyInput.trim());
        }
      } catch (err) {
        alert(`Failed to save key: ${err.message}`);
      } finally {
        setIsConfiguringKey(false);
      }
    };

    return (
      <div className="lt-explanation-error" role="alert">
        <Card variant="elevated" padding="lg">
          <div className="lt-explanation-error__header">
            <span className="lt-explanation-error__icon" aria-hidden="true">
              {isKeyRequired ? '🔑' : '⚠️'}
            </span>
            <div>
              <h3 className="lt-explanation-error__title">
                {isKeyRequired
                  ? (isTelugu ? 'బ్యాకెండ్ ఏఐ కీ కాన్ఫిగరేషన్ అవసరం' : 'Backend AI Key Required')
                  : (isTelugu ? 'వివరణ ప్రాసెసింగ్‌లో సమస్య ఎదురైంది' : 'Explanation Processing Error')}
              </h3>
              <p className="lt-explanation-error__desc">{error.message}</p>
            </div>
          </div>

          {/* Setup Instructions if API Key is Missing */}
          {isKeyRequired && (
            <div className="lt-key-setup-box">
              <h4 className="lt-key-setup-box__title">
                {isTelugu ? 'నిజమైన ఏఐ విశ్లేషణను ఎలా సెటప్ చేయాలి:' : 'How to Enable Real AI Explanations:'}
              </h4>
              <ol className="lt-key-setup-box__steps">
                <li>
                  {isTelugu ? 'ఉచిత గూగుల్ జెమిని ఏపీఐ కీని పొందండి:' : 'Get a free Google Gemini API key at:'}{' '}
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lt-link"
                  >
                    https://aistudio.google.com/app/apikey ↗
                  </a>
                </li>
                <li>
                  {isTelugu
                    ? 'ప్రాజెక్ట్ రూట్‌లో .env ఫైల్‌ను సృష్టించండి: GEMINI_API_KEY=your_key'
                    : 'Create a .env file in the project root: GEMINI_API_KEY=your_actual_key_here'}
                </li>
                <li>
                  {isTelugu
                    ? 'లేదా క్రింద ఉన్న ఫీల్డ్‌లో మీ ఏపీఐ కీని నమోదు చేసి నేరుగా బ్రౌజర్ సెషన్‌లో పరీక్షించండి:'
                    : 'Or enter your key below to test immediately in this browser session (saved in backend memory only):'}
                </li>
              </ol>

              <form onSubmit={handleSaveKey} className="lt-key-setup-form">
                <input
                  type="password"
                  className="lt-key-input"
                  placeholder="Paste AI API key (e.g., AIzaSy...)"
                  value={sessionKeyInput}
                  onChange={(e) => setSessionKeyInput(e.target.value)}
                  aria-label="AI API Key"
                />
                <Button variant="primary" size="sm" type="submit" disabled={isConfiguringKey || !sessionKeyInput.trim()}>
                  {isConfiguringKey ? (isTelugu ? 'సేవ్ చేస్తోంది...' : 'Saving...') : (isTelugu ? 'కీ సేవ్ చేయండి' : 'Save Key')}
                </Button>
              </form>

              {configSuccessMsg && (
                <div className="lt-key-success-msg" role="status">
                  ✓ {configSuccessMsg}
                </div>
              )}
            </div>
          )}

          <div className="lt-explanation-error__actions">
            <Button variant="primary" size="md" onClick={onRetry}>
              🔄 {isTelugu ? 'మళ్లీ ప్రయత్నించండి' : 'Retry Explanation'}
            </Button>
            <Button variant="outline" size="md" onClick={onReset}>
              ← {isTelugu ? 'పత్రాల విభాగానికి తిరిగి వెళ్లండి' : 'Back to Workspace'}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // 3. Empty or No-Data State
  if (!explanation) return null;

  // Extract structured fields
  const {
    documentTitle = 'Analyzed Document',
    targetExplanationLanguage = 'English',
    summary = {},
    importantInformation = [],
    importantDates = [],
    requirementsAndConditions = [],
    importantWarnings = [],
    suggestedNextSteps = [],
    whatIsUnclear = [],
    sourceEvidence = [],
    domainSafeguardNotice,
  } = explanation;

  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      alert(isTelugu ? 'మీ బ్రౌజర్ ఆడియో రీడర్‌కు మద్దతు ఇవ్వదు.' : 'Speech synthesis is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToRead = `${summary.whatIsIt || ''}. ${summary.whyItMatters || ''}. ${summary.mainPurpose || ''}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);

    if (targetLang === 'te') utterance.lang = 'te-IN';
    else if (targetLang === 'hi') utterance.lang = 'hi-IN';
    else utterance.lang = 'en-US';

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <div className="lt-explanation-results" id="explanation-results" role="region" aria-label="Document Explanation">
      {/* Top Banner / Document Meta */}
      <div className="lt-explanation-meta-banner">
        <div className="lt-explanation-meta-banner__main">
          <Badge variant="teal" size="sm">
            {isTelugu ? 'దశ 4 ఏఐ వివరణ' : 'Stage 4 AI Explanation'}
          </Badge>
          <h2 className="lt-explanation-meta-banner__title">
            📄 {documentTitle}
          </h2>
          <div className="lt-explanation-meta-banner__badges">
            <Badge variant="navy" size="sm">
              🌐 {isTelugu ? `వివరణ భాష: ${targetExplanationLanguage}` : `Explained in: ${targetExplanationLanguage}`}
            </Badge>
            {extractionMeta?.pageCount && (
              <Badge variant="neutral" size="sm">
                📑 {extractionMeta.pageCount} {extractionMeta.pageCount === 1 ? 'Page' : 'Pages'}
              </Badge>
            )}
            {extractionMeta?.wordCount > 0 && (
              <Badge variant="neutral" size="sm">
                📝 {extractionMeta.wordCount} {isTelugu ? 'పదాలు' : 'words'}
              </Badge>
            )}
            <Badge variant="teal" size="sm">
              🔒 {isTelugu ? 'నిజమైన ఏఐ విశ్లేషణ' : 'Verified Fact-Grounded'}
            </Badge>
          </div>
        </div>

        <div className="lt-explanation-meta-banner__actions">
          <Button variant="outline" size="sm" onClick={onReset}>
            ← {isTelugu ? 'వేరొక పత్రం' : 'Analyze Another'}
          </Button>
        </div>
      </div>

      {/* Notice if OCR / Vision was required */}
      {extractionMeta?.ocrNotice && (
        <div className="lt-ocr-notice" role="note">
          <span aria-hidden="true">👁️</span>
          <span>{extractionMeta.ocrNotice}</span>
        </div>
      )}

      {/* Section A: Simple Summary */}
      <Card variant="default" padding="lg" className="lt-result-card">
        <div className="lt-result-card__header">
          <span className="lt-result-card__icon" aria-hidden="true">💡</span>
          <div>
            <h3 className="lt-result-card__title">
              {isTelugu ? 'ఎ. సులభమైన సారాంశం (Simple Summary)' : 'A. Simple Summary'}
            </h3>
            <p className="lt-result-card__subtitle">
              {isTelugu ? 'ఈ పత్రం ఏమిటి మరియు ఇది మీకు ఎందుకు ముఖ్యమో సులభమైన భాషలో:' : 'What this document is about and why it matters in plain language:'}
            </p>
          </div>
          <button
            type="button"
            className={`lt-read-aloud-btn ${isSpeaking ? 'lt-read-aloud-btn--active' : ''}`}
            onClick={handleToggleSpeech}
            aria-label={isSpeaking ? 'Stop reading' : 'Read aloud'}
          >
            {isSpeaking
              ? (isTelugu ? '⏹ ఆపండి' : '⏹ Stop Reading')
              : (isTelugu ? '🔊 వినండి (Read Aloud)' : '🔊 Read Aloud')}
          </button>
        </div>

        <div className="lt-summary-grid">
          <div className="lt-summary-item">
            <h4 className="lt-summary-item__label">
              📌 {isTelugu ? 'ఈ పత్రం ఏమిటి?' : 'What is this document?'}
            </h4>
            <p className="lt-summary-item__text">{summary.whatIsIt || 'Not specified'}</p>
          </div>

          <div className="lt-summary-item">
            <h4 className="lt-summary-item__label">
              ⭐ {isTelugu ? 'ఇది ఎందుకు ముఖ్యం?' : 'Why might it matter?'}
            </h4>
            <p className="lt-summary-item__text">{summary.whyItMatters || 'Not specified'}</p>
          </div>

          <div className="lt-summary-item">
            <h4 className="lt-summary-item__label">
              🎯 {isTelugu ? 'ప్రధాన ఉద్దేశ్యం' : 'Main Purpose'}
            </h4>
            <p className="lt-summary-item__text">{summary.mainPurpose || 'Not specified'}</p>
          </div>
        </div>
      </Card>

      {/* Section B: Important Information */}
      <Card variant="default" padding="lg" className="lt-result-card">
        <div className="lt-result-card__header">
          <span className="lt-result-card__icon" aria-hidden="true">📋</span>
          <div>
            <h3 className="lt-result-card__title">
              {isTelugu ? 'బి. ముఖ్యమైన సమాచారం (Important Information)' : 'B. Important Information'}
            </h3>
            <p className="lt-result-card__subtitle">
              {isTelugu ? 'పత్రంలో నేరుగా పేర్కొన్న ముఖ్య వాస్తవాలు మాత్రమే (లేకపోతే "పేర్కొనబడలేదు" అని ఉంటుంది):' : 'Key facts explicitly stated in the document (unmentioned fields are strictly labeled "Not specified"): '}
            </p>
          </div>
        </div>

        <div className="lt-info-grid">
          {importantInformation.map((item, idx) => (
            <div key={idx} className="lt-info-item">
              <span className="lt-info-item__label">{item.label}</span>
              <span className={`lt-info-item__value ${item.value === 'Not specified in the document' ? 'is-missing' : ''}`}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Section C: Important Dates & Deadlines */}
      <Card variant="default" padding="lg" className="lt-result-card">
        <div className="lt-result-card__header">
          <span className="lt-result-card__icon" aria-hidden="true">📅</span>
          <div>
            <h3 className="lt-result-card__title">
              {isTelugu ? 'సి. ముఖ్యమైన తేదీలు & గడువులు (Important Dates & Deadlines)' : 'C. Important Dates & Deadlines'}
            </h3>
            <p className="lt-result-card__subtitle">
              {isTelugu ? 'దరఖాస్తు గడువులు, చెల్లింపు తేదీలు మరియు సమావేశాలు:' : 'Strictly verified application deadlines, payment dates, and cutoffs:'}
            </p>
          </div>
        </div>

        {importantDates.length === 0 ? (
          <p className="lt-empty-section-notice">
            {isTelugu ? 'ఈ పత్రంలో నిర్దిష్ట గడువు తేదీలు ఏవీ పేర్కొనబడలేదు.' : 'No specific dates or deadlines were mentioned in this document.'}
          </p>
        ) : (
          <div className="lt-dates-list">
            {importantDates.map((d, idx) => (
              <div key={idx} className="lt-date-card">
                <div className="lt-date-card__badge-row">
                  <span className="lt-date-card__date">{d.date}</span>
                  <Badge variant="navy" size="sm">{d.type}</Badge>
                </div>
                <p className="lt-date-card__desc">{d.description}</p>
                {d.sourceQuote && (
                  <blockquote className="lt-date-card__quote">
                    "{d.sourceQuote}"
                  </blockquote>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Section D: Requirements and Conditions */}
      <Card variant="default" padding="lg" className="lt-result-card">
        <div className="lt-result-card__header">
          <span className="lt-result-card__icon" aria-hidden="true">⚖️</span>
          <div>
            <h3 className="lt-result-card__title">
              {isTelugu ? 'డి. అర్హత నిబంధనలు & షరతులు (Requirements & Conditions)' : 'D. Requirements and Conditions'}
            </h3>
            <p className="lt-result-card__subtitle">
              {isTelugu ? 'ఎవరు అర్హులు, ఏ నిబంధనలు వర్తిస్తాయి మరియు ఏవి అస్పష్టంగా ఉన్నాయి:' : 'Who qualifies, mandatory conditions, and verified criteria:'}
            </p>
          </div>
        </div>

        {requirementsAndConditions.length === 0 ? (
          <p className="lt-empty-section-notice">
            {isTelugu ? 'ఈ పత్రంలో నిర్దిష్ట అర్హత నిబంధనలు పేర్కొనబడలేదు.' : 'No eligibility requirements or criteria were stated in this document.'}
          </p>
        ) : (
          <div className="lt-reqs-list">
            {requirementsAndConditions.map((req, idx) => (
              <div key={idx} className="lt-req-card">
                <div className="lt-req-card__header">
                  <strong>{req.condition}</strong>
                  <Badge variant={req.status?.toLowerCase().includes('mandatory') ? 'accent' : 'neutral'} size="sm">
                    {req.status}
                  </Badge>
                </div>
                <p className="lt-req-card__details">{req.details}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Section E: Important Warnings */}
      {importantWarnings.length > 0 && (
        <Card variant="accent" padding="lg" className="lt-result-card lt-result-card--warning">
          <div className="lt-result-card__header">
            <span className="lt-result-card__icon" aria-hidden="true">⚠️</span>
            <div>
              <h3 className="lt-result-card__title">
                {isTelugu ? 'ఇ. ముఖ్యమైన హెచ్చరికలు & పరిమితులు (Important Warnings)' : 'E. Important Warnings'}
              </h3>
              <p className="lt-result-card__subtitle">
                {isTelugu ? 'పత్రంలో స్పష్టంగా పేర్కొన్న ఆంక్షలు, జరిమానాలు లేదా తప్పిపోయిన వివరాలు:' : 'Restrictions, penalties, or critical notices explicitly supported by the document:'}
              </p>
            </div>
          </div>

          <div className="lt-warnings-list">
            {importantWarnings.map((w, idx) => (
              <div key={idx} className="lt-warning-item">
                <div className="lt-warning-item__text">
                  <strong>{w.warning}</strong>
                  {w.sourceText && (
                    <span className="lt-warning-item__source">
                      Source text: "{w.sourceText}"
                    </span>
                  )}
                </div>
                <Badge variant="error" size="sm">
                  {w.severity?.toUpperCase() || 'WARNING'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Section F: Suggested Next Steps (Bridge to Stage 5) */}
      <Card variant="elevated" padding="lg" className="lt-result-card lt-result-card--steps">
        <div className="lt-result-card__header">
          <span className="lt-result-card__icon" aria-hidden="true">🚀</span>
          <div>
            <h3 className="lt-result-card__title">
              {isTelugu ? 'ఎఫ్. సూచించిన తదుపరి చర్యలు (Suggested Next Steps)' : 'F. Suggested Next Steps'}
            </h3>
            <p className="lt-result-card__subtitle">
              {isTelugu ? 'పత్రం ఆధారంగా మీరు తీసుకోవలసిన ఆచరణాత్మక చర్యలు (దశ 5 లైఫ్ యాక్షన్ మ్యాప్‌కు కనెక్ట్ అవుతుంది):' : 'Concrete practical actions grounded in the document (Ready for Stage 5 Life Action Map):'}
            </p>
          </div>
        </div>

        <div className="lt-steps-timeline">
          {suggestedNextSteps.map((step, idx) => (
            <div key={idx} className="lt-step-item">
              <div className="lt-step-item__number" aria-hidden="true">{idx + 1}</div>
              <div className="lt-step-item__content">
                <h4 className="lt-step-item__action">{step.action}</h4>
                <p className="lt-step-item__reason">{step.reason}</p>
                <div className="lt-step-item__footer">
                  {step.deadline && step.deadline !== 'Not specified' && (
                    <span className="lt-step-meta">
                      ⏰ <strong>Deadline:</strong> {step.deadline}
                    </span>
                  )}
                  {step.verificationNeeded && (
                    <span className="lt-step-meta lt-step-meta--verify">
                      🔍 <strong>Verify:</strong> {step.verificationNeeded}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Section G: What Is Unclear? */}
      {whatIsUnclear.length > 0 && (
        <Card variant="default" padding="lg" className="lt-result-card">
          <div className="lt-result-card__header">
            <span className="lt-result-card__icon" aria-hidden="true">❓</span>
            <div>
              <h3 className="lt-result-card__title">
                {isTelugu ? 'జి. పత్రంలో స్పష్టత లేని అంశాలు (What Is Unclear?)' : 'G. What Is Unclear?'}
              </h3>
              <p className="lt-result-card__subtitle">
                {isTelugu ? 'ఈ పత్రంలో సమాధానం లేని ముఖ్యమైన ప్రశ్నలు (ఊహించకుండా స్పష్టంగా గుర్తించబడినవి):' : 'Important questions that cannot be answered from the available document:'}
              </p>
            </div>
          </div>

          <ul className="lt-unclear-list">
            {whatIsUnclear.map((item, idx) => (
              <li key={idx} className="lt-unclear-item">
                <span className="lt-unclear-bullet" aria-hidden="true">⚠️</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Section H: Source Evidence & Quotes */}
      {sourceEvidence.length > 0 && (
        <Card variant="default" padding="lg" className="lt-result-card">
          <div className="lt-result-card__header">
            <span className="lt-result-card__icon" aria-hidden="true">🔍</span>
            <div>
              <h3 className="lt-result-card__title">
                {isTelugu ? 'హెచ్. మూల పత్ర ఆధారాలు (Source Evidence & Quotes)' : 'H. Source Evidence & Quotes'}
              </h3>
              <p className="lt-result-card__subtitle">
                {isTelugu ? 'ముఖ్యమైన అంశాలకు మద్దతుగా పత్రం నుండి నేరుగా సేకరించిన వాక్యాలు:' : 'Verbatim passages and citations supporting the extracted facts:'}
              </p>
            </div>
          </div>

          <div className="lt-evidence-grid">
            {sourceEvidence.map((ev, idx) => (
              <div key={idx} className="lt-evidence-item">
                <span className="lt-evidence-item__topic">{ev.topic}</span>
                <blockquote className="lt-evidence-item__quote">"{ev.passage}"</blockquote>
                {ev.reference && (
                  <span className="lt-evidence-item__ref">{ev.reference}</span>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Section I: Domain Safeguards & Disclaimer */}
      <div className="lt-disclaimer-box">
        <div className="lt-disclaimer-box__header">
          <span aria-hidden="true">🛡️</span>
          <span>{isTelugu ? 'ముఖ్యమైన గమనిక & చట్టపరమైన రక్షణ' : 'Important Domain Safeguard & Disclaimer'}</span>
        </div>
        <p className="lt-disclaimer-box__text">
          {domainSafeguardNotice || (isTelugu
            ? 'ఈ వివరణ సమాచార అవగాహన కోసం మాత్రమే రూపొందించబడింది. ఇది చట్టపరమైన, వైద్య లేదా నిశ్చయమైన ప్రభుత్వ మంజూరు కాదు. దయచేసి ఏదైనా ముఖ్యమైన నిర్ణయం తీసుకునే ముందు అధికారిక జారీ విభాగంతో వివరాలను నిర్ధారించుకోండి.'
            : 'This explanation is provided for general comprehension only and does not constitute formal legal, medical, or guaranteed financial approval. Always confirm application cutoffs and eligibility criteria directly with the issuing department.')}
        </p>
      </div>

      {/* Stage 5: Life Action Map */}
      <div id="life-action-map">
        <LifeActionMap
          explanation={explanation}
          isTelugu={isTelugu}
          documentTitle={documentTitle}
        />
      </div>

      {/* Stage 6: Ask My Document */}
      <div id="ask-document">
        <AskDocument
          preparedDocument={preparedDocument}
          sourceLang={sourceLang}
          targetLang={targetLang}
          sourceLangName={sourceLangName}
          targetLangName={targetExplanationLanguage || targetLangName}
          isTelugu={isTelugu}
          documentTitle={documentTitle}
        />
      </div>

      {/* Stage 5 & 6 Quick Navigation Footer Actions */}
      <div className="lt-explanation-footer-actions">
        <Button
          variant="primary"
          size="lg"
          onClick={() => {
            const el = document.getElementById('life-action-map');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        >
          🗺️ {isTelugu ? 'లైఫ్ యాక్షన్ మ్యాప్‌కి వెళ్లండి' : 'Go to Life Action Map'}
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => {
            const el = document.getElementById('ask-document');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        >
          💬 {isTelugu ? 'ప్రశ్నలు అడగండి (Q&A)' : 'Ask Document Questions'}
        </Button>
        <Button variant="outline" size="lg" onClick={onReset}>
          🔄 {isTelugu ? 'మరొక పత్రాన్ని విశ్లేషించండి' : 'Analyze Another Document'}
        </Button>
      </div>
    </div>
  );
}

export default ExplanationView;
