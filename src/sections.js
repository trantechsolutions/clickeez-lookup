// Canonical Series-1 Collector's Guide section map — the single source of truth for
// the collection checklist. Derived directly from the scansheet (tools/collector-guide.jpg)
// and verified to cover exactly the 71 entries in images.json:
//   12 / 12 / 12 / 13 / 12 / 4 / 5 / 1  (= 71)
//
// `color` is the section's accent, sampled to echo each colored block on the poster.
// Member names are EXACT (symbols like .x, <3, ^…^ preserved) so they resolve against
// images.json via imageFor() without normalization surprises.

export const SECTIONS = [
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

// Flat list of every collectible name, in scansheet order.
export const ALL_MEMBERS = SECTIONS.flatMap((s) => s.members);

// Total collectible count — drives the "X / TOTAL collected" counter.
export const TOTAL = ALL_MEMBERS.length;
