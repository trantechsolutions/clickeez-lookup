# ADR-001: Scansheet-Styled Collection Checklist View

**Status:**   Proposed
**Date:**     2026-06-05
**Author:**   solution-architect agent
**Deciders:** jonny5v (project owner)
**Location:** `docs/architecture/decisions/ADR-001-collection-checklist-view.md`

---

## Section 1 — Context

The Clickeez Lookup app is a static Vite + React 19 single-page app whose only view today is a *batch-code → hidden-character* lookup that reads from a Google Sheet (with a bundled offline snapshot). The project already owns 71 cropped Series-1 face images (`src/images.json` + `public/clickeez/*.png`) sourced from the official Series 1 Collector's Guide scan (`tools/collector-guide.jpg`).

The owner wants a second capability: a personal **collection checklist** of the characters they already own, visually mimicking the Collector's Guide scansheet — the pastel themed blocks, the per-character ○ check circles, and the "COLLECT THEM ALL!" framing. The scansheet organises the 71 faces into **8 colored sections** (Strawberry Treats, Cozy Garden, Kawaii Dreams, Celestial Sky, Epic, Legendary, X-Clusive, Limited Edition); the existing `tools/layout.js` only encodes 4 of these (the common-row crop coordinates), so a complete section map does not yet exist anywhere in the codebase. This is a personal single-user toy-collection tracker — no scale, auth, compliance, or backend requirements apply.

## Section 2 — Decision

We will add a **client-only, self-tracked collection checklist view** that renders all 71 Series-1 faces grouped into the 8 scansheet sections, with each character's ○ circle acting as a clickable owned/not-owned toggle, persisted to `localStorage`.

A new canonical `sections` data structure (`{ name, color, members: [...] }`) becomes the single source of truth for the checklist's grouping and order, derived directly from the scansheet image and verified to cover exactly the 71 entries in `images.json` (12 / 12 / 12 / 13 / 12 / 4 / 5 / 1). Ownership is modeled as a flat set of owned character names — **decoupled from the `clickeez.csv` pack/hidden lookup data** — because the collection unit is the named face on the poster, not a pack or a hidden pairing. `localStorage` is chosen over any backend because the app is static, single-user, and has no cross-device requirement; this keeps the deployment a pure static build.

## Section 3 — Consequences

### Positive consequences
- Adds the requested feature with **zero new runtime dependencies** and **no backend** — deploy stays a static Vite build on the current host.
- Reuses existing assets: `images.json`, `public/clickeez/*.png`, the pastel brand tokens in `App.css`, and the `FaceThumb` rendering pattern.
- The verified `sections` map (71/71, no orphans/dupes) becomes a reusable canonical structure other features can consume later.
- Ownership state survives reloads via `localStorage`; an export/import affordance can be layered on later without schema change (it is already a JSON name array).

### Negative consequences / trade-offs
- `localStorage` ownership is **device- and browser-local** — clearing site data or switching devices loses the collection. Acceptable for a personal tracker; a sync backend would be a separate future ADR.
- Faithful scansheet mimicry (8 themed blocks with distinct gradient backgrounds, header banner, per-section accent colors) is **non-trivial CSS** — roughly the bulk of the build effort, and the section colors must be hand-tuned against the scan to "feel" right.
- Introduces a **navigation concern**: the app now has two views (Lookup, Collection). A lightweight tab/toggle must be added to `App.jsx`; this is the only change to existing code paths.
- The checklist is **Series 1 only** by definition (the scansheet covers only Series 1; Series 2 has no guide art). Series 2 characters in `clickeez.csv` are intentionally excluded from the grid.

## Section 4 — Alternatives considered

### Alternative: Pre-populated checklist inferred from owned packs
**Why it was considered:** The user said "the ones I *already have*," which could imply auto-deriving ownership from data already in the app.
**Why it was rejected:** The app has no record of which packs the user owns, and `clickeez.csv` maps packs→hidden pairings, not an inventory. Inferring ownership would be guesswork and would couple the visual face-grid to an unrelated data model. An interactive self-tracked checklist matches the plain request ("create a checklist of the ones I have") and the scansheet's own ○-circle affordance.

