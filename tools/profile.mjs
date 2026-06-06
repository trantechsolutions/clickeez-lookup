import sharp from 'sharp';

// Deterministic grid finder. For a block region, compute per-column and per-row
// "tile-ness" projections, then report candidate centers. The printed faces sit in
// light rounded tiles separated by saturated colored gaps + dark label text, so:
//   tileness = luminance - saturation*k   (bright AND unsaturated => tile interior)
// Gaps (saturated bg) and label text (dark) both score low; tile rows/cols score high.
//
// Usage: node tools/profile.mjs <x0> <y0> <w> <h> [axis=both]
// Prints smoothed projection with peak markers so you can read centers off guide coords.

const SRC = 'tools/collector-guide.jpg';
const [x0, y0, w, h] = process.argv.slice(2, 6).map(Number);
const axis = process.argv[6] || 'both';

const { data, info } = await sharp(SRC)
  .extract({ left: x0, top: y0, width: w, height: h })
  .raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

// per-pixel signal = local gradient magnitude. Face interiors are detailed (high
// gradient); smooth inter-tile background scores ~0. Robust to color/brightness.
const lum = new Float64Array(width * height);
for (let i = 0, p = 0; i < width * height; i++, p += channels)
  lum[i] = (data[p] + data[p + 1] + data[p + 2]) / 3;
const tile = new Float64Array(width * height);
for (let y = 1; y < height - 1; y++) for (let x = 1; x < width - 1; x++) {
  const i = y * width + x;
  const gx = lum[i + 1] - lum[i - 1];
  const gy = lum[i + width] - lum[i - width];
  tile[i] = Math.hypot(gx, gy);
}

const colMean = new Float64Array(width);
for (let x = 0; x < width; x++) { let s = 0; for (let y = 0; y < height; y++) s += tile[y * width + x]; colMean[x] = s / height; }
const rowMean = new Float64Array(height);
for (let y = 0; y < height; y++) { let s = 0; for (let x = 0; x < width; x++) s += tile[y * width + x]; rowMean[y] = s / width; }

function smooth(arr, k) {
  const out = new Float64Array(arr.length);
  for (let i = 0; i < arr.length; i++) { let s = 0, n = 0; for (let j = -k; j <= k; j++) { const t = i + j; if (t >= 0 && t < arr.length) { s += arr[t]; n++; } } out[i] = s / n; }
  return out;
}
// Find centers of contiguous "high" bands (above midpoint between min and max).
function bands(arr, offset, label) {
  const sm = smooth(arr, 6);
  let lo = Infinity, hi = -Infinity;
  for (const v of sm) { if (v < lo) lo = v; if (v > hi) hi = v; }
  const thr = lo + (hi - lo) * 0.55;
  const segs = [];
  let start = -1;
  for (let i = 0; i < sm.length; i++) {
    if (sm[i] >= thr && start < 0) start = i;
    else if (sm[i] < thr && start >= 0) { if (i - start >= 18) segs.push([start, i - 1]); start = -1; }
  }
  if (start >= 0 && sm.length - start >= 18) segs.push([start, sm.length - 1]);
  console.log(`\n${label}: range[${lo.toFixed(0)}..${hi.toFixed(0)}] thr=${thr.toFixed(0)} -> ${segs.length} bands`);
  for (const [a, b] of segs) {
    const c = Math.round((a + b) / 2) + offset;
    console.log(`   center=${c}  (span ${a + offset}..${b + offset}, width ${b - a})`);
  }
  return segs.map(([a, b]) => Math.round((a + b) / 2) + offset);
}

// Row/col centers via TROUGH detection: smooth gaps between detailed face-bands
// are low-gradient valleys. Centers = midpoints between consecutive deep valleys.
function troughs(arr, offset, label, minGap) {
  const sm = smooth(arr, 7);
  let lo = Infinity, hi = -Infinity;
  for (const v of sm) { if (v < lo) lo = v; if (v > hi) hi = v; }
  const thr = lo + (hi - lo) * 0.45; // below this = valley
  const valleys = [];
  let start = -1;
  for (let i = 0; i < sm.length; i++) {
    if (sm[i] < thr && start < 0) start = i;
    else if (sm[i] >= thr && start >= 0) { valleys.push(Math.round((start + i - 1) / 2)); start = -1; }
  }
  if (start >= 0) valleys.push(Math.round((start + sm.length - 1) / 2));
  // include the region ends as implicit valleys so first/last bands get centers
  const bounds = [0, ...valleys.filter(v => v > 5 && v < sm.length - 5), sm.length - 1];
  const centers = [];
  for (let i = 0; i < bounds.length - 1; i++) {
    const a = bounds[i], b = bounds[i + 1];
    if (b - a >= minGap) centers.push(Math.round((a + b) / 2) + offset);
  }
  console.log(`\n${label}: range[${lo.toFixed(0)}..${hi.toFixed(0)}] valleys@${valleys.map(v => v + offset).join(',')}`);
  console.log(`   centers: ${centers.join(', ')}`);
  return centers;
}

console.log(`region x[${x0}..${x0 + w}] y[${y0}..${y0 + h}]`);
if (axis === 'x' || axis === 'both') troughs(colMean, x0, 'COLUMNS (x centers)', 60);
if (axis === 'y' || axis === 'both') troughs(rowMean, y0, 'ROWS (y centers)', 90);
