import sharp from 'sharp';
import { SRC, BOX, FACES } from './layout.js';

// One tile per face: the crop with its intended name burned into the corner,
// plus an index number. Unambiguous face<->name pairing for individual review.
const COLS = 8;
const CELL = 170;
const PAD = 6;
const half = BOX / 2;
const meta = await sharp(SRC).metadata();
const clamp = (v, max) => Math.max(0, Math.min(v, max));

const rows = Math.ceil(FACES.length / COLS);
const W = COLS * (CELL + PAD) + PAD;
const H = rows * (CELL + PAD) + PAD;

const composites = [];
for (let i = 0; i < FACES.length; i++) {
  const f = FACES[i];
  const left = clamp(Math.round(f.x - half), meta.width - BOX);
  const top = clamp(Math.round(f.y - half), meta.height - BOX);
  const thumb = await sharp(SRC)
    .extract({ left, top, width: BOX, height: BOX })
    .resize(CELL, CELL)
    .png().toBuffer();
  const esc = f.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const label = Buffer.from(
    `<svg width="${CELL}" height="${CELL}">` +
    `<rect x="0" y="0" width="${CELL}" height="18" fill="#000" opacity="0.65"/>` +
    `<text x="3" y="13" font-family="monospace" font-size="11" fill="#0f6">${i} ${esc}</text></svg>`
  );
  const gx = i % COLS, gy = Math.floor(i / COLS);
  const x = PAD + gx * (CELL + PAD), y = PAD + gy * (CELL + PAD);
  composites.push({ input: thumb, left: x, top: y });
  composites.push({ input: label, left: x, top: y });
}

await sharp({ create: { width: W, height: H, channels: 3, background: '#0f1117' } })
  .composite(composites).png().toFile('tools/_review.png');
console.log(`Review sheet: ${FACES.length} tiles, ${W}x${H}, ${rows} rows`);
