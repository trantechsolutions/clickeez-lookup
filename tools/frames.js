// LOCKED per-character "Swirlybunny frame" crops from the SERIES 1 COLLECTOR'S
// GUIDE scan (tools/collector-guide.jpg, 2496x1516).
//
// The frame = the rounded character TILE in the upper portion + its printed
// "● name" label in the lower portion, matching the user-blessed gold standard
// public/clickeez/Swirlybunny.png (tile ~0.40 from top, name ~0.86 from top).
//
// This is NOT a uniform grid. Each entry is an INDIVIDUALLY LOCKED crop box:
//   { name, cx, cy, box }  ->  square box of side `box` centered at (cx, cy),
//   resized to 220x220.
// cx/cy are the CROP-BOX center (already shifted down ~0.10*box from the tile
// center so the name label is captured). Long, left-aligned names that run past
// the tile get a wider box + small right shift so the full name + bullet fit
// (e.g. Falling_Stars). Side-column cells have irregular spacing and are each
// calibrated by eye against the contact sheet (node tools/framesheet.mjs).
//
// Anchor geometry (derived by reproducing Swirlybunny from the guide):
//   tile size T ~ 122 (main) ; box ~ 1.42*T ~ 178-194 ; cy = tileCy + ~0.10*box
// Accept gate per tile: full rounded tile centered horizontally in the upper
// portion + COMPLETE name (bullet through last glyph, unclipped) in the lower
// portion, at Swirlybunny proportions.

export const SRC = 'tools/collector-guide.jpg';

// Sheet label -> spreadsheet data name, where they differ.
export const LABEL_TO_DATA = {
  'IAmGreenDog': 'IAMGreenDog',
};

// ---- Kawaii Dreams (blue/purple block) — main columns A/B ----
// tile centers col A x=1320, col B x=1530 ; rows y=282/444/606/768
// frame: box 190, crop-center cx = tileCx+4, cy = tileCy+19
const KAWAII_MAIN = [
  { name: 'rainz',      cx: 1324, cy: 301, box: 190 },
  { name: 'DREAMYY~',   cx: 1324, cy: 463, box: 190 },
  { name: 'angel.eyes', cx: 1324, cy: 625, box: 190 },
  { name: 'NYAA~!!',    cx: 1324, cy: 787, box: 190 },
  { name: 'Ra1n_Bows',  cx: 1534, cy: 301, box: 190 },
  { name: 'happyval<3', cx: 1534, cy: 463, box: 190 },
  { name: 'patchy:>',   cx: 1534, cy: 625, box: 190 },
  { name: 'CYBERPINK',  cx: 1534, cy: 787, box: 190 },
];

// ---- Celestial Sky (purple block) — main columns A/B ----
// tile centers col A x=1971, col B x=2137 ; rows y=278/440/602/764
const CELESTIAL_MAIN = [
  { name: 'Day.x',         cx: 1975, cy: 297, box: 190 },
  { name: 'z_STORM_z',     cx: 1975, cy: 459, box: 190 },
  { name: 'xlunar_sky',    cx: 1975, cy: 621, box: 190 },
  { name: 'Invasion!!',    cx: 1975, cy: 783, box: 190 },
  { name: 'x.Twilight.x',  cx: 2141, cy: 297, box: 190 },
  { name: 'Falling_Stars', cx: 2145, cy: 460, box: 206 }, // long name -> wider box + right shift
  { name: 'Star_STRUCK',   cx: 2141, cy: 621, box: 190 },
  { name: 'Saturnz',       cx: 2141, cy: 783, box: 190 },
];

