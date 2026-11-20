export type ScholarshipType = 'merit' | 'need' | 'government' | 'international';

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  type: ScholarshipType;
  destination: string;
  levels: string[];
  fields: string[];
  countriesEligible: string[];
  minPercent: number;
  maxIncomeLakh: number | null;
  gender: 'Any' | 'Female';
  categories: string[];
  amountTier: number; // internal sort helper: 3 = full, 2 = tuition+living, 1 = partial/stipend
  amountNote: string;
  deadlineNote: string;
  summary: string;
  docs: string[];
  officialUrl: string;
}

export interface StudentProfile {
  name?: string;
  age?: number | null;
  citizenship: string;
  state?: string;
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

export interface MatchResult {
  scholarship: Scholarship;
  score: number;
  whyMatch: string[];
  checkYourself: string[];
}

export const INCOME_BOUNDS: Record<string, { min: number; max: number } | null> = {
  'Below 1 lakh': { min: 0, max: 1 },
  '1–2.5 lakh': { min: 1, max: 2.5 },
  '2.5–5 lakh': { min: 2.5, max: 5 },
  '5–8 lakh': { min: 5, max: 8 },
  'Above 8 lakh': { min: 8, max: Infinity },
  'Prefer not to say': null,
};

// Add more scholarships here. Official URL must be the provider's real website.
export const SCHOLARSHIPS: Scholarship[] = [
  {
    id: 'nsp',
    name: 'National Scholarship Portal (NSP)',
    provider: 'Government of India',
    type: 'government',
    destination: 'India',
    levels: ['Class 10', 'Class 12', 'Diploma', 'Undergraduate', 'Postgraduate', 'PhD'],
    fields: ['Any'],
    countriesEligible: ['India'],
    minPercent: 50,
    maxIncomeLakh: 6,
    gender: 'Any',
    categories: ['Any'],
    amountTier: 2,
    amountNote: 'Fee waiver and annual stipend (see official site)',
    deadlineNote: "Check the official site for this year's dates",
    summary: 'Central and state government scholarships across school, college and research degrees.',
    docs: ['Aadhaar or national ID', 'Family income certificate', 'Previous year marksheet', 'Bonafide student certificate', 'Bank passbook copy'],
    officialUrl: 'https://scholarships.gov.in',
  },
  {
    id: 'aicte',
    name: 'AICTE Scholarship Schemes',
    provider: 'All India Council for Technical Education',
    type: 'government',
    destination: 'India',
    levels: ['Diploma', 'Undergraduate'],
    fields: ['Engineering & Technology', 'Design'],
    countriesEligible: ['India'],
    minPercent: 50,
    maxIncomeLakh: 8,
    gender: 'Any',
    categories: ['Any'],
    amountTier: 2,
    amountNote: 'Annual tuition and study support (see official site)',
    deadlineNote: "Check the official site for this year's dates",
    summary: 'Technical education support including Pragati for women and Saksham for differently abled students.',
    docs: ['Admission proof in AICTE-approved institute', 'Class 10 / 12 marksheets', 'Family income certificate', 'Category or disability certificate if applicable'],
    officialUrl: 'https://www.aicte-india.org',
  },
  {
    id: 'inspire',
    name: 'INSPIRE Scholarship (SHE)',
    provider: 'Department of Science & Technology',
    type: 'merit',
    destination: 'India',
    levels: ['Undergraduate', 'Postgraduate'],
    fields: ['Science'],
    countriesEligible: ['India'],
    minPercent: 85,
    maxIncomeLakh: null,
    gender: 'Any',
    categories: ['Any'],
    amountTier: 2,
    amountNote: 'Annual scholarship and mentorship grant (see official site)',
    deadlineNote: "Check the official site for this year's dates",
    summary: 'Merit-based support for top students pursuing natural and basic sciences.',
    docs: ['Class 12 board marksheet or rank certificate', 'College enrolment certificate in basic sciences', 'Bank account details'],
    officialUrl: 'https://www.online-inspire.gov.in',
  },
  {
    id: 'buddy4study',
    name: 'Buddy4Study Verified Listings',
    provider: 'Buddy4Study Foundation',
    type: 'need',
    destination: 'India',
    levels: ['Class 10', 'Class 12', 'Diploma', 'Undergraduate', 'Postgraduate'],
    fields: ['Any'],
    countriesEligible: ['India'],
    minPercent: 50,
    maxIncomeLakh: 6,
    gender: 'Any',
    categories: ['Any'],
    amountTier: 1,
    amountNote: 'Tuition support across CSR and foundation schemes (see official site)',
    deadlineNote: "Check the official site for this year's dates",
    summary: 'Need-based and merit corporate-funded scholarships aggregated with verified official portals.',
    docs: ['Latest marksheet', 'Family income proof', 'Current school or college ID', 'Passport-size photograph'],
    officialUrl: 'https://www.buddy4study.com',
  },
  {
    id: 'reliance',
    name: 'Reliance Foundation Scholarships',
    provider: 'Reliance Foundation',
    type: 'merit',
    destination: 'India',
    levels: ['Undergraduate', 'Postgraduate'],
    fields: ['Any'],
    countriesEligible: ['India'],
    minPercent: 60,
    maxIncomeLakh: 15,
    gender: 'Any',
    categories: ['Any'],
    amountTier: 2,
    amountNote: 'Tuition and living grant (see official site)',
    deadlineNote: "Check the official site for this year's dates",
    summary: 'Merit-cum-means awards supporting undergraduate and postgraduate students across India.',
    docs: ['Class 12 or degree marksheets', 'Entrance or aptitude score', 'Household income certificate', 'Two letters of reference (for PG)'],
    officialUrl: 'https://www.reliancefoundation.org',
  },
  {
    id: 'jntata',
    name: 'JN Tata Endowment Scholarship',
    provider: 'Tata Trusts',
    type: 'merit',
    destination: 'Global',
    levels: ['Postgraduate', 'PhD'],
    fields: ['Any'],
    countriesEligible: ['India'],
    minPercent: 60,
    maxIncomeLakh: null,
    gender: 'Any',
    categories: ['Any'],
    amountTier: 2,
    amountNote: 'Loan scholarship with travel and gift grant options (see official site)',
    deadlineNote: "Check the official site for this year's dates",
    summary: 'Supports Indian graduates pursuing higher studies abroad across all disciplines.',
    docs: ['Undergraduate transcripts', 'University admission offer or application proof', 'Statement of purpose', 'Resume and test scores'],
    officialUrl: 'https://www.jntataendowment.org',
  },
  {
    id: 'inlaks',
    name: 'Inlaks Shivdasani Foundation Scholarship',
    provider: 'Inlaks Shivdasani Foundation',
    type: 'international',
    destination: 'Global',
    levels: ['Postgraduate'],
    fields: ['Any'],
    countriesEligible: ['India'],
    minPercent: 65,
    maxIncomeLakh: null,
    gender: 'Any',
    categories: ['Any'],
    amountTier: 3,
    amountNote: 'Tuition, living and one-way travel support (see official site)',
    deadlineNote: "Check the official site for this year's dates",
    summary: 'Full funding for outstanding Indian graduates admitted to top universities abroad.',
    docs: ['Offer letter from eligible foreign university', 'Academic transcripts', 'Two reference letters', 'Passport copy'],
    officialUrl: 'https://www.inlaksfoundation.org',
  },
  {
    id: 'fulbright',
    name: 'Fulbright-Nehru Fellowships',
    provider: 'USIEF',
    type: 'international',
    destination: 'United States',
    levels: ['Postgraduate', 'PhD'],
    fields: ['Any'],
    countriesEligible: ['India'],
    minPercent: 60,
    maxIncomeLakh: null,
    gender: 'Any',
    categories: ['Any'],
    amountTier: 3,
    amountNote: 'Tuition, living stipend, airfare and health cover (see official site)',
    deadlineNote: "Check the official site for this year's dates",
    summary: 'Flagship U.S.–India exchange fellowship for master’s and doctoral study in the United States.',
    docs: ['Bachelor’s/Master’s transcripts', 'Three letters of recommendation', 'Personal and study objectives essays', 'English proficiency score'],
    officialUrl: 'https://www.usief.org.in',
  },
  {
    id: 'chevening',
    name: 'Chevening Scholarships',
    provider: 'UK Foreign, Commonwealth & Development Office',
    type: 'international',
    destination: 'United Kingdom',
    levels: ['Postgraduate'],
    fields: ['Any'],
    countriesEligible: ['Any'],
    minPercent: 60,
    maxIncomeLakh: null,
    gender: 'Any',
    categories: ['Any'],
    amountTier: 3,
    amountNote: 'Full tuition, monthly stipend and travel (see official site)',
    deadlineNote: "Check the official site for this year's dates",
    summary: 'UK government global award for one-year master’s degrees across British universities.',
    docs: ['Undergraduate degree certificate & transcripts', 'Two reference letters', 'Work experience verification', 'Unconditional UK university offer'],
    officialUrl: 'https://www.chevening.org',
  },
  {
    id: 'commonwealth',
    name: 'Commonwealth Scholarships',
    provider: 'Commonwealth Scholarship Commission (UK)',
    type: 'international',
    destination: 'United Kingdom',
    levels: ['Postgraduate', 'PhD'],
    fields: ['Any'],
    countriesEligible: ['Any'],
    minPercent: 60,
    maxIncomeLakh: null,
    gender: 'Any',
    categories: ['Any'],
    amountTier: 3,
    amountNote: 'Full tuition, airfare and living allowance (see official site)',
    deadlineNote: "Check the official site for this year's dates",
    summary: 'Supports talented students from Commonwealth nations for master’s and PhD programmes in the UK.',
    docs: ['Academic transcripts', 'Citizenship proof', 'Two references', 'Development impact statement'],
    officialUrl: 'https://cscuk.fcdo.gov.uk',
  },
  {
    id: 'gates-cambridge',
    name: 'Gates Cambridge Scholarships',
    provider: 'Gates Cambridge Trust',
    type: 'international',
    destination: 'United Kingdom',
    levels: ['Postgraduate', 'PhD'],
    fields: ['Any'],
    countriesEligible: ['Any'],
    minPercent: 75,
    maxIncomeLakh: null,
    gender: 'Any',
    categories: ['Any'],
    amountTier: 3,
    amountNote: 'Full cost of studying at Cambridge plus allowance (see official site)',
    deadlineNote: "Check the official site for this year's dates",
    summary: 'Full-cost postgraduate awards at the University of Cambridge for applicants outside the UK.',
    docs: ['University of Cambridge application', 'Academic transcripts', 'Gates Cambridge statement', 'Research proposal (for PhD)'],
    officialUrl: 'https://www.gatescambridge.org',
  },
  {
    id: 'rhodes',
    name: 'Rhodes Scholarship',
    provider: 'Rhodes Trust (University of Oxford)',
    type: 'international',
    destination: 'United Kingdom',
    levels: ['Postgraduate'],
    fields: ['Any'],
    countriesEligible: ['Any'],
    minPercent: 75,
    maxIncomeLakh: null,
    gender: 'Any',
    categories: ['Any'],
    amountTier: 3,
    amountNote: 'Oxford tuition, stipend and settling allowance (see official site)',
    deadlineNote: "Check the official site for this year's dates",
    summary: 'Prestigious postgraduate fellowship for full-time study at the University of Oxford.',
    docs: ['Official academic transcripts', 'Personal statement & CV', 'Four to six reference letters', 'Proof of citizenship & age eligibility'],
    officialUrl: 'https://www.rhodeshouse.ox.ac.uk',
  },
  {
    id: 'daad',
    name: 'DAAD Scholarships',
    provider: 'German Academic Exchange Service',
    type: 'international',
    destination: 'Germany',
    levels: ['Postgraduate', 'PhD'],
    fields: ['Any'],
    countriesEligible: ['Any'],
    minPercent: 60,
    maxIncomeLakh: null,
    gender: 'Any',
    categories: ['Any'],
    amountTier: 3,
    amountNote: 'Monthly stipend, travel and insurance (see official site)',
    deadlineNote: "Check the official site for this year's dates",
    summary: 'Funding for graduate degrees and research stays at public and state-recognised German universities.',
    docs: ['Degree certificates & transcripts', 'Motivation letter', 'CV & work experience proof', 'Language certificate (German or English)'],
    officialUrl: 'https://www.daad.de/en/',
  },
  {
    id: 'erasmus',
    name: 'Erasmus Mundus Joint Masters',
    provider: 'European Commission',
    type: 'international',
    destination: 'Europe',
    levels: ['Postgraduate'],
    fields: ['Any'],
    countriesEligible: ['Any'],
    minPercent: 60,
    maxIncomeLakh: null,
    gender: 'Any',
    categories: ['Any'],
    amountTier: 3,
    amountNote: 'Tuition waiver, travel and monthly living grant (see official site)',
    deadlineNote: "Check the official site for this year's dates",
    summary: 'Study across multiple European universities in an integrated international master’s programme.',
    docs: ['Bachelor’s diploma & transcripts', 'Motivation letter', 'Two recommendation letters', 'English proficiency proof'],
    officialUrl: 'https://erasmus-plus.ec.europa.eu',
  },
  {
    id: 'knight-hennessy',
    name: 'Knight-Hennessy Scholars',
    provider: 'Stanford University',
    type: 'international',
    destination: 'United States',
    levels: ['Postgraduate', 'PhD'],
    fields: ['Any'],
    countriesEligible: ['Any'],
    minPercent: 75,
    maxIncomeLakh: null,
    gender: 'Any',
    categories: ['Any'],
    amountTier: 3,
    amountNote: 'Full tuition, stipend and travel for Stanford graduate degrees (see official site)',
    deadlineNote: "Check the official site for this year's dates",
    summary: 'Multidisciplinary graduate fellowship covering any master’s or doctoral degree at Stanford.',
    docs: ['Stanford graduate programme application', 'Transcripts & test scores', 'Two recommendation letters', 'Short essays & video story'],
    officialUrl: 'https://knight-hennessy.stanford.edu',
  },
  {
    id: 'mext',
    name: 'MEXT (Japanese Government Scholarship)',
    provider: 'Ministry of Education, Culture, Sports, Science & Technology',
    type: 'government',
    destination: 'Japan',
    levels: ['Undergraduate', 'Postgraduate', 'PhD'],
    fields: ['Any'],
    countriesEligible: ['Any'],
    minPercent: 65,
    maxIncomeLakh: null,
    gender: 'Any',
    categories: ['Any'],
    amountTier: 3,
    amountNote: 'Tuition exemption, monthly allowance and airfare (see official site)',
    deadlineNote: "Check the official site for this year's dates",
    summary: 'Full Japanese government scholarship for undergraduate and research students.',
    docs: ['Academic transcripts', 'Recommendation letter from school/university', 'Medical certificate', 'Study or research plan'],
    officialUrl: 'https://www.studyinjapan.go.jp',
  },
  {
    id: 'csc',
    name: 'Chinese Government Scholarship (CSC)',
    provider: 'China Scholarship Council',
    type: 'government',
    destination: 'China',
    levels: ['Undergraduate', 'Postgraduate', 'PhD'],
    fields: ['Any'],
    countriesEligible: ['Any'],
    minPercent: 60,
    maxIncomeLakh: null,
    gender: 'Any',
    categories: ['Any'],
    amountTier: 3,
    amountNote: 'Tuition, accommodation, stipend and insurance (see official site)',
    deadlineNote: "Check the official site for this year's dates",
    summary: 'Bilateral and university-track scholarships for international students across China.',
    docs: ['Notarised highest diploma & transcripts', 'Study plan or research proposal', 'Two recommendation letters', 'Foreigner physical examination form'],
    officialUrl: 'https://www.campuschina.org',
  },
  {
    id: 'gks',
    name: 'Global Korea Scholarship (GKS)',
    provider: 'NIIED · Government of South Korea',
    type: 'government',
    destination: 'South Korea',
    levels: ['Undergraduate', 'Postgraduate', 'PhD'],
    fields: ['Any'],
    countriesEligible: ['Any'],
    minPercent: 75,
    maxIncomeLakh: null,
    gender: 'Any',
    categories: ['Any'],
    amountTier: 3,
    amountNote: 'Full tuition, Korean language year, stipend and airfare (see official site)',
    deadlineNote: "Check the official site for this year's dates",
    summary: 'South Korean government funding for undergraduate and graduate degree programmes.',
    docs: ['Apostilled degree & transcripts', 'Personal statement & study plan', 'Two letters of recommendation', 'Proof of applicant & parent citizenship'],
    officialUrl: 'https://www.studyinkorea.go.kr',
  },
  {
    id: 'google',
    name: 'Google Scholarships for Students',
    provider: 'Google',
    type: 'merit',
    destination: 'Global',
    levels: ['Undergraduate', 'Postgraduate'],
    fields: ['Engineering & Technology', 'Science'],
    countriesEligible: ['Any'],
    minPercent: 65,
    maxIncomeLakh: null,
    gender: 'Any',
    categories: ['Any'],
    amountTier: 1,
    amountNote: 'Tuition award for computer science and technology students (see official site)',
    deadlineNote: "Check the official site for this year's dates",
    summary: 'Supports students pursuing computer science, engineering and closely related technical fields.',
    docs: ['Current university transcripts', 'Resume highlighting technical projects', 'Short essay responses', 'Reference letter'],
    officialUrl: 'https://buildyourfuture.withgoogle.com/scholarships',
  },
  {
    id: 'akf',
    name: 'Aga Khan Foundation International Scholarship',
    provider: 'Aga Khan Foundation',
    type: 'need',
    destination: 'Global',
    levels: ['Postgraduate', 'PhD'],
    fields: ['Any'],
    countriesEligible: ['Any'],
    minPercent: 65,
    maxIncomeLakh: 8,
    gender: 'Any',
    categories: ['Any'],
    amountTier: 3,
    amountNote: 'Half grant / half loan for tuition and living expenses (see official site)',
    deadlineNote: "Check the official site for this year's dates",
    summary: 'Need-based postgraduate support for outstanding students from select developing countries.',
    docs: ['Admission offer from university', 'Academic transcripts', 'Detailed family financial statement', 'Two academic/professional references'],
    officialUrl: 'https://www.akdn.org',
  },
];

export function distinctCountriesCount(list: ReadonlyArray<Scholarship>): number {
  const set = new Set<string>();
  for (const s of list) {
    if (s.destination && s.destination !== 'Global') set.add(s.destination);
  }
  return set.size;
}

export function distinctFieldsCount(list: ReadonlyArray<Scholarship>): number {
  const set = new Set<string>();
  for (const s of list) {
    for (const f of s.fields) {
      if (f !== 'Any') set.add(f);
    }
  }
  // Ensure at least the supported specific fields in the dataset or catalog are reflected accurately
  return set.size;
}

export function convertCgpaToPercent(cgpa: number): number {
  return Math.round(cgpa * 9.5 * 10) / 10;
}

export function matchScholarships(
  profile: StudentProfile,
  list: ReadonlyArray<Scholarship> = SCHOLARSHIPS
): MatchResult[] {
  const results: MatchResult[] = [];
  const incomeBounds = INCOME_BOUNDS[profile.incomeRange] ?? null;

  for (const s of list) {
    // Hard filters
    if (!s.levels.includes(profile.applyingFor)) continue;

    if (
      !s.countriesEligible.includes('Any') &&
      !s.countriesEligible.includes(profile.citizenship)
    ) {
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

    // Score calculation (100 total: level 25, field 20, marks 15, income 15, category/gender 10, destination 15)
    let score = 0;
    const whyMatch: string[] = [];
    const checkYourself: string[] = [];

    // 1. Level (25)
    score += 25;
    whyMatch.push(`${profile.applyingFor} eligible`);

    // 2. Field (20)
    if (s.fields.includes(profile.field)) {
      score += 20;
      whyMatch.push(`${profile.field} focus`);
    } else {
      score += 17;
      whyMatch.push('Open to all fields');
    }

    // 3. Marks (15)
    if (profile.percent === null) {
      score += 7.5;
      checkYourself.push('Marks requirement to check');
    } else {
      score += 15;
      if (s.minPercent > 0) {
        whyMatch.push(`Meets ${s.minPercent}%+ marks`);
      }
    }

    // 4. Income (15)
    if (s.maxIncomeLakh === null) {
      score += 15;
    } else if (!incomeBounds) {
      score += 7.5;
      checkYourself.push('Income proof needed');
    } else if (incomeBounds.max <= s.maxIncomeLakh) {
      score += 15;
      whyMatch.push(`Income under ₹${s.maxIncomeLakh}L`);
    } else {
      score += 10;
      checkYourself.push(`Check ₹${s.maxIncomeLakh}L income cap`);
    }

    // 5. Category & Gender (10 = 5 + 5)
    if (s.categories.includes('Any')) {
      score += 5;
    } else if (profile.category === 'Prefer not to say') {
      score += 2.5;
      checkYourself.push('Category proof needed');
    } else {
      score += 5;
      whyMatch.push(`${profile.category} eligible`);
    }

    if (s.gender === 'Any') {
      score += 5;
    } else if (profile.gender === 'Prefer not to say') {
      score += 2.5;
      checkYourself.push('Gender criteria to check');
    } else {
      score += 5;
      whyMatch.push(`${s.gender} applicants`);
    }

    // 6. Destination (15)
    if (profile.destination === 'India') {
      if (s.destination === 'India') {
        score += 15;
        whyMatch.push('Study in India');
      } else {
        score += 5;
      }
    } else if (profile.destination === 'Abroad (any)') {
      if (s.destination !== 'India') {
        score += 15;
        whyMatch.push(s.destination === 'Global' ? 'Study abroad' : `Study in ${s.destination}`);
      } else {
        score += 5;
      }
    } else {
      if (s.destination === profile.destination || s.destination === 'Global') {
        score += 15;
        whyMatch.push(`Destination: ${s.destination}`);
      } else {
        score += 5;
      }
    }

    results.push({
      scholarship: s,
      score: Math.max(0, Math.min(100, Math.round(score))),
      whyMatch,
      checkYourself,
    });
  }

  results.sort((a, b) => b.score - a.score);
  return results;
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
