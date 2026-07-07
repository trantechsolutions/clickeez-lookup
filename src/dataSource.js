import snapshot from './data.json';
import { transformCsv } from './parseCsv';

// The spreadsheet's public CSV, via Google's gviz endpoint. Unlike the /export
// endpoint (which 307-redirects to a signed googleusercontent.com URL that drops
// CORS headers), gviz responds 200 directly WITH `Access-Control-Allow-Origin`,
// so the browser can fetch it cross-origin from any static host (GitHub Pages,
// Vercel, dev) — no proxy needed. Override with VITE_SHEET_URL if desired.
const SHEET_ID = '1Fgra5SB-SL7g916c8yYVuxYlH0tLJpl3-6REZd1fmwA';
const GID = '0';

const SHEET_URL =
  import.meta.env.VITE_SHEET_URL ||
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${GID}`;

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
