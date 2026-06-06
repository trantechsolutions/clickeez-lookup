import sharp from 'sharp';
import { SRC, BOX, FACES } from './layout.js';

// Crops the bounding region of the current FACES, then draws each crop box so we
// can SEE whether boxes bound the printed faces in-context.
let minX = 1e9, minY = 1e9, maxX = 0, maxY = 0;
for (const f of FACES) {
  const box = f.box || BOX;
  const l = Math.round(f.x - box / 2), t = Math.round(f.y - box / 2);
  minX = Math.min(minX, l); minY = Math.min(minY, t);
  maxX = Math.max(maxX, l + box); maxY = Math.max(maxY, t + box);
}
const meta = await sharp(SRC).metadata();
const pad = 30;
const left = Math.max(0, minX - pad), top = Math.max(0, minY - pad);
const w = Math.min(meta.width - left, maxX - minX + pad * 2);
const h = Math.min(meta.height - top, maxY - minY + pad * 2);
// Fixed 3x zoom — high enough to read tile borders honestly. (1.6x lied.)
const scale = +(process.argv[2] || 3);

let rects = '';
for (const f of FACES) {
  const box = f.box || BOX;
  const l = (Math.round(f.x - box / 2) - left) * scale, t = (Math.round(f.y - box / 2) - top) * scale;
  rects += `<rect x="${l}" y="${t}" width="${box * scale}" height="${box * scale}" fill="none" stroke="#ff0000" stroke-width="3"/>`;
  rects += `<circle cx="${(f.x - left) * scale}" cy="${(f.y - top) * scale}" r="3" fill="#ff0000"/>`;
}
const W = Math.round(w * scale), H = Math.round(h * scale);
const svg = Buffer.from(`<svg width="${W}" height="${H}">${rects}</svg>`);
await sharp(SRC)
  .extract({ left, top, width: w, height: h })
  .resize(W, H)
  .composite([{ input: svg, left: 0, top: 0 }])
  .png().toFile('tools/_boxes.png');
console.log(`boxes overlay: region ${left},${top} ${w}x${h} scale ${scale}`);
