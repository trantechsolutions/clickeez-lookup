import sharp from 'sharp';
import { SRC, FRAMES } from './frames.js';

// Contact sheet of the locked frame crops, name burned into the corner, so each
// crop can be verified against the accept gate (full tile + complete name).
// Optional arg: substring filter, e.g. `node tools/framesheet.mjs side`.
const filter = process.argv[2];
const list = filter ? FRAMES.filter((f) => f.name.toLowerCase().includes(filter.toLowerCase())) : FRAMES;

const COLS = 8, CELL = 210, PAD = 6, LBL = 18;
const meta = await sharp(SRC).metadata();
const clamp = (v, mx) => Math.max(0, Math.min(v, mx));
const rows = Math.ceil(list.length / COLS);
const W = COLS * (CELL + PAD) + PAD;
const H = rows * (CELL + LBL + PAD) + PAD;

const comp = [];
for (let i = 0; i < list.length; i++) {
  const f = list[i];
  const left = clamp(Math.round(f.cx - f.box / 2), meta.width - f.box);
  const top = clamp(Math.round(f.cy - f.box / 2), meta.height - f.box);
  const buf = await sharp(SRC)
    .extract({ left, top, width: f.box, height: f.box })
    .resize(CELL, CELL).png().toBuffer();
  const esc = f.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const lbl = Buffer.from(
    `<svg width="${CELL}" height="${LBL}"><rect width="100%" height="100%" fill="#111"/>` +
    `<text x="3" y="14" font-family="monospace" font-size="11" fill="#0f6">${i} ${esc}  b${f.box}</text></svg>`);
  const gx = i % COLS, gy = Math.floor(i / COLS);
  const x = PAD + gx * (CELL + PAD), y = PAD + gy * (CELL + LBL + PAD);
  comp.push({ input: buf, left: x, top: y }, { input: lbl, left: x, top: y + CELL });
}
await sharp({ create: { width: W, height: H, channels: 3, background: '#0f1117' } })
  .composite(comp).png().toFile('tools/_framesheet.png');
console.log(`Frame sheet: ${list.length} tiles -> tools/_framesheet.png`);
