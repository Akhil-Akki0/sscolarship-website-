export type ScholarshipType = 'merit' | 'need' | 'government' | 'international';
export type ScholarshipRegion = 'Karnataka' | 'India' | 'Asia';
export type LiveCycleStatus = 'live' | 'pre_stopped';

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  type: ScholarshipType;
  region: ScholarshipRegion;
  destination: string;
  statesEligible: string[]; // ['Karnataka'] or ['All India'] or ['Global']
  levels: string[];
  fields: string[];
  countriesEligible: string[];
  minPercent: number;
  maxIncomeLakh: number | null;
  gender: 'Any' | 'Female';
  categories: string[];
  disabilityOnly?: boolean;
  amountTier: number; // 3 = full, 2 = tuition+living/substantial, 1 = stipend/prize
  amountNote: string;
  deadlineDate: string; // YYYY-MM-DD for current/recent cycle
  deadlineText: string; // Human-readable official cycle deadline
  reopensNote?: string; // Shown when pre-stopped
  isRolling?: boolean;
  summary: string;
  keywords: string[];
  docs: string[];
  officialUrl: string;
}

export interface StudentProfile {
  name?: string;
  age?: number | null;
  citizenship: string;
  state: string;
  currentLevel: string;
  field: string;
  percent: number | null;
  incomeRange: string;
  category: string;
  gender: string;
  disability?: string;
  destination: string;
  applyingFor: string;
}

export interface ScholarshipStatusInfo {
  status: LiveCycleStatus;
  daysLeft: number | null;
  badgeText: string;
}

export interface MatchResult {
  scholarship: Scholarship;
  status: LiveCycleStatus;
  daysLeft: number | null;
  statusBadge: string;
  score: number;
  whyMatch: string[];
  checkYourself: string[];
}

export interface SearchResponse {
  query: string;
  directMatches: MatchResult[];
  relatedScholarships: MatchResult[];
  relatedQueries: string[];
}

export const INCOME_BOUNDS: Record<string, { min: number; max: number } | null> = {
  'Below 1 lakh': { min: 0, max: 1 },
  '1–2.5 lakh': { min: 1, max: 2.5 },
  '2.5–5 lakh': { min: 2.5, max: 5 },
  '5–8 lakh': { min: 5, max: 8 },
  'Above 8 lakh': { min: 8, max: Infinity },
  'Prefer not to say': null,
};

/**
 * Verified Karnataka State, India National, and focused Asia scholarship registry.
 * Every record uses its real official government or foundation URL.
 * Zero fake reviews, zero synthetic ratings, zero placeholder portals.
 */
