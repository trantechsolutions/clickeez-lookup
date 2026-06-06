// Coordinate map for cropping faces from the SERIES 1 COLLECTOR'S GUIDE scan
// (tools/collector-guide.jpg, 2496x1516). The guide is NOT a single uniform grid:
// each colored block (Strawberry, Cozy, Kawaii, Celestial, Epic, Legendary, X-clusive)
// has its own column-X / row-Y origins, and the narrow side columns have irregular
// per-cell Y spacing. We calibrate one block at a time with tools/sweep.mjs.
//
// IMPORTANT: crop.mjs MERGES into src/images.json. So FACES below holds ONLY the
// block(s) currently being (re)calibrated. The Strawberry + Cozy Garden crops are
// already good (user-confirmed) and live in the manifest/PNGs already — they are
// intentionally NOT listed here so a re-crop never disturbs them.

export const SRC = 'tools/collector-guide.jpg';
export const BOX = 104; // tile-square is ~105px across every block (Strawberry-good used this)

// ---- Kawaii Dreams (blue/purple block, right half) ----
// Two main columns + one narrow side column. Main rows share Y; the side column has
// irregular per-cell Y. Centers read off the 3x box overlay (node tools/boxoverlay.mjs)
// — each box must bound its rounded tile. Don't extrapolate; verify all four rows.
const K_COLA = 1320, K_COLB = 1530;
const K_R1 = 282, K_R2 = 444, K_R3 = 606, K_R4 = 768;
const K_SIDE = 1715;

const KAWAII = [
  // main column A
  { name: 'rainz',      x: K_COLA, y: K_R1 },
  { name: 'DREAMYY~',   x: K_COLA, y: K_R2 },
  { name: 'angel.eyes', x: K_COLA, y: K_R3 },
  { name: 'NYAA~!!',    x: K_COLA, y: K_R4 },
  // main column B
  { name: 'Ra1n_Bows',  x: K_COLB, y: K_R1 },
  { name: 'happyval<3', x: K_COLB, y: K_R2 },
  { name: 'patchy:>',   x: K_COLB, y: K_R3 },
  { name: 'CYBERPINK',  x: K_COLB, y: K_R4 },
  // side column (narrower tiles, irregular vertical spacing — faces sit above labels)
  { name: 'beau.x',     x: K_SIDE, y: 238, box: 90 },
  { name: 'goth.qt',    x: K_SIDE, y: 370, box: 90 },
  { name: 'Yume',       x: K_SIDE, y: 540, box: 90 },
  { name: '~Meowch!~',  x: K_SIDE, y: 700, box: 90 },
];

// ---- Celestial Sky (purple block, far right) ----
// Two main columns + one TALL side column (5 cells: SUPAR-STAR / x.Night /
// NIGHTLIGHT / Estella / COSMOS). Centers read off the 3x overlay.
const C_COLA = 1971, C_COLB = 2137;
const C_R1 = 278, C_R2 = 440, C_R3 = 602, C_R4 = 764;
const C_SIDE = 2330;

const CELESTIAL = [
  // main column A
  { name: 'Day.x',         x: C_COLA, y: C_R1 },
  { name: 'z_STORM_z',     x: C_COLA, y: C_R2 },
  { name: 'xlunar_sky',    x: C_COLA, y: C_R3 },
  { name: 'Invasion!!',    x: C_COLA, y: C_R4 },
  // main column B
  { name: 'x.Twilight.x',  x: C_COLB, y: C_R1 },
  { name: 'Falling_Stars', x: C_COLB, y: C_R2 },
  { name: 'Star_STRUCK',   x: C_COLB, y: C_R3 },
  { name: 'Saturnz',       x: C_COLB, y: C_R4 },
  // side column (5 cells, irregular vertical spacing). Centers reconciled (median)
  // from 3 independent calibration agents — see calibrate-celestial-side workflow.
  { name: 'SUPAR-STAR', x: 2334, y: 248, box: 90 },
  { name: 'x.Night',    x: 2336, y: 432, box: 90 },
  { name: 'NIGHTLIGHT', x: 2350, y: 592, box: 90 },
  { name: 'Estella',    x: 2350, y: 746, box: 90 },
  { name: 'COSMOS',     x: 2336, y: 905, box: 90 },
];

export const FACES = CELESTIAL;