// ---- Side columns — INDIVIDUALLY calibrated (irregular spacing) ----
// Seeded from face centers; cy nudged down to include each name. Verify + lock
// each via tools/framesheet.mjs before running tools/frame.mjs.
// Side tiles are smaller than main and names sit ~58px below the face center.
// Box is sized to fit the NAME (long names -> wider box); cy = fy + 58 - 0.35*box
// keeps face upper, name at ~0.85 of the frame.
const KAWAII_SIDE = [
  { name: 'beau.x',    cx: 1718, cy: 249, box: 150 },
  { name: 'goth.qt',   cx: 1718, cy: 389, box: 150 },
  { name: 'Yume',      cx: 1718, cy: 564, box: 150 },
  { name: '~Meowch!~', cx: 1730, cy: 728, box: 186 }, // long name -> box centered on name, widened; cy clears Yume label above
];
const CELESTIAL_SIDE = [
  { name: 'SUPAR-STAR', cx: 2352, cy: 244, box: 200 }, // long name -> box centered on name, widened
  { name: 'x.Night',    cx: 2336, cy: 437, box: 150 },
  { name: 'NIGHTLIGHT', cx: 2352, cy: 590, box: 174 },
  { name: 'Estella',    cx: 2350, cy: 751, box: 150 },
  { name: 'COSMOS',     cx: 2336, cy: 910, box: 150 },
];

// ---- Epic (pastel block, bottom-left) ----
// Full-figure characters; names sit far below the tall figures. User chose
// FULL-FIGURE framing: box 250 shows the whole character (bow + outfit) + name,
// at the cost of a faint neighbour sliver at the edges (column pitch is ~185).
// 6 columns x 2 rows. cols x = 115/302/485/670/855/1040 ; row1 cy 1100, row2 1385.
const EPIC = [
  { name: '*ShiningStar*',  cx: 115,  cy: 1100, box: 250 },
  { name: '*StarExplorer*', cx: 302,  cy: 1100, box: 250 },
  { name: '*StarDreamer*',  cx: 485,  cy: 1100, box: 250 },
  { name: 'Giggly-bunny',   cx: 670,  cy: 1100, box: 250 },
  { name: 'Cuddly-bear',    cx: 855,  cy: 1100, box: 250 },
  { name: 'TECHY-C4T',      cx: 1040, cy: 1100, box: 250 },
  { name: 'Flutterdeery',   cx: 115,  cy: 1385, box: 250 },
  { name: 'BumbleKitty',    cx: 302,  cy: 1385, box: 250 },
  { name: 'Ladybunny',      cx: 485,  cy: 1385, box: 250 },
  { name: 'StrwBrryJAM',    cx: 670,  cy: 1385, box: 250 },
  { name: 'StrwBrryCAKE',   cx: 855,  cy: 1385, box: 250 },
  { name: 'StrwBrryMILK',   cx: 1040, cy: 1385, box: 250 },
];

// ---- X-clusive (center block) — single row of 5 normal face tiles ----
// Names sit ~90px below face center (like main columns). Individually located.
const XCLUSIVE = [
  { name: '^.Sky.^',    cx: 1330, cy: 985, box: 190 },
  { name: 'MistiCloud', cx: 1530, cy: 985, box: 190 },
  { name: 'V.Dreams.V', cx: 1755, cy: 982, box: 190 },
  { name: '<.Garden.<', cx: 1945, cy: 982, box: 190 },
  { name: '>.Treats.>', cx: 2130, cy: 982, box: 190 },
];

// ---- Legendary (center-bottom 2x2) — normal face tiles, name ~75px below ----
const LEGENDARY = [
  { name: 'berry_LEGEND',  cx: 1335, cy: 1245, box: 190 },
  { name: 'sky_LEGEND',    cx: 1530, cy: 1245, box: 190 },
  { name: 'cozy_LEGEND',   cx: 1335, cy: 1400, box: 190 },
  { name: 'kawaii_LEGEND', cx: 1532, cy: 1400, box: 200 }, // longest name -> wider box
];

// ---- Limited Edition — single tall full-figure tile ----
// Full figure shown; box shifted left + sized to clear the "WILL YOU FIND IT?"
// play-arrow graphic on the right (starts ~x1880) while keeping the full name.
const LIMITED = [
  { name: 'The_Lucky_Bunny', cx: 1747, cy: 1328, box: 258 },
];

// FRAMES holds ONLY the blocks being (re)cut to the Swirlybunny frame.
// frame.mjs MERGES into src/images.json, so confirmed-good crops not listed
// here keep their existing PNGs untouched.
export const FRAMES = [
  ...KAWAII_MAIN,
  ...CELESTIAL_MAIN,
  ...KAWAII_SIDE,
  ...CELESTIAL_SIDE,
  ...EPIC,
  ...XCLUSIVE,
  ...LEGENDARY,
  ...LIMITED,
];
