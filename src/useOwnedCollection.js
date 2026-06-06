import { useCallback, useEffect, useState } from 'react';
import { SECTIONS, TOTAL } from './sections';

// Persistence contract: localStorage key holds a JSON array of owned character names.
// The set is decoupled from the lookup data — it tracks ownership of the 71 named faces.
const STORAGE_KEY = 'clickeez.owned';

// ---- Shareable code ----------------------------------------------------------
// A collection is encoded as a bitmask over the FIXED checklist order (one bit per
// face, in SECTIONS order), base64url-packed behind a version tag. This keeps the
// code tiny (~12 chars for 71 faces) so it copy/pastes cleanly. The code is
// index-based, so the version tag must bump if the checklist order ever changes.
const CODE_PREFIX = 'CZ1';
const ALL_NAMES = SECTIONS.flatMap((s) => s.members);

function encodeCode(ownedSet) {
  const bytes = new Uint8Array(Math.ceil(ALL_NAMES.length / 8));
  ALL_NAMES.forEach((name, i) => {
    if (ownedSet.has(name)) bytes[i >> 3] |= 1 << (i & 7);
  });
  let bin = '';
  bytes.forEach((b) => { bin += String.fromCharCode(b); });
  const b64 = btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return CODE_PREFIX + b64;
}

function decodeCode(raw) {
  const code = (raw || '').trim();
  if (!code.slice(0, CODE_PREFIX.length).toUpperCase().startsWith('CZ')) {
    throw new Error('That doesn’t look like a Clickeez collection code.');
  }
  if (!code.toUpperCase().startsWith(CODE_PREFIX)) {
    throw new Error('That code is from a different version and can’t be read.');
  }
  let b64 = code.slice(CODE_PREFIX.length).replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  let bin;
  try {
    bin = atob(b64);
  } catch {
    throw new Error('That code looks incomplete or corrupted.');
  }
  const next = new Set();
  ALL_NAMES.forEach((name, i) => {
    const byte = bin.charCodeAt(i >> 3) || 0;
    if (byte & (1 << (i & 7))) next.add(name);
  });
  return next;
}

function readOwned() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed) : new Set();
  } catch {
    // Corrupt/blocked storage — start empty rather than crash the view.
    return new Set();
  }
}

function writeOwned(set) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    // Storage full or unavailable (private mode) — state still lives in memory this session.
  }
}

/**
 * Tracks which Clickeez the user owns, persisted to localStorage.
 * @returns {{ owned: Set<string>, isOwned: (name:string)=>boolean,
 *            toggle: (name:string)=>void, reset: ()=>void,
 *            count: number, total: number }}
 */
export function useOwnedCollection() {
  const [owned, setOwned] = useState(readOwned);

  // Persist on every change.
  useEffect(() => {
    writeOwned(owned);
  }, [owned]);

  const toggle = useCallback((name) => {
    setOwned((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  const reset = useCallback(() => setOwned(new Set()), []);

  const isOwned = useCallback((name) => owned.has(name), [owned]);

  // Returns a compact shareable code for the current collection.
  const exportCode = useCallback(() => encodeCode(owned), [owned]);

  // Replaces the collection from a code. Returns { ok, count } or { ok:false, error }.
  const importCode = useCallback((raw) => {
    let next;
    try {
      next = decodeCode(raw);
    } catch (e) {
      return { ok: false, error: e.message };
    }
    setOwned(next);
    return { ok: true, count: next.size };
  }, []);

  return { owned, isOwned, toggle, reset, exportCode, importCode, count: owned.size, total: TOTAL };
}
