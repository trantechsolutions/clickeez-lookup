const norm = (s) => (s || '').toLowerCase().replace(/\s+/g, '').trim();

/**
 * Look up possible hidden Clickeez given a visible character and (optionally) a batch code.
 *
 * The source spreadsheet notes that batch codes are NOT definitive — they frequently
 * overlap across assortments — so a batch code is used to RANK confidence rather than
 * to hard-filter. Entries whose batch list contains the code are surfaced as the most
 * likely; the rest are still shown as possible, just lower confidence.
 *
 * @param {Array}  entries  the dataset to search (live or snapshot)
 * @param {string} visible  visible character name (required)
 * @param {string} [batch]  batch code like "YH1505" (optional)
 * @param {string} [series] restrict to one series, e.g. "Series 3" (empty = all)
 * @returns {{ matches: Array, hasBatch: boolean }}
 */
export function lookup(entries, visible, batch, series) {
  const v = norm(visible);
  if (!v) return { matches: [], hasBatch: false };

  const b = norm(batch);
  const hasBatch = !!b;

  const inSeries = series ? (e) => e.series === series : () => true;
  const hits = entries.filter((e) => inSeries(e) && e.visible.some((name) => norm(name) === v));

  const matches = hits.map((e) => {
    const batchMatch = hasBatch && e.batchCodes.some((c) => norm(c) === b);
    const noBatchData = e.batchCodes.length === 0;
    let confidence;
    if (!hasBatch) confidence = 'listed';
    else if (batchMatch) confidence = 'strong';
    else if (noBatchData) confidence = 'unknown';
    else confidence = 'weak';
    return { ...e, batchMatch, confidence };
  });

  const order = { strong: 0, listed: 0, unknown: 1, weak: 2 };
  matches.sort((a, b2) => (order[a.confidence] - order[b2.confidence]));

  return { matches, hasBatch };
}

export const RARITY_META = {
  'Common': { color: '#9aa7b8', label: 'Common' },
  'Epic/Rare': { color: '#a855f7', label: 'Epic / Rare' },
  'Legendary/Ultra Rare': { color: '#f59e0b', label: 'Legendary / Ultra Rare' },
  'Limited Edition': { color: '#ec4899', label: 'Limited Edition' },
};

export function rarityMeta(r) {
  return RARITY_META[r] || { color: '#9aa7b8', label: r || 'Unknown' };
}
