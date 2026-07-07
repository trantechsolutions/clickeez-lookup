// Coordinate map for cropping faces from the SERIES 3 "Bubble Pops" COLLECTOR'S GUIDE
// scan (tools/collector-guide-s3.jpg, 2048x1256). Same approach as tools/layout.js:
// the guide is NOT one uniform grid — each colored block has its own column-X / row-Y
// origins, and several blocks have a narrow side column with irregular per-cell Y.
//
// Verify with:  node tools/verify-s3.mjs   (writes _overlay-s3.png + _contact-s3.png)
// Then crop:    node tools/crop-series3.mjs
//
// crop-series3.mjs MERGES into src/images.json keyed on the EXACT names in sections.js
// (SERIES_3_SECTIONS), so the app resolves each face by the same string the checklist uses.

export const SRC = 'tools/collector-guide-s3.jpg';
export const BOX = 106;

// ---- Magical Glow (blue block, far left) — 3 cols x 4 rows ----
const MG_C1 = 66, MG_C2 = 222, MG_C3 = 392;
const MG_R1 = 196, MG_R2 = 340, MG_R3 = 486, MG_R4 = 630;
const MAGICAL = [
  { name: 'IAmBlueMouse',    x: MG_C1, y: MG_R1 },
  { name: 'Twinkle!',        x: MG_C2, y: MG_R1 },
  { name: '*milky*sl4y*',    x: MG_C3, y: MG_R1 },
  { name: 'CASTaSPELL',      x: MG_C1, y: MG_R2 },
  { name: 'Squ33ky',         x: MG_C2, y: MG_R2 },
  { name: 'Sparkle!',        x: MG_C3, y: MG_R2 },
  { name: '.o*.GLIMMER.*o.', x: MG_C1, y: MG_R3 },
  { name: 'Tadaaaa!!',       x: MG_C2, y: MG_R3 },
  { name: 'Crystal.x',       x: MG_C3, y: MG_R3 },
  { name: 'ABRACADABRA!',    x: MG_C1, y: MG_R4 },
  { name: '-.CHARM.-',       x: MG_C2, y: MG_R4 },
  { name: 'Shine!',          x: MG_C3, y: MG_R4 },
];

// ---- Baked Goodies (peach block) — 2 main cols + 1 side col ----
const BG_C1 = 574, BG_C2 = 733, BG_SIDE = 906;
const BG_R1 = 196, BG_R2 = 340, BG_R3 = 486, BG_R4 = 630;
const BAKED = [
  { name: 'SW~RLY',           x: BG_C1, y: BG_R1 },
  { name: 'mooOOOse',         x: BG_C2, y: BG_R1 },
  { name: 'W4FFLES',          x: BG_SIDE, y: 184 },
  { name: 'C00kieeeee~',      x: BG_C1, y: BG_R2 },
  { name: '..jammy.cowkie..', x: BG_C2, y: BG_R2 },
  { name: 'Top-Tier',         x: BG_SIDE, y: 336 },
  { name: 'on~a~roll',        x: BG_C1, y: BG_R3 },
  { name: 'BirthYAY<3',       x: BG_C2, y: BG_R3 },
  { name: 'Toast-Ouioui',     x: BG_SIDE, y: 486 },
  { name: 'sweetie-roll',     x: BG_C1, y: BG_R4 },
  { name: 'cutie~puff',       x: BG_C2, y: BG_R4 },
  { name: 'Cake-POP!!',       x: BG_SIDE, y: 622 },
];

// ---- Forest Pals (green block) — 2 main cols + 1 side col ----
const FP_C1 = 1080, FP_C2 = 1239, FP_SIDE = 1418;
const FP_R1 = 196, FP_R2 = 340, FP_R3 = 486, FP_R4 = 630;
const FOREST = [
  { name: '!Mossy',       x: FP_C1, y: FP_R1 },
  { name: 'forestberry',  x: FP_C2, y: FP_R1 },
  { name: '~!FROGGY!~',   x: FP_SIDE, y: 172 },
  { name: 'MushMouse',    x: FP_C1, y: FP_R2 },
  { name: 'FOXY',         x: FP_C2, y: FP_R2 },
  { name: 'D33RY',        x: FP_SIDE, y: 330 },
  { name: 'Axo-Lottie',   x: FP_C1, y: FP_R3 },
  { name: 'some.grass',   x: FP_C2, y: FP_R3 },
  { name: '*Bubbles*',    x: FP_SIDE, y: 480 },
  { name: 'acorn.<3',     x: FP_C1, y: FP_R4 },
  { name: 'Lily.paddily', x: FP_C2, y: FP_R4 },
  { name: 'Annie.x',      x: FP_SIDE, y: 606 },
];