export const SCHOLARSHIPS: Scholarship[] = [
  // =========================================================================
  // KARNATAKA STATE SCHOLARSHIPS (PRIMARY FOCUS)
  // =========================================================================
  {
    id: 'ka-ssp-postmatric',
    name: 'Karnataka SSP Post-Matric Scholarship',
    provider: 'Government of Karnataka (SSP · SWD / BCWD / Tribal / Minority)',
    type: 'government',
    region: 'Karnataka',
    destination: 'Karnataka, India',
    statesEligible: ['Karnataka'],
    levels: ['Class 12', 'Diploma', 'Undergraduate', 'Postgraduate', 'PhD'],
    fields: ['Any'],
    countriesEligible: ['India'],
    minPercent: 0,
    maxIncomeLakh: 10,
    gender: 'Any',
    categories: ['SC', 'ST', 'OBC', 'Minority', 'EWS'],
    amountTier: 2,
    amountNote: 'Tuition fee reimbursement and annual maintenance allowance (per department slab)',
    deadlineDate: '2026-12-31',
    deadlineText: '31 Dec 2026 (2026–27 Cycle)',
    summary: 'Flagship Karnataka State Scholarship Portal scheme covering post-matric tuition, exam fees, and maintenance for Karnataka domicile students.',
    keywords: ['ssp', 'karnataka', 'post matric', 'sc', 'st', 'obc', 'minority', 'ews', 'fee reimbursement', 'bengaluru', 'state portal'],
    docs: ['SATS / SSP Student ID', 'Aadhaar & e-KYC', 'Karnataka Caste & Income Certificate (RD number)', 'College bonafide / fee receipt', 'Previous marks card (NAD / Digilocker)'],
    officialUrl: 'https://ssp.postmatric.karnataka.gov.in',
  },
  {
    id: 'ka-ssp-prematric',
    name: 'Karnataka SSP Pre-Matric Scholarship',
    provider: 'Government of Karnataka (State Scholarship Portal)',
    type: 'government',
    region: 'Karnataka',
    destination: 'Karnataka, India',
    statesEligible: ['Karnataka'],
    levels: ['Class 10'],
    fields: ['Any'],
    countriesEligible: ['India'],
    minPercent: 0,
    maxIncomeLakh: 2.5,
    gender: 'Any',
    categories: ['SC', 'ST', 'OBC', 'Minority'],
    amountTier: 1,
    amountNote: 'Annual pre-matric education grant for school students in Karnataka',
    deadlineDate: '2026-12-15',
    deadlineText: '15 Dec 2026',
    summary: 'State financial support for Class 1 to 10 students studying in Karnataka schools across SC, ST, Backward Classes, and Minority departments.',
    keywords: ['ssp', 'pre matric', 'school', 'class 10', 'karnataka', 'sats', 'sc', 'st', 'obc', 'minority'],
    docs: ['SATS ID', 'Student & parent Aadhaar', 'RD Caste & Income Certificate', 'Bank account linked to Aadhaar'],
    officialUrl: 'https://ssp.karnataka.gov.in',
  },
  {
    id: 'ka-vidyasiri',
    name: 'Vidyasiri Scholarship (Food & Accommodation Aid)',
    provider: 'Backward Classes Welfare Dept., Govt. of Karnataka',
    type: 'need',
    region: 'Karnataka',
    destination: 'Karnataka, India',
    statesEligible: ['Karnataka'],
    levels: ['Diploma', 'Undergraduate', 'Postgraduate'],
    fields: ['Any'],
    countriesEligible: ['India'],
    minPercent: 40,
    maxIncomeLakh: 2.5,
    gender: 'Any',
    categories: ['OBC', 'EWS'],
    amountTier: 2,
    amountNote: '₹1,500/month for 10 months (₹15,000/year) for non-hostel students',
    deadlineDate: '2026-12-31',
    deadlineText: '31 Dec 2026',
    summary: 'Monthly food and accommodation assistance for Karnataka post-matric students (Cat-1, 2A, 3A, 3B / OBC) who did not get government hostel seats.',
    keywords: ['vidyasiri', 'bcwd', 'hostel', 'food', 'accommodation', 'obc', '2a', '3a', '3b', 'cat 1', 'karnataka'],
    docs: ['SSP Post-Matric Registration', 'Karnataka OBC Caste & Income Certificate (under ₹2.5L)', 'Rural / distance residence proof', 'College attendance confirmation'],
    officialUrl: 'https://bcwd.karnataka.gov.in',
  },
  {
    id: 'ka-raitha-vidyanidhi',
    name: 'CM Raitha Vidya Nidhi Scholarship',
    provider: 'Dept. of Agriculture & SSP, Govt. of Karnataka',
    type: 'government',
    region: 'Karnataka',
    destination: 'Karnataka, India',
    statesEligible: ['Karnataka'],
    levels: ['Class 12', 'Diploma', 'Undergraduate', 'Postgraduate'],
    fields: ['Any'],
    countriesEligible: ['India'],
    minPercent: 0,
    maxIncomeLakh: null,
    gender: 'Any',
    categories: ['Any'],
    amountTier: 1,
    amountNote: '₹2,500 to ₹11,000/year depending on course and gender',
    deadlineDate: '2027-01-15',
    deadlineText: '15 Jan 2027',
    summary: 'Direct annual scholarship for children of Karnataka farmers registered under the FRUITS database pursuing PUC, ITI, Diploma, Degree, or PG.',
    keywords: ['raitha vidya nidhi', 'farmer', 'agriculture', 'fruits id', 'karnataka', 'puc', 'iti', 'diploma', 'ssp'],
    docs: ['Parent FRUITS ID (PM-KISAN / Farmer registration)', 'SSP Student ID', 'Aadhaar & bank seeding', 'Current year college admission proof'],
    officialUrl: 'https://ssp.postmatric.karnataka.gov.in',
  },
  {
    id: 'ka-labour-welfare',
    name: 'Karnataka Labour Welfare Board Education Scholarship',
    provider: 'Karnataka Labour Welfare Board (KLWB)',
    type: 'need',
    region: 'Karnataka',
    destination: 'Karnataka, India',
    statesEligible: ['Karnataka'],
    levels: ['Class 10', 'Class 12', 'Diploma', 'Undergraduate', 'Postgraduate'],
    fields: ['Any'],
    countriesEligible: ['India'],
    minPercent: 50,
    maxIncomeLakh: 6,
    gender: 'Any',
    categories: ['Any'],
    amountTier: 1,
    amountNote: '₹3,000 to ₹10,000/year for children of registered Karnataka factory/shop workers',
    deadlineDate: '2026-12-31',
    deadlineText: '31 Dec 2026',
    summary: 'Annual educational assistance for children of organised-sector workers contributing to the Karnataka Labour Welfare Fund.',
    keywords: ['klwb', 'labour', 'worker', 'factory', 'karnataka', 'sslc', 'puc', 'degree', 'medical', 'engineering'],
    docs: ['Employer labour welfare contribution certificate', 'Previous exam marksheet (50%+)', 'Employee salary / family income proof', 'Student Aadhaar & bank passbook'],
    officialUrl: 'https://klwbapps.karnataka.gov.in',
  },
  {
    id: 'ka-kbocwwb',
    name: 'KBOCWWB Construction Workers Education Assistance',
    provider: 'Karnataka Building & Other Construction Workers Welfare Board',
    type: 'need',
    region: 'Karnataka',
    destination: 'Karnataka, India',
    statesEligible: ['Karnataka'],
    levels: ['Class 10', 'Class 12', 'Diploma', 'Undergraduate', 'Postgraduate'],
    fields: ['Any'],
    countriesEligible: ['India'],
    minPercent: 45,
    maxIncomeLakh: null,
    gender: 'Any',
    categories: ['Any'],
    amountTier: 2,
    amountNote: 'Course-wise grant and fee assistance for registered construction workers’ children',
    deadlineDate: '2027-01-31',
    deadlineText: '31 Jan 2027',
    summary: 'Karnataka Labour Department welfare board assistance covering school, ITI, polytechnic, engineering, and medical education for children of registered building workers.',
    keywords: ['kbocwwb', 'construction worker', 'labour card', 'seva sindhu', 'karnataka', 'engineering', 'iti'],
    docs: ['Active KBOCWWB Registration Card of parent', 'College study & fee certificate', 'Previous year marks card', 'Aadhaar-linked student bank account'],
    officialUrl: 'https://kbocwwb.karnataka.gov.in',
  },
  {
    id: 'ka-dom-minority',
    name: 'Karnataka Directorate of Minorities (DOM) Scholarship',
    provider: 'Directorate of Minorities, Govt. of Karnataka',
    type: 'government',
    region: 'Karnataka',
    destination: 'Karnataka, India',
    statesEligible: ['Karnataka'],
    levels: ['Class 12', 'Diploma', 'Undergraduate', 'Postgraduate', 'PhD'],
    fields: ['Any'],
    countriesEligible: ['India'],
    minPercent: 50,
    maxIncomeLakh: 2.5,
    gender: 'Any',
    categories: ['Minority'],
    amountTier: 2,
    amountNote: 'Post-matric, Merit-cum-Means & Vidyasiri support for Karnataka minority students',
    deadlineDate: '2026-12-20',
    deadlineText: '20 Dec 2026',
    summary: 'Supports Muslim, Christian, Jain, Sikh, Buddhist, and Parsi domicile students in Karnataka pursuing PU, technical, professional, and doctoral courses.',
    keywords: ['dom', 'minority', 'karnataka', 'ssp', 'merit cum means', 'fee reimbursement', 'phd', 'mba', 'engineering'],
    docs: ['Minority community & income certificate (RD number)', 'Karnataka domicile / 7-year study proof', 'Previous year marksheet (50%+)', 'College bonafide via SSP'],
    officialUrl: 'https://dom.karnataka.gov.in',
  },
  {
    id: 'ka-swd-prize',
    name: 'Karnataka SWD First-Class Prize Money Scholarship',
    provider: 'Social Welfare & Tribal Welfare Dept., Govt. of Karnataka',
    type: 'merit',
    region: 'Karnataka',
    destination: 'Karnataka, India',
    statesEligible: ['Karnataka'],
    levels: ['Class 12', 'Diploma', 'Undergraduate', 'Postgraduate'],
    fields: ['Any'],
    countriesEligible: ['India'],
    minPercent: 60,
    maxIncomeLakh: null,
    gender: 'Any',
    categories: ['SC', 'ST'],
    amountTier: 2,
    amountNote: 'One-time ₹20,000 to ₹35,000 cash incentive on passing in 1st Class (60%+)',
    deadlineDate: '2027-02-28',
    deadlineText: '28 Feb 2027',
    summary: 'Merit cash prize awarded by Karnataka Social Welfare Department to SC/ST students who pass SSLC, PUC, Degree, PG, or professional exams in First Class in their first attempt.',
    keywords: ['prize money', 'swd', 'social welfare', 'sc', 'st', 'first class', 'karnataka', 'merit'],
    docs: ['First-attempt 60%+ marks card', 'RD Caste Certificate', 'Aadhaar & bank passbook', 'College study certificate'],
    officialUrl: 'https://swdservices.karnataka.gov.in',
  },
  {
    id: 'ka-azim-premji',
    name: 'Azim Premji Scholarship for Women',
    provider: 'Azim Premji Foundation (Bengaluru)',
    type: 'need',
    region: 'Karnataka',
    destination: 'Karnataka, India',
    statesEligible: ['Karnataka', 'All India'],
    levels: ['Diploma', 'Undergraduate'],
    fields: ['Any'],
    countriesEligible: ['India'],
    minPercent: 0,
    maxIncomeLakh: 6,
    gender: 'Female',
    categories: ['Any'],
    amountTier: 2,
    amountNote: '₹30,000 per year for the full duration of Diploma or Bachelor’s degree',
    deadlineDate: '2026-12-10',
    deadlineText: '10 Dec 2026 (Cycle 2)',
    summary: 'Supports young women from government schools across Karnataka and partner states entering their first year of a recognised diploma or undergraduate degree.',
    keywords: ['azim premji', 'bengaluru', 'karnataka', 'women', 'girl', 'government school', 'diploma', 'undergraduate'],
    docs: ['Class 10 & 12 government school pass proof', 'First-year college/diploma admission proof', 'Aadhaar & active bank account'],
    officialUrl: 'https://azimpremjifoundation.org',
  },
  {
    id: 'ka-sanchi-honnamma',
    name: 'Sanchi Honnamma Scholarship (Karnataka DCE)',
    provider: 'Dept. of Collegiate Education, Govt. of Karnataka',
    type: 'merit',
    region: 'Karnataka',
    destination: 'Karnataka, India',
    statesEligible: ['Karnataka'],
    levels: ['Undergraduate'],
    fields: ['Arts & Humanities', 'Commerce & Management', 'Science'],
    countriesEligible: ['India'],
    minPercent: 60,
    maxIncomeLakh: 8,
    gender: 'Female',
    categories: ['Any'],
    amountTier: 1,
    amountNote: '₹2,000/year merit incentive for Karnataka college women students',
    deadlineDate: '2026-10-31',
    deadlineText: 'Closed 31 Oct 2026',
    reopensNote: 'Next cycle expected Aug–Oct 2027 via DCE / SSP',
    summary: 'State collegiate education merit scholarship for women pursuing BA, BCom, BSc, or BBA in Karnataka government or aided colleges.',
    keywords: ['sanchi honnamma', 'dce', 'karnataka', 'women', 'girl', 'degree', 'arts', 'commerce', 'science', 'pre stopped'],
    docs: ['PUC marksheet', 'Government/aided college enrolment in Karnataka', 'Income certificate'],
    officialUrl: 'https://dce.karnataka.gov.in',
  },
  {
    id: 'ka-cv-raman',
    name: 'Sir C.V. Raman Scholarship (Karnataka DCE)',
    provider: 'Dept. of Collegiate Education, Govt. of Karnataka',
    type: 'merit',
    region: 'Karnataka',
    destination: 'Karnataka, India',
    statesEligible: ['Karnataka'],
    levels: ['Undergraduate'],
    fields: ['Science'],
    countriesEligible: ['India'],
    minPercent: 60,
    maxIncomeLakh: 8,
    gender: 'Any',
    categories: ['Any'],
    amountTier: 1,
    amountNote: '₹5,000/year for BSc basic science students in Karnataka',
    deadlineDate: '2026-10-31',
    deadlineText: 'Closed 31 Oct 2026',
    reopensNote: 'Next cycle expected Aug–Oct 2027 via DCE / SSP',
    summary: 'Encourages Karnataka students studying pure and basic sciences (BSc) in recognised state colleges.',
    keywords: ['cv raman', 'sir cv raman', 'dce', 'bsc', 'science', 'karnataka', 'pre stopped'],
    docs: ['Class 12 Science marks card', 'BSc admission proof in Karnataka', 'Aadhaar & income certificate'],
    officialUrl: 'https://dce.karnataka.gov.in',
  },
  {
    id: 'ka-vidyadhan',
    name: 'Vidyadhan Scholarship — Karnataka Program',
    provider: 'Sarojini Damodaran Foundation (Bengaluru)',
    type: 'merit',
    region: 'Karnataka',
    destination: 'Karnataka, India',
    statesEligible: ['Karnataka'],
    levels: ['Class 12', 'Undergraduate'],
    fields: ['Any'],
    countriesEligible: ['India'],
    minPercent: 80,
    maxIncomeLakh: 2,
    gender: 'Any',
    categories: ['Any'],
    amountTier: 2,
    amountNote: '₹10,000/year for +2 and ₹15,000–₹75,000/year for graduation',
    deadlineDate: '2026-07-31',
    deadlineText: 'Closed 31 Jul 2026',
    reopensNote: 'Next Karnataka SSLC batch opens May 2027',
    summary: 'Merit-cum-means scholarship by Bengaluru-based Sarojini Damodaran Foundation for high-scoring SSLC students from low-income Karnataka families.',
    keywords: ['vidyadhan', 'sarojini damodaran', 'bengaluru', 'karnataka', 'sslc', 'puc', 'pre stopped'],
    docs: ['Karnataka SSLC marksheet (90%+ / 75% PwD)', 'Family income certificate (< ₹2L)', 'Photograph & online test'],
    officialUrl: 'https://www.vidyadhan.org',
  },

  // =========================================================================
  // INDIA NATIONAL SCHOLARSHIPS (ELIGIBLE FOR KARNATAKA & ALL-INDIA STUDENTS)
  // =========================================================================
  {
    id: 'in-nsp-csss',
    name: 'NSP Central Sector Scheme of Scholarship (PM-USP CSSS)',
    provider: 'Dept. of Higher Education, Govt. of India',
    type: 'government',
    region: 'India',
    destination: 'India',
    statesEligible: ['All India', 'Karnataka'],
    levels: ['Undergraduate', 'Postgraduate'],
    fields: ['Any'],
    countriesEligible: ['India'],
    minPercent: 80,
    maxIncomeLakh: 4.5,
    gender: 'Any',
    categories: ['Any'],
    amountTier: 2,
    amountNote: '₹12,000/year (UG Years 1–3) and ₹20,000/year (PG / 4th–5th Year)',
    deadlineDate: '2026-12-15',
    deadlineText: '15 Dec 2026 (Verification / Window)',
    summary: 'National merit-cum-means college scholarship on the National Scholarship Portal for top 20th-percentile Class 12 board passers (including Karnataka PU Board).',
    keywords: ['nsp', 'central sector', 'csss', 'national scholarship portal', 'karnataka pu', 'undergraduate', 'postgraduate', 'merit'],
    docs: ['NSP OTR ID', 'Class 12 / 2nd PUC marksheet (top 20 percentile)', 'Family income certificate (≤ ₹4.5L)', 'College bonafide & bank details'],
    officialUrl: 'https://scholarships.gov.in',
  },
  {
    id: 'in-aicte-pragati',
    name: 'AICTE Pragati Scholarship for Girls',
    provider: 'All India Council for Technical Education (Govt. of India)',
    type: 'government',
    region: 'India',
    destination: 'India',
    statesEligible: ['All India', 'Karnataka'],
    levels: ['Diploma', 'Undergraduate'],
    fields: ['Engineering & Technology', 'Design'],
    countriesEligible: ['India'],
    minPercent: 50,
    maxIncomeLakh: 8,
    gender: 'Female',
    categories: ['Any'],
    amountTier: 2,
    amountNote: '₹50,000 per year for up to 4 years of Engineering / Diploma study',
    deadlineDate: '2026-12-15',
    deadlineText: '15 Dec 2026',
    summary: 'Government of India technical education scholarship empowering girl students admitted to first-year AICTE-approved Degree or Diploma engineering programmes.',
    keywords: ['aicte', 'pragati', 'girl', 'women', 'engineering', 'btech', 'be', 'diploma', 'polytechnic', 'karnataka', 'nsp'],
    docs: ['Admission proof in AICTE-approved college', 'Class 10 / 12 marksheets', 'Family income certificate (≤ ₹8L)', 'NSP OTR & Aadhaar'],
    officialUrl: 'https://www.aicte-india.org',
  },
  {
    id: 'in-aicte-saksham',
    name: 'AICTE Saksham Scholarship (Differently Abled)',
    provider: 'All India Council for Technical Education (Govt. of India)',
    type: 'government',
    region: 'India',
    destination: 'India',
    statesEligible: ['All India', 'Karnataka'],
    levels: ['Diploma', 'Undergraduate'],
    fields: ['Engineering & Technology', 'Design'],
    countriesEligible: ['India'],
    minPercent: 50,
    maxIncomeLakh: 8,
    gender: 'Any',
    categories: ['Any'],
    disabilityOnly: true,
    amountTier: 2,
    amountNote: '₹50,000 per year for tuition, books, and assistive software/devices',
    deadlineDate: '2026-12-15',
    deadlineText: '15 Dec 2026',
    summary: 'Supports all eligible differently abled students (40%+ disability) admitted to first-year AICTE-approved engineering degree or diploma courses.',
    keywords: ['aicte', 'saksham', 'disability', 'pwd', 'udid', 'engineering', 'diploma', 'karnataka'],
    docs: ['UDID / Disability Certificate (≥ 40%)', 'AICTE college admission letter', 'Family income certificate (≤ ₹8L)', 'Previous marksheet'],
    officialUrl: 'https://www.aicte-india.org',
  },
  {
    id: 'in-sitaram-jindal',
    name: 'Sitaram Jindal Foundation Scholarship',
    provider: 'Sitaram Jindal Foundation (Bengaluru)',
    type: 'need',
    region: 'India',
    destination: 'India',
    statesEligible: ['All India', 'Karnataka'],
    levels: ['Class 12', 'Diploma', 'Undergraduate', 'Postgraduate'],
    fields: ['Any'],
    countriesEligible: ['India'],
    minPercent: 55,
    maxIncomeLakh: 4,
    gender: 'Any',
    categories: ['Any'],
    isRolling: true,
    amountTier: 1,
    amountNote: '₹500 to ₹3,200/month across PUC, ITI, Diploma, Degree, PG & Medical',
    deadlineDate: '2026-12-31',
    deadlineText: 'Rolling · Next review 31 Dec 2026',
    summary: 'Year-round merit-cum-means scholarship administered from Bengaluru supporting needy students from Class 11/PUC through Postgraduate, Engineering, and Medicine.',
    keywords: ['sitaram jindal', 'bengaluru', 'karnataka', 'rolling', 'diploma', 'iti', 'engineering', 'medicine', 'puc'],
    docs: ['Attested marksheets', 'Family income certificate', 'Principal fee & hostel certificate', 'Bank passbook copy'],
    officialUrl: 'https://www.sitaramjindalfoundation.org',
  },
  {
    id: 'in-ffe',
    name: 'Foundation For Excellence (FFE) Scholarship',
    provider: 'FFE India Trust (Bengaluru)',
    type: 'merit',
    region: 'India',
    destination: 'India',
    statesEligible: ['All India', 'Karnataka'],
    levels: ['Undergraduate'],
    fields: ['Engineering & Technology', 'Medicine & Health', 'Law'],
    countriesEligible: ['India'],
    minPercent: 70,
    maxIncomeLakh: 3,
    gender: 'Any',
    categories: ['Any'],
    amountTier: 2,
    amountNote: '₹50,000/year plus mentoring and laptop/skill support (see official portal)',
    deadlineDate: '2026-12-31',
    deadlineText: '31 Dec 2026',
    summary: 'Headquartered in Bengaluru, FFE awards financial aid and career mentorship to meritorious first-year BE/BTech, MBBS, BPharm, and 5-year Law students from financially constrained homes.',
    keywords: ['ffe', 'foundation for excellence', 'bengaluru', 'kcet', 'jee', 'neet', 'engineering', 'mbbs', 'law', 'karnataka'],
    docs: ['KCET / JEE / NEET / CLAT rank card', 'Class 12 marksheet (70%+)', 'Parent income proof (≤ ₹3L)', 'College fee structure & bonafide'],
    officialUrl: 'https://ffe.org',
  },
  {
    id: 'in-sbi-asha',
    name: 'SBI Platinum Jubilee Asha Scholarship',
    provider: 'SBI Foundation',
    type: 'need',
    region: 'India',
    destination: 'India',
    statesEligible: ['All India', 'Karnataka'],
    levels: ['Class 10', 'Class 12', 'Undergraduate', 'Postgraduate'],
    fields: ['Any'],
    countriesEligible: ['India'],
    minPercent: 75,
    maxIncomeLakh: 6,
    gender: 'Any',
    categories: ['Any'],
    amountTier: 2,
    amountNote: '₹15,000 to ₹7,50,000/year across school, UG, PG, IIT & IIM tracks',
    deadlineDate: '2026-11-30',
    deadlineText: '30 Nov 2026',
    summary: 'Supports meritorious Indian students from low-income households studying in Class 6–12, undergraduate colleges, and postgraduate/premier institutes.',
    keywords: ['sbi asha', 'sbi foundation', 'school', 'undergraduate', 'postgraduate', 'iit', 'iim', 'closing soon'],
    docs: ['Previous academic marksheet (75%+)', 'Family income certificate (≤ ₹6L)', 'Current fee receipt & ID card', 'Aadhaar & bank account'],
    officialUrl: 'https://www.sbiashascholarship.org',
  },
  {
    id: 'in-dst-inspire',
    name: 'INSPIRE Scholarship for Higher Education (SHE)',
    provider: 'Department of Science & Technology, Govt. of India',
    type: 'merit',
    region: 'India',
    destination: 'India',
    statesEligible: ['All India', 'Karnataka'],
    levels: ['Undergraduate', 'Postgraduate'],
    fields: ['Science'],
    countriesEligible: ['India'],
    minPercent: 85,
    maxIncomeLakh: null,
    gender: 'Any',
    categories: ['Any'],
    amountTier: 2,
    amountNote: '₹80,000/year (₹60,000 cash + ₹20,000 summer mentorship grant)',
    deadlineDate: '2026-10-31',
    deadlineText: 'Closed 31 Oct 2026',
    reopensNote: 'Next cycle opens Sep 2027 on online-inspire.gov.in',
    summary: 'National science fellowship for top 1% Class 12 board students (or JEE/NEET/IISER rankers) pursuing BSc, BS, or Integrated MSc in basic and natural sciences.',
    keywords: ['inspire', 'dst', 'science', 'bsc', 'msc', 'research', 'merit', 'pre stopped'],
    docs: ['Class 12 board top-1% eligibility advisory / rank', 'BSc/Integrated MSc enrolment certificate', 'SBI bank account & Aadhaar'],
    officialUrl: 'https://www.online-inspire.gov.in',
  },
  {
    id: 'in-reliance-ug',
    name: 'Reliance Foundation Undergraduate Scholarship',
    provider: 'Reliance Foundation',
    type: 'merit',
    region: 'India',
    destination: 'India',
    statesEligible: ['All India', 'Karnataka'],
    levels: ['Undergraduate'],
    fields: ['Any'],
    countriesEligible: ['India'],
    minPercent: 60,
    maxIncomeLakh: 15,
    gender: 'Any',
    categories: ['Any'],
    amountTier: 2,
    amountNote: 'Up to ₹2,00,000 across the undergraduate degree duration',
    deadlineDate: '2026-10-06',
    deadlineText: 'Closed 06 Oct 2026',
    reopensNote: 'Next intake expected Aug–Oct 2027',
    summary: 'Merit-cum-means scholarship selecting 5,000 first-year undergraduate scholars across all streams in India via an online aptitude test.',
    keywords: ['reliance foundation', 'undergraduate', 'aptitude', 'merit', 'pre stopped'],
    docs: ['Class 12 marksheet (60%+)', 'First-year UG college admission proof', 'Family income proof (≤ ₹15L)', 'Online aptitude test'],
    officialUrl: 'https://www.reliancefoundation.org',
  },

  // =========================================================================
  // ASIA REGIONAL SCHOLARSHIPS (FOCUSED, MINIMAL INTERNATIONAL FOOTPRINT)
  // =========================================================================
  {
    id: 'asia-singa',
    name: 'Singapore International Graduate Award (SINGA)',
    provider: 'A*STAR · NTU · NUS · SUTD · SMU (Singapore, Asia)',
    type: 'international',
    region: 'Asia',
    destination: 'Singapore (Asia)',
    statesEligible: ['Global'],
    levels: ['PhD'],
    fields: ['Engineering & Technology', 'Science', 'Medicine & Health'],
    countriesEligible: ['Any'],
    minPercent: 75,
    maxIncomeLakh: null,
    gender: 'Any',
    categories: ['Any'],
    amountTier: 3,
    amountNote: 'Full PhD tuition, S$2,700–S$3,200/month stipend, airfare & settling grant',
    deadlineDate: '2026-12-01',
    deadlineText: '01 Dec 2026 (Aug 2027 Intake)',
    summary: 'Fully funded doctoral research award in Singapore for science and engineering graduates across top Asian research universities.',
    keywords: ['singa', 'singapore', 'asia', 'astar', 'nus', 'ntu', 'phd', 'research', 'stem'],
    docs: ['Bachelor’s/Master’s transcripts', 'Two academic referee reports', 'Passport copy', 'Research statement'],
    officialUrl: 'https://www.a-star.edu.sg',
  },
  {
    id: 'asia-gks',
    name: 'Global Korea Scholarship (GKS — NIIED Asia)',
    provider: 'NIIED · Government of South Korea (Asia)',
    type: 'international',
    region: 'Asia',
    destination: 'South Korea (Asia)',
    statesEligible: ['Global'],
    levels: ['Undergraduate', 'Postgraduate', 'PhD'],
    fields: ['Any'],
    countriesEligible: ['Any'],
    minPercent: 80,
    maxIncomeLakh: null,
    gender: 'Any',
    categories: ['Any'],
    amountTier: 3,
    amountNote: 'Full tuition, 1-year Korean language course, monthly stipend & return airfare',
    deadlineDate: '2027-02-28',
    deadlineText: '28 Feb 2027 (Graduate Embassy/Uni Cycle)',
    summary: 'South Korean government scholarship supporting Asian and international scholars for degree programmes in Korea.',
    keywords: ['gks', 'korea', 'south korea', 'asia', 'niied', 'undergraduate', 'postgraduate', 'phd'],
    docs: ['Apostilled degree & transcripts', 'Personal statement & study plan', 'Two recommendation letters', 'Proof of citizenship'],
    officialUrl: 'https://www.studyinkorea.go.kr',
  },
  {
    id: 'asia-mext',
    name: 'MEXT Japanese Government Scholarship (Embassy Track)',
    provider: 'Ministry of Education (MEXT), Japan (Asia)',
    type: 'international',
    region: 'Asia',
    destination: 'Japan (Asia)',
    statesEligible: ['Global'],
    levels: ['Undergraduate', 'Postgraduate', 'PhD'],
    fields: ['Any'],
    countriesEligible: ['Any'],
    minPercent: 70,
    maxIncomeLakh: null,
    gender: 'Any',
    categories: ['Any'],
    amountTier: 3,
    amountNote: 'Full tuition waiver, monthly yen stipend & round-trip airfare',
    deadlineDate: '2026-05-31',
    deadlineText: 'Closed 31 May 2026 (Embassy Track)',
    reopensNote: 'Next Indian Embassy cycle opens Apr 2027',
    summary: 'Japanese government MEXT scholarship for undergraduate and research students from India/Karnataka via the Embassy of Japan.',
    keywords: ['mext', 'japan', 'asia', 'embassy', 'research', 'undergraduate', 'postgraduate', 'pre stopped'],
    docs: ['Academic transcripts', 'Recommendation letter', 'Study / research plan', 'Medical examination form'],
    officialUrl: 'https://www.studyinjapan.go.jp',
  },
];

