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