### Alternative: Backend-persisted collection (e.g. a small KV/DB + user accounts)
**Why it was considered:** Would enable cross-device sync and durability against cache-clears.
**Why it was rejected:** Massive over-engineering for a single-user personal toy tracker. It would convert a zero-cost static deploy into a stateful service with auth — directly conflicting with the app's current no-backend architecture. `localStorage` meets the actual need; sync can be a future ADR if the requirement ever emerges.

### Alternative: Reuse `tools/layout.js` as the section source of truth
**Why it was considered:** It already groups some characters by colored block.
**Why it was rejected:** It only encodes 4 of the 8 scansheet sections (the common rows) and exists for *crop calibration*, not display grouping; it omits Epic, Legendary, X-Clusive, and Limited Edition entirely. A purpose-built, fully-reconciled `sections` map is required.

## Section 5 — Implementation notes

- Stack is fixed: **React 19 + Vite**, plain CSS in the `App.css` idiom (CSS custom properties, no CSS-in-JS, no UI library). Match existing naming and pastel `--brand-*` tokens.
- The canonical section map is **already verified** (71/71, zero typos/dupes/orphans). Use it verbatim as `src/sections.js`:

```js
export const SECTIONS = [
  { name: 'Strawberry Treats', color: '#f49ac2', members: ['NeoGelato.xx','Sprinkles.x','BerryWafflz','Swirlybunny','YUMMYberry!','ChocoxPuddin','STRAW_BERRY','StrwbrrSWIRL','Berry','StrwBryBear','SillyBerry123','xCHOCO_dip'] },
  { name: 'Cozy Garden',       color: '#9fe3c5', members: ['Flowacrown','PrissyRose1','^PicnicParty^','Purplepupxx','butterflyx','IAMGreenDog','Mshrm_Deer','PetalPowerz','SAKURA_KITTY','Shy','bun^-^','honeyB'] },
  { name: 'Kawaii Dreams',     color: '#7fd4e8', members: ['rainz','Ra1n_Bows','beau.x','DREAMYY~','happyval<3','goth.qt','angel.eyes','patchy:>','Yume','NYAA~!!','CYBERPINK','~Meowch!~'] },
  { name: 'Celestial Sky',     color: '#a98fd0', members: ['SUPAR-STAR','Day.x','x.Twilight.x','x.Night','z_STORM_z','Falling_Stars','NIGHTLIGHT','xlunar_sky','Star_STRUCK','Estella','Invasion!!','Saturnz','COSMOS'] },
  { name: 'Epic',              color: '#f6c89f', members: ['*ShiningStar*','*StarExplorer*','*StarDreamer*','Giggly-bunny','Cuddly-bear','TECHY-C4T','Flutterdeery','BumbleKitty','Ladybunny','StrwBrryJAM','StrwBrryCAKE','StrwBrryMILK'] },
  { name: 'Legendary',         color: '#c9a0e8', members: ['berry_LEGEND','sky_LEGEND','cozy_LEGEND','kawaii_LEGEND'] },
  { name: 'X-Clusive',         color: '#b7a3e0', members: ['^.Sky.^','MistiCloud','V.Dreams.V','<.Garden.<','>.Treats.>'] },
  { name: 'Limited Edition',   color: '#ec4899', members: ['The_Lucky_Bunny'] },
];
```

- Persistence contract: `localStorage` key `clickeez.owned`, value `JSON.stringify([...ownedNames])`. Read on mount, write on every toggle.
- Image lookup must reuse the existing `imagesForField` / `images.json` mechanism, keyed by the exact member name (names include symbols like `.x`, `<3`, `^…^` — never normalize them away).

## Section 6 — References

- Scansheet source: `tools/collector-guide.jpg` (Series 1 Collector's Guide, 2496×1516)
- Canonical face manifest: `src/images.json` (71 entries)
- Crop-calibration memory: per-block face-crop notes (`clickeez-image-crops`)
- Existing render pattern: `FaceThumb` component in `src/App.jsx`
