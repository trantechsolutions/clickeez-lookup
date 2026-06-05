import sharp from 'sharp';
import { SRC, BOX, FACES } from './layout.js';

// Draws every crop box (stroke only) + name onto a downscaled copy of the FULL
// source image, so drift is read directly against ground truth — no re-cropping.
const SCALE = 0.5;
const src = sharp(SRC);
const meta = await src.metadata();
const W = Math.round(meta.width * SCALE);
const H = Math.round(meta.height * SCALE);
const half = BOX / 2;

const rects = FACES.map((f, i) => {
  const x = (f.x - half) * SCALE;
  const y = (f.y - half) * SCALE;
  const s = BOX * SCALE;
  const esc = f.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${s.toFixed(1)}" height="${s.toFixed(1)}" fill="none" stroke="#00ff66" stroke-width="1.5"/>` +
         `<text x="${(x + 2).toFixed(1)}" y="${(y + 11).toFixed(1)}" font-family="monospace" font-size="9" fill="#00ff66">${i}:${esc}</text>`;
}).join('');

const svg = Buffer.from(`<svg width="${W}" height="${H}">${rects}</svg>`);

await src
  .resize(W, H)
  .composite([{ input: svg, left: 0, top: 0 }])
  .png()
  .toFile('tools/_overlay.png');

console.log(`Overlay: ${FACES.length} boxes on ${W}x${H}`);