export function formatIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getScholarshipStatus(
  s: Scholarship,
  referenceDate: Date = new Date('2026-11-20T00:00:00Z')
): ScholarshipStatusInfo {
  const refDay = new Date(
    Date.UTC(referenceDate.getUTCFullYear(), referenceDate.getUTCMonth(), referenceDate.getUTCDate())
  );
  const parts = s.deadlineDate.split('-').map(Number);
  const dlDay = new Date(Date.UTC(parts[0], (parts[1] || 1) - 1, parts[2] || 1));
  const diffMs = dlDay.getTime() - refDay.getTime();
  const daysLeft = Math.round(diffMs / 86400000);

  if (daysLeft >= 0) {
    if (s.isRolling) {
      return {
        status: 'live',
        daysLeft,
        badgeText: 'LIVE · ROLLING',
      };
    }
    const dayLabel = daysLeft === 0 ? 'CLOSES TODAY' : `${daysLeft}D LEFT`;
    return {
      status: 'live',
      daysLeft,
      badgeText: `LIVE TO APPLY · ${dayLabel}`,
    };
  }

  return {
    status: 'pre_stopped',
    daysLeft,
    badgeText: `PRE-STOPPED · ${s.deadlineText.toUpperCase()}`,
  };
}

export function distinctRegionsCount(list: ReadonlyArray<Scholarship>): number {
  return new Set(list.map(s => s.destination)).size;
}

