import sharp from 'sharp';
import { SRC, BOX, FACES } from './layout-series3.js';

// Two verification artifacts for Series 3 crop calibration:
//   tools/_overlay-s3.png  — every crop box + name drawn on the half-scale full scan
//   tools/_contact-s3.png  — a labeled contact sheet of the actual crops
// Optional zoom arg for the contact sheet only. Run, view both, adjust layout-series3.js.

const meta = await sharp(SRC).metadata();
const clamp = (v, max) => Math.max(0, Math.min(v, max));

// ---- Overlay on the full image (0.5 scale) ----
const SCALE = 0.5;
const OW = Math.round(meta.width * SCALE), OH = Math.round(meta.height * SCALE);
const rects = FACES.map((f, i) => {
  const box = f.box || BOX;
  const x = (f.x - box / 2) * SCALE, y = (f.y - box / 2) * SCALE, s = box * SCALE;
  const esc = f.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${s.toFixed(1)}" height="${s.toFixed(1)}" fill="none" stroke="#00ff66" stroke-width="1.5"/>` +
    `<circle cx="${(f.x * SCALE).toFixed(1)}" cy="${(f.y * SCALE).toFixed(1)}" r="1.6" fill="#ff0044"/>` +
    `<text x="${(x + 1).toFixed(1)}" y="${(y + 9).toFixed(1)}" font-family="monospace" font-size="8" fill="#00ff66">${i}</text>`;
}).join('');
await sharp(SRC)
  .resize(OW, OH)
  .composite([{ input: Buffer.from(`<svg width="${OW}" height="${OH}">${rects}</svg>`), left: 0, top: 0 }])
  .png()
  .toFile('tools/_overlay-s3.png');

// ---- Labeled contact sheet ----
const COLS = 10, CELL = 150, PAD = 4, LBL = 22, TILE = CELL + LBL;
const rows = Math.ceil(FACES.length / COLS);
const CW = COLS * (CELL + PAD) + PAD, CH = rows * (TILE + PAD) + PAD;
const comp = [];
for (let i = 0; i < FACES.length; i++) {
  const f = FACES[i];
  const box = f.box || BOX;
  const left = clamp(Math.round(f.x - box / 2), meta.width - box);
  const top = clamp(Math.round(f.y - box / 2), meta.height - box);
  const thumb = await sharp(SRC)
    .extract({ left, top, width: box, height: box })
    .resize(CELL, CELL).png().toBuffer();
  const esc = f.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const lbl = Buffer.from(
    `<svg width="${CELL}" height="${LBL}"><rect width="100%" height="100%" fill="#111"/>` +
    `<text x="3" y="15" font-family="monospace" font-size="11" fill="#0f6">${i} ${esc}</text></svg>`);
  const gx = i % COLS, gy = Math.floor(i / COLS);
  const x = PAD + gx * (CELL + PAD), y = PAD + gy * (TILE + PAD);
  comp.push({ input: thumb, left: x, top: y });
  comp.push({ input: lbl, left: x, top: y + CELL });
}
await sharp({ create: { width: CW, height: CH, channels: 3, background: '#222' } })
  .composite(comp).png().toFile('tools/_contact-s3.png');

console.log(`Wrote tools/_overlay-s3.png (${OW}x${OH}) and tools/_contact-s3.png (${FACES.length} faces)`);
