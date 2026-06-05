# Clickeez Lookup

A React lookup tool for the **Clickeez** blind-bag collectible (US). Each pack shows
**1 visible** Clickeez and hides **1 (or more) hidden** Clickeez. Enter the visible
character and your batch code to see the documented possible hidden results.

## How it works

- **Data** comes from the community pattern-tracking spreadsheet, parsed into
  [`src/data.json`](src/data.json) (70 documented entries, Series 1 & 2, across
  2-Packs, 5-Packs, Keyboard Starter Packs, and specials).
- **Input:** a visible Clickeez name (required) + a batch code like `YH1505` (optional).
- **Output:** every documented hidden possibility for that visible, with rarity, pack
  type, series, weight, and the batch codes that entry has been seen in.

### Batch codes are a hint, not a filter

The source data is explicit that batch codes **don't definitively predict** the hidden
contents — they overlap heavily across assortments. So a batch code is used to **rank
confidence**, not to exclude results:

| Confidence           | Meaning                                                      |
| -------------------- | ------------------------------------------------------------ |
| **Batch match**      | The entry has been documented in the batch code you entered. |
| **Batch not listed** | Documented, but not (yet) seen in your batch code.           |
| **No batch data**    | Documented, but no batch codes recorded for this entry.      |
| **Documented**       | Shown when no batch code was entered.                        |

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
```

## Staying in sync with the spreadsheet

The app fetches the spreadsheet **live** on every load and re-parses it in the browser,
so it's always current. A status pill under the header shows whether the data is `Live`
or an `Offline snapshot`, plus a **↻ Refresh** button to re-pull on demand.

How it works:

- On mount, the app fetches the sheet's public CSV export and parses it client-side
  ([`src/dataSource.js`](src/dataSource.js) + [`src/parseCsv.js`](src/parseCsv.js)).
- If the fetch fails for any reason, it **falls back to the bundled snapshot**
  ([`src/data.json`](src/data.json)) so the app never breaks.

### The CORS catch (important for deployment)

Google's CSV export endpoint sends **no CORS headers**, so a browser can't fetch it
cross-origin directly. The app fetches `/sheet/...` and relies on a proxy:

- **Dev:** Vite proxies `/sheet/*` → `docs.google.com` automatically
  (see [`vite.config.js`](vite.config.js)). Nothing to configure.
- **Production:** you need to provide that same proxy. Two easy options:
  1. **Vercel/Netlify rewrite** — add a rewrite so `/sheet/*` forwards to
     `https://docs.google.com/*`. (e.g. a `vercel.json` `rewrites` entry.)
  2. **Set `VITE_SHEET_URL`** to a full URL of your own CORS-enabled proxy / serverless
     function that returns the CSV.

The sheet must remain **shared as "Anyone with the link → Viewer"** for the export to be
public.

## Character images

Result cards show each hidden Clickeez's face, cropped from the official **Series 1
Collector's Guide** (`tools/collector-guide.jpg`).

- [`tools/layout.js`](tools/layout.js) — the calibrated `[centerX, centerY]` of every
  face on the guide (per-block coordinates; the guide is not a uniform grid).
- [`tools/crop.mjs`](tools/crop.mjs) — crops each face to `public/clickeez/<name>.png`
  and writes [`src/images.json`](src/images.json), a manifest keyed on the exact
  spreadsheet names.
- [`src/images.js`](src/images.js) — resolves a (possibly multi-character) hidden field
  like `"^PicnicParty^ and z_STORM_z"` to individual face images.

To re-crop (e.g. after recalibrating a coordinate):

```bash
node tools/crop.mjs        # regenerates crops + manifest
node tools/review.mjs      # labeled contact sheet at tools/_review.png to eyeball them
```

> **Scope: Series 1 only.** The guide covers ~65 of the names in the data. Series 2
> characters (`SPLASH!`, `princess.x`, `mermy<3`, the ocean/beach wave, etc.) have no
> image and render a rarity-tinted **`?` placeholder** until a Series 2 guide is added.

### Refreshing the bundled snapshot

The fallback snapshot in `src/data.json` is generated from `clickeez.csv` by `parse.cjs`.
To refresh it (so the offline fallback isn't stale):

```bash
node parse.cjs
```

> Results are **possibilities, not guarantees.** Assortments appear to be driven by the
> "Try Me" sample on the box, and Limited Editions show up at random.