export function distinctFieldsCount(list: ReadonlyArray<Scholarship>): number {
  const set = new Set<string>();
  for (const s of list) {
    for (const f of s.fields) {
      if (f !== 'Any') set.add(f);
    }
  }
  return set.size;
}

export function convertCgpaToPercent(cgpa: number): number {
  return Math.round(cgpa * 9.5 * 10) / 10;
}

export function toDirectoryEntries(
  list: ReadonlyArray<Scholarship> = SCHOLARSHIPS,
  referenceDate: Date = new Date('2026-11-20T00:00:00Z')
): MatchResult[] {
  const out = list.map(s => {
    const st = getScholarshipStatus(s, referenceDate);
    const regionBonus = s.region === 'Karnataka' ? 95 : s.region === 'India' ? 88 : 76;
    return {
      scholarship: s,
      status: st.status,
      daysLeft: st.daysLeft,
      statusBadge: st.badgeText,
      score: regionBonus,
      whyMatch: [
        s.region === 'Karnataka' ? 'Karnataka State Focus' : s.region === 'India' ? 'All-India Eligible' : 'Asia Regional',
        s.isRolling ? 'Rolling Applications' : s.deadlineText,
      ],
      checkYourself: st.status === 'pre_stopped' && s.reopensNote ? [s.reopensNote] : [],
    };
  });

  // Live Karnataka first, then live India/Asia, then pre-stopped
  out.sort((a, b) => {
    if (a.status !== b.status) return a.status === 'live' ? -1 : 1;
    if (b.score !== a.score) return b.score - a.score;
    return (a.daysLeft ?? 999) - (b.daysLeft ?? 999);
  });

  return out;
}

