import snapshot from './data.json';
import { transformCsv } from './parseCsv';

// The spreadsheet's public CSV export. Google does NOT send CORS headers on this
// endpoint, so a browser can't fetch it directly cross-origin — we go through a proxy:
//   - dev:  Vite proxies /sheet -> docs.google.com (see vite.config.js)
//   - prod: set VITE_SHEET_URL to your own proxy (e.g. a serverless function / Vercel rewrite)
const SHEET_ID = '1Fgra5SB-SL7g916c8yYVuxYlH0tLJpl3-6REZd1fmwA';
const GID = '0';

const SHEET_URL =
  import.meta.env.VITE_SHEET_URL ||
  `/sheet/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;

export const SNAPSHOT = snapshot;

/**
 * Fetch the latest spreadsheet data live.
 * Resolves to { data, visibles, batches, source, fetchedAt }.
 * On any failure, falls back to the bundled snapshot so the app always works.
 */
export async function fetchLiveData({ signal } = {}) {
  try {
    const res = await fetch(SHEET_URL, { signal, cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    const parsed = transformCsv(text);
    if (!parsed.data.length) throw new Error('Empty sheet');
    return { ...parsed, source: 'live', fetchedAt: new Date() };
  } catch (err) {
    return {
      ...snapshot,
      source: 'snapshot',
      error: err.name === 'AbortError' ? null : (err.message || 'fetch failed'),
      fetchedAt: null,
    };
  }
}
