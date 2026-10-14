import React from 'react';
import Badge from '../../common/Badge/Badge';
import './Footer.css';

const CURRENT_YEAR = new Date().getFullYear();

/**
 * Footer Component for Life Translator
 * Compliant with Stage 2 requirements:
 * - Temporary wordmark returning to top
 * - Navigation links to homepage sections
 * - Responsible advice disclaimer (legal, medical, tax, financial)
 * - Privacy guarantee
 */
export function Footer({ currentLang = 'en' }) {
  const isTelugu = currentLang === 'te';

  const scrollTo = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="lt-footer">
      <div className="container lt-footer__inner">
        <div className="lt-footer__grid">
          {/* Brand & Description */}
          <div className="lt-footer__col lt-footer__col--main">
            <div className="lt-footer__brand">
              <a
                href="#home"
                className="lt-footer__brand-title"
                onClick={(e) => scrollTo(e, 'home')}
                title="Life Translator - Return to top"
              >
                Life Translator
              </a>
              <Badge variant="navy" size="sm">
                {isTelugu ? 'దశ 2' : 'Stage 2'}
              </Badge>
            </div>
            <p className="lt-footer__desc">
              {isTelugu
                ? 'కష్టమైన పత్రాలను సులభమైన మాటల్లో అర్థం చేసుకోవడానికి మరియు మీరు తీసుకోవాల్సిన తదుపరి చర్యలను తెలుసుకోవడానికి సహాయపడే వెబ్‌సైట్.'
                : 'Life Translator helps people understand complicated documents in simple language and discover what steps they may need to take next.'}
            </p>

            <div className="lt-footer__privacy-note">
              <span className="lt-footer__privacy-icon" aria-hidden="true">🛡️</span>
              <span>
                {isTelugu
                  ? 'గోప్యతా సూత్రం: మీ పత్రాల వివరాలు భద్రంగా ఉంటాయి. వ్యక్తిగత పత్రాల సమాచారం అనవసరంగా నిల్వ చేయబడదు.'
                  : 'Privacy Principle: Your documents are processed with care. We do not store, sell, or share personal document data.'}
              </span>
            </div>
          </div>

          {/* Quick Section Links */}
          <div className="lt-footer__col">
            <h4 className="lt-footer__heading">
              {isTelugu ? 'వెబ్‌సైట్ విభాగాలు' : 'Quick Navigation'}
            </h4>
            <ul className="lt-footer__list">
              <li>
                <a href="#home" onClick={(e) => scrollTo(e, 'home')}>
                  {isTelugu ? 'హోమ్' : 'Home'}
                </a>
              </li>
              <li>
                <a href="#how-it-works" onClick={(e) => scrollTo(e, 'how-it-works')}>
                  {isTelugu ? 'ఇది ఎలా పనిచేస్తుంది' : 'How It Works'}
                </a>
              </li>
              <li>
                <a href="#who-it-helps" onClick={(e) => scrollTo(e, 'who-it-helps')}>
                  {isTelugu ? 'ఎవరికి సహాయం చేస్తుంది' : 'Who It Helps'}
                </a>
              </li>
              <li>
                <a href="#features" onClick={(e) => scrollTo(e, 'features')}>
                  {isTelugu ? 'ముఖ్య ప్రయోజనాలు' : 'Features'}
                </a>
              </li>
              <li>
                <a href="#get-started" onClick={(e) => scrollTo(e, 'get-started')}>
                  {isTelugu ? 'ప్రారంభించండి' : 'Get Started'}
                </a>
              </li>
            </ul>
          </div>

          {/* Important Advisory Note */}
          <div className="lt-footer__col">
            <h4 className="lt-footer__heading">
              {isTelugu ? 'ముఖ్యమైన గమనిక' : 'Important Note'}
            </h4>
            <div className="lt-footer__disclaimer">
              <p>
                {isTelugu
                  ? 'ముఖ్యమైన చట్టపరమైన, వైద్య, ఆర్థిక, పన్ను మరియు బీమా నిర్ణయాల కోసం సంబంధిత అధికారిక కార్యాలయం లేదా నిపుణుల సలహాను తీసుకోవడం అవసరం కావచ్చు.'
                  : 'Important legal, medical, financial, tax, and insurance decisions may require confirmation from an appropriate professional or official source.'}
              </p>
            </div>
          </div>
        </div>

        <div className="lt-footer__bottom">
          <p className="lt-footer__copy">
            © {CURRENT_YEAR} Life Translator. {isTelugu ? 'హ్యాకథాన్ ప్రాజెక్ట్.' : 'Hackathon Project Development.'}
          </p>
          <p className="lt-footer__note">
            {isTelugu
              ? 'తాత్కాలిక ప్రాజెక్ట్ పేరు · అభివృద్ధి పూర్తయిన తర్వాత తుది పేరు మరియు లోగో నిర్ణయించబడుతుంది.'
              : 'Temporary Project Name · We will finalize the project name, logo, and branding at the end of development.'}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