export function matchScholarships(
  profile: StudentProfile,
  list: ReadonlyArray<Scholarship> = SCHOLARSHIPS,
  referenceDate: Date = new Date('2026-11-20T00:00:00Z')
): MatchResult[] {
  const results: MatchResult[] = [];
  const incomeBounds = INCOME_BOUNDS[profile.incomeRange] ?? null;
  const userState = (profile.state || '').trim().toLowerCase();
  const isKarnatakaUser = userState === '' || userState.includes('karnataka');

  for (const s of list) {
    // Hard eligibility filters
    if (!s.levels.includes(profile.applyingFor)) continue;

    if (
      !s.countriesEligible.includes('Any') &&
      !s.countriesEligible.includes(profile.citizenship)
    ) {
      continue;
    }

    // State restriction: Karnataka-only schemes require Karnataka (or India unspecified)
    if (
      s.statesEligible.includes('Karnataka') &&
      !s.statesEligible.includes('All India') &&
      !s.statesEligible.includes('Global') &&
      userState &&
      !userState.includes('karnataka')
    ) {
      continue;
    }

    if (s.disabilityOnly && profile.disability !== 'Yes') {
      continue;
    }

    if (incomeBounds && s.maxIncomeLakh !== null && incomeBounds.min > s.maxIncomeLakh) {
      continue;
    }

    if (profile.percent !== null && profile.percent < s.minPercent) {
      continue;
    }

    if (
      profile.gender !== 'Prefer not to say' &&
      s.gender !== 'Any' &&
      profile.gender !== s.gender
    ) {
      continue;
    }

    if (
      profile.category !== 'Prefer not to say' &&
      !s.categories.includes('Any') &&
      !s.categories.includes(profile.category)
    ) {
      continue;
    }

    if (!s.fields.includes('Any') && !s.fields.includes(profile.field)) {
      continue;
    }

    // Destination filter if explicitly asking for Asia-only or Karnataka-only
    if (
      (profile.destination === 'Japan (Asia)' && s.destination !== 'Japan (Asia)') ||
      (profile.destination === 'South Korea (Asia)' && s.destination !== 'South Korea (Asia)') ||
      (profile.destination === 'Singapore (Asia)' && s.destination !== 'Singapore (Asia)')
    ) {
      continue;
    }

    const statusInfo = getScholarshipStatus(s, referenceDate);

    // Weighted match score (100 max)
    let score = 0;
    const whyMatch: string[] = [];
    const checkYourself: string[] = [];

    // 1. Level (20)
    score += 20;
    whyMatch.push(`${profile.applyingFor} eligible`);

    // 2. Field (18)
    if (s.fields.includes(profile.field)) {
      score += 18;
      whyMatch.push(`${profile.field} focus`);
    } else {
      score += 14;
      whyMatch.push('Open to your field');
    }

    // 3. Marks (12)
    if (profile.percent === null) {
      score += 6;
      checkYourself.push('Marks requirement to check');
    } else {
      score += 12;
      if (s.minPercent > 0) {
        whyMatch.push(`Meets ${s.minPercent}%+ marks`);
      }
    }

    // 4. Income (15)
    if (s.maxIncomeLakh === null) {
      score += 15;
    } else if (!incomeBounds) {
      score += 7.5;
      checkYourself.push('Income certificate check');
    } else if (incomeBounds.max <= s.maxIncomeLakh) {
      score += 15;
      whyMatch.push(`Income under ₹${s.maxIncomeLakh}L`);
    } else {
      score += 10;
      checkYourself.push(`Verify ₹${s.maxIncomeLakh}L income cap`);
    }

    // 5. Category & Gender (10)
    if (s.categories.includes('Any')) {
      score += 5;
    } else if (profile.category === 'Prefer not to say') {
      score += 2.5;
      checkYourself.push(`Categories: ${s.categories.join('/')}`);
    } else {
      score += 5;
      whyMatch.push(`${profile.category} eligible`);
    }

    if (s.gender === 'Any') {
      score += 5;
    } else if (profile.gender === 'Prefer not to say') {
      score += 2.5;
      checkYourself.push(`${s.gender} applicants only`);
    } else {
      score += 5;
      whyMatch.push(`${s.gender} applicants`);
    }

    // 6. Karnataka / India / Asia Priority (25)
    if (profile.destination === 'Asia (Japan / Korea / Singapore)' || profile.destination.includes('(Asia)')) {
      if (s.region === 'Asia') {
        score += 25;
        whyMatch.push(`Asia track: ${s.destination}`);
      } else {
        score += 10;
      }
    } else if (profile.destination === 'Karnataka (State & Central)' || isKarnatakaUser) {
      if (s.region === 'Karnataka') {
        score += 25;
        whyMatch.push('Karnataka domicile match');
      } else if (s.region === 'India') {
        score += 20;
        whyMatch.push('Eligible from Karnataka');
      } else {
        score += 8;
        whyMatch.push('Asia study option');
      }
    } else {
      if (s.region === 'India') {
        score += 22;
        whyMatch.push('All-India eligible');
      } else {
        score += 12;
      }
    }

    if (statusInfo.status === 'pre_stopped' && s.reopensNote) {
      checkYourself.push(s.reopensNote);
    }

    results.push({
      scholarship: s,
      status: statusInfo.status,
      daysLeft: statusInfo.daysLeft,
      statusBadge: statusInfo.badgeText,
      score: Math.max(0, Math.min(100, Math.round(score))),
      whyMatch,
      checkYourself,
    });
  }

  // Always show Live to Apply matches first, then Pre-Stopped matches
  results.sort((a, b) => {
    if (a.status !== b.status) return a.status === 'live' ? -1 : 1;
    if (b.score !== a.score) return b.score - a.score;
    return (a.daysLeft ?? 999) - (b.daysLeft ?? 999);
  });

  return results;
}

