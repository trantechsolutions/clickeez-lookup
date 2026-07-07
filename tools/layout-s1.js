// Coordinate map for RE-cropping SERIES 1 faces from the cleaner re-scan
// (tools/collector-guide-s1.jpg, 2048x1234) — flatter/less-creased than the original
// collector-guide.jpg. Same block-by-block calibration approach as tools/layout.js.
//
// Verify with:  node tools/verify-s1.mjs   (writes _overlay-s1.png + _contact-s1.png)
// Then crop:    node tools/crop-s1.mjs      (overwrites public/clickeez PNGs, keys unchanged)
//
// Names are EXACT sections.js (SERIES_1_SECTIONS) strings so crop overwrites the same
// slugs already in src/images.json — no manifest churn, just fresher pixels.

export const SRC = 'tools/collector-guide-s1.jpg';
export const BOX = 106;

// ---- Strawberry Treats (pink block, left) — 3 cols x 4 rows ----
const ST_C1 = 63, ST_C2 = 220, ST_C3 = 391;
const ST_R1 = 243, ST_R2 = 382, ST_R3 = 524, ST_R4 = 664;
const STRAWBERRY = [
  { name: 'NeoGelato.xx',  x: ST_C1, y: ST_R1 },
  { name: 'Sprinkles.x',   x: ST_C2, y: ST_R1 },
  { name: 'BerryWafflz',   x: ST_C3, y: ST_R1 },
  { name: 'Swirlybunny',   x: ST_C1, y: ST_R2 },
  { name: 'YUMMYberry!',   x: ST_C2, y: ST_R2 },
  { name: 'ChocoxPuddin',  x: ST_C3, y: ST_R2 },
  { name: 'STRAW_BERRY',   x: ST_C1, y: ST_R3 },
  { name: 'StrwbrrSWIRL',  x: ST_C2, y: ST_R3 },
  { name: 'Berry',         x: ST_C3, y: ST_R3 },
  { name: 'StrwBryBear',   x: ST_C1, y: ST_R4 },
  { name: 'SillyBerry123', x: ST_C2, y: ST_R4 },
  { name: 'xCHOCO_dip',    x: ST_C3, y: ST_R4 },
];

// ---- Cozy Garden (green block) — 2 main cols + 1 side col ----
const CG_C1 = 558, CG_C2 = 722, CG_SIDE = 911;
const CG_R1 = 243, CG_R2 = 382, CG_R3 = 524, CG_R4 = 664;
const COZY = [
  { name: 'Flowacrown',    x: CG_C1, y: CG_R1 },
  { name: 'PrissyRose1',   x: CG_C2, y: CG_R1 },
  { name: '^PicnicParty^', x: CG_SIDE, y: 218 },
  { name: 'Purplepupxx',   x: CG_C1, y: CG_R2 },
  { name: 'butterflyx',    x: CG_C2, y: CG_R2 },
  { name: 'IAMGreenDog',   x: CG_SIDE, y: 362 },
  { name: 'Mshrm_Deer',    x: CG_C1, y: CG_R3 },
  { name: 'PetalPowerz',   x: CG_C2, y: CG_R3 },
  { name: 'SAKURA_KITTY',  x: CG_SIDE, y: 504 },
  { name: 'Shy',           x: CG_C1, y: CG_R4 },
  { name: 'bun^-^',        x: CG_C2, y: CG_R4 },
  { name: 'honeyB',        x: CG_SIDE, y: 646 },
];

// ---- Kawaii Dreams (teal block) — 2 main cols + 1 side col ----
const KD_C1 = 1080, KD_C2 = 1244, KD_SIDE = 1418;
const KD_R1 = 243, KD_R2 = 382, KD_R3 = 524, KD_R4 = 664;
const KAWAII = [
  { name: 'rainz',       x: KD_C1, y: KD_R1 },
  { name: 'Ra1n_Bows',   x: KD_C2, y: KD_R1 },
  { name: 'beau.x',      x: KD_SIDE, y: 210 },
  { name: 'DREAMYY~',    x: KD_C1, y: KD_R2 },
  { name: 'happyval<3',  x: KD_C2, y: KD_R2 },
  { name: 'goth.qt',     x: KD_SIDE, y: 354 },
  { name: 'angel.eyes',  x: KD_C1, y: KD_R3 },
  { name: 'patchy:>',    x: KD_C2, y: KD_R3 },
  { name: 'Yume',        x: KD_SIDE, y: 496 },
  { name: 'NYAA~!!',     x: KD_C1, y: KD_R4 },
  { name: 'CYBERPINK',   x: KD_C2, y: KD_R4 },
  { name: '~Meowch!~',   x: KD_SIDE, y: 638 },
];

