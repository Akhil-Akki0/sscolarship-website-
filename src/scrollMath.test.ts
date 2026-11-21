import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clamp,
  seg,
  ease,
  capWheelDelta,
  normalizeWheelDelta,
  computeStory1xSpeed,
  computeWheelStep,
  computeFrameWindow,
  linearFlyIn,
  computeCropStyle,
  computeHeroGeometry,
  findNearestFrame,
  formatStatValue,
} from './scrollMath';

test('capWheelDelta caps fast scroll deltas by elapsed time and stops immediately at 0', () => {
  assert.equal(capWheelDelta(0, 16), 0);
  assert.equal(capWheelDelta(8, 16), 8);
  assert.ok(Math.abs(capWheelDelta(600, 16) - 13.6) < 1e-9);
  assert.ok(Math.abs(capWheelDelta(-900, 48) - -40.8) < 1e-9);
});

test('normalizeWheelDelta converts pixel, line, and page units cleanly', () => {
  assert.equal(normalizeWheelDelta(0, 0, 900), 0);
  assert.equal(normalizeWheelDelta(24, 0, 900), 24);
  assert.equal(normalizeWheelDelta(3, 1, 900), 120);
  assert.equal(normalizeWheelDelta(1, 2, 900), 900);
});

test('computeStory1xSpeed matches 5.04s fly-in duration and clamps safely', () => {
  // 640vh at 900px = 5760px; denom = 4860px; fly-in = 3159px; 3159 / 5040ms ≈ 0.627 px/ms
  const s900 = computeStory1xSpeed(5760, 900);
  assert.ok(s900 > 0.60 && s900 < 0.66);

  // Small viewport clamps at 0.55 px/ms
  assert.equal(computeStory1xSpeed(2000, 500), 0.55);
  // Tall viewport clamps at 0.95 px/ms
  assert.equal(computeStory1xSpeed(12800, 2000), 0.95);
});

test('computeWheelStep enforces 1X max speed in story, 1:1 slow scroll, and stops at 0', () => {
  const base = {
    deltaMode: 0,
    dtMs: 16,
    scrollY: 1000,
    storyBottom: 4860,
    viewportHeight: 900,
    story1xPxPerMs: 0.625,
  };
  assert.equal(computeWheelStep({ ...base, deltaY: 0 }), 0);
  // Slow scroll (< 1X) stays 1:1
  assert.equal(computeWheelStep({ ...base, deltaY: 6 }), 6);
  // Fast scroll (> 1X) clamps to dtMs * story1xPxPerMs = 16 * 0.625 = 10px
  assert.equal(computeWheelStep({ ...base, deltaY: 500 }), 10);
  assert.equal(computeWheelStep({ ...base, deltaY: -500 }), -10);

  // Isolated standard mouse notch after pause gets smooth 1X notch credit (120 * 0.625 = 75px)
  assert.equal(computeWheelStep({ ...base, dtMs: 180, deltaY: 100 }), 75);

  // Huge burst even after pause stays capped at 48 * 0.625 = 30px
  assert.equal(computeWheelStep({ ...base, dtMs: 180, deltaY: 600 }), 30);

  // Below story allows comfortable 100px mouse notch while still capping huge bursts
  const below = computeWheelStep({
    ...base,
    scrollY: 5500,
    dtMs: 100,
    deltaY: 100,
  });
  assert.equal(below, 100);
  const belowFast = computeWheelStep({
    ...base,
    scrollY: 5500,
    dtMs: 16,
    deltaY: 500,
  });
  assert.ok(belowFast < 25);
});

test('computeFrameWindow orders frames outward around target', () => {
  assert.deepEqual(computeFrameWindow(10, 121, 2, 3), [10, 11, 9, 12, 8, 13]);
  assert.deepEqual(computeFrameWindow(0, 5, 2, 2), [0, 1, 2]);
  assert.deepEqual(computeFrameWindow(0, 0), []);
});

test('linearFlyIn advances at uniform constant speed across [0.05, 0.70]', () => {
  assert.equal(linearFlyIn(0.05), 0);
  assert.ok(Math.abs(linearFlyIn(0.2125) - 0.25) < 1e-12);
  assert.ok(Math.abs(linearFlyIn(0.375) - 0.5) < 1e-12);
  assert.ok(Math.abs(linearFlyIn(0.5375) - 0.75) < 1e-12);
  assert.equal(linearFlyIn(0.70), 1);
});

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
