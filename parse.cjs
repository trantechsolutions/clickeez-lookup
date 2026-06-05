const fs = require('fs');
const path = require('path');

function parseCSV(text) {
  const rows = [];
  let cur = [], field = '', inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') {
        if (text[i+1] === '"') { field += '"'; i++; }
        else inQ = false;
      } else field += c;
    } else {
      if (c === '"') inQ = true;
      else if (c === ',') { cur.push(field); field = ''; }
      else if (c === '\n') { cur.push(field); rows.push(cur); cur = []; field = ''; }
      else if (c === '\r') {}
      else field += c;
    }
  }
  if (field.length || cur.length) { cur.push(field); rows.push(cur); }
  return rows;
}

const raw = fs.readFileSync(path.join(__dirname, 'clickeez.csv'), 'utf8');
const rows = parseCSV(raw).filter(r => r.some(c => c && c.trim()));
const data = [];
for (let i = 1; i < rows.length; i++) {
  const r = rows[i];
  const visibleRaw = (r[0]||'').trim();
  const hiddenRaw = (r[1]||'').trim();
  if (!visibleRaw && !hiddenRaw) continue;
  const visible = visibleRaw.split(',').map(s=>s.trim()).filter(Boolean);
  const batchRaw = (r[4]||'').trim();
  const batchCodes = batchRaw ? batchRaw.split(',').map(s=>s.trim()).filter(Boolean) : [];
  data.push({
    id: i,
    visible,
    visibleRaw,
    hidden: hiddenRaw,
    rarity: (r[2]||'').trim(),
    type: (r[3]||'').trim(),
    batchCodes,
    series: (r[5]||'').trim(),
    weight: (r[6]||'').trim(),
  });
}

const noise = /^(N\/A|Unknown|not entirely)/i;
const visSet = new Set();
data.forEach(d => d.visible.forEach(v => { if (v && !noise.test(v)) visSet.add(v); }));
const visibles = [...visSet].sort((a,b)=>a.toLowerCase().localeCompare(b.toLowerCase()));

const batchSet = new Set();
data.forEach(d => d.batchCodes.forEach(b => batchSet.add(b)));
const batches = [...batchSet].sort();

fs.writeFileSync(path.join(__dirname, 'src', 'data.json'),
  JSON.stringify({ data, visibles, batches }, null, 2));
console.log('Entries:', data.length, '| Unique visibles:', visibles.length, '| Batch codes:', batches.length);
console.log('Batches:', batches.join(', '));