// ---- Celestial Sky (purple block, far right) — 2 main cols + 5-cell side col ----
const CS_C1 = 1592, CS_C2 = 1756, CS_SIDE = 1946;
const CS_R1 = 243, CS_R2 = 382, CS_R3 = 524, CS_R4 = 664;
const CELESTIAL = [
  { name: 'Day.x',         x: CS_C1, y: CS_R1 },
  { name: 'x.Twilight.x',  x: CS_C2, y: CS_R1 },
  { name: 'z_STORM_z',     x: CS_C1, y: CS_R2 },
  { name: 'Falling_Stars', x: CS_C2, y: CS_R2 },
  { name: 'xlunar_sky',    x: CS_C1, y: CS_R3 },
  { name: 'Star_STRUCK',   x: CS_C2, y: CS_R3 },
  { name: 'Invasion!!',    x: CS_C1, y: CS_R4 },
  { name: 'Saturnz',       x: CS_C2, y: CS_R4 },
  // side column (5 cells, irregular vertical spacing)
  { name: 'SUPAR-STAR', x: CS_SIDE, y: 190 },
  { name: 'x.Night',    x: CS_SIDE, y: 328 },
  { name: 'NIGHTLIGHT', x: CS_SIDE, y: 455 },
  { name: 'Estella',    x: CS_SIDE, y: 583 },
  { name: 'COSMOS',     x: CS_SIDE, y: 710 },
];

// ---- Epic (bottom left) — 6 cols x 2 rows (head crops) ----
const EP_C1 = 63, EP_C2 = 220, EP_C3 = 391, EP_C4 = 558, EP_C5 = 722, EP_C6 = 906;
const EP_R1 = 871, EP_R2 = 1101;
const EPIC = [
  { name: '*ShiningStar*',  x: EP_C1, y: EP_R1 },
  { name: '*StarExplorer*', x: EP_C2, y: EP_R1 },
  { name: '*StarDreamer*',  x: EP_C3, y: EP_R1 },
  { name: 'Giggly-bunny',   x: EP_C4, y: EP_R1 },
  { name: 'Cuddly-bear',    x: EP_C5, y: EP_R1 },
  { name: 'TECHY-C4T',      x: EP_C6, y: EP_R1 },
  { name: 'Flutterdeery',   x: EP_C1, y: EP_R2 },
  { name: 'BumbleKitty',    x: EP_C2, y: EP_R2 },
  { name: 'Ladybunny',      x: EP_C3, y: EP_R2 },
  { name: 'StrwBrryJAM',    x: EP_C4, y: EP_R2 },
  { name: 'StrwBrryCAKE',   x: EP_C5, y: EP_R2 },
  { name: 'StrwBrryMILK',   x: EP_C6, y: EP_R2 },
];

// ---- X-Clusive (middle row of 5) ----
const XC = [
  { name: '^.Sky.^',     x: 1080, y: 786 },
  { name: 'MistiCloud',  x: 1244, y: 786 },
  { name: 'V.Dreams.V',  x: 1413, y: 786 },
  { name: '<.Garden.<',  x: 1582, y: 786 },
  { name: '>.Treats.>',  x: 1751, y: 786 },
];

// ---- Legendary (2x2) ----
const LEG = [
  { name: 'berry_LEGEND',  x: 1080, y: 988 },
  { name: 'sky_LEGEND',    x: 1244, y: 988 },
  { name: 'cozy_LEGEND',   x: 1080, y: 1121 },
  { name: 'kawaii_LEGEND', x: 1244, y: 1121 },
];

// ---- Limited Edition (single figurine) ----
const LIMITED = [
  { name: 'The_Lucky_Bunny', x: 1454, y: 1024 },
];

export const FACES = [
  ...STRAWBERRY, ...COZY, ...KAWAII, ...CELESTIAL, ...EPIC, ...XC, ...LEG, ...LIMITED,
];
