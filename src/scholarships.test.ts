import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SCHOLARSHIPS,
  distinctRegionsCount,
  distinctFieldsCount,
  convertCgpaToPercent,
  getScholarshipStatus,
  toDirectoryEntries,
  matchScholarships,
  searchScholarships,
  buildSparklineGeometry,
  type StudentProfile,
} from './scholarships.ts';

const refDate = new Date('2026-11-20T00:00:00Z');

const karnatakaProfile: StudentProfile = {
  citizenship: 'India',
  state: 'Karnataka',
  currentLevel: 'Class 12',
  field: 'Engineering & Technology',
  percent: 84,
  incomeRange: '1–2.5 lakh',
  category: 'OBC',
  gender: 'Female',
  destination: 'Karnataka (State & Central)',
  applyingFor: 'Undergraduate',
};

test('catalog focuses on Karnataka & India with minimal Asia entries and zero fake URLs', () => {
  assert.ok(SCHOLARSHIPS.length >= 20);
  const kaCount = SCHOLARSHIPS.filter(s => s.region === 'Karnataka').length;
  const inCount = SCHOLARSHIPS.filter(s => s.region === 'India').length;
  const asiaCount = SCHOLARSHIPS.filter(s => s.region === 'Asia').length;

  assert.ok(kaCount >= 10, 'Expected strong Karnataka scholarship coverage');
  assert.ok(inCount >= 6, 'Expected All-India scholarship coverage');
  assert.ok(asiaCount <= 4 && asiaCount >= 2, 'Expected compact Asia scholarship coverage');

  for (const s of SCHOLARSHIPS) {
    assert.ok(s.officialUrl.startsWith('https://'), `${s.id} must use https://`);
    assert.ok(!s.officialUrl.includes('#'), `${s.id} must not contain #`);
    assert.ok(!s.officialUrl.includes('buddy4study'), `${s.id} should use direct official portals`);
    assert.match(s.deadlineDate, /^\d{4}-\d{2}-\d{2}$/, `${s.id} must have ISO deadlineDate`);
    assert.ok(s.deadlineText.length > 3, `${s.id} must have human-readable deadlineText`);
    assert.ok(s.docs.length > 0, `${s.id} must have docs checklist`);
  }
  assert.ok(distinctRegionsCount(SCHOLARSHIPS) >= 4);
  assert.ok(distinctFieldsCount(SCHOLARSHIPS) >= 3);
});

test('getScholarshipStatus separates live vs pre_stopped schemes against current date', () => {
  const ssp = SCHOLARSHIPS.find(s => s.id === 'ka-ssp-postmatric')!;
  const vidyadhan = SCHOLARSHIPS.find(s => s.id === 'ka-vidyadhan')!;

  const sspStatus = getScholarshipStatus(ssp, refDate);
  assert.equal(sspStatus.status, 'live');
  assert.ok((sspStatus.daysLeft ?? -1) > 0);
  assert.match(sspStatus.badgeText, /^LIVE TO APPLY/);

  const vidyadhanStatus = getScholarshipStatus(vidyadhan, refDate);
  assert.equal(vidyadhanStatus.status, 'pre_stopped');
  assert.ok((vidyadhanStatus.daysLeft ?? 0) < 0);
  assert.match(vidyadhanStatus.badgeText, /^PRE-STOPPED/);
});

test('CGPA conversion multiplies by 9.5', () => {
  assert.equal(convertCgpaToPercent(8.5), 80.8);
  assert.equal(convertCgpaToPercent(10), 95);
});

test('matcher ranks Live Karnataka schemes above Pre-Stopped and respects eligibility', () => {
  const matches = matchScholarships(karnatakaProfile, SCHOLARSHIPS, refDate);
  assert.ok(matches.length >= 6);

  // All live items appear before any pre_stopped item
  let seenPreStopped = false;
  for (const m of matches) {
    if (m.status === 'pre_stopped') seenPreStopped = true;
    if (seenPreStopped) {
      assert.equal(m.status, 'pre_stopped', 'Live items must always sort ahead of pre-stopped');
    }
  }

  // Karnataka SSP & Vidyasiri & AICTE Pragati & FFE should match this OBC female Engineering UG profile
  assert.ok(matches.some(m => m.scholarship.id === 'ka-ssp-postmatric' && m.status === 'live'));
  assert.ok(matches.some(m => m.scholarship.id === 'ka-vidyasiri' && m.status === 'live'));
  assert.ok(matches.some(m => m.scholarship.id === 'in-aicte-pragati' && m.status === 'live'));
  assert.ok(matches.some(m => m.scholarship.id === 'in-ffe' && m.status === 'live'));

  // SC/ST only prize money should not match OBC profile
  assert.equal(matches.find(m => m.scholarship.id === 'ka-swd-prize'), undefined);
});

test('Non-Karnataka Indian state excludes Karnataka-only domicile schemes', () => {
  const mhProfile: StudentProfile = {
    ...karnatakaProfile,
    state: 'Maharashtra',
    destination: 'All India',
  };
  const matches = matchScholarships(mhProfile, SCHOLARSHIPS, refDate);
  assert.equal(matches.find(m => m.scholarship.id === 'ka-vidyasiri'), undefined);
  assert.ok(matches.some(m => m.scholarship.id === 'in-aicte-pragati'));
});

test('searchScholarships returns direct matches, related scholarships, and related queries', () => {
  const dir = toDirectoryEntries(SCHOLARSHIPS, refDate);
  const res = searchScholarships(dir, 'vidyasiri');

  assert.ok(res.directMatches.some(m => m.scholarship.id === 'ka-vidyasiri'));
  assert.ok(res.relatedScholarships.length >= 1, 'Expected related scholarships alongside direct match');
  assert.ok(
    res.relatedScholarships.every(m => m.scholarship.id !== 'ka-vidyasiri'),
    'Related scholarships should not duplicate direct matches'
  );
  assert.ok(res.relatedQueries.length >= 3);
  assert.ok(res.relatedQueries.some(q => q.toLowerCase().includes('karnataka')));
});

test('sparkline geometry rescales top 8 scores into 220x70 SVG coordinates', () => {
  const geo = buildSparklineGeometry([98, 95, 92, 90, 88, 85, 80, 75]);
  const pts = geo.pointsAttr.split(' ');
  assert.equal(pts.length, 8);
  assert.equal(geo.dots.length, 3);
  assert.equal(geo.dots[2].x, 214);
});
