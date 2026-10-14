import React, { useState, useRef, useEffect } from 'react';
import Badge from '../Badge/Badge';
import { searchLanguages } from '../../../config/languages';
import './LanguageSelector.css';

/**
 * Searchable, Extensible Language Selector Component
 * 
 * Props:
 * - selectedCode: Current selected language ISO code (e.g. 'en', 'te', 'hi', 'auto')
 * - onSelect: Callback when a language is selected (code: string)
 * - languages: Array of language objects to select from
 * - label: Accessible label string
 * - placeholder: Search bar placeholder
 * - showStatusBadge: Whether to display verification status (e.g., 'Verified', 'Supported')
 * - id: HTML id for accessibility
 */
export function LanguageSelector({
  selectedCode = 'en',
  onSelect,
  languages = [],
  label = 'Select Language',
  placeholder = 'Search by name or script (e.g., Telugu, हिन्दी, Español)...',
  showStatusBadge = true,
  id = 'lt-lang-selector',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  const selectedLang = languages.find((l) => l.code === selectedCode) || languages[0] || {
    name: selectedCode,
    nativeName: selectedCode,
  };

  const filteredLanguages = searchLanguages(searchQuery, languages);

  // Close on outside click or Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Focus search input when popover opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  const handleSelect = (langCode) => {
    onSelect(langCode);
    setIsOpen(false);
  };

  return (
    <div className="lt-lang-select-container" ref={containerRef}>
      {label && (
        <label htmlFor={`${id}-button`} className="lt-lang-select-label">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        id={`${id}-button`}
        className={`lt-lang-select-trigger ${isOpen ? 'is-open' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`${id}-dropdown`}
      >
        <span className="lt-lang-select-trigger__icon" aria-hidden="true">🌐</span>
        <span className="lt-lang-select-trigger__text">
          <strong className="lt-lang-select-trigger__name">{selectedLang.name}</strong>
          {selectedLang.nativeName && selectedLang.nativeName !== selectedLang.name && (
            <span className="lt-lang-select-trigger__native">({selectedLang.nativeName})</span>
          )}
        </span>
        <span className="lt-lang-select-trigger__arrow" aria-hidden="true">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {/* Searchable Dropdown Popover */}
      {isOpen && (
        <div id={`${id}-dropdown`} className="lt-lang-select-popover" role="dialog" aria-modal="false">
          <div className="lt-lang-select-search-box">
            <span className="lt-lang-select-search-icon" aria-hidden="true">🔍</span>
            <input
              ref={searchInputRef}
              type="text"
              className="lt-lang-select-search-input"
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Filter languages by name or native script"
            />
            {searchQuery && (
              <button
                type="button"
                className="lt-lang-select-search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="lt-lang-select-results-count">
            <span>{filteredLanguages.length} languages available</span>
          </div>

          <ul className="lt-lang-select-list" role="listbox">
            {filteredLanguages.length === 0 ? (
              <li className="lt-lang-select-empty">
                No matching language found. Check spelling or request support.
              </li>
            ) : (
              filteredLanguages.map((lang) => {
                const isSelected = lang.code === selectedCode;
                return (
                  <li
                    key={lang.code}
                    role="option"
                    aria-selected={isSelected}
                    className={`lt-lang-select-item ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => handleSelect(lang.code)}
                  >
                    <div className="lt-lang-select-item__main">
                      <div className="lt-lang-select-item__names">
                        <span className="lt-lang-select-item__name">{lang.name}</span>
                        {lang.nativeName && (
                          <span className="lt-lang-select-item__native">{lang.nativeName}</span>
                        )}
                      </div>
                      {lang.region && (
                        <span className="lt-lang-select-item__region">{lang.region}</span>
                      )}
                    </div>

                    <div className="lt-lang-select-item__badge">
                      {lang.isAuto ? (
                        <Badge variant="teal" size="sm">Auto-Detect</Badge>
                      ) : showStatusBadge && lang.tier === 'verified' ? (
                        <Badge variant="success" size="sm">Verified</Badge>
                      ) : showStatusBadge && lang.tier === 'supported' ? (
                        <Badge variant="neutral" size="sm">AI Supported</Badge>
                      ) : null}
                      {isSelected && <span className="lt-lang-select-check" aria-hidden="true">✓</span>}
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;
