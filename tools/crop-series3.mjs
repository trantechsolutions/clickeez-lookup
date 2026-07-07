import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { SRC, BOX, FACES } from './layout-series3.js';

// Series 3 face cropper — same behavior as tools/crop.mjs but sourced from the
// Series 3 scan (tools/collector-guide-s3.jpg) and its layout-series3.js map.
// Crops each face to public/clickeez/<slug>.png and MERGES into src/images.json,
// keyed on the EXACT names in sections.js so the app resolves images by that string.

const OUT_DIR = 'public/clickeez';
const MANIFEST_PATH = 'src/images.json';

// Sheet label -> sections.js name, where they differ (add as calibration surfaces any).
const LABEL_TO_DATA = {};

// Turn a character name into a filesystem-safe slug (names contain . ! < > ^ ~ : / etc.)
function slug(name) {
  return name
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/[!^~#%&+]/g, '_')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '') || 'unnamed';
}

if (!fs.existsSync(SRC)) {
  console.error(`Missing scan: ${SRC}\nDrop the Series 3 collector-guide scan there, then re-run.`);
  process.exit(1);
}
if (FACES.length === 0) {
  console.error('layout-series3.js FACES is empty — calibrate coordinates first.');
  process.exit(1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const meta = await sharp(SRC).metadata();
const clamp = (v, max) => Math.max(0, Math.min(v, max));

const manifest = fs.existsSync(MANIFEST_PATH)
  ? JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'))
  : {};
let count = 0;

for (const f of FACES) {
  const dataName = LABEL_TO_DATA[f.name] || f.name;
  const file = slug(dataName) + '.png';
  const box = f.box || BOX;
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
console.log(`Cropped ${count} Series 3 faces -> ${OUT_DIR}`);
console.log(`Manifest: ${MANIFEST_PATH} (${Object.keys(manifest).length} keys total)`);
