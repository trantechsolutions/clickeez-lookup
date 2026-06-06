import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { SRC, BOX, FACES } from './layout.js';

// Crops each face to public/clickeez/<slug>.png and writes an image manifest
// keyed on the EXACT names used in the spreadsheet data (src/data.json), so the
// app can look up an image by the same name it already has.

const OUT_DIR = 'public/clickeez';
const half = BOX / 2;

// Sheet label -> spreadsheet data name, where they differ.
const LABEL_TO_DATA = {
  'IAmGreenDog': 'IAMGreenDog', // sheet capitalizes differently than data
};

// Turn a character name into a filesystem-safe slug (names contain . ! < > ^ ~ : etc.)
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
const clamp = (v, max) => Math.max(0, Math.min(v, max));

// MERGE into the existing manifest rather than overwrite. FACES holds only the
// blocks we are (re)calibrating; the strawberry/garden crops the user confirmed
// good are NOT in FACES, so leaving the manifest intact preserves their keys and
// their PNGs are never touched. Only re-run crop on the broken blocks.
const MANIFEST_PATH = 'src/images.json';
const manifest = fs.existsSync(MANIFEST_PATH)
  ? JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'))
  : {};
let count = 0;

for (const f of FACES) {
  const dataName = LABEL_TO_DATA[f.name] || f.name;
  const file = slug(dataName) + '.png';
  const box = f.box || BOX; // per-face box override (side columns may differ)
  const left = clamp(Math.round(f.x - box / 2), meta.width - box);
  const top = clamp(Math.round(f.y - box / 2), meta.height - box);

  await sharp(SRC)
    .extract({ left, top, width: box, height: box })
    .resize(220, 220)
    .png()
    .toFile(path.join(OUT_DIR, file));

  manifest[dataName] = `/clickeez/${file}`;
  count++;
}

fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
console.log(`Cropped ${count} faces -> ${OUT_DIR}`);
console.log(`Manifest: ${MANIFEST_PATH} (${Object.keys(manifest).length} keys total)`);
