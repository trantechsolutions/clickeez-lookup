// Browser-side CSV parser + transformer.
// Mirrors the logic in parse.cjs so live-fetched data is shaped identically to the
// bundled snapshot in data.json.

function parseCSV(text) {
  const rows = [];
  let cur = [], field = '', inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQ = false;
      } else field += c;
    } else {
      if (c === '"') inQ = true;
      else if (c === ',') { cur.push(field); field = ''; }
      else if (c === '\n') { cur.push(field); rows.push(cur); cur = []; field = ''; }
      else if (c === '\r') { /* skip */ }
      else field += c;
    }
  }
  if (field.length || cur.length) { cur.push(field); rows.push(cur); }
  return rows;
}

const NOISE = /^(N\/A|Unknown|not entirely)/i;

/** Transform raw CSV text into the { data, visibles, batches } shape the app uses. */
export function transformCsv(rawText) {
  const rows = parseCSV(rawText).filter((r) => r.some((c) => c && c.trim()));
  const data = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const visibleRaw = (r[0] || '').trim();
    const hiddenRaw = (r[1] || '').trim();
    if (!visibleRaw && !hiddenRaw) continue;
    const visible = visibleRaw.split(',').map((s) => s.trim()).filter(Boolean);
    const batchRaw = (r[4] || '').trim();
    const batchCodes = batchRaw ? batchRaw.split(',').map((s) => s.trim()).filter(Boolean) : [];
    data.push({
      id: i,
      visible,
      visibleRaw,
      hidden: hiddenRaw,
      rarity: (r[2] || '').trim(),
      type: (r[3] || '').trim(),
      batchCodes,
      series: (r[5] || '').trim(),
      weight: (r[6] || '').trim(),
    });
  }

  const visSet = new Set();
  data.forEach((d) => d.visible.forEach((v) => { if (v && !NOISE.test(v)) visSet.add(v); }));
  const visibles = [...visSet].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

  const batchSet = new Set();
  data.forEach((d) => d.batchCodes.forEach((b) => batchSet.add(b)));
  const batches = [...batchSet].sort();

  return { data, visibles, batches };
}