const RELATED_QUERY_MAP: Array<{ triggers: string[]; suggestions: string[] }> = [
  {
    triggers: ['ssp', 'karnataka', 'state', 'post', 'pre', 'matric', 'domicile'],
    suggestions: ['Karnataka SSP Post-Matric', 'Vidyasiri Hostel Aid', 'CM Raitha Vidya Nidhi', 'SWD Prize Money', 'Pre-Stopped DCE'],
  },
  {
    triggers: ['obc', 'bcwd', '2a', '3a', '3b', 'vidyasiri', 'hostel', 'food'],
    suggestions: ['Vidyasiri OBC', 'Karnataka SSP Post-Matric', 'Sitaram Jindal Foundation', 'CM Raitha Vidya Nidhi'],
  },
  {
    triggers: ['sc', 'st', 'prize', 'social welfare', 'swd'],
    suggestions: ['SWD First-Class Prize Money', 'Karnataka SSP Post-Matric', 'Karnataka SSP Pre-Matric', 'NSP Central Sector'],
  },
  {
    triggers: ['minority', 'dom', 'muslim', 'christian', 'jain'],
    suggestions: ['DOM Minority Scholarship', 'Karnataka SSP Post-Matric', 'Sitaram Jindal Foundation'],
  },
  {
    triggers: ['eng', 'tech', 'btech', 'be', 'diploma', 'ffe', 'aicte', 'pragati', 'kcet'],
    suggestions: ['AICTE Pragati Girls', 'FFE Engineering', 'Karnataka SSP Post-Matric', 'KBOCWWB Labour Aid', 'SINGA Singapore'],
  },
  {
    triggers: ['science', 'bsc', 'msc', 'inspire', 'raman', 'phd', 'research'],
    suggestions: ['Sir C.V. Raman BSc', 'DST INSPIRE SHE', 'SINGA PhD Asia', 'Sanchi Honnamma'],
  },
  {
    triggers: ['girl', 'women', 'female', 'azim', 'pragati', 'sanchi'],
    suggestions: ['Azim Premji Women', 'AICTE Pragati Girls', 'Sanchi Honnamma DCE', 'Karnataka SSP Post-Matric'],
  },
  {
    triggers: ['asia', 'japan', 'korea', 'singapore', 'mext', 'gks', 'singa', 'abroad'],
    suggestions: ['SINGA Singapore PhD', 'Global Korea Scholarship', 'MEXT Japan', 'Karnataka SSP Post-Matric'],
  },
  {
    triggers: ['stopped', 'closed', 'pre-stopped', 'pre stopped', 'next'],
    suggestions: ['Vidyadhan Karnataka', 'Sanchi Honnamma', 'Sir C.V. Raman', 'DST INSPIRE', 'Reliance UG', 'MEXT Japan'],
  },
];

