// Coordinate map for cropping faces from the BOX PHOTO guide (tools/clickeez_hires.avif, 2000x2000).
// The box back-panel guide is a near-uniform grid: 12 columns, ~87px pitch, col0 center x=335;
// 4 COMMON rows (one color-group each) at y = 890/990/1090/1190 (pitch 100).
// Each row lists characters in the same left-to-right order as the fold-out groups.

export const SRC = 'tools/clickeez_hires.avif';
export const BOX = 84;

const COL0 = 335;
const COLP = 87;
const colX = (c) => Math.round(COL0 + c * COLP);

// Build a row of names across columns starting at column 0.
const row = (y, names) => names.map((name, c) => ({ name, x: colX(c), y }));

export const FACES = [
  // ---- Row 1 (pink / Strawberry Treats) y=890 ----
  ...row(890, [
    'NeoGelato.xx', 'Sprinkles.x', 'BerryWafflz', 'Swirlybunny', 'YUMMYberry!', 'ChocoxPuddin',
    'STRAW_BERRY', 'StrwbrrSWIRL', 'Berry', 'StrwBryBear', 'SillyBerry123', 'xCHOCO_dip',
  ]),

  // ---- Row 2 (green / Cozy Garden) y=990 ----
  ...row(990, [
    'Flowacrown', 'PrissyRose1', '^PicnicParty^', 'Purplepupxx', 'butterflyx', 'IAmGreenDog',
    'Mshrm_Deer', 'PetalPowerz', 'SAKURA_KITTY', 'Shy', 'bun^-^', 'honeyB',
  ]),

  // ---- Row 3 (blue / Kawaii Dreams) y=1090 ----
  ...row(1090, [
    'rainz', 'Ra1n_Bows', 'beau.x', 'DREAMYY~', 'happyval<3', 'goth.qt',
    'angel.eyes', 'patchy:>', 'Yume', 'NYAA~!!', 'CYBERPINK', '~Meowch!~',
  ]),

  // ---- Row 4 (purple / Celestial Sky) y=1190 ----
  ...row(1190, [
    'Day.x', 'x.Twilight.x', 'x.Night', 'z_STORM_z', 'Falling_Stars', 'NIGHTLIGHT',
    'xlunar_sky', 'Star_STRUCK', 'Estella', 'Invasion!!', 'Saturnz', 'COSMOS',
  ]),

  // SUPAR-STAR is the Celestial group's odd-one-out — confirm position during review.
  { name: 'SUPAR-STAR', x: colX(11), y: 1090 },
];
