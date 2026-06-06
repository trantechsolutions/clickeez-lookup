import sharp from 'sharp';

// Usage:
//   node tools/sweep.mjs x <fixedY> <x0> <x1> [box] [step]   -> sweeps X (find columns)
//   node tools/sweep.mjs y <fixedX> <y0> <y1> [box] [step]   -> sweeps Y (find rows)
// Tiles probe crops with the swept coordinate burned in, so you can pick the
// value that centers a face. Output: tools/_sweep.png

const SRC = 'tools/collector-guide.jpg';
const [axis, fixedS, aS, bS, boxS, stepS] = process.argv.slice(2);
const fixed = +fixedS, a = +aS, b = +bS;
const BOX = +(boxS || 80);
const step = +(stepS || 15);
const half = BOX / 2;

const meta = await sharp(SRC).metadata();
const clamp = (v, max) => Math.max(0, Math.min(v, max));

const vals = [];
for (let v = a; v <= b; v += step) vals.push(v);

const CELL = 165, PAD = 4, COLS = Math.min(vals.length, 7);
const rows = Math.ceil(vals.length / COLS);
const W = COLS * (CELL + PAD) + PAD, H = rows * (CELL + PAD) + PAD;

const comp = [];
for (let i = 0; i < vals.length; i++) {
  const v = vals[i];
  const cx = axis === 'x' ? v : fixed;
  const cy = axis === 'y' ? v : fixed;
  const left = clamp(Math.round(cx - half), meta.width - BOX);
  const top = clamp(Math.round(cy - half), meta.height - BOX);
  const thumb = await sharp(SRC)
    .extract({ left, top, width: BOX, height: BOX })
    .resize(CELL, CELL).png().toBuffer();
  const label = Buffer.from(
    `<svg width="${CELL}" height="18"><rect width="${CELL}" height="18" fill="#000" opacity="0.7"/>` +
    `<text x="2" y="13" font-family="monospace" font-size="12" fill="#0f6">${axis}=${v}</text></svg>`);
  const gx = i % COLS, gy = Math.floor(i / COLS);
  const x = PAD + gx * (CELL + PAD), y = PAD + gy * (CELL + PAD);
  comp.push({ input: thumb, left: x, top: y }, { input: label, left: x, top: y });
}
await sharp({ create: { width: W, height: H, channels: 3, background: '#0f1117' } })
  .composite(comp).png().toFile('tools/_sweep.png');
console.log(`sweep ${axis} fixed=${fixed} ${a}..${b} step ${step} box ${BOX} -> ${vals.length} tiles`);
