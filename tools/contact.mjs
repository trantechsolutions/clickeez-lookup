import sharp from 'sharp';
import { SRC, BOX, FACES } from './layout.js';

// Builds a labeled contact sheet of every face crop so we can eyeball calibration.
const COLS = 10;
const CELL = 150;       // thumb size in the contact sheet
const PAD = 4;
const LABEL_H = 26;
const TILE = CELL + LABEL_H;

const rows = Math.ceil(FACES.length / COLS);
const W = COLS * (CELL + PAD) + PAD;
const H = rows * (TILE + PAD) + PAD;

const half = BOX / 2;
const src = sharp(SRC);
const meta = await src.metadata();

function clamp(v, max) { return Math.max(0, Math.min(v, max)); }

const composites = [];
for (let i = 0; i < FACES.length; i++) {
  const f = FACES[i];
  let left = Math.round(f.x - half);
  let top = Math.round(f.y - half);
  left = clamp(left, meta.width - BOX);
  top = clamp(top, meta.height - BOX);

  const thumb = await sharp(SRC)
    .extract({ left, top, width: BOX, height: BOX })
    .resize(CELL, CELL)
    .png()
    .toBuffer();

  const label = Buffer.from(
    `<svg width="${CELL}" height="${LABEL_H}"><rect width="100%" height="100%" fill="#1d212d"/><text x="${CELL / 2}" y="${LABEL_H - 8}" font-family="monospace" font-size="13" fill="#e8ecf4" text-anchor="middle">${f.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</text></svg>`
  );

  const gx = i % COLS;
  const gy = Math.floor(i / COLS);
  const x = PAD + gx * (CELL + PAD);
  const y = PAD + gy * (TILE + PAD);
  composites.push({ input: thumb, left: x, top: y });
  composites.push({ input: label, left: x, top: y + CELL });
}

await sharp({ create: { width: W, height: H, channels: 3, background: '#0f1117' } })
  .composite(composites)
  .png()
  .toFile('tools/_contact.png');

console.log(`Contact sheet: ${FACES.length} faces, ${W}x${H}`);
