import React, { useState, useEffect, useRef } from 'react';
import Button from '../../common/Button/Button';
import Badge from '../../common/Badge/Badge';
import './Header.css';

/**
 * Header Component for Life Translator
 * Features:
 * - Clean header with Life Translator text logo on the left
 * - Three-line hamburger menu icon (☰) on the right
 * - Functional language selector (English / Telugu)
 * - Accessible dropdown panel containing:
 *   1. Home
 *   2. How It Works
 *   3. Who It Helps
 *   4. Features
 *   5. Get Started
 * - Closes on: ☰ click, outside click, Escape key, or menu item selection
 * - Smooth scrolling without hiding section headings
 */
export function Header({ currentLang = 'en', onToggleLang }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  const isTelugu = currentLang === 'te';

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Close menu on Escape key press or clicking outside
  useEffect(() => {
    if (!menuOpen) return;

    const handlePointerDown = (event) => {
      // If click was outside both the menu container and the hamburger button
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeMenu();
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  // Smooth scroll handler for all menu items
  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    closeMenu();

    // Use requestAnimationFrame so the menu close animation doesn't jitter scroll
    requestAnimationFrame(() => {
      const targetElement = document.getElementById(sectionId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  };

  return (
    <header className="lt-header">
      <div className="container lt-header__inner">
        {/* Left: Life Translator text logo (returns user to top) */}
        <div className="lt-header__brand">
          <a
            href="#home"
            className="lt-header__logo"
            onClick={(e) => handleNavClick(e, 'home')}
            title="Life Translator | Bodhaka (బోధక) - Return to top"
          >
            <span className="lt-header__logo-main">Life Translator</span>
            <span className="lt-header__logo-dot" aria-hidden="true"></span>
          </a>
          <Badge variant="teal" size="sm" className="lt-header__badge">
            {isTelugu ? 'బోధక (Bodhaka)' : 'Bodhaka (బోధక)'}
          </Badge>
        </div>

        {/* Right: Controls & Hamburger Menu Button */}
        <div className="lt-header__actions">
          {/* Functional Language Switcher */}
          <button
            type="button"
            className="lt-lang-toggle"
            onClick={onToggleLang}
            title={isTelugu ? 'Switch to English' : 'తెలుగులోకి మార్చండి'}
            aria-label={`Language switch: currently ${isTelugu ? 'Telugu' : 'English'}. Click to toggle.`}
          >
            <span className={`lt-lang-toggle__opt ${!isTelugu ? 'is-active' : ''}`}>EN</span>
            <span className="lt-lang-toggle__divider" aria-hidden="true">/</span>
            <span className={`lt-lang-toggle__opt ${isTelugu ? 'is-active' : ''}`}>తెలుగు</span>
          </button>

          {/* Optional Quick CTA Button (visible on wide screens for convenience) */}
          <Button
            variant="primary"
            size="sm"
            className="lt-header__cta-quick"
            onClick={(e) => handleNavClick(e, 'get-started')}
          >
            {isTelugu ? 'ప్రారంభించండి' : 'Get Started'}
          </Button>

          {/* Three-Line Hamburger Menu Icon (☰) */}
          <button
            ref={menuButtonRef}
            type="button"
            id="lt-menu-toggle-btn"
            className={`lt-hamburger-btn ${menuOpen ? 'is-active' : ''}`}
            onClick={toggleMenu}
            aria-expanded={menuOpen}
            aria-controls="lt-navigation-menu"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu (☰)'}
            title={menuOpen ? 'Close menu' : 'Menu'}
          >
            <span className="lt-hamburger-icon" aria-hidden="true">
              <span className="lt-hamburger-bar"></span>
              <span className="lt-hamburger-bar"></span>
              <span className="lt-hamburger-bar"></span>
            </span>
            <span className="lt-hamburger-label">
              {menuOpen ? (isTelugu ? 'మూసివేయి' : 'Close') : (isTelugu ? 'మెనూ' : 'Menu')}
            </span>
          </button>
        </div>
      </div>

      {/* Backdrop overlay to handle outside clicks cleanly */}
      {menuOpen && (
        <div
          className="lt-menu-backdrop"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Dropdown Menu Panel */}
      {menuOpen && (
        <nav
          ref={menuRef}
          id="lt-navigation-menu"
          className="lt-menu-dropdown"
          aria-label="Site Sections Navigation"
          role="navigation"
        >
          <div className="lt-menu-dropdown__header">
            <span className="lt-menu-dropdown__title">
              {isTelugu ? 'విభాగాలు' : 'Navigation Menu'}
            </span>
            <button
              type="button"
              className="lt-menu-dropdown__close-btn"
              onClick={closeMenu}
              aria-label="Close menu"
              title="Close menu (Esc)"
            >
              ✕
            </button>
          </div>

          <ul className="lt-menu-dropdown__list">
            {/* 1. Home */}
            <li className="lt-menu-dropdown__item">
              <a
                href="#home"
                className="lt-menu-dropdown__link"
                onClick={(e) => handleNavClick(e, 'home')}
              >
                <span className="lt-menu-dropdown__icon" aria-hidden="true">🏠</span>
                <span className="lt-menu-dropdown__text">
                  <span className="lt-menu-dropdown__name">{isTelugu ? 'హోమ్' : 'Home'}</span>
                  <span className="lt-menu-dropdown__sub">{isTelugu ? 'పైకి వెళ్లండి' : 'Return to top'}</span>
                </span>
                <span className="lt-menu-dropdown__arrow" aria-hidden="true">›</span>
              </a>
            </li>

            {/* 2. How It Works */}
            <li className="lt-menu-dropdown__item">
              <a
                href="#how-it-works"
                className="lt-menu-dropdown__link"
                onClick={(e) => handleNavClick(e, 'how-it-works')}
              >
                <span className="lt-menu-dropdown__icon" aria-hidden="true">⚡</span>
                <span className="lt-menu-dropdown__text">
                  <span className="lt-menu-dropdown__name">{isTelugu ? 'ఇది ఎలా పనిచేస్తుంది' : 'How It Works'}</span>
                  <span className="lt-menu-dropdown__sub">{isTelugu ? '3 సులభమైన దశలు' : '3 simple steps'}</span>
                </span>
                <span className="lt-menu-dropdown__arrow" aria-hidden="true">›</span>
              </a>
            </li>

            {/* 3. Who It Helps */}
            <li className="lt-menu-dropdown__item">
              <a
                href="#who-it-helps"
                className="lt-menu-dropdown__link"
                onClick={(e) => handleNavClick(e, 'who-it-helps')}
              >
                <span className="lt-menu-dropdown__icon" aria-hidden="true">👥</span>
                <span className="lt-menu-dropdown__text">
                  <span className="lt-menu-dropdown__name">{isTelugu ? 'ఎవరికి సహాయం చేస్తుంది' : 'Who It Helps'}</span>
                  <span className="lt-menu-dropdown__sub">{isTelugu ? 'రైతులు, విద్యార్థులు & కుటుంబాలు' : 'Farmers, students & families'}</span>
                </span>
                <span className="lt-menu-dropdown__arrow" aria-hidden="true">›</span>
              </a>
            </li>

            {/* 4. Features */}
            <li className="lt-menu-dropdown__item">
              <a
                href="#features"
                className="lt-menu-dropdown__link"
                onClick={(e) => handleNavClick(e, 'features')}
              >
                <span className="lt-menu-dropdown__icon" aria-hidden="true">✨</span>
                <span className="lt-menu-dropdown__text">
                  <span className="lt-menu-dropdown__name">{isTelugu ? 'ముఖ్య ప్రయోజనాలు' : 'Features'}</span>
                  <span className="lt-menu-dropdown__sub">{isTelugu ? 'తేదీలు, చెక్‌లిస్ట్ & తెలుగు మద్దతు' : 'Dates, checklists & Telugu'}</span>
                </span>
                <span className="lt-menu-dropdown__arrow" aria-hidden="true">›</span>
              </a>
            </li>

            {/* 5. Get Started */}
            <li className="lt-menu-dropdown__item lt-menu-dropdown__item--cta">
              <a
                href="#get-started"
                className="lt-menu-dropdown__link lt-menu-dropdown__link--cta"
                onClick={(e) => handleNavClick(e, 'get-started')}
              >
                <span className="lt-menu-dropdown__icon" aria-hidden="true">🚀</span>
                <span className="lt-menu-dropdown__text">
                  <span className="lt-menu-dropdown__name">{isTelugu ? 'ప్రారంభించండి' : 'Get Started'}</span>
                  <span className="lt-menu-dropdown__sub">{isTelugu ? 'పత్రాల వర్క్‌స్పేస్' : 'Document workspace'}</span>
                </span>
                <span className="lt-menu-dropdown__arrow" aria-hidden="true">›</span>
              </a>
            </li>
          </ul>

          <div className="lt-menu-dropdown__footer">
            <span className="lt-menu-dropdown__footer-note">
              {isTelugu
                ? 'లైఫ్ ట్రాన్స్‌లేటర్ · కష్టమైన పత్రాలకు సులభమైన పరిష్కారం'
                : 'Life Translator · Simple document understanding'}
            </span>
          </div>
        </nav>
      )}
    </header>
  );
}

export default Header;
