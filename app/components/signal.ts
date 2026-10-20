// One continuous line: a day of power grid demand that turns into a heartbeat.
// The shape is illustrative, not real data. Units are SVG viewBox units.

export const W = 1000;
export const H = 300;
export const SPLIT = 560; // where the grid curve hands off to the heartbeat

type Pt = [number, number];

function gauss(x: number, mu: number, sigma: number) {
  return Math.exp(-((x - mu) ** 2) / (2 * sigma * sigma));
}

// Winter-style daily load: overnight trough, morning ramp, evening peak.
function load(hour: number) {
  return (
    0.34 +
    0.22 * gauss(hour, 8.2, 2.1) +
    0.1 * gauss(hour, 13, 3.5) +
    0.4 * gauss(hour, 18.6, 2.4) -
    0.08 * gauss(hour, 3.5, 2.2)
  );
}

// Load runs from about 0.28 overnight to 0.77 at the evening peak.
const toY = (v: number) => 270 - ((v - 0.28) / 0.49) * 240;

function gridPoints() {
  const pts: Pt[] = [];
  const steps = 140;
  for (let i = 0; i <= steps; i++) {
    const hour = (i / steps) * 24;
    const wobble = 0.006 * Math.sin(i * 0.9) + 0.002 * Math.sin(i * 2.3);
    pts.push([(i / steps) * SPLIT, toY(load(hour) + wobble)]);
  }
  return pts;
}

function heartPoints(base: number) {
  const pts: Pt[] = [[SPLIT, base]];
  const peaks: number[] = []; // index of each beat's tall spike
  const start = SPLIT + 20;
  const beat = (W - start - 16) / 3;
  pts.push([start, base]);

  for (let b = 0; b < 3; b++) {
    const x = start + b * beat;
    // P wave
    for (let i = 1; i <= 8; i++) {
      const t = i / 8;
      pts.push([x + 11 + t * 18, base - 16 * Math.sin(Math.PI * t)]);
    }
    // QRS complex
    pts.push([x + 41, base]);
    pts.push([x + 44, base + 10]);
    peaks.push(pts.length);
    pts.push([x + 49, base - 192]);
    pts.push([x + 54, base + 40]);
    pts.push([x + 58, base]);
    // T wave
    for (let i = 1; i <= 12; i++) {
      const t = i / 12;
      pts.push([x + 72 + t * 28, base - 30 * Math.sin(Math.PI * t)]);
    }
    pts.push([x + beat, base]);
  }
  pts.push([W, base]);
  return { pts, peaks };
}

function toPath(pts: Pt[]) {
  return pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");
}

// Running length along the polyline, so a 0–1 draw amount maps to a point.
function lengths(pts: Pt[]) {
  const acc = [0];
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    acc.push(acc[i - 1] + Math.hypot(x1 - x0, y1 - y0));
  }
  return acc;
}

function pointAt(pts: Pt[], acc: number[], f: number): Pt {
  const target = Math.min(1, Math.max(0, f)) * acc[acc.length - 1];
  let lo = 0;
  let hi = acc.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (acc[mid] < target) lo = mid;
    else hi = mid;
  }
  const t = (target - acc[lo]) / (acc[hi] - acc[lo] || 1);
  return [
    pts[lo][0] + (pts[hi][0] - pts[lo][0]) * t,
    pts[lo][1] + (pts[hi][1] - pts[lo][1]) * t,
  ];
}

const grid = gridPoints();
const heart = heartPoints(grid[grid.length - 1][1]);
const gridAcc = lengths(grid);
const heartAcc = lengths(heart.pts);

export const gridPath = toPath(grid);
export const heartPath = toPath(heart.pts);

export const pointOnGrid = (f: number) => pointAt(grid, gridAcc, f);
export const pointOnHeart = (f: number) => pointAt(heart.pts, heartAcc, f);

// Each beat's spike: where it sits along the heartbeat (0–1) and on the canvas.
export const spikes = heart.peaks.map((i) => ({
  at: heartAcc[i] / heartAcc[heartAcc.length - 1],
  x: heart.pts[i][0],
  y: heart.pts[i][1],
}));
