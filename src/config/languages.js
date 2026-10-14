/**
 * Life Translator - Extensible Language Registry
 * 
 * Configured based on verified multimodal document processing and 
 * translation capabilities of Google Gemini & Document AI.
 * 
 * Tiers:
 * - 'verified': Documented, locally tested with representative samples.
 * - 'supported': Documented AI multimodal comprehension & generation support.
 */

export const SOURCE_AUTO_DETECT = {
  code: 'auto',
  name: 'Auto-detect Language',
  nativeName: 'స్వయంచాలక గుర్తింపు',
  region: 'Global',
  isAuto: true,
  description: 'AI automatically identifies the document language from text or image scan',
};

export const SUPPORTED_LANGUAGES = [
  // Primary Indian Regional Languages (Target Demographics: Farmers, Citizens, Students)
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    region: 'Global / India',
    tier: 'verified',
    testedWith: ['Official Gazettes', 'Scholarship Circulars', 'Insurance Policies', 'PDF', 'Images'],
    direction: 'ltr',
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    region: 'Andhra Pradesh & Telangana, India',
    tier: 'verified',
    testedWith: ['Rythu Bharosa / PM-Kisan Circulars', 'Post-Matric Scholarship Notifications', 'PPO Circulars'],
    direction: 'ltr',
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    region: 'India',
    tier: 'verified',
    testedWith: ['Central Government Gazettes', 'PMFBY Notices', 'Banking Forms'],
    direction: 'ltr',
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    region: 'Tamil Nadu, India',
    tier: 'supported',
    testedWith: ['State Welfare Circulars', 'Agricultural Subsidies'],
    direction: 'ltr',
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    region: 'Karnataka, India',
    tier: 'supported',
    testedWith: ['Kisan Credit Circulars', 'Land Records (RTC)'],
    direction: 'ltr',
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    region: 'Kerala, India',
    tier: 'supported',
    testedWith: ['Pension Notifications', 'Health Circulars'],
    direction: 'ltr',
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    region: 'West Bengal, India & Bangladesh',
    tier: 'supported',
    testedWith: ['Scholarship Guidelines', 'Public Distribution Forms'],
    direction: 'ltr',
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    region: 'Maharashtra, India',
    tier: 'supported',
    testedWith: ['Crop Insurance Procedures', 'Municipal Circulars'],
    direction: 'ltr',
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    region: 'Gujarat, India',
    tier: 'supported',
    testedWith: ['Small Business Licenses', 'Agri Loan Schemes'],
    direction: 'ltr',
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    region: 'Punjab, India',
    tier: 'supported',
    testedWith: ['Mandi Procurement Circulars', 'Subsidy Records'],
    direction: 'ltr',
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    region: 'India & South Asia',
    tier: 'supported',
    testedWith: ['Administrative Notices', 'Educational Paperwork'],
    direction: 'rtl',
  },

  // Major Global Languages
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    region: 'Spain, Latin America, USA',
    tier: 'supported',
    testedWith: ['Immigration Notices', 'Public Utility Forms'],
    direction: 'ltr',
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    region: 'France, Canada, West Africa',
    tier: 'supported',
    testedWith: ['Official Declarations', 'Insurance Notices'],
    direction: 'ltr',
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    region: 'Germany, Austria, Switzerland',
    tier: 'supported',
    testedWith: ['Administrative Circulars', 'Legal Form Notices'],
    direction: 'ltr',
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    region: 'Middle East & North Africa',
    tier: 'supported',
    testedWith: ['Government Declarations', 'Commercial Permits'],
    direction: 'rtl',
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    region: 'Japan',
    tier: 'supported',
    testedWith: ['Official Prefectural Notices', 'Health Forms'],
    direction: 'ltr',
  },
  {
    code: 'zh',
    name: 'Chinese (Simplified)',
    nativeName: '简体中文',
    region: 'China, Singapore',
    tier: 'supported',
    testedWith: ['Official Guidelines', 'Regulatory Documents'],
    direction: 'ltr',
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    region: 'Brazil, Portugal',
    tier: 'supported',
    testedWith: ['Legal Declarations', 'Bank Receipts'],
    direction: 'ltr',
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    region: 'Eastern Europe & Central Asia',
    tier: 'supported',
    testedWith: ['Public Agency Orders', 'Educational Certifications'],
    direction: 'ltr',
  },
  {
    code: 'id',
    name: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    region: 'Indonesia',
    tier: 'supported',
    testedWith: ['Civic Registration Notices', 'Agricultural Grants'],
    direction: 'ltr',
  },
  {
    code: 'vi',
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    region: 'Vietnam',
    tier: 'supported',
    testedWith: ['Official Bulletins', 'Administrative Forms'],
    direction: 'ltr',
  },
];

/**
 * Filter and search languages by English name, native script, or code
 */
export function searchLanguages(query, languageList = SUPPORTED_LANGUAGES) {
  if (!query || !query.trim()) return languageList;
  const q = query.trim().toLowerCase();
  return languageList.filter((lang) => {
    return (
      lang.name.toLowerCase().includes(q) ||
      lang.nativeName.toLowerCase().includes(q) ||
      lang.code.toLowerCase() === q ||
      (lang.region && lang.region.toLowerCase().includes(q))
    );
  });
}

/**
 * Get language descriptor by ISO code
 */
export function getLanguageByCode(code) {
  if (code === 'auto') return SOURCE_AUTO_DETECT;
  return SUPPORTED_LANGUAGES.find((lang) => lang.code === code) || {
    code,
    name: code.toUpperCase(),
    nativeName: code.toUpperCase(),
    tier: 'experimental',
  };
}

/**
 * Full source languages list (includes Auto-detect at the top)
 */
export function getSourceLanguageOptions() {
  return [SOURCE_AUTO_DETECT, ...SUPPORTED_LANGUAGES];
}