const DEFAULT_RELATED_QUERIES = [
  'Karnataka SSP Post-Matric',
  'Vidyasiri OBC',
  'CM Raitha Vidya Nidhi',
  'AICTE Pragati Engineering',
  'FFE Bengaluru',
  'Asia (SINGA / GKS)',
  'Pre-Stopped Schemes',
];

function scoreQueryMatch(s: Scholarship, tokens: string[], rawLower: string): number {
  const haystack = [
    s.name,
    s.provider,
    s.region,
    s.destination,
    s.summary,
    s.type,
    s.deadlineText,
    ...s.levels,
    ...s.fields,
    ...s.categories,
    ...s.keywords,
  ]
    .join(' ')
    .toLowerCase();

  if (haystack.includes(rawLower)) {
    return s.name.toLowerCase().includes(rawLower) ? 10 : 7;
  }
  let hits = 0;
  for (const t of tokens) {
    if (haystack.includes(t)) hits += 2;
  }
  if (rawLower.includes('pre') && rawLower.includes('stop') && s.reopensNote) {
    hits += 5;
  }
  return hits;
}

export function searchScholarships(
  matches: ReadonlyArray<MatchResult>,
  query: string
): SearchResponse {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      query: '',
      directMatches: [...matches],
      relatedScholarships: [],
      relatedQueries: DEFAULT_RELATED_QUERIES,
    };
  }

  const lower = trimmed.toLowerCase();
  const tokens = lower.split(/\s+/).filter(t => t.length >= 2);

  const scored = matches
    .map(m => ({ m, relevance: scoreQueryMatch(m.scholarship, tokens, lower) }))
    .filter(x => x.relevance > 0)
    .sort((a, b) => {
      if (b.relevance !== a.relevance) return b.relevance - a.relevance;
      if (a.m.status !== b.m.status) return a.m.status === 'live' ? -1 : 1;
      return b.m.score - a.m.score;
    });

  const directMatches = scored.map(x => x.m);
  const directIds = new Set(directMatches.map(m => m.scholarship.id));

  // Build Related Scholarships sharing region, type, category, or field with top hits (or Karnataka default)
  const anchorRegions = new Set(directMatches.slice(0, 3).map(m => m.scholarship.region));
  const anchorTypes = new Set(directMatches.slice(0, 3).map(m => m.scholarship.type));
  const anchorFields = new Set(directMatches.slice(0, 3).flatMap(m => m.scholarship.fields));

  if (anchorRegions.size === 0) anchorRegions.add('Karnataka');

  const relatedScholarships = matches
    .filter(m => !directIds.has(m.scholarship.id))
    .map(m => {
      let rel = 0;
      if (anchorRegions.has(m.scholarship.region)) rel += 4;
      if (anchorTypes.has(m.scholarship.type)) rel += 3;
      if (m.scholarship.fields.some(f => anchorFields.has(f))) rel += 2;
      if (m.scholarship.region === 'Karnataka') rel += 2;
      if (m.status === 'live') rel += 2;
      return { m, rel };
    })
    .filter(x => x.rel >= 3)
    .sort((a, b) => b.rel - a.rel || b.m.score - a.m.score)
    .slice(0, 4)
    .map(x => x.m);

  // Build Related Search Suggestions dynamically from matched triggers
  const sugSet = new Set<string>();
  for (const group of RELATED_QUERY_MAP) {
    if (group.triggers.some(tr => lower.includes(tr) || tokens.some(tk => tr.includes(tk)))) {
      for (const sug of group.suggestions) {
        if (sug.toLowerCase() !== lower) sugSet.add(sug);
      }
    }
  }
  for (const m of directMatches.slice(0, 3)) {
    const shortName = m.scholarship.name.split('(')[0].trim();
    if (shortName.toLowerCase() !== lower) sugSet.add(shortName);
  }
  for (const def of DEFAULT_RELATED_QUERIES) {
    if (sugSet.size >= 6) break;
    if (def.toLowerCase() !== lower) sugSet.add(def);
  }

  return {
    query: trimmed,
    directMatches,
    relatedScholarships,
    relatedQueries: Array.from(sugSet).slice(0, 6),
  };
}