// ---- Pink Life (pink block, far right) — 2 main cols + side col + 151 below ----
const PL_C1 = 1592, PL_C2 = 1751, PL_SIDE = 1930;
const PL_R1 = 196, PL_R2 = 340, PL_R3 = 486, PL_R4 = 630;
const PINK = [
  { name: 'just-a-gorl:p',   x: PL_C1, y: PL_R1 },
  { name: '/Pretty/Preppy/', x: PL_C2, y: PL_R1 },
  { name: 'nerdy-XOXO',      x: PL_SIDE, y: 178 },
  { name: 'berry.milky',     x: PL_C1, y: PL_R2 },
  { name: 'its_givin_OwO',   x: PL_C2, y: PL_R2 },
  { name: 'munch-oui',       x: PL_SIDE, y: 330 },
  { name: 'Girly-POP!',      x: PL_C1, y: PL_R3 },
  { name: 'just>a<baby',     x: PL_C2, y: PL_R3 },
  { name: 'Gr00vy',          x: PL_SIDE, y: 480 },
  { name: 'Ballerina<3',     x: PL_C1, y: PL_R4 },
  { name: 'YAPPY123',        x: PL_C2, y: PL_R4 },
  { name: 'FLOWA-POWAR',     x: PL_SIDE, y: 606 },
  { name: 'cherry.on.top',   x: PL_SIDE, y: 734 },
];

// ---- Epic (magenta block, bottom left) — 6 cols x 2 rows (head crops) ----
const EP_C1 = 66, EP_C2 = 222, EP_C3 = 392, EP_C4 = 574, EP_C5 = 733, EP_C6 = 904;
const EP_R1 = 880, EP_R2 = 1098;
const EPIC = [
  { name: '*enchanting*', x: EP_C1, y: EP_R1 },
  { name: '*conjure*',    x: EP_C2, y: EP_R1 },
  { name: '*familiar*',   x: EP_C3, y: EP_R1 },
  { name: '*fluffyyy*',   x: EP_C4, y: EP_R1 },
  { name: '#cherryyy#',   x: EP_C5, y: EP_R1 },
  { name: '~cinnyyy~',    x: EP_C6, y: EP_R1 },
  { name: 'FAUNA',        x: EP_C1, y: EP_R2 },
  { name: 'FLORA',        x: EP_C2, y: EP_R2 },
  { name: 'FLY',          x: EP_C3, y: EP_R2 },
  { name: 'GirlBoss',     x: EP_C4, y: EP_R2 },
  { name: 'DIVA!',        x: EP_C5, y: EP_R2 },
  { name: 'softie',       x: EP_C6, y: EP_R2 },
];

// ---- X-Clusive (purple block, middle) — 4 across ----
const XC = [
  { name: 'v.qt.bow.v',      x: 1080, y: 840 },
  { name: '<.happy.glow.<',  x: 1239, y: 840 },
  { name: '>.silly.sandy.>', x: 1418, y: 840 },
  { name: '^.fun.guy.^',     x: 1592, y: 840 },
];

// ---- Legendary (2x2) ----
const LEG = [
  { name: 'bakery_LEGEND', x: 1080, y: 1022 },
  { name: 'magic_LEGEND',  x: 1239, y: 1022 },
  { name: 'pink_LEGEND',   x: 1080, y: 1145 },
  { name: 'forest_LEGEND', x: 1239, y: 1145 },
];

// ---- Limited Edition (single) ----
const LIMITED = [
  { name: 'The_Bubbly_Cow', x: 1454, y: 1052 },
];

export const FACES = [
  ...MAGICAL, ...BAKED, ...FOREST, ...PINK, ...EPIC, ...XC, ...LEG, ...LIMITED,
];
