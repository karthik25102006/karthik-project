import React, { useState, useRef, useEffect } from 'react';
import PageLayout from './components/layout/PageLayout/PageLayout';
import Button from './components/common/Button/Button';
import Card from './components/common/Card/Card';
import Badge from './components/common/Badge/Badge';
import LanguageSelector from './components/common/LanguageSelector/LanguageSelector';
import ExplanationView from './components/common/ExplanationView/ExplanationView';
import {
  SUPPORTED_LANGUAGES,
  getSourceLanguageOptions,
  getLanguageByCode,
} from './config/languages';
import './App.css';

export function App() {
  const [currentLang, setCurrentLang] = useState('en');
  const [selectedWhoGroup, setSelectedWhoGroup] = useState(1); // Default to Farmers
  const [activeSampleId, setActiveSampleId] = useState('farmer');
  const [sampleLang, setSampleLang] = useState('en');
  const [isLargeText, setIsLargeText] = useState(false);
  const [workspaceTab, setWorkspaceTab] = useState('upload'); // 'upload' | 'paste'
  const [pastedText, setPastedText] = useState('');
  
  // Multilingual Configuration States
  const [sourceDocLang, setSourceDocLang] = useState('auto'); // 'auto' | ISO code
  const [targetAnalysisLang, setTargetAnalysisLang] = useState('en');
  const [feedbackNotice, setFeedbackNotice] = useState(
    'Welcome to Life Translator! Upload a document or paste text to generate a real AI explanation.'
  );

  // File Upload & Stage 3 Document Preparation State
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [pasteError, setPasteError] = useState(null);
  const [preparedDocument, setPreparedDocument] = useState(null);
  const [showDocPreview, setShowDocPreview] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  // Stage 4 AI Explanation States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);
  const [explanationResult, setExplanationResult] = useState(null);
  const [extractionMeta, setExtractionMeta] = useState(null);

  // Revoke object URL on cleanup to prevent memory leaks
  useEffect(() => {
    return () => {
      if (selectedFile?.previewUrl) {
        URL.revokeObjectURL(selectedFile.previewUrl);
      }
    };
  }, [selectedFile?.previewUrl]);

  const isTelugu = currentLang === 'te';

  const toggleLanguage = () => {
    setCurrentLang((prev) => {
      const next = prev === 'en' ? 'te' : 'en';
      setSampleLang(next);
      setTargetAnalysisLang(next);
      setFeedbackNotice(
        next === 'te'
          ? 'భాష తెలుగులోకి మార్చబడింది.'
          : 'Website language switched to English.'
      );
      return next;
    });
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Section 3: How It Works (3 Planned Steps)
  const howSteps = [
    {
      step: 1,
      icon: '📄',
      titleEn: 'Step 1: Add Your Document',
      titleTe: 'దశ 1: మీ పత్రాన్ని చేర్చండి',
      descEn: 'Upload a supported document or paste its text.',
      descTe: 'మద్దతు ఉన్న పత్రాన్ని అప్‌లోడ్ చేయండి లేదా దాని టెక్స్ట్‌ను పేస్ట్ చేయండి.',
    },
    {
      step: 2,
      icon: '🌐',
      titleEn: 'Step 2: Choose Your Language',
      titleTe: 'దశ 2: మీ భాషను ఎంచుకోండి',
      descEn: 'Choose the language you want to understand.',
      descTe: 'మీరు అర్థం చేసుకోవాలనుకుంటున్న భాషను ఎంచుకోండి.',
    },
    {
      step: 3,
      icon: '✅',
      titleEn: 'Step 3: Understand What to Do',
      titleTe: 'దశ 3: ఏమి చేయాలో తెలుసుకోండి',
      descEn: 'Get a simple explanation and a clear list of next steps.',
      descTe: 'సులభమైన వివరణ మరియు స్పష్టమైన తదుపరి చర్యల జాబితాను పొందండి.',
    },
  ];

  // Section 4: Who It Helps (6 Required Target Groups)
  const whoHelpsGroups = [
    {
      id: 0,
      icon: '🎓',
      sampleKey: 'student',
      titleEn: 'Students',
      titleTe: 'విద్యార్థులు',
      descEn: 'Understand scholarship notices, admission rules, and application requirements.',
      descTe: 'స్కాలర్‌షిప్ నోటీసులు, అడ్మిషన్ నిబంధనలు మరియు దరఖాస్తు అవసరాలను అర్థం చేసుకోండి.',
      exampleDocsEn: [
        'Post-Matric Scholarship deadline and eligibility notices',
        'College admission guidelines and document verification checklist',
        'Tuition fee reimbursement and application submission steps',
      ],
      exampleDocsTe: [
        'పోస్ట్-మెట్రిక్ స్కాలర్‌షిప్ గడువు మరియు అర్హత నోటీసులు',
        'కాలేజీ అడ్మిషన్ మార్గదర్శకాలు మరియు సర్టిఫికెట్ల చెక్‌లిస్ట్',
        'ఫీజు రీయింబర్స్‌మెంట్ దరఖాస్తు విధానం',
      ],
    },
    {
      id: 1,
      icon: '🌾',
      sampleKey: 'farmer',
      titleEn: 'Farmers',
      titleTe: 'రైతులు',
      descEn: 'Understand agricultural schemes, subsidies, crop insurance, loans, and application paperwork.',
      descTe: 'వ్యవసాయ పథకాలు, సబ్సిడీలు, పంట బీమా, రుణాలు మరియు దరఖాస్తు పత్రాలను అర్థం చేసుకోండి.',
      exampleDocsEn: [
        'PM-Kisan and state crop investment input subsidy notices',
        'Pradhan Mantri Fasal Bima Yojana (PMFBY) crop insurance terms and claim cutoffs',
        'Kisan Credit Card (KCC) loan agreements, interest subventions, and repayment schedules',
      ],
      exampleDocsTe: [
        'పీఎం-కిసాన్ మరియు పంట పెట్టుబడి రాయితీ నోటీసులు',
        'ఫసల్ బీమా యోజన పంట నష్టం క్లెయిమ్ గడువులు',
        'కిసాన్ క్రెడిట్ కార్డు రుణ ఒప్పందాలు మరియు వడ్డీ రాయితీ వివరాలు',
      ],
    },
    {
      id: 2,
      icon: '👵',
      sampleKey: 'pension',
      titleEn: 'Parents and Senior Citizens',
      titleTe: 'తల్లిదండ్రులు మరియు సీనియర్ సిటిజన్లు',
      descEn: 'Make sense of school notices, pension information, and important documents.',
      descTe: 'పాఠశాల నోటీసులు, పెన్షన్ సమాచారం మరియు ముఖ్యమైన పత్రాలను అర్థం చేసుకోండి.',
      exampleDocsEn: [
        'Annual Digital Life Certificate (Jeevan Pramaan) submission instructions',
        'School fee schedules, academic circulars, and activity consent forms',
        'Senior citizen savings schemes, fixed deposit rules, and pension revisions',
      ],
      exampleDocsTe: [
        'వార్షిక జీవన్ ప్రమాణ్ లైఫ్ సర్టిఫికేట్ సమర్పణ మార్గదర్శకాలు',
        'పాఠశాల ఫీజు షెడ్యూల్స్ మరియు అనుమతి పత్రాలు',
        'సీనియర్ సిటిజన్ పొదుపు పథకాలు మరియు పెన్షన్ సవరణ పత్రాలు',
      ],
    },
    {
      id: 3,
      icon: '👨‍👩‍👧',
      sampleKey: 'family',
      titleEn: 'Families',
      titleTe: 'కుటుంబాలు',
      descEn: 'Understand banking, insurance, and other everyday paperwork.',
      descTe: 'బ్యాంకింగ్, బీమా మరియు ఇతర రోజువారీ పత్రాలను అర్థం చేసుకోండి.',
      exampleDocsEn: [
        'Home, vehicle, and health insurance policy exclusions and terms',
        'Bank housing loan sanction letters and monthly EMI repayment rules',
        'Electricity, municipal water connection agreements, and civic notices',
      ],
      exampleDocsTe: [
        'గృహ మరియు వాహన బీమా పాలసీ నిబంధనలు',
        'బ్యాంక్ హోమ్ లోన్ మంజూరు పత్రాలు మరియు ఈఎంఐ నిబంధనలు',
        'విద్యుత్, తాగునీటి సరఫరా మరియు మున్సిపల్ పత్రాలు',
      ],
    },
    {
      id: 4,
      icon: '🏥',
      sampleKey: 'patient',
      titleEn: 'Patients and Caregivers',
      titleTe: 'రోగులు మరియు సంరక్షకులు',
      descEn: 'Understand medical terms and written instructions in simpler language.',
      descTe: 'వైద్య పరిభాష మరియు లిఖితపూర్వక సూచనలను సులభమైన భాషలో అర్థం చేసుకోండి.',
      exampleDocsEn: [
        'Hospital discharge summaries and non-clinical home recovery steps',
        'Diagnostic lab test terminology and normal range explanations',
        'Health insurance claim submission guidelines and cashless approval rules',
      ],
      exampleDocsTe: [
        'హాస్పిటల్ డిశ్చార్జ్ సమ్మరీ మరియు సాధారణ రికవరీ సూచనలు',
        'ల్యాబ్ రిపోర్టుల్లోని క్లిష్టమైన పదాల సాధారణ వివరణ',
        'ఆరోగ్య బీమా క్లెయిమ్ సమర్పణ మార్గదర్శకాలు',
      ],
    },
    {
      id: 5,
      icon: '💼',
      sampleKey: 'worker',
      titleEn: 'Workers and Small Business Owners',
      titleTe: 'కార్మికులు మరియు చిన్న వ్యాపారులు',
      descEn: 'Understand employment documents, financial paperwork, and licensing instructions.',
      descTe: 'ఉపాధి పత్రాలు, ఆర్థిక కాగితాలు మరియు లైసెన్సింగ్ సూచనలను అర్థం చేసుకోండి.',
      exampleDocsEn: [
        'Shop establishment licensing, annual renewals, and municipal inspections',
        'Employment contracts, minimum wage guidelines, and notice period terms',
        'GST reminders, tax invoice rules, and trade compliance steps',
      ],
      exampleDocsTe: [
        'దుకాణం లైసెన్స్ మరియు వార్షిక పునరుద్ధరణ మార్గదర్శకాలు',
        'ఉపాధి ఒప్పందాలు మరియు కనీస వేతన నిబంధనలు',
        'జీఎస్టీ దాఖలు గడువులు మరియు ఇన్వాయిస్ నిబంధనలు',
      ],
    },
  ];

  // Section 5: Key Benefits (Planned Capabilities)
  const keyBenefits = [
    {
      icon: '💡',
      titleEn: 'Simple Explanations of Difficult Text',
      titleTe: 'కష్టమైన టెక్స్ట్‌కు సులభమైన వివరణ',
      descEn: 'Converts dense bureaucratic jargon, legal clauses, and confusing terms into everyday words you can easily grasp.',
      descTe: 'అధికారిక మరియు చట్టపరమైన క్లిష్టమైన భాషను ఎవరైనా సులభంగా అర్థం చేసుకోగలిగే సాధారణ మాటల్లోకి మారుస్తుంది.',
    },
    {
      icon: '📅',
      titleEn: 'Important Dates & Requirements Made Easy to Find',
      titleTe: 'ముఖ్యమైన తేదీలు & నిబంధనలు వెంటనే కనిపిస్తాయి',
      descEn: 'Clearly isolates submission deadlines, late fee cutoffs, and eligibility criteria so you never miss an important date.',
      descTe: 'దరఖాస్తు చివరి తేదీలు, ఫీజు వివరాలు మరియు అర్హతలను ప్రత్యేకంగా చూపిస్తుంది, తద్వారా మీరు గడువులను కోల్పోరు.',
    },
    {
      icon: '📋',
      titleEn: 'Clear Checklists for Preparing & Taking Action',
      titleTe: 'పత్రాల తయారీ & కార్యాచరణ కోసం చెక్‌లిస్ట్',
      descEn: 'Provides an itemized checklist of certificates, identity proofs, and forms you need to gather before applying.',
      descTe: 'దరఖాస్తు చేయడానికి ముందు మీరు సమర్పించాల్సిన ఆధార్, సర్టిఫికెట్లు మరియు ఇతర పత్రాల స్పష్టమైన జాబితాను అందిస్తుంది.',
    },
    {
      icon: '🌐',
      titleEn: 'Multilingual Document & Explanation Support',
      titleTe: 'బహుభాషా పత్రాలు & వివరణల మద్దతు',
      descEn: 'Upload documents in any supported language (including Telugu, Hindi, Tamil, and world languages) and receive explanations in your preferred language.',
      descTe: 'తెలుగు, హిందీ, తమిళం లేదా ప్రపంచ భాషలలో ఉన్న పత్రాలను అప్‌లోడ్ చేసి, మీకు నచ్చిన భాషలో స్పష్టమైన వివరణను పొందండి.',
    },
    {
      icon: '💬',
      titleEn: 'A Way to Ask Questions About the Document',
      titleTe: 'పత్రంపై అనుమానాలను అడిగే సదుపాయం',
      descEn: 'Ask specific questions grounded strictly in the document content to clarify doubts before making decisions.',
      descTe: 'పత్రంలోని సమాచారం ఆధారంగానే మీ నిర్దిష్ట ప్రశ్నలను అడిగి అనుమానాలను నివృత్తి చేసుకోవచ్చు.',
    },
    {
      icon: '⚠️',
      titleEn: 'Warnings When Information Is Missing or Unclear',
      titleTe: 'సమాచారం లేనప్పుడు ముందస్తు హెచ్చరికలు',
      descEn: 'Clearly flags when deadlines, fees, or critical rules are absent from the source document, keeping you protected.',
      descTe: 'పత్రంలో ఏదైనా ముఖ్యమైన తేదీ లేదా నిబంధన లేకపోతే, వెంటనే తెలియజేసి సంబంధిత ఆఫీసును సంప్రదించమని హెచ్చరిస్తుంది.',
    },
  ];

  // Preserved Working Samples (Stage 1 feature maintained)
  const samples = {
    farmer: {
      id: 'farmer',
      titleEn: 'Farmer Crop Subsidy Notice',
      titleTe: 'రైతు పంట పెట్టుబడి సబ్సిడీ నోటీసు',
      originalSnippet: `GOVERNMENT OF ANDHRA PRADESH - DEPT OF AGRICULTURE
NOTIFICATION NO. AGRI/2026/SUB-42B
Subject: Disbursement of Input Subsidy for Kharif Season

Pursuant to Section 8(a) of the Agricultural Welfare Regulation, all eligible small and marginal pattadar cultivators holding validated e-Crop registration for Kharif are hereby notified that the final date for Aadhaar-seeded NPCI banking verification is 15th November 2026. Non-compliance shall result in withholding of the ₹2,000 disbursement per installment. Enclose Form-4B, VRO verification slip, and 1-B land record. Failure to rectify land ownership ambiguities before the nodal cutoff disqualifies claim settlement under the prevailing scheme provisions.`,
      explanation: {
        meaningEn:
          'This is an official notice for small farmers who cultivated crops in Kharif. The government will deposit ₹2,000 per installment directly into your Aadhaar-linked bank account.',
        meaningTe:
          'ఖరీఫ్ పంట వేసిన చిన్న మరియు సన్నకారు రైతుల కోసం ఈ నోటీసు. ప్రభుత్వం ఒక్కో విడతకు ₹2,000 సబ్సిడీని మీ బ్యాంక్ ఖాతాలో జమ చేస్తుంది.',
        keyFactsEn: [
          'Important Deadline: 15 November 2026',
          'Subsidy Amount: ₹2,000 per installment',
          'Eligibility: Small & marginal farmers with valid e-Crop registration',
          'Payment Method: Direct transfer to bank account linked with Aadhaar (NPCI)',
        ],
        keyFactsTe: [
          'చివరి తేదీ: 15 నవంబర్ 2026',
          'సబ్సిడీ మొత్తం: ఒక్కో విడతకు ₹2,000',
          'అర్హత: ఈ-క్రాప్ నమోదైన రైతులు',
          'చెల్లింపు: ఆధార్ లింక్ అయిన బ్యాంక్ ఖాతాకు నేరుగా బదిలీ',
        ],
        checklistEn: [
          'Aadhaar Card copy',
          'Bank Passbook (must be linked to Aadhaar / NPCI)',
          'Land Pattadar Passbook or 1-B record copy',
          'VRO Verification slip (from Village Revenue Officer)',
        ],
        checklistTe: [
          'ఆధార్ కార్డు జిరాక్స్',
          'బ్యాంక్ పాస్‌బుక్ (ఆధార్ లింక్ అయి ఉండాలి)',
          'పట్టాదారు పాస్‌బుక్ లేదా 1-B కాపీ',
          'గ్రామ రెవెన్యూ అధికారి (VRO) ధృవీకరణ పత్రం',
        ],
        nextStepsEn: [
          '1. Confirm with your bank that your account is linked with Aadhaar (NPCI).',
          '2. Visit your local Rythu Bharosa Kendram (RBK) before 15 November.',
          '3. Submit Form-4B with your land record copy.',
        ],
        nextStepsTe: [
          '1. మీ బ్యాంక్ ఖాతాకు ఆధార్ లింక్ అయిందో లేదో సరిచూసుకోండి.',
          '2. నవంబర్ 15 లోపు రైతు భరోసా కేంద్రం (RBK) ని సంప్రదించండి.',
          '3. ఫారం-4B మరియు భూమి పత్రాల కాపీని సమర్పించండి.',
        ],
        warningEn:
          'Notice: The circular does not specify the total number of installments. Ask your RBK agriculture officer for the full schedule.',
        warningTe:
          'గమనిక: మొత్తం ఎన్ని విడతలు ఇస్తారో ఇందులో లేదు. పూర్తి వివరాల కోసం మీ రైతు భరోసా కేంద్రాన్ని అడగండి.',
      },
    },

    student: {
      id: 'student',
      titleEn: 'Student Scholarship Circular',
      titleTe: 'విద్యార్థి స్కాలర్‌షిప్ నోటీసు',
      originalSnippet: `DIRECTORATE OF HIGHER EDUCATION & WELFARE
CIRCULAR NO. EDN/SCHOL/2026-27
Subject: Post-Matric Tuition Fee Reimbursement and Maintenance Allowance

All eligible undergraduate and polytechnic candidates admitted under convener quota with family annual income not exceeding ₹2,50,000 are mandated to upload verified biometrics and institute attendance records by 30th November 2026. A late fee of ₹500 applies for applications submitted between 1st Dec and 10th Dec. Failure to furnish bona fide certificates from principal authority will render the application summarily rejected without further administrative hearing.`,
      explanation: {
        meaningEn:
          'This notice is for college and polytechnic students to receive tuition fee reimbursement and monthly allowance from the government.',
        meaningTe:
          'డిగ్రీ మరియు పాలిటెక్నిక్ విద్యార్థుల కాలేజీ ఫీజు రీయింబర్స్‌మెంట్ మరియు అలవెన్స్ కోసం విడుదల చేసిన నోటీసు.',
        keyFactsEn: [
          'Normal Deadline: 30 November 2026 (No extra fee)',
          'Late Submission: 1 December to 10 December 2026 (₹500 late fee)',
          'Income Limit: Family income under ₹2,50,000 per year',
          'Quota: Must have joined through government convener quota',
        ],
        keyFactsTe: [
          'సాధారణ గడువు: 30 నవంబర్ 2026 (రుసుము లేదు)',
          'ఆలస్య గడువు: 1 డిసెంబర్ నుండి 10 డిసెంబర్ వరకు (₹500 లేట్ ఫీజు)',
          'ఆదాయ పరిమితి: కుటుంబ వార్షిక ఆదాయం ₹2,50,000 లోపు',
          'కన్వీనర్ కోటాలో అడ్మిషన్ పొంది ఉండాలి',
        ],
        checklistEn: [
          'Student Aadhaar Card',
          'College Allotment Order copy',
          'Current Income Certificate',
          'Caste Certificate (if applicable)',
          'Bona fide Certificate signed by College Principal',
        ],
        checklistTe: [
          'విద్యార్థి ఆధార్ కార్డు',
          'కాలేజీ అలాట్‌మెంట్ ఆర్డర్ కాపీ',
          'ఆదాయ ధృవీకరణ పత్రం',
          'కుల ధృవీకరణ పత్రం (వర్తిస్తే)',
          'కాలేజీ ప్రిన్సిపాల్ సంతకం చేసిన బోనఫైడ్ సర్టిఫికెట్',
        ],
        nextStepsEn: [
          '1. Get your signed Bona fide Certificate from your college office.',
          '2. Complete biometric verification at your college scholarship desk.',
          '3. Submit application online before 30 November to avoid the ₹500 late fee.',
        ],
        nextStepsTe: [
          '1. కాలేజీ ఆఫీసు నుండి బోనఫైడ్ సర్టిఫికెట్ తీసుకోండి.',
          '2. కాలేజీ కౌంటర్ వద్ద బయోమెట్రిక్ పూర్తి చేయండి.',
          '3. నవంబర్ 30 లోపు పోర్టల్‌లో దరఖాస్తు చేయండి.',
        ],
        warningEn:
          'Notice: Requires 75% college attendance. Verify your attendance status with your college clerk before applying.',
        warningTe:
          'గమనిక: దీనికి 75% హాజరు ఉండాలి. దరఖాస్తు చేసే ముందు మీ హాజరును సరిచూసుకోండి.',
      },
    },

    pension: {
      id: 'pension',
      titleEn: 'Senior Citizen Pension Renewal',
      titleTe: 'సీనియర్ సిటిజన్ పింఛను పునరుద్ధరణ',
      originalSnippet: `CENTRAL PENSION ACCOUNTING OFFICE & STATE TREASURY
NOTICE: ANNUAL DIGITAL LIFE CERTIFICATE SUBMISSION (JEEVAN PRAMAAN)

All civilian and military superannuated pensioners receiving monthly credit are required to complete verification between 1st October and 30th November 2026. Submission may be executed via Face Authentication mobile client, Postman doorstep facility, or designated bank branches. In the absence of confirmed biometric token submission by the terminal date of 30th November, pension credit for December will be withheld until subsequent regularization. Senior pensioners aged 80+ may avail doorstep postal service without surcharge.`,
      explanation: {
        meaningEn:
          'This notice reminds retired senior citizens to submit their annual Life Certificate (Jeevan Pramaan) so pension payments continue smoothly without interruption.',
        meaningTe:
          'రిటైర్ అయిన సీనియర్ సిటిజన్లు తమ వార్షిక జీవన్ ప్రమాణ్ సర్టిఫికేట్ సమర్పించాలని తెలిపే నోటీసు.',
        keyFactsEn: [
          'Submission Window: 1 October to 30 November 2026',
          'Consequence: December pension paused if not submitted by 30 Nov',
          'Aged 80+: Free doorstep service by your local postman',
          'Options: Mobile face app, bank branch, or post office',
        ],
        keyFactsTe: [
          'సమర్పించే సమయం: 1 అక్టోబర్ నుండి 30 నవంబర్ 2026 వరకు',
          'గడువు దాటితే: డిసెంబర్ పింఛను తాత్కాలికంగా ఆగిపోతుంది',
          '80 ఏళ్లు పైబడిన వారికి: పోస్ట్‌మ్యాన్ ఉచితంగా ఇంటి వద్దకే వస్తారు',
          'చేసే విధానం: మొబైల్ ఫేస్ యాప్, బ్యాంక్ లేదా పోస్ట్ ఆఫీస్',
        ],
        checklistEn: [
          'Aadhaar Card',
          'Pension Payment Order (PPO) Number',
          'Bank Account Passbook where pension arrives',
          'Mobile phone linked with Aadhaar (for OTP)',
        ],
        checklistTe: [
          'ఆధార్ కార్డు',
          'PPO నంబర్',
          'పింఛను పడే బ్యాంక్ పాస్‌బుక్',
          'ఆధార్ లింక్ అయిన మొబైల్ ఫోన్ (ఓటీపీ కోసం)',
        ],
        nextStepsEn: [
          '1. Choose your preferred way: Face authentication on smartphone, or walk into your local bank/post office.',
          '2. Keep your PPO number and Aadhaar ready.',
          '3. Complete verification before 30 November.',
          '4. Save the confirmation SMS with your Pramaan ID.',
        ],
        nextStepsTe: [
          '1. మొబైల్ యాప్ లేదా బ్యాంక్/పోస్ట్ ఆఫీస్‌ను ఎంచుకోండి.',
          '2. PPO నంబర్ మరియు ఆధార్ సిద్ధంగా ఉంచుకోండి.',
          '3. నవంబర్ 30 లోపు వెరిఫికేషన్ పూర్తి చేయండి.',
          '4. వచ్చే ప్రమాణ్ ఐడీ SMSను దాచుకోండి.',
        ],
        warningEn:
          'Warning: Never share your bank account password or ATM PIN with anyone offering to help with your life certificate.',
        warningTe:
          'హెచ్చరిక: లైఫ్ సర్టిఫికేట్ కోసం మీ బ్యాంక్ పాస్‌వర్డ్ లేదా ఏటీఎం పిన్ ఎవరికీ చెప్పకండి.',
      },
    },
  };

  const activeSample = samples[activeSampleId] || samples.farmer;

  // Helper: Format file size into human-readable string
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Helper: Count words in a string
  const countWords = (text) => {
    if (!text || !text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  };

  // Helper: Validate file type, empty files, and 10MB size limit
  const validateAndProcessFile = (file) => {
    if (!file) return;

    // Reset previous prepared payload and errors
    setPreparedDocument(null);
    setPasteError(null);

    // Empty file check (0 bytes)
    if (file.size === 0) {
      setFileError(
        isTelugu
          ? 'ఎంచుకున్న ఫైల్ ఖాళీగా ఉంది (0 బైట్లు). దయచేసి సరైన పత్రాన్ని ఎంచుకోండి.'
          : 'Selected file is empty (0 bytes). Please choose a valid document.'
      );
      if (selectedFile?.previewUrl) {
        URL.revokeObjectURL(selectedFile.previewUrl);
      }
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // 10MB limit in bytes
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setFileError(
        isTelugu
          ? `ఫైల్ పరిమాణం చాలా పెద్దది (${formatFileSize(file.size)}). గరిష్ట పరిమాణం 10MB మాత్రమే.`
          : `File size exceeds 10MB limit (${formatFileSize(file.size)}). Please choose a smaller file.`
      );
      if (selectedFile?.previewUrl) {
        URL.revokeObjectURL(selectedFile.previewUrl);
      }
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.txt'];
    const allowedMimeTypes = ['application/pdf', 'image/png', 'image/jpeg', 'text/plain'];

    const lastDotIndex = file.name.lastIndexOf('.');
    const fileExtension = lastDotIndex !== -1 ? file.name.slice(lastDotIndex).toLowerCase() : '';

    const isExtAllowed = allowedExtensions.includes(fileExtension);
    const isMimeAllowed = allowedMimeTypes.includes(file.type);

    if (!isExtAllowed && !isMimeAllowed) {
      setFileError(
        isTelugu
          ? 'మద్దతు లేని ఫైల్ రకం. దయచేసి PDF, PNG, JPG, లేదా TXT ఫైల్‌ను మాత్రమే ఎంచుకోండి.'
          : 'Unsupported file type. Please select a PDF, PNG, JPEG, or TXT file.'
      );
      if (selectedFile?.previewUrl) {
        URL.revokeObjectURL(selectedFile.previewUrl);
      }
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Revoke previous object URL if any
    if (selectedFile?.previewUrl) {
      URL.revokeObjectURL(selectedFile.previewUrl);
    }

    // Validation successful
    setFileError(null);
    let category = 'document';
    let previewUrl = null;

    if (fileExtension === '.pdf' || file.type === 'application/pdf') {
      category = 'pdf';
    } else if (['.png', '.jpg', '.jpeg'].includes(fileExtension) || file.type.startsWith('image/')) {
      category = 'image';
      previewUrl = URL.createObjectURL(file);
    } else if (fileExtension === '.txt' || file.type === 'text/plain') {
      category = 'text';
    }

    const fileMeta = {
      file,
      name: file.name,
      size: file.size,
      sizeFormatted: formatFileSize(file.size),
      type: file.type || fileExtension.replace('.', '').toUpperCase(),
      category,
      previewUrl,
      textContent: null,
      previewSnippet: null,
      wordCount: null,
      charCount: null,
      lastModified: file.lastModified ? new Date(file.lastModified).toLocaleDateString() : 'Recent',
    };

    setSelectedFile(fileMeta);

    // Read text file asynchronously in browser
    if (category === 'text') {
      file.text()
        .then((text) => {
          const words = countWords(text);
          const lines = text.split('\n').length;
          setSelectedFile((prev) => {
            if (!prev || prev.name !== file.name) return prev;
            return {
              ...prev,
              textContent: text,
              wordCount: words,
              lineCount: lines,
              charCount: text.length,
              previewSnippet: text.slice(0, 350) + (text.length > 350 ? '...' : ''),
            };
          });
        })
        .catch(() => {
          // Gracefully continue with basic metadata
        });
    }

    setFeedbackNotice(
      isTelugu
        ? `ఎంపికైన పత్రం: "${file.name}" (${formatFileSize(file.size)}). పరిశీలించి "పత్రాన్ని సిద్ధం చేయండి" క్లిక్ చేయండి.`
        : `Selected file: "${file.name}" (${formatFileSize(file.size)}). Review preview and click "Prepare Document".`
    );
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndProcessFile(files[0]);
    }
  };

  const handleRemoveFile = (e) => {
    if (e) e.stopPropagation();
    if (selectedFile?.previewUrl) {
      URL.revokeObjectURL(selectedFile.previewUrl);
    }
    setSelectedFile(null);
    setFileError(null);
    setPreparedDocument(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFeedbackNotice(
      isTelugu
        ? 'పత్రం తొలగించబడింది. మీరు మరొక ఫైల్‌ను ఎంచుకోవచ్చు.'
        : 'Document removed. You can browse or drop a different file.'
    );
  };

  const handleBrowseClick = (e) => {
    if (e) e.stopPropagation();
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Ensure re-selecting same file fires onChange
      fileInputRef.current.click();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  // Helper: Read browser file as Base64 string
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result;
        const b64 = typeof result === 'string' && result.includes(',') ? result.split(',')[1] : result;
        resolve(b64);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  // Stage 3 & 4: Functional "Prepare Document" Action
  const handlePrepareDocument = () => {
    const srcLangObj = getLanguageByCode(sourceDocLang);
    const targetLangObj = getLanguageByCode(targetAnalysisLang);
    const srcLabel = sourceDocLang === 'auto' ? (isTelugu ? 'ఆటో-గుర్తింపు' : 'Auto-detected') : srcLangObj.name;
    const targetLabel = targetLangObj.name;

    if (workspaceTab === 'upload') {
      if (selectedFile) {
        setFileError(null);
        const payload = {
          source: 'upload',
          title: selectedFile.name,
          category: selectedFile.category,
          sizeFormatted: selectedFile.sizeFormatted,
          type: selectedFile.type || 'Document File',
          wordCount: selectedFile.wordCount,
          charCount: selectedFile.charCount,
          sourceLang: sourceDocLang,
          sourceLangName: srcLabel,
          targetLang: targetAnalysisLang,
          targetLangName: targetLabel,
          previewUrl: selectedFile.previewUrl,
          previewSnippet: selectedFile.previewSnippet,
          textContent: selectedFile.textContent || '',
          preparedAt: new Date().toLocaleTimeString(),
          mode: 'Client Browser Memory (100% Private)',
        };
        setPreparedDocument(payload);
        setFeedbackNotice(
          isTelugu
            ? `'${selectedFile.name}' పత్రం సిద్ధమైంది. ఇప్పుడు "ఏఐ వివరణను రూపొందించండి" క్లిక్ చేయండి.`
            : `'${selectedFile.name}' verified and prepared. Click "Generate AI Explanation" to analyze with AI.`
        );
        return payload;
      } else {
        setFileError(
          isTelugu
            ? 'దయచేసి పత్రాన్ని సిద్ధం చేయడానికి ముందు ఒక ఫైల్‌ను (PDF, PNG, JPG, లేదా TXT) ఎంచుకోండి.'
            : 'Please select a document (PDF, PNG, JPEG, or TXT) before preparing.'
        );
        setFeedbackNotice(
          isTelugu
            ? 'దయచేసి ముందుగా ఒక పత్రాన్ని ఎంచుకోండి.'
            : 'Please choose a document to prepare.'
        );
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
        return null;
      }
    } else {
      // Paste text tab
      if (pastedText.trim().length > 0) {
        setPasteError(null);
        const words = countWords(pastedText);
        const payload = {
          source: 'paste',
          title: isTelugu ? 'పేస్ట్ చేసిన పత్రం టెక్స్ట్' : 'Pasted Document Text',
          category: 'text',
          sizeFormatted: `${pastedText.length} ${isTelugu ? 'అక్షరాలు' : 'characters'}`,
          type: 'Plain Text',
          wordCount: words,
          charCount: pastedText.length,
          sourceLang: sourceDocLang,
          sourceLangName: srcLabel,
          targetLang: targetAnalysisLang,
          targetLangName: targetLabel,
          previewSnippet: pastedText.slice(0, 250) + (pastedText.length > 250 ? '...' : ''),
          textContent: pastedText.trim(),
          preparedAt: new Date().toLocaleTimeString(),
          mode: 'Client Browser Memory (100% Private)',
        };
        setPreparedDocument(payload);
        setFeedbackNotice(
          isTelugu
            ? `${words} పదాల టెక్స్ట్ సిద్ధమైంది. ఇప్పుడు "ఏఐ వివరణను రూపొందించండి" క్లిక్ చేయండి.`
            : `${words} words of document text prepared. Click "Generate AI Explanation" to analyze with AI.`
        );
        return payload;
      } else {
        setPasteError(
          isTelugu
            ? 'దయచేసి సిద్ధం చేయడానికి ముందు టెక్స్ట్‌ను పేస్ట్ చేయండి లేదా "నమూనా టెక్స్ట్ చేర్చండి" క్లిక్ చేయండి.'
            : 'Please paste document text or click "Insert Sample Notice" before preparing.'
        );
        setFeedbackNotice(
          isTelugu
            ? 'టెక్స్ట్ ఖాళీగా ఉంది. దయచేసి టెక్స్ట్‌ను పేస్ట్ చేయండి.'
            : 'Pasted text is empty. Please enter or paste text to prepare.'
        );
        return null;
      }
    }
  };

  // Stage 4: Real AI Explanation Generation Execution
  const executeAiExplanation = async () => {
    // Ensure document is prepared
    let doc = preparedDocument;
    if (!doc) {
      doc = handlePrepareDocument();
      if (!doc) return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    setExplanationResult(null);

    // Smooth scroll to explanation results area
    setTimeout(() => {
      const el = document.getElementById('explanation-results') || document.getElementById('get-started');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);

    try {
      const srcLangObj = getLanguageByCode(sourceDocLang);
      const targetLangObj = getLanguageByCode(targetAnalysisLang);

      let payload = {
        sourceLang: sourceDocLang,
        targetLang: targetAnalysisLang,
        sourceLangName: sourceDocLang === 'auto' ? (isTelugu ? 'ఆటో-గుర్తింపు' : 'Auto-detected') : srcLangObj.name,
        targetLangName: targetLangObj.name,
      };

      if (workspaceTab === 'upload') {
        if (!selectedFile) throw new Error('Please select a file to explain.');
        const b64 = await fileToBase64(selectedFile.file);
        payload = {
          ...payload,
          fileBase64: b64,
          fileName: selectedFile.name,
          mimeType: selectedFile.type,
          category: selectedFile.category,
          text: selectedFile.textContent || undefined,
        };
      } else {
        if (!pastedText.trim()) throw new Error('Please paste document text to explain.');
        payload = {
          ...payload,
          text: pastedText.trim(),
          fileName: 'Pasted Document Text',
          category: 'text',
        };
      }

      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setAnalysisError(data);
        setFeedbackNotice(
          isTelugu ? 'ఏఐ వివరణ ప్రాసెసింగ్‌లో సమస్య ఎదురైంది.' : 'AI explanation failed. See error details below.'
        );
      } else {
        setExplanationResult(data.explanation);
        setExtractionMeta(data.extractionMeta);
        setFeedbackNotice(
          isTelugu ? 'ఏఐ వివరణ విజయవంతంగా రూపొందించబడింది!' : 'AI explanation generated successfully!'
        );
      }
    } catch (err) {
      setAnalysisError({
        error: 'CLIENT_ERROR',
        message: err.message || 'An error occurred while preparing the explanation request.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <PageLayout currentLang={currentLang} onToggleLang={toggleLanguage}>
      {/* 1. HERO SECTION (#home) */}
      <section id="home" className="lt-hero">
        <div className="container">
          <div className="lt-hero__grid">
            {/* Left Column: Heading, Supporting Text, Action Buttons */}
            <div className="lt-hero__content">
              <div className="lt-hero__meta">
                <Badge variant="teal" size="sm">
                  {isTelugu ? 'బోధక (Bodhaka) • లైఫ్ ట్రాన్స్‌లేటర్' : 'Bodhaka (బోధక) • Life Translator'}
                </Badge>
                <Badge variant="navy" size="sm">
                  {isTelugu ? 'బహుభాషా మద్దతు' : 'Multilingual Ready'}
                </Badge>
                <Badge variant="neutral" size="sm">
                  {isTelugu ? 'ఉచితం & సురక్షితం' : 'Free & Private'}
                </Badge>
              </div>

              {/* Exact Main Heading */}
              <h1 className="lt-hero__title">
                {isTelugu ? (
                  <>
                    మీ పత్రాలను అర్థం చేసుకోండి.{' '}
                    <span className="lt-hero__highlight">మీ తదుపరి చర్యలను తెలుసుకోండి.</span>
                  </>
                ) : (
                  <>
                    Understand Your Documents.{' '}
                    <span className="lt-hero__highlight">Know Your Next Steps.</span>
                  </>
                )}
              </h1>

              {/* Exact Supporting Text */}
              <p className="lt-hero__subtitle">
                {isTelugu
                  ? 'కష్టమైన పత్రాలను చూసి గందరగోళానికి గురవుతున్నారా? పత్రాన్ని అప్‌లోడ్ చేసి, మీ భాషను ఎంచుకోండి; దాని అసలైన ఉద్దేశ్యాన్ని మరియు మీరు చేయాల్సిన పనుల స్పష్టమైన జాబితాను పొందండి.'
                  : 'Confused by complicated documents? Upload a document, choose your language, and get a simple explanation of what it means and what to do next.'}
              </p>

              {/* Hero Buttons */}
              <div className="lt-hero__actions">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    scrollTo('get-started');
                    setFeedbackNotice(
                      isTelugu
                        ? 'డాక్యుమెంట్ వర్క్‌స్పేస్‌కి వచ్చారు. మీ పత్రాన్ని ఇక్కడ అప్‌లోడ్ చేయవచ్చు లేదా టెక్స్ట్‌ను పేస్ట్ చేయవచ్చు.'
                        : 'Welcome to the Document Workspace. You can drop a file or paste text below.'
                    );
                  }}
                >
                  {isTelugu ? 'ప్రారంభించండి' : 'Get Started'}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    scrollTo('how-it-works');
                    setFeedbackNotice(
                      isTelugu
                        ? 'లైఫ్ ట్రాన్స్‌లేటర్ పనిచేసే 3 సులభమైన దశలు ఇక్కడ ఉన్నాయి.'
                        : 'Here are the 3 simple steps of Life Translator.'
                    );
                  }}
                >
                  {isTelugu ? 'ఇది ఎలా పనిచేస్తుందో చూడండి' : 'See How It Works'}
                </Button>
              </div>
            </div>

            {/* Right Column: Clean CSS Visual (Complicated Document -> Easy to Understand) */}
            <div className="lt-hero__visual" aria-hidden="true">
              {/* Top: Dense Complicated Document */}
              <div className="lt-visual-card lt-visual-card--before">
                <span className="lt-visual-card__tag lt-visual-card__tag--before">
                  ❌ {isTelugu ? 'కష్టమైన అధికారిక సర్క్యులర్' : 'Complicated Official Document'}
                </span>
                <p style={{ fontWeight: 600, color: 'var(--color-navy-900)', marginBottom: '4px' }}>
                  Clause 8(a): Agri/2026/Sub-42B
                </p>
                <div className="lt-visual-card__lines">
                  <div className="lt-visual-card__line"></div>
                  <div className="lt-visual-card__line lt-visual-card__line--medium"></div>
                  <div className="lt-visual-card__line lt-visual-card__line--short"></div>
                </div>
              </div>

              {/* Middle: Transformation Bridge */}
              <div className="lt-visual-bridge">
                <span className="lt-visual-bridge__arrow">⚡</span>
                <span>{isTelugu ? 'లైఫ్ ట్రాన్స్‌లేటర్ సులభతరం చేస్తుంది' : 'Simplified by Life Translator'}</span>
                <span className="lt-visual-bridge__arrow">↓</span>
              </div>

              {/* Bottom: Clear Next Steps & Explanation */}
              <div className="lt-visual-card lt-visual-card--after">
                <span className="lt-visual-card__tag lt-visual-card__tag--after">
                  ✨ {isTelugu ? 'సులభమైన వివరణ & కార్యాచరణ' : 'Clear Explanation & Next Steps'}
                </span>
                <div className="lt-visual-card__items">
                  <div className="lt-visual-card__item">
                    <span className="lt-visual-card__icon">✓</span>
                    <span>{isTelugu ? 'వివరణ: విడతకు ₹2,000 పంట సబ్సిడీ' : 'Meaning: ₹2,000 subsidy per installment'}</span>
                  </div>
                  <div className="lt-visual-card__item">
                    <span className="lt-visual-card__icon">📅</span>
                    <span>{isTelugu ? 'తుది గడువు: 15 నవంబర్ 2026' : 'Deadline: 15 November 2026'}</span>
                  </div>
                  <div className="lt-visual-card__item">
                    <span className="lt-visual-card__icon">📋</span>
                    <span>{isTelugu ? 'కావాల్సినవి: ఆధార్ + బ్యాంక్ పాస్‌బుక్' : 'Checklist: Aadhaar + Bank Passbook'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Status Notice Banner */}
      {feedbackNotice && (
        <section className="container" style={{ paddingTop: 'var(--space-4)' }}>
          <div className="lt-feedback-alert" role="status">
            <div className="lt-feedback-alert__text">
              <span aria-hidden="true">💡</span>
              <span>{feedbackNotice}</span>
            </div>
            <button
              type="button"
              className="lt-feedback-alert__close"
              onClick={() => setFeedbackNotice('')}
              aria-label="Dismiss notice"
              title="Close notice"
            >
              ✕
            </button>
          </div>
        </section>
      )}

      {/* 2. HOW IT WORKS SECTION (#how-it-works) */}
      <section id="how-it-works" className="lt-section lt-section--muted">
        <div className="container">
          <div className="lt-section-header lt-section-header--center">
            <Badge variant="teal" size="sm" className="lt-section-header__badge">
              {isTelugu ? 'సరళమైన ప్రక్రియ' : '3 Simple Steps'}
            </Badge>
            <h2 className="lt-section-header__title">
              {isTelugu ? 'ఇది ఎలా పనిచేస్తుంది' : 'How It Works'}
            </h2>
            <p className="lt-section-header__desc">
              {isTelugu
                ? 'మీరు చేయాల్సిందల్లా మూడు సులువైన పనులు. మిగిలినదంతా లైఫ్ ట్రాన్స్‌లేటర్ చూసుకుంటుంది:'
                : 'Life Translator turns hard paperwork into clear next steps in three easy steps:'}
            </p>
          </div>

          <div className="lt-how-steps">
            {howSteps.map((item) => (
              <Card key={item.step} variant="default" padding="lg" className="lt-step-box">
                <div className="lt-step-box__num-badge">{item.step}</div>
                <div className="lt-step-box__icon" aria-hidden="true">{item.icon}</div>
                <h3 className="lt-step-box__title">
                  {isTelugu ? item.titleTe : item.titleEn}
                </h3>
                <p className="lt-step-box__desc">
                  {isTelugu ? item.descTe : item.descEn}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 3. WHO IT HELPS SECTION (#who-it-helps) */}
      <section id="who-it-helps" className="lt-section">
        <div className="container">
          <div className="lt-section-header">
            <Badge variant="navy" size="sm" className="lt-section-header__badge">
              {isTelugu ? 'అందరి కోసం' : 'Audience'}
            </Badge>
            <h2 className="lt-section-header__title">
              {isTelugu ? 'ఎవరికి సహాయం చేస్తుంది' : 'Who It Helps'}
            </h2>
            <p className="lt-section-header__desc">
              {isTelugu
                ? 'విద్యార్థుల నుండి రైతుల వరకు, ప్రతి ఒక్కరూ వారి రోజువారీ పత్రాలను సులభంగా అర్థం చేసుకోవడానికి రూపొందించబడింది:'
                : 'Designed for everyday citizens, students, and farmers navigating essential paperwork:'}
            </p>
          </div>

          <div className="lt-who-grid">
            {whoHelpsGroups.map((group) => {
              const isSelected = selectedWhoGroup === group.id;
              return (
                <Card
                  key={group.id}
                  variant={isSelected ? 'accent' : 'interactive'}
                  padding="md"
                  className="lt-who-card"
                  onClick={() => {
                    setSelectedWhoGroup(group.id);
                    if (group.sampleKey === 'student') setActiveSampleId('student');
                    else if (group.sampleKey === 'pension') setActiveSampleId('pension');
                    else setActiveSampleId('farmer');

                    setFeedbackNotice(
                      isTelugu
                        ? `${group.titleTe} ఎంపిక చేయబడింది. కింద ఉన్న నమూనా పత్రాన్ని చూడవచ్చు.`
                        : `Selected ${group.titleEn}. The sample document is ready below.`
                    );
                  }}
                >
                  <div className="lt-who-card__icon" aria-hidden="true">{group.icon}</div>
                  <h3 className="lt-who-card__title">
                    {isTelugu ? group.titleTe : group.titleEn}
                  </h3>
                  <p className="lt-who-card__desc">
                    {isTelugu ? group.descTe : group.descEn}
                  </p>
                  <div className="lt-who-card__action">
                    <Button
                      variant={isSelected ? 'primary' : 'outline'}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedWhoGroup(group.id);
                        scrollTo('sample-preview');
                      }}
                    >
                      {isTelugu ? 'నమూనా చూడండి ↓' : 'View Sample ↓'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. KEY BENEFITS SECTION (#features) */}
      <section id="features" className="lt-section lt-section--muted">
        <div className="container">
          <div className="lt-section-header">
            <Badge variant="teal" size="sm" className="lt-section-header__badge">
              {isTelugu ? 'ప్రయోజనాలు' : 'Key Benefits'}
            </Badge>
            <h2 className="lt-section-header__title">
              {isTelugu ? 'లైఫ్ ట్రాన్స్‌లేటర్ ముఖ్య ప్రయోజనాలు' : 'Key Benefits of Life Translator'}
            </h2>
            <p className="lt-section-header__desc">
              {isTelugu
                ? 'పత్రాల గందరగోళాన్ని నివారించడానికి మేము ప్లాన్ చేసిన ముఖ్య సదుపాయాలు:'
                : 'Planned capabilities designed to help you navigate documents with confidence:'}
            </p>
          </div>

          <div className="lt-benefits-grid">
            {keyBenefits.map((benefit, idx) => (
              <Card key={idx} variant="default" padding="lg" className="lt-benefit-card">
                <div className="lt-benefit-card__icon" aria-hidden="true">{benefit.icon}</div>
                <h3 className="lt-benefit-card__title">
                  {isTelugu ? benefit.titleTe : benefit.titleEn}
                </h3>
                <p className="lt-benefit-card__desc">
                  {isTelugu ? benefit.descTe : benefit.descEn}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5. DOCUMENT WORKSPACE PLACEHOLDER (#get-started) */}
      <section id="get-started" className="lt-section lt-section--warm">
        <div className="container">
          <div className="lt-workspace-container">
            <div className="lt-section-header lt-section-header--center">
              <Badge variant="teal" size="sm" className="lt-section-header__badge">
                {isTelugu ? 'పత్రాల విభాగం' : 'Document Workspace'}
              </Badge>
              <h2 className="lt-section-header__title">
                {isTelugu ? 'మీ పత్రాన్ని ఇక్కడ చేర్చండి' : 'Add Your Document Here'}
              </h2>
              <p className="lt-section-header__desc">
                {isTelugu
                  ? 'మీ పత్రాన్ని అప్‌లోడ్ చేయండి లేదా టెక్స్ట్‌ను పేస్ట్ చేసి ప్రివ్యూ చూసి సిద్ధం చేయండి:'
                  : 'Upload your document or paste text below to preview and prepare it for translation and explanation:'}
              </p>
            </div>

            <Card variant="elevated" padding="lg">
              {/* Working Tabs: Upload Document vs Paste Text */}
              <div className="lt-workspace-tabs" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={workspaceTab === 'upload'}
                  className={`lt-workspace-tab-btn ${workspaceTab === 'upload' ? 'is-active' : ''}`}
                  onClick={() => setWorkspaceTab('upload')}
                >
                  📁 {isTelugu ? 'పత్రం అప్‌లోడ్ చేయండి' : 'Upload Document'}
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={workspaceTab === 'paste'}
                  className={`lt-workspace-tab-btn ${workspaceTab === 'paste' ? 'is-active' : ''}`}
                  onClick={() => setWorkspaceTab('paste')}
                >
                  📝 {isTelugu ? 'టెక్స్ట్ పేస్ట్ చేయండి' : 'Paste Document Text'}
                </button>
              </div>

              {/* Native Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.txt,application/pdf,image/png,image/jpeg,text/plain"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
                aria-label="Upload document file"
                tabIndex={-1}
              />

              {/* Tab 1: Upload Dropzone & Selected File View */}
              {workspaceTab === 'upload' && (
                <div>
                  {selectedFile ? (
                    <div className="lt-selected-file-card">
                      <div className="lt-selected-file-card__inner">
                        <div className="lt-selected-file-card__main">
                          <div className="lt-selected-file-card__icon" aria-hidden="true">
                            {selectedFile.category === 'pdf'
                              ? '📕'
                              : selectedFile.category === 'image'
                              ? '🖼️'
                              : selectedFile.category === 'text'
                              ? '📝'
                              : '📄'}
                          </div>
                          <div className="lt-selected-file-card__details">
                            <span className="lt-selected-file-card__name" title={selectedFile.name}>
                              {selectedFile.name}
                            </span>
                            <div className="lt-selected-file-card__meta">
                              <span>{selectedFile.sizeFormatted}</span>
                              <span>•</span>
                              <span>{selectedFile.type}</span>
                              <span>•</span>
                              <Badge variant="teal" size="sm">
                                {isTelugu ? 'ప్రివ్యూ సిద్ధం' : 'Preview Ready'}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveFile}
                          title={isTelugu ? 'పత్రాన్ని తొలగించండి' : 'Remove this document'}
                          ariaLabel="Remove selected document"
                        >
                          ✕ {isTelugu ? 'తొలగించండి' : 'Remove'}
                        </Button>
                      </div>

                      <div className="lt-selected-file-card__actions">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleBrowseClick}
                        >
                          🔄 {isTelugu ? 'మరొక ఫైల్ ఎంచుకోండి' : 'Choose Different File'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowDocPreview((prev) => !prev)}
                        >
                          {showDocPreview
                            ? (isTelugu ? '👁️ ప్రివ్యూ దాచండి' : '👁️ Hide Preview')
                            : (isTelugu ? '👁️ ప్రివ్యూ చూపించండి' : '👁️ Show Preview')}
                        </Button>
                      </div>

                      {/* Stage 3: In-Browser Document Preview */}
                      {showDocPreview && (
                        <div className="lt-document-preview">
                          <div className="lt-document-preview__header">
                            <span className="lt-document-preview__title">
                              <span>👁️</span>
                              <span>{isTelugu ? 'పత్రం పరిశీలన (బ్రౌజర్ మెమరీ)' : 'Document Inspection (In-Browser)'}</span>
                            </span>
                            <Badge variant="teal" size="sm">
                              {selectedFile.category === 'image'
                                ? (isTelugu ? 'చిత్రం ప్రివ్యూ' : 'Image Preview')
                                : selectedFile.category === 'text'
                                ? (isTelugu ? 'టెక్స్ట్ ప్రివ్యూ' : 'Text Preview')
                                : (isTelugu ? 'పీడీఎఫ్ వివరాలు' : 'PDF Metadata')}
                            </Badge>
                          </div>

                          {/* Image Preview */}
                          {selectedFile.category === 'image' && selectedFile.previewUrl && (
                            <div className="lt-image-preview">
                              <img
                                src={selectedFile.previewUrl}
                                alt={selectedFile.name}
                                className="lt-image-preview__img"
                              />
                              <div className="lt-image-preview__meta">
                                <span>{selectedFile.name}</span> • <span>{selectedFile.sizeFormatted}</span>
                              </div>
                            </div>
                          )}

                          {/* Text File Preview */}
                          {selectedFile.category === 'text' && (
                            <div className="lt-text-preview">
                              <div className="lt-text-preview__box">
                                {selectedFile.textContent || selectedFile.previewSnippet || (isTelugu ? 'టెక్స్ట్ లోడ్ అవుతోంది...' : 'Loading text content...')}
                              </div>
                              <div className="lt-text-preview__stats">
                                <span><strong>{selectedFile.wordCount || 0}</strong> {isTelugu ? 'పదాలు' : 'words'}</span>
                                <span>•</span>
                                <span><strong>{selectedFile.charCount || 0}</strong> {isTelugu ? 'అక్షరాలు' : 'characters'}</span>
                                {selectedFile.textContent && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setPastedText(selectedFile.textContent);
                                      setWorkspaceTab('paste');
                                      setFeedbackNotice(
                                        isTelugu
                                          ? 'ఫైల్ టెక్స్ట్ "టెక్స్ట్ పేస్ట్ చేయండి" ట్యాబ్‌కు కాపీ చేయబడింది.'
                                          : 'File text copied into Paste Text tab for editing.'
                                      );
                                    }}
                                  >
                                    📋 {isTelugu ? 'ఎడిట్ చేయడానికి పేస్ట్ ట్యాబ్‌కు కాపీ చేయండి' : 'Copy to Paste Tab to Edit'}
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}

                          {/* PDF Preview Card */}
                          {selectedFile.category === 'pdf' && (
                            <div className="lt-pdf-preview">
                              <div className="lt-pdf-preview__icon" aria-hidden="true">📕</div>
                              <div className="lt-pdf-preview__info">
                                <strong>{selectedFile.name}</strong>
                                <span className="lt-pdf-preview__note">
                                  {selectedFile.sizeFormatted} • {selectedFile.type || 'application/pdf'} • {selectedFile.lastModified}
                                </span>
                                <span className="lt-pdf-preview__note" style={{ color: 'var(--color-teal-700)', marginTop: '2px' }}>
                                  ✓ {isTelugu ? 'పీడీఎఫ్ ఫార్మాట్ నిర్ధారించబడింది. దశ 4 లో పేజీల విశ్లేషణ సిద్ధమవుతుంది.' : 'PDF format verified in browser. Page-by-page OCR ready for Stage 4.'}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      className={`lt-dropzone ${isDragging ? 'is-dragging' : ''}`}
                      onClick={handleBrowseClick}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      tabIndex={0}
                      role="button"
                      aria-label="Upload document dropzone: Click to browse or drag and drop a file"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleBrowseClick();
                        }
                      }}
                    >
                      <div className="lt-dropzone__icon" aria-hidden="true">📤</div>
                      <h3 className="lt-dropzone__heading">
                        {isTelugu
                          ? 'పత్రాన్ని ఇక్కడ డ్రాగ్ చేయండి లేదా బ్రౌజ్ చేయడానికి క్లిక్ చేయండి'
                          : 'Drag & drop your document here, or click to browse'}
                      </h3>
                      <p className="lt-dropzone__sub">
                        {isTelugu
                          ? 'మద్దతు ఉన్న ఫైల్ రకాలు: PDF, PNG, JPG, JPEG, TXT (గరిష్టంగా 10MB)'
                          : 'Supported formats: PDF, PNG, JPG, JPEG, TXT (up to 10MB)'}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleBrowseClick}
                      >
                        📁 {isTelugu ? 'ఫైల్ ఎంచుకోండి' : 'Browse Files'}
                      </Button>
                    </div>
                  )}

                  {/* Clear Error Alert for Unsupported Type or Oversized File */}
                  {fileError && (
                    <div className="lt-file-error-alert" role="alert">
                      <div className="lt-file-error-alert__text">
                        <span aria-hidden="true">⚠️</span>
                        <span>{fileError}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleBrowseClick}
                        style={{ color: '#991B1B', borderColor: '#FECACA' }}
                      >
                        {isTelugu ? 'మళ్లీ ప్రయత్నించండి' : 'Try Again'}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Paste Text Area */}
              {workspaceTab === 'paste' && (
                <div className="lt-pastezone">
                  <textarea
                    className="lt-textarea"
                    placeholder={
                      isTelugu
                        ? 'మీ పత్రంలోని టెక్స్ట్‌ను ఇక్కడ పేస్ట్ చేయండి...'
                        : 'Paste the confusing text from your document, circular, or letter here...'
                    }
                    value={pastedText}
                    onChange={(e) => {
                      setPastedText(e.target.value);
                      if (pasteError) setPasteError(null);
                      if (preparedDocument) setPreparedDocument(null);
                    }}
                    aria-label="Paste document text here"
                  ></textarea>

                  {/* Inline Paste Error Alert */}
                  {pasteError && (
                    <div className="lt-file-error-alert" role="alert">
                      <div className="lt-file-error-alert__text">
                        <span aria-hidden="true">⚠️</span>
                        <span>{pasteError}</span>
                      </div>
                    </div>
                  )}

                  {/* Paste Controls: Word/Character Stats & Actions */}
                  <div className="lt-paste-controls">
                    <div className="lt-paste-stats">
                      <span>
                        <strong>{pastedText.length}</strong> {isTelugu ? 'అక్షరాలు' : 'characters'}
                      </span>
                      <span>•</span>
                      <span>
                        <strong>{countWords(pastedText)}</strong> {isTelugu ? 'పదాలు' : 'words'}
                      </span>
                      {pastedText.trim().length > 0 && (
                        <>
                          <span>•</span>
                          <span>
                            ~{Math.max(1, Math.ceil(countWords(pastedText) / 150))} {isTelugu ? 'నిమిషం పఠనం' : 'min read'}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="lt-paste-actions">
                      {pastedText.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setPastedText('');
                            setPasteError(null);
                            setPreparedDocument(null);
                            setFeedbackNotice(
                              isTelugu ? 'టెక్స్ట్ తొలగించబడింది.' : 'Pasted text cleared.'
                            );
                          }}
                        >
                          ✕ {isTelugu ? 'టెక్స్ట్ తొలగించండి' : 'Clear Text'}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const fictionalFarmerNotice = `[FICTIONAL DEMONSTRATION NOTICE — DEPARTMENT OF AGRICULTURE & FARMER WELFARE]
CIRCULAR NO. AP-AGRI/2026/SUB-42B
Subject: Disbursement of Input Subsidy for Kharif Season and Crop Insurance

Pursuant to Section 8(a) of the Agricultural Welfare Regulation, all eligible small and marginal pattadar cultivators holding validated e-Crop registration for Kharif are hereby notified:
1. Final Date for Aadhaar-seeded NPCI banking verification: 15th November 2026. Non-compliance shall result in withholding of the ₹2,000 disbursement per installment.
2. Required Documentation: Enclose Form-4B, Village Revenue Officer (VRO) verification slip, and 1-B land record copy.
3. Crop Insurance Cutoff: Weather-based crop insurance premium claim settlement forms must be countersigned by the Rythu Bharosa Kendram (RBK) agricultural extension officer by 20th November 2026.
4. Important Warning: Failure to rectify land ownership ambiguities before the nodal cutoff of 15th November disqualifies claim settlement under the prevailing scheme provisions.
5. What to Note: The circular does not specify the total number of subsidy installments. Beneficiaries must verify the full installment schedule with their local RBK officer.

[DISCLAIMER: This is a fictional sample notice provided solely for technical testing and demonstration of Life Translator's document explanation capabilities. Not an official government circular.]`;
                          setPastedText(fictionalFarmerNotice);
                          setPasteError(null);
                          setPreparedDocument(null);
                          setFeedbackNotice(
                            isTelugu
                              ? '[నమూనా ప్రదర్శన] రైతు పంట సబ్సిడీ నోటీసు చేర్చబడింది. "పత్రాన్ని సిద్ధం చేయండి" క్లిక్ చేయండి.'
                              : '[Fictional Demo Document] Farmer Crop Subsidy Notice loaded. Click "Prepare Document" to start.'
                          );
                        }}
                      >
                        🌱 {isTelugu ? 'రైతు సబ్సిడీ నమూనా నోటీసు (డెమో)' : 'Load Fictional Farmer Notice (Demo)'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Stage 3: Prepared Document Status Card */}
              {preparedDocument && (
                <div className="lt-prepared-card" role="region" aria-label="Prepared Document Status">
                  <div className="lt-prepared-card__header">
                    <div className="lt-prepared-card__title-group">
                      <span aria-hidden="true" style={{ fontSize: '1.3rem' }}>✅</span>
                      <div>
                        <h4 className="lt-prepared-card__title">
                          {isTelugu ? 'పత్రం విజయవంతంగా సిద్ధమైంది (బ్రౌజర్ మెమరీ)' : 'Document Prepared & Verified (Browser Memory Only)'}
                        </h4>
                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                          {isTelugu ? `సిద్ధమైన సమయం: ${preparedDocument.preparedAt}` : `Prepared at ${preparedDocument.preparedAt}`} • {preparedDocument.mode}
                        </span>
                      </div>
                    </div>
                    <Badge variant="teal" size="sm">
                      {isTelugu ? 'దశ 3 సిద్ధం' : 'Stage 3 Ready'}
                    </Badge>
                  </div>

                  <div className="lt-prepared-card__grid">
                    <div className="lt-prepared-card__item">
                      <span className="lt-prepared-card__label">{isTelugu ? 'పత్రం వనరు' : 'Document Source'}</span>
                      <span className="lt-prepared-card__value" title={preparedDocument.title}>
                        {preparedDocument.title}
                      </span>
                    </div>
                    <div className="lt-prepared-card__item">
                      <span className="lt-prepared-card__label">{isTelugu ? 'మూల భాష' : 'Source Language'}</span>
                      <span className="lt-prepared-card__value">{preparedDocument.sourceLangName}</span>
                    </div>
                    <div className="lt-prepared-card__item">
                      <span className="lt-prepared-card__label">{isTelugu ? 'వివరణ భాష' : 'Explanation Target'}</span>
                      <span className="lt-prepared-card__value"><strong>{preparedDocument.targetLangName}</strong></span>
                    </div>
                    <div className="lt-prepared-card__item">
                      <span className="lt-prepared-card__label">{isTelugu ? 'పరిమాణం / పదాలు' : 'Size / Words'}</span>
                      <span className="lt-prepared-card__value">
                        {preparedDocument.sizeFormatted}
                        {preparedDocument.wordCount ? ` (${preparedDocument.wordCount} words)` : ''}
                      </span>
                    </div>
                  </div>

                  <div className="lt-prepared-card__notice">
                    <strong>{isTelugu ? 'దశ 3 గోప్యతా హామీ:' : 'Stage 3 Local Privacy Guarantee:'}</strong>{' '}
                    {isTelugu
                      ? 'ఈ పత్రం మీ బ్రౌజర్ మెమరీలో మాత్రమే సిద్ధం చేయబడింది. ఎటువంటి బాహ్య ఏఐ సర్వర్‌లకు పంపబడలేదు. దశ 4 లో మీ అనుమతితో సురక్షితమైన బ్యాకెండ్ ఏఐ ద్వారా విశ్లేషణ ప్రారంభమవుతుంది.'
                      : 'This document has been validated and prepared strictly within your browser. No data has been transmitted to external services or third-party AI APIs. In Stage 4, this prepared payload will be sent to our secure backend proxy.'}
                  </div>
                </div>
              )}

              {/* Multilingual Document & Explanation Selectors */}
              <div className="lt-workspace-footer">
                <div className="lt-workspace-lang-grid">
                  {/* Source Document Language (with Auto-Detect + Manual Override) */}
                  <LanguageSelector
                    id="source-doc-lang"
                    label={isTelugu ? 'పత్రం అసలు భాష (Original Document Language):' : 'Original Document Language:'}
                    placeholder={
                      isTelugu
                        ? 'భాష పేరు లేదా లిపి ద్వారా వెతకండి...'
                        : 'Search source language (e.g., Auto, Telugu, Hindi, Spanish)...'
                    }
                    languages={getSourceLanguageOptions()}
                    selectedCode={sourceDocLang}
                    onSelect={(code) => {
                      setSourceDocLang(code);
                      const langObj = getLanguageByCode(code);
                      if (preparedDocument) {
                        setPreparedDocument((prev) => prev ? {
                          ...prev,
                          sourceLang: code,
                          sourceLangName: code === 'auto' ? (isTelugu ? 'ఆటో-గుర్తింపు' : 'Auto-detected') : langObj.name,
                        } : null);
                      }
                      setFeedbackNotice(
                        code === 'auto'
                          ? (isTelugu ? 'స్వయంచాలక భాష గుర్తింపు ఎంచుకోబడింది.' : 'Automatic source-language detection enabled.')
                          : (isTelugu ? `మూల భాష: ${langObj.name} ఎంచుకోబడింది.` : `Source document language set to ${langObj.name}.`)
                      );
                    }}
                    showStatusBadge={true}
                  />

                  {/* Target Explanation Language (Searchable) */}
                  <LanguageSelector
                    id="target-explanation-lang"
                    label={isTelugu ? 'మీకు కావలసిన వివరణ భాష (Explanation Language):' : 'Explain Meaning In:'}
                    placeholder={
                      isTelugu
                        ? 'వివరణ భాషను వెతకండి (ఉదా: English, తెలుగు, हिन्दी)...'
                        : 'Search explanation language (e.g., English, Telugu, Hindi)...'
                    }
                    languages={SUPPORTED_LANGUAGES}
                    selectedCode={targetAnalysisLang}
                    onSelect={(code) => {
                      setTargetAnalysisLang(code);
                      if (code === 'en' || code === 'te') {
                        setSampleLang(code);
                      }
                      const langObj = getLanguageByCode(code);
                      if (preparedDocument) {
                        setPreparedDocument((prev) => prev ? {
                          ...prev,
                          targetLang: code,
                          targetLangName: langObj.name,
                        } : null);
                      }
                      setFeedbackNotice(
                        isTelugu
                          ? `వివరణ భాష: ${langObj.name} (${langObj.nativeName}) కు మార్చబడింది.`
                          : `Explanation language set to ${langObj.name} (${langObj.nativeName}).`
                      );
                    }}
                    showStatusBadge={true}
                  />
                </div>

                <div className="lt-workspace-action-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <Badge variant={preparedDocument ? 'teal' : 'navy'} size="sm">
                      {preparedDocument
                        ? (isTelugu ? '✓ పత్రం సిద్ధమైంది' : '✓ Document Ready')
                        : (isTelugu ? 'బహుభాషా మద్దతు' : 'Multilingual Ready')}
                    </Badge>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                      {sourceDocLang === 'auto'
                        ? (isTelugu ? 'ఆటో-గుర్తింపు లేదా మాన్యువల్ ఎంపిక' : 'Auto-detected with manual override')
                        : `${getLanguageByCode(sourceDocLang).name} → ${getLanguageByCode(targetAnalysisLang).name}`}
                    </span>
                  </div>

                  {/* Stage 4: Prepare & Generate AI Actions */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    <Button
                      variant={preparedDocument ? 'outline' : 'primary'}
                      size="md"
                      onClick={handlePrepareDocument}
                    >
                      {preparedDocument
                        ? (isTelugu ? '✓ సిద్ధమైంది (మళ్లీ తనిఖీ చేయండి)' : '✓ Prepared (Re-verify)')
                        : (isTelugu ? '📄 పత్రాన్ని సిద్ధం చేయండి' : '📄 Prepare Document')}
                    </Button>

                    <Button
                      variant="primary"
                      size="md"
                      disabled={isAnalyzing}
                      onClick={executeAiExplanation}
                    >
                      {isAnalyzing
                        ? (isTelugu ? '⏳ విశ్లేషిస్తోంది...' : '⏳ Analyzing...')
                        : (isTelugu ? '✨ ఏఐ వివరణను రూపొందించండి' : '✨ Generate AI Explanation')}
                    </Button>
                  </div>
                </div>

                {/* Secure Data Flow & Grounding Transparency Box */}
                <div className="lt-data-flow-box">
                  <div className="lt-data-flow-box__header">
                    <span aria-hidden="true">🔒</span>
                    <span>{isTelugu ? 'డేటా గోప్యత & సాంకేతిక సామర్థ్యం' : 'Secure Data Flow & Quality Guidelines'}</span>
                  </div>
                  <ul className="lt-data-flow-box__list">
                    <li>
                      <strong>{isTelugu ? 'బ్యాకెండ్ భద్రత:' : 'Backend Security:'}</strong>{' '}
                      {isTelugu
                        ? 'మీ పత్రాలు మరియు ఏపీఐ కీలు సురక్షితమైన బ్యాకెండ్ ప్రాక్సీ ద్వారా మాత్రమే ప్రాసెస్ చేయబడతాయి. బ్రౌజర్‌లో కీలు ఎప్పుడూ బహిర్గతం కావు.'
                        : 'API keys remain secured on the backend proxy server. Documents are processed in-memory and never exposed client-side.'}
                    </li>
                    <li>
                      <strong>{isTelugu ? 'ముఖ్యాంశాల రక్షణ:' : 'Fact Preservation:'}</strong>{' '}
                      {isTelugu
                        ? 'వ్యక్తుల పేర్లు, దరఖాస్తు గడువు తేదీలు, బ్యాంకు ఖాతా నంబర్లు, మరియు అర్హత మొత్తాలు యథాతథంగా రక్షించబడతాయి.'
                        : 'Names, dates, bank account requirements, subsidy amounts, and eligibility criteria are preserved verbatim across translations.'}
                    </li>
                    <li>
                      <strong>{isTelugu ? 'స్పష్టమైన పరిమితులు:' : 'Honest AI Limitations:'}</strong>{' '}
                      {isTelugu
                        ? 'అస్పష్టమైన స్కాన్‌లు, చేతిరాత లేదా మద్దతు లేని లిపి ఉన్నప్పుడు మా వ్యవస్థ ఊహాజనిత సమాచారాన్ని సృష్టించదు; పరిమితిని స్పష్టంగా తెలియజేస్తుంది.'
                        : 'If handwriting, low scan resolution, or unusual scripts cannot be reliably read, Life Translator reports the limitation instead of hallucinating.'}
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Stages 4, 5 & 6: Real AI Explanation, Life Action Map, and Grounded Q&A */}
            <ExplanationView
              explanation={explanationResult}
              extractionMeta={extractionMeta}
              preparedDocument={preparedDocument}
              isLoading={isAnalyzing}
              error={analysisError}
              onRetry={executeAiExplanation}
              onReset={() => {
                setExplanationResult(null);
                setAnalysisError(null);
                scrollTo('get-started');
              }}
              onConfigureKey={() => {
                executeAiExplanation();
              }}
              isTelugu={isTelugu}
              sourceLang={sourceDocLang}
              targetLang={targetAnalysisLang}
              sourceLangName={sourceDocLang === 'auto' ? (isTelugu ? 'ఆటో-గుర్తింపు' : 'Auto-detected') : (getLanguageByCode(sourceDocLang)?.name || 'Auto')}
              targetLangName={getLanguageByCode(targetAnalysisLang)?.name || 'English'}
            />
          </div>
        </div>
      </section>

      {/* WORKING SAMPLE DOCUMENT DEMONSTRATION (Preserved from Stage 1) */}
      <section id="sample-preview" className="lt-section lt-section--muted">
        <div className="container">
          <div className="lt-section-header">
            <Badge variant="teal" size="sm" className="lt-section-header__badge">
              {isTelugu ? 'ప్రత్యక్ష నమూనా' : 'Working Demonstration'}
            </Badge>
            <h2 className="lt-section-header__title">
              {isTelugu ? 'నమూనా పత్రం ఎలా అర్థమవుతుందో చూడండి' : 'See How a Document Is Simplified'}
            </h2>
            <p className="lt-section-header__desc">
              {isTelugu
                ? 'కింద ఉన్న ఉదాహరణలలో ఒకదాన్ని ఎంచుకోండి. అసలైన కష్టమైన పత్రాన్ని మేము ఎలా సులభంగా వివరిస్తామో ప్రత్యక్షంగా చూడండి:'
                : 'Choose one of our real-world examples below to see how Life Translator transforms complicated paperwork into a simple explanation and checklist:'}
            </p>
          </div>

          {/* Sample Selectors and Accessibility Controls */}
          <div className="lt-sample-controls">
            <div className="lt-sample-selector">
              <Button
                variant={activeSampleId === 'farmer' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => {
                  setActiveSampleId('farmer');
                  setFeedbackNotice(
                    isTelugu ? 'రైతు పంట సబ్సిడీ నమూనా ఎంపికైంది.' : 'Loaded Farmer Crop Subsidy notice.'
                  );
                }}
              >
                🌾 {isTelugu ? 'రైతు సబ్సిడీ' : 'Farmer Subsidy'}
              </Button>

              <Button
                variant={activeSampleId === 'student' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => {
                  setActiveSampleId('student');
                  setFeedbackNotice(
                    isTelugu ? 'విద్యార్థి స్కాలర్‌షిప్ నమూనా ఎంపికైంది.' : 'Loaded Student Scholarship circular.'
                  );
                }}
              >
                🎓 {isTelugu ? 'విద్యార్థి స్కాలర్‌షిప్' : 'Student Scholarship'}
              </Button>

              <Button
                variant={activeSampleId === 'pension' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => {
                  setActiveSampleId('pension');
                  setFeedbackNotice(
                    isTelugu ? 'సీనియర్ సిటిజన్ పింఛను నమూనా ఎంపికైంది.' : 'Loaded Senior Pension notice.'
                  );
                }}
              >
                👵 {isTelugu ? 'సీనియర్ పింఛను' : 'Senior Pension'}
              </Button>
            </div>

            {/* Accessibility Controls: Language switch & font size */}
            <div className="lt-sample-tools">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSampleLang((prev) => (prev === 'en' ? 'te' : 'en'));
                  setFeedbackNotice(
                    sampleLang === 'en' ? 'వివరణ తెలుగులోకి మార్చబడింది.' : 'Explanation switched to English.'
                  );
                }}
                title="Switch explanation between English and Telugu"
              >
                🌐 {sampleLang === 'en' ? 'తెలుగులో వివరణ' : 'English Explanation'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsLargeText((prev) => !prev);
                  setFeedbackNotice(
                    !isLargeText ? 'అక్షరాల పరిమాణం పెంచబడింది.' : 'Text size set back to standard.'
                  );
                }}
                title="Toggle larger font size for easier reading"
              >
                🔤 {isLargeText ? 'Standard Text' : 'Larger Text'}
              </Button>
            </div>
          </div>

          {/* Comparison Cards: Original Hard Document vs Life Translator Explanation */}
          <div className={`lt-sample-grid ${isLargeText ? 'is-large-text' : ''}`}>
            {/* Left Card: Original Confusing Text */}
            <Card variant="default" padding="md" className="lt-doc-card">
              <div className="lt-doc-card__header">
                <div>
                  <h3 className="lt-doc-card__title">
                    📄 {isTelugu ? 'అసలైన కష్టమైన పత్రం' : 'Original Hard Document'}
                  </h3>
                  <Badge variant="neutral" size="sm">
                    {isTelugu ? 'అధికారిక సర్క్యులర్' : 'Official Excerpt'}
                  </Badge>
                </div>
              </div>

              <pre className="lt-doc-card__original-text">
                {activeSample.originalSnippet}
              </pre>

              <p className="lt-doc-card__original-note">
                {isTelugu
                  ? 'గమనిక: ఇలాంటి పత్రాల్లోని న్యాయపరమైన భాష సాధారణ పౌరులకు అర్థం చేసుకోవడం కష్టంగా ఉంటుంది.'
                  : 'Notice: Official documents use dense clauses that make it difficult for everyday people to find what they need.'}
              </p>
            </Card>

            {/* Right Card: Life Translator Simplified Breakdown */}
            <Card variant="accent" padding="md" className="lt-doc-card">
              <div className="lt-doc-card__header">
                <div>
                  <h3 className="lt-doc-card__title">
                    ✨ {isTelugu ? 'లైఫ్ ట్రాన్స్‌లేటర్ సులభమైన వివరణ' : 'Life Translator Simple Explanation'}
                  </h3>
                  <Badge variant="teal" size="sm">
                    {sampleLang === 'te' ? 'తెలుగు వివరణ' : 'Simple English'}
                  </Badge>
                </div>
              </div>

              <div className="lt-explanation-section">
                <div className="lt-explanation-block lt-explanation-block--highlight">
                  <div className="lt-explanation-block__label">
                    <span>💡</span>
                    <span>{sampleLang === 'te' ? 'దీని అసలైన ఉద్దేశ్యం:' : 'What This Means:'}</span>
                  </div>
                  <p className="lt-explanation-block__text">
                    {sampleLang === 'te'
                      ? activeSample.explanation.meaningTe
                      : activeSample.explanation.meaningEn}
                  </p>
                </div>

                <div className="lt-explanation-block">
                  <div className="lt-explanation-block__label">
                    <span>📅</span>
                    <span>{sampleLang === 'te' ? 'ముఖ్యమైన తేదీలు & వివరాలు:' : 'Important Dates & Facts:'}</span>
                  </div>
                  <ul className="lt-explanation-block__list">
                    {(sampleLang === 'te'
                      ? activeSample.explanation.keyFactsTe
                      : activeSample.explanation.keyFactsEn
                    ).map((fact, idx) => (
                      <li key={idx}>{fact}</li>
                    ))}
                  </ul>
                </div>

                <div className="lt-explanation-block">
                  <div className="lt-explanation-block__label">
                    <span>📋</span>
                    <span>{sampleLang === 'te' ? 'మీరు వెంట తీసుకెళ్లాల్సిన పత్రాలు:' : 'Checklist: What You Need to Bring:'}</span>
                  </div>
                  <ul className="lt-explanation-block__list">
                    {(sampleLang === 'te'
                      ? activeSample.explanation.checklistTe
                      : activeSample.explanation.checklistEn
                    ).map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="lt-explanation-block">
                  <div className="lt-explanation-block__label">
                    <span>🚶‍♂️</span>
                    <span>{sampleLang === 'te' ? 'మీరు చేయాల్సిన తదుపరి పనులు:' : 'What You Should Do Next:'}</span>
                  </div>
                  <ul className="lt-explanation-block__list">
                    {(sampleLang === 'te'
                      ? activeSample.explanation.nextStepsTe
                      : activeSample.explanation.nextStepsEn
                    ).map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>

                <div className="lt-explanation-block lt-explanation-block--warning">
                  <div className="lt-explanation-block__label">
                    <span>⚠️</span>
                    <span>{sampleLang === 'te' ? 'ముఖ్య గమనిక & హెచ్చరిక:' : 'Important Notice:'}</span>
                  </div>
                  <p className="lt-explanation-block__text">
                    {sampleLang === 'te'
                      ? activeSample.explanation.warningTe
                      : activeSample.explanation.warningEn}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 6. CALL-TO-ACTION SECTION (#cta) */}
      <section id="cta" className="lt-cta-section">
        <div className="container">
          <div className="lt-cta-card">
            <Badge variant="teal" size="sm" style={{ marginBottom: 'var(--space-4)' }}>
              {isTelugu ? 'ఆరంభించండి' : 'Ready to Start?'}
            </Badge>

            {/* Exact CTA Heading */}
            <h2 className="lt-cta-card__title">
              {isTelugu
                ? 'మీ తదుపరి పత్రాన్ని సులభంగా అర్థం చేసుకోండి.'
                : 'Make Your Next Document Easier to Understand.'}
            </h2>

            {/* Exact Supporting Text */}
            <p className="lt-cta-card__desc">
              {isTelugu
                ? 'కష్టమైన పత్రాలను స్పష్టమైన సమాచారంగా మరియు ఆచరణాత్మక కార్యాచరణగా మార్చడానికి సిద్ధంగా ఉండండి.'
                : 'Get ready to turn confusing paperwork into clear information and practical next steps.'}
            </p>

            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                scrollTo('get-started');
                setFeedbackNotice(
                  isTelugu
                    ? 'డాక్యుమెంట్ వర్క్‌స్పేస్‌కి వచ్చారు. పత్రాన్ని అప్‌లోడ్ చేయండి లేదా టెక్స్ట్‌ను పేస్ట్ చేయండి.'
                    : 'Navigated to the Document Workspace. Drop your file or paste text.'
                );
              }}
            >
              {isTelugu ? 'ప్రారంభించండి' : 'Get Started'}
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

export default App;