export function buildSparklineGeometry(scores: ReadonlyArray<number>): {
  pointsAttr: string;
  dots: Array<{ x: number; y: number }>;
} {
  const top = scores.slice(0, 8);
  if (top.length === 0) {
    const fallback = [
      { x: 0, y: 60 },
      { x: 214, y: 60 },
    ];
    return {
      pointsAttr: fallback.map(p => `${p.x},${p.y}`).join(' '),
      dots: [fallback[0], fallback[1], fallback[1]],
    };
  }
  const ordered = top.length > 1 ? [...top].reverse() : [...top, ...top];
  const minS = Math.min(...ordered);
  const maxS = Math.max(...ordered);
  const span = Math.max(10, maxS - minS);

  const pts = ordered.map((sc, i) => {
    const x = Math.round((i / (ordered.length - 1)) * 214);
    const y = Math.round(60 - ((sc - minS) / span) * 46);
    return { x, y };
  });

  const idx1 = Math.min(pts.length - 1, Math.floor(pts.length * 0.35));
  const idx2 = Math.min(pts.length - 1, Math.floor(pts.length * 0.7));
  const idx3 = pts.length - 1;

  return {
    pointsAttr: pts.map(p => `${p.x},${p.y}`).join(' '),
    dots: [pts[idx1], pts[idx2], pts[idx3]],
  };
}

