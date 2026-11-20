import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SCHOLARSHIPS,
  distinctCountriesCount,
  distinctFieldsCount,
  convertCgpaToPercent,
  matchScholarships,
  buildSparklineGeometry,
  type StudentProfile,
} from './scholarships';

const demoProfile: StudentProfile = {
  citizenship: 'India',
  currentLevel: 'Undergraduate',
  field: 'Engineering & Technology',
  percent: 82,
  incomeRange: '2.5–5 lakh',
  category: 'General',
  gender: 'Female',
  destination: 'Abroad (any)',
  applyingFor: 'Postgraduate',
};

test('dataset contains 20 valid official URLs with no placeholders', () => {
  assert.equal(SCHOLARSHIPS.length, 20);
  for (const s of SCHOLARSHIPS) {
    assert.ok(s.officialUrl.startsWith('https://'), `${s.id} must use https://`);
    assert.ok(!s.officialUrl.includes('#'), `${s.id} must not contain #`);
    assert.ok(s.docs.length > 0, `${s.id} must have docs`);
  }
  assert.ok(distinctCountriesCount(SCHOLARSHIPS) >= 6);
  assert.ok(distinctFieldsCount(SCHOLARSHIPS) >= 3);
});

test('CGPA conversion multiplies by 9.5', () => {
  assert.equal(convertCgpaToPercent(8.5), 80.8);
  assert.equal(convertCgpaToPercent(10), 95);
});

test('matcher enforces hard filters and ranks destination & field matches higher', () => {
  const matches = matchScholarships(demoProfile);
  assert.ok(matches.length >= 10);
  // Scores sorted descending
  for (let i = 1; i < matches.length; i++) {
    assert.ok(matches[i - 1].score >= matches[i].score);
  }
  // Google scholarship (Engineering & Technology, Global, PG) should outrank India-only NSP for Abroad destination
  const google = matches.find(m => m.scholarship.id === 'google');
  const nsp = matches.find(m => m.scholarship.id === 'nsp');
  assert.ok(google && nsp);
  assert.ok(google.score > nsp.score);

  // INSPIRE requires Science; Engineering & Technology student must be excluded
  assert.equal(matches.find(m => m.scholarship.id === 'inspire'), undefined);
});

test('Prefer not to say does not exclude and adds Check yourself chip', () => {
  const privateProfile: StudentProfile = {
    ...demoProfile,
    incomeRange: 'Prefer not to say',
    category: 'Prefer not to say',
    gender: 'Prefer not to say',
  };
  const matches = matchScholarships(privateProfile);
  const nsp = matches.find(m => m.scholarship.id === 'nsp');
  assert.ok(nsp);
  assert.ok(nsp.checkYourself.includes('Income proof needed'));
});

test('low marks excludes high-cutoff merit scholarships', () => {
  const lowMarks: StudentProfile = {
    ...demoProfile,
    percent: 45,
  };
  const matches = matchScholarships(lowMarks);
  assert.equal(matches.length, 0);
});

test('sparkline geometry rescales top 8 scores into 220x70 SVG coordinates', () => {
  const geo = buildSparklineGeometry([98, 95, 92, 90, 88, 85, 80, 75]);
  const pts = geo.pointsAttr.split(' ');
  assert.equal(pts.length, 8);
  assert.equal(geo.dots.length, 3);
  assert.equal(geo.dots[2].x, 214);
});
