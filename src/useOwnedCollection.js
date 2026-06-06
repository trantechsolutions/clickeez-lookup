import { useCallback, useEffect, useState } from 'react';
import { TOTAL } from './sections';

// Persistence contract: localStorage key holds a JSON array of owned character names.
// The set is decoupled from the lookup data — it tracks ownership of the 71 named faces.
const STORAGE_KEY = 'clickeez.owned';

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

  return { owned, isOwned, toggle, reset, count: owned.size, total: TOTAL };
}
