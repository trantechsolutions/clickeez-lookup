// Canonical Collector's Guide section map — the single source of truth for the
// collection checklist. Grouped by series, each series a set of colored blocks
// derived directly from its scansheet.
//
// Series 1 (tools/collector-guide.jpg) covers exactly the 71 entries in images.json:
//   12 / 12 / 12 / 13 / 12 / 4 / 5 / 1  (= 71)
// Series 3 "Bubble Pops" adds 70 entries (guide #103–172):
//   12 / 12 / 12 / 13 / 12 / 4 / 4 / 1  (= 70)
//
// `color` is each block's accent, sampled to echo the colored block on its poster.
// Member names are EXACT (symbols like .x, <3, ^…^ preserved) so they resolve against
// images.json via imageFor() without normalization surprises.
//
// ORDER IS LOAD-BEARING: the shareable code (useOwnedCollection.js) is a bitmask over
// ALL_MEMBERS in this exact order. Series 1 stays first with unchanged positions so
// existing codes and localStorage keep working; new series are APPENDED, never inserted.

export const SERIES_1_SECTIONS = [
  {
    name: 'Strawberry Treats',
    color: '#f49ac2',
    members: [
      'NeoGelato.xx', 'Sprinkles.x', 'BerryWafflz', 'Swirlybunny', 'YUMMYberry!', 'ChocoxPuddin',
      'STRAW_BERRY', 'StrwbrrSWIRL', 'Berry', 'StrwBryBear', 'SillyBerry123', 'xCHOCO_dip',
    ],
  },
  {
    name: 'Cozy Garden',
    color: '#9fe3c5',
    members: [
      'Flowacrown', 'PrissyRose1', '^PicnicParty^', 'Purplepupxx', 'butterflyx', 'IAMGreenDog',
      'Mshrm_Deer', 'PetalPowerz', 'SAKURA_KITTY', 'Shy', 'bun^-^', 'honeyB',
    ],
  },
  {
    name: 'Kawaii Dreams',
    color: '#7fd4e8',
    members: [
      'rainz', 'Ra1n_Bows', 'beau.x', 'DREAMYY~', 'happyval<3', 'goth.qt',
      'angel.eyes', 'patchy:>', 'Yume', 'NYAA~!!', 'CYBERPINK', '~Meowch!~',
    ],
  },
  {
    name: 'Celestial Sky',
    color: '#a98fd0',
    members: [
      'SUPAR-STAR', 'Day.x', 'x.Twilight.x', 'x.Night', 'z_STORM_z', 'Falling_Stars', 'NIGHTLIGHT',
      'xlunar_sky', 'Star_STRUCK', 'Estella', 'Invasion!!', 'Saturnz', 'COSMOS',
    ],
  },
  {
    name: 'Epic',
    color: '#f6c89f',
    members: [
      '*ShiningStar*', '*StarExplorer*', '*StarDreamer*', 'Giggly-bunny', 'Cuddly-bear', 'TECHY-C4T',
      'Flutterdeery', 'BumbleKitty', 'Ladybunny', 'StrwBrryJAM', 'StrwBrryCAKE', 'StrwBrryMILK',
    ],
  },
  {
    name: 'Legendary',
    color: '#c9a0e8',
    members: ['berry_LEGEND', 'sky_LEGEND', 'cozy_LEGEND', 'kawaii_LEGEND'],
  },
  {
    name: 'X-Clusive',
    color: '#b7a3e0',
    members: ['^.Sky.^', 'MistiCloud', 'V.Dreams.V', '<.Garden.<', '>.Treats.>'],
  },
  {
    name: 'Limited Edition',
    color: '#ec4899',
    members: ['The_Lucky_Bunny'],
  },
];

// Series 3 "Bubble Pops" — transcribed from the collector's guide scan (#103–172).
// Numbers run contiguously 103→172 (70 items), matching the poster's "70 to collect!".
export const SERIES_3_SECTIONS = [
  {
    name: 'Magical Glow',
    color: '#9ab0e6',
    members: [
      'IAmBlueMouse', 'Twinkle!', '*milky*sl4y*', 'CASTaSPELL', 'Squ33ky', 'Sparkle!',
      '.o*.GLIMMER.*o.', 'Tadaaaa!!', 'Crystal.x', 'ABRACADABRA!', '-.CHARM.-', 'Shine!',
    ],
  },
  {
    name: 'Baked Goodies',
    color: '#f2a988',
    members: [
      'SW~RLY', 'mooOOOse', 'W4FFLES', 'C00kieeeee~', '..jammy.cowkie..', 'Top-Tier',
      'on~a~roll', 'BirthYAY<3', 'Toast-Ouioui', 'sweetie-roll', 'cutie~puff', 'Cake-POP!!',
    ],
  },
  {
    name: 'Forest Pals',
    color: '#a4d98c',
    members: [
      '!Mossy', 'forestberry', '~!FROGGY!~', 'MushMouse', 'FOXY', 'D33RY',
      'Axo-Lottie', 'some.grass', '*Bubbles*', 'acorn.<3', 'Lily.paddily', 'Annie.x',
    ],
  },
  {
    name: 'Pink Life',
    color: '#f2a0ce',
    members: [
      'just-a-gorl:p', '/Pretty/Preppy/', 'nerdy-XOXO', 'berry.milky', 'its_givin_OwO', 'munch-oui',
      'Girly-POP!', 'just>a<baby', 'Gr00vy', 'Ballerina<3', 'YAPPY123', 'FLOWA-POWAR',
      'cherry.on.top',
    ],
  },
  {
    name: 'Epic',
    color: '#ee7ab8',
    members: [
      '*enchanting*', '*conjure*', '*familiar*', '*fluffyyy*', '#cherryyy#', '~cinnyyy~',
      'FAUNA', 'FLORA', 'FLY', 'GirlBoss', 'DIVA!', 'softie',
    ],
  },
  {
    name: 'X-Clusive',
    color: '#b89ad8',
    members: ['v.qt.bow.v', '<.happy.glow.<', '>.silly.sandy.>', '^.fun.guy.^'],
  },
  {
    name: 'Legendary',
    color: '#c9a0e8',
    members: ['bakery_LEGEND', 'magic_LEGEND', 'pink_LEGEND', 'forest_LEGEND'],
  },
  {
    name: 'Limited Edition',
    color: '#ec4899',
    members: ['The_Bubbly_Cow'],
  },
];

// Series metadata drives the grouped checklist. New series append here.
export const SERIES = [
  { id: 's1', name: 'Series 1', subtitle: null, sections: SERIES_1_SECTIONS },
  { id: 's3', name: 'Series 3', subtitle: 'Bubble Pops', sections: SERIES_3_SECTIONS },
];

// Flat list of every section across all series, in scansheet order (Series 1 first).
// Kept for the share-code bitmask order and any consumer that wants a flat block list.
export const SECTIONS = SERIES.flatMap((s) => s.sections);

// Flat list of every collectible name, in fixed checklist order.
export const ALL_MEMBERS = SECTIONS.flatMap((s) => s.members);

// Total collectible count — drives the "X / TOTAL collected" counter.
export const TOTAL = ALL_MEMBERS.length;
