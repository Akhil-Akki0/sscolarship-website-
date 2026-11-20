import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clamp,
  seg,
  ease,
  computeCropStyle,
  computeHeroGeometry,
  findNearestFrame,
  formatStatValue,
} from './scrollMath';

test('seg and ease produce expected boundaries and midpoint', () => {
  assert.equal(clamp(-0.5), 0);
  assert.equal(clamp(1.5), 1);
  assert.equal(seg(0.05, 0.05, 0.7), 0);
  assert.equal(seg(0.7, 0.05, 0.7), 1);
  assert.ok(Math.abs(seg(0.375, 0.05, 0.7) - 0.5) < 1e-12);
  assert.equal(ease(0), 0);
  assert.equal(ease(0.5), 0.5);
  assert.equal(ease(1), 1);
  assert.ok(ease(0.25) < 0.25);
  assert.ok(ease(0.75) > 0.75);
});

test('computeCropStyle matches 1200x678 sprite sheet geometry', () => {
  const rk1 = computeCropStyle(30, 200, 260, 295);
  assert.equal(rk1.aspectRatio, '260/295');
  assert.ok(Math.abs(rk1.widthPct - (1200 / 260) * 100) < 1e-6);
  assert.ok(Math.abs(rk1.leftPct - (-30 / 260) * 100) < 1e-6);
  assert.ok(Math.abs(rk1.topPct - (-200 / 295) * 100) < 1e-6);

  const rk3 = computeCropStyle(895, 240, 265, 270);
  assert.equal(rk3.aspectRatio, '265/270');
  assert.ok(Math.abs(rk3.widthPct - (1200 / 265) * 100) < 1e-6);
});

test('computeHeroGeometry scales font size to fit within 86% viewport width', () => {
  const normal = computeHeroGeometry(1440, 900, 1000, 140);
  assert.ok(normal.fs <= 104);
  assert.ok(normal.top > 0);

  const squeezed = computeHeroGeometry(1000, 900, 1000, 140);
  assert.ok(squeezed.fs < normal.fs);
});

test('findNearestFrame locates exact or nearest cached frame outward', () => {
  const frames = [true, null, null, true, null];
  assert.equal(findNearestFrame(frames, 0), 0);
  assert.equal(findNearestFrame(frames, 1), 0);
  assert.equal(findNearestFrame(frames, 2), 3);
  assert.equal(findNearestFrame([null, null], 1), -1);
});

test('formatStatValue formats integers with commas and decimals accurately', () => {
  assert.equal(formatStatValue(1240, 0, true), '1,240');
  assert.equal(formatStatValue(38, 0, false), '38');
  assert.equal(formatStatValue(2.1, 1, false), '2.1');
  assert.equal(formatStatValue(99.4, 1, false), '99.4');
});
