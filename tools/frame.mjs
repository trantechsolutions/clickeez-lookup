import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { SRC, FRAMES, LABEL_TO_DATA } from './frames.js';

// Writes each LOCKED Swirlybunny-frame crop to public/clickeez/<slug>.png and
// MERGES src/images.json (keyed on the spreadsheet data name). Only the blocks
// listed in FRAMES are (re)written; confirmed-good crops are left untouched.

const OUT_DIR = 'public/clickeez';
const MANIFEST_PATH = 'src/images.json';

function slug(name) {
  return name
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/[!^~]/g, '_')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '') || 'unnamed';
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const meta = await sharp(SRC).metadata();
const clamp = (v, mx) => Math.max(0, Math.min(v, mx));
const manifest = fs.existsSync(MANIFEST_PATH)
  ? JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'))
  : {};

let count = 0;
for (const f of FRAMES) {
  const dataName = LABEL_TO_DATA[f.name] || f.name;
  const file = slug(dataName) + '.png';
  const left = clamp(Math.round(f.cx - f.box / 2), meta.width - f.box);
  const top = clamp(Math.round(f.cy - f.box / 2), meta.height - f.box);
  await sharp(SRC)
    .extract({ left, top, width: f.box, height: f.box })
    .resize(220, 220)
    .png()
    .toFile(path.join(OUT_DIR, file));
  manifest[dataName] = `/clickeez/${file}`;
  count++;
}

fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
console.log(`Framed ${count} crops -> ${OUT_DIR}`);
console.log(`Manifest: ${MANIFEST_PATH} (${Object.keys(manifest).length} keys total)`);
