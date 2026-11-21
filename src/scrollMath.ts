export function clamp(v: number, a = 0, b = 1): number {
  return Math.max(a, Math.min(b, v));
}

export function seg(p: number, a: number, b: number): number {
  return clamp((p - a) / (b - a));
}

export function ease(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function capWheelDelta(deltaY: number, dtMs = 16, maxPxPerMs = 0.85): number {
  if (!Number.isFinite(deltaY) || deltaY === 0) return 0;
  const clampedDt = Math.min(48, Math.max(8, dtMs));
  const maxStep = clampedDt * maxPxPerMs;
  return Math.sign(deltaY) * Math.min(Math.abs(deltaY), maxStep);
}

export function normalizeWheelDelta(deltaY: number, deltaMode: number, pageHeight = 900): number {
  if (!Number.isFinite(deltaY) || deltaY === 0) return 0;
  if (deltaMode === 1) return deltaY * 40;
  if (deltaMode === 2) return deltaY * Math.max(300, pageHeight);
  return deltaY;
}

export function computeStory1xSpeed(
  storyHeight: number,
  viewportHeight: number,
  videoDurationSec = 5.04
): number {
  const denom = Math.max(1, storyHeight - viewportHeight);
  const flyInDistance = 0.65 * denom;
  const durationMs = Math.max(1000, videoDurationSec * 1000);
  return clamp(flyInDistance / durationMs, 0.55, 0.95);
}

export interface WheelStepOptions {
  deltaY: number;
  deltaMode: number;
  dtMs: number;
  scrollY: number;
  storyBottom: number;
  viewportHeight: number;
  story1xPxPerMs: number;
}

export function computeWheelStep(opts: WheelStepOptions): number {
  const norm = normalizeWheelDelta(opts.deltaY, opts.deltaMode, opts.viewportHeight);
  if (norm === 0) return 0;

  const inStory = opts.scrollY < opts.storyBottom;
  const speed = inStory
    ? opts.story1xPxPerMs
    : Math.max(1.05, opts.story1xPxPerMs * 1.6);
  const isIsolatedStandardNotch = opts.dtMs > 80 && Math.abs(norm) <= 125;
  const maxDt = inStory ? (isIsolatedStandardNotch ? 120 : 48) : 100;
  const clampedDt = Math.min(maxDt, Math.max(8, opts.dtMs));
  const maxStep = clampedDt * speed;
  let step = Math.sign(norm) * Math.min(Math.abs(norm), maxStep);

  // Prevent a large downward/upward step from blowing deep across the story boundary in one tick
  if (inStory && step > 0 && opts.scrollY + step > opts.storyBottom) {
    const storyRemaining = opts.storyBottom - opts.scrollY;
    step = Math.min(step, storyRemaining + 48);
  } else if (!inStory && step < 0 && opts.scrollY + step < opts.storyBottom) {
    const distToBoundary = opts.scrollY - opts.storyBottom;
    const maxInsideStory = Math.min(48, Math.max(8, opts.dtMs)) * opts.story1xPxPerMs;
    step = -Math.min(Math.abs(step), distToBoundary + maxInsideStory);
  }

  return step;
}

export function computeFrameWindow(
  want: number,
  totalFrames: number,
  behind = 4,
  ahead = 8
): number[] {
  if (totalFrames <= 0) return [];
  const center = clamp(Math.round(want), 0, totalFrames - 1);
  const order: number[] = [center];
  const maxDist = Math.max(behind, ahead);
  for (let d = 1; d <= maxDist; d++) {
    if (d <= ahead && center + d < totalFrames) order.push(center + d);
    if (d <= behind && center - d >= 0) order.push(center - d);
  }
  return order;
}

export function linearFlyIn(sp: number): number {
  return seg(sp, 0.05, 0.70);
}

export function computeCropStyle(x: number, y: number, w: number, h: number) {
  return {
    aspectRatio: `${w}/${h}`,
    widthPct: (1200 / w) * 100,
    leftPct: (-x / w) * 100,
    topPct: (-y / h) * 100,
  };
}

export function computeHeroGeometry(
  W: number,
  H: number,
  lineWidthAtBaseFs: number,
  blockHeight: number
) {
  const bw = W * 1.06;
  const bh = H * 1.12;
  const k = Math.max(bw / 1600, bh / 900);
  const fernTop = -0.09 * H + (bh - 900 * k) / 2 + 245 * k + 0.06 * H;
  let fs = Math.min(104, 72 * k);
  if (lineWidthAtBaseFs > W * 0.86) {
    fs = fs * ((W * 0.86) / lineWidthAtBaseFs);
  }
  const top = fernTop + 0.5 * fs - blockHeight;
  return { fs, fernTop, top };
}

export function findNearestFrame(
  frames: ReadonlyArray<unknown>,
  target: number
): number {
  const n = frames.length;
  if (n === 0) return -1;
  const t = clamp(Math.round(target), 0, n - 1);
  if (frames[t]) return t;
  for (let k = 1; k < n; k++) {
    if (t - k >= 0 && frames[t - k]) return t - k;
    if (t + k < n && frames[t + k]) return t + k;
  }
  return -1;
}

export function formatStatValue(val: number, decimals: number, useComma: boolean): string {
  const fixed = val.toFixed(decimals);
  if (!useComma) return fixed;
  const parts = fixed.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}
