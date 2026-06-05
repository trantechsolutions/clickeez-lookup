import manifest from './images.json';

// Maps a Clickeez name to its cropped face image, or null if we have none
// (e.g. Series 2 — the bundled guide is Series 1 only).
//
// Hidden fields are often multi-character, e.g. "^PicnicParty^ and z_STORM_z" or
// "BerryWafflz and CYBERPINK". splitNames() breaks those into individual tokens so
// each can resolve its own image.

const norm = (s) => (s || '').toLowerCase().replace(/\s+/g, '').trim();

// Pre-build a normalized lookup so minor casing/spacing differences still match.
const NORM_MAP = {};
for (const [name, url] of Object.entries(manifest)) {
  NORM_MAP[norm(name)] = { name, url };
}

/** Split a hidden/visible field into individual character tokens. */
export function splitNames(field) {
  if (!field) return [];
  return field
    .split(/\s+and\s+|,/g)
    .map((s) => s.trim())
    .filter(Boolean)
    // drop footnote fragments that aren't real characters
    .filter((s) => !/^(and |one other|two others|unknown|n\/a|but only|not entirely)/i.test(s));
}

/** Resolve a single name to { name, url } or null. */
export function imageFor(name) {
  return NORM_MAP[norm(name)] || null;
}

/** Resolve every token in a field to [{ token, image }]. */
export function imagesForField(field) {
  return splitNames(field).map((token) => ({ token, image: imageFor(token) }));
}
