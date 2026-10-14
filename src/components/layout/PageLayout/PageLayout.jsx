import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './PageLayout.css';

/**
 * Consistent PageLayout Shell for Life Translator
 */
export function PageLayout({ children, currentLang = 'en', onToggleLang }) {
  return (
    <div className="lt-page-layout">
      <Header currentLang={currentLang} onToggleLang={onToggleLang} />
      <main id="top" className="lt-page-layout__main">
        {children}
      </main>
      <Footer currentLang={currentLang} />
    </div>
  );
}

export default PageLayout;
