import { useEffect, useMemo, useState, useCallback } from 'react';
import { lookup, rarityMeta } from './lookup';
import { fetchLiveData, SNAPSHOT } from './dataSource';
import { imagesForField } from './images';
import CollectionView from './CollectionView';
import './App.css';

function FaceThumb({ token, image, color }) {
  return (
    <figure className="face">
      {image ? (
        <img src={image.url} alt={token} loading="lazy" />
      ) : (
        <div className="face-placeholder" style={{ '--rarity': color }} title="No image (Series 2)">?</div>
      )}
      <figcaption>{token}</figcaption>
    </figure>
  );
}

function ConfidenceBadge({ confidence }) {
  const map = {
    strong: { text: 'Batch match', cls: 'conf strong' },
    weak: { text: 'Batch not listed', cls: 'conf weak' },
    unknown: { text: 'No batch data', cls: 'conf unknown' },
    listed: { text: 'Documented', cls: 'conf listed' },
  };
  const m = map[confidence] || map.listed;
  return <span className={m.cls}>{m.text}</span>;
}

function ResultCard({ entry }) {
  const r = rarityMeta(entry.rarity);
  const faces = imagesForField(entry.hidden);
  return (
    <div className="card" style={{ '--rarity': r.color }}>
      <div className="card-top">
        <div className="hidden-name">{entry.hidden}</div>
        <ConfidenceBadge confidence={entry.confidence} />
      </div>
      {faces.length > 0 && (
        <div className="faces">
          {faces.map((f, i) => (
            <FaceThumb key={i} token={f.token} image={f.image} color={r.color} />
          ))}
        </div>
      )}
      <div className="rarity-row">
        <span className="rarity-dot" />
        <span className="rarity-label">{r.label}</span>
      </div>
      <div className="meta-grid">
        <div><span className="k">Type</span><span className="val">{entry.type || '—'}</span></div>
        <div><span className="k">Series</span><span className="val">{entry.series || '—'}</span></div>
        {entry.weight && <div><span className="k">Weight</span><span className="val">{entry.weight}</span></div>}
        {entry.visible.length > 1 && (
          <div className="full-row"><span className="k">Pack visibles</span><span className="val">{entry.visibleRaw}</span></div>
        )}
      </div>
      {entry.batchCodes.length > 0 && (
        <div className="batch-codes">
          {entry.batchCodes.map((c) => (
            <span key={c} className={'chip' + (entry.batchMatch ? ' chip-active' : '')}>{c}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function fmtTime(d) {
  if (!d) return '';
  try {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function DataStatus({ dataset, loading, onRefresh }) {
  const live = dataset.source === 'live';
  return (
    <div className="data-status">
      <span className={'src-dot ' + (live ? 'ok' : 'warn')} />
      <span className="src-text">
        {loading
          ? 'Checking spreadsheet…'
          : live
            ? `Live · ${dataset.data.length} entries · updated ${fmtTime(dataset.fetchedAt)}`
            : `Offline snapshot · ${dataset.data.length} entries${dataset.error ? ` (live fetch failed: ${dataset.error})` : ''}`}
      </span>
      <button type="button" className="refresh-btn" onClick={onRefresh} disabled={loading}>
        {loading ? '↻' : '↻ Refresh'}
      </button>
    </div>
  );
}

export default function App() {
  // Start from the bundled snapshot so the app renders instantly, then upgrade to live.
  const [dataset, setDataset] = useState({ ...SNAPSHOT, source: 'snapshot', fetchedAt: null });
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState('lookup');
  const [visible, setVisible] = useState('');
  const [batch, setBatch] = useState('');
  const [submitted, setSubmitted] = useState(null);

  const refresh = useCallback(async (signal) => {
    setLoading(true);
    const next = await fetchLiveData({ signal });
    if (signal?.aborted) return;
    setDataset(next);
    setLoading(false);
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    refresh(ctrl.signal);
    return () => ctrl.abort();
  }, [refresh]);

  const result = useMemo(() => {
    if (!submitted) return null;
    return lookup(dataset.data, submitted.visible, submitted.batch);
  }, [submitted, dataset]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!visible.trim()) return;
    setSubmitted({ visible, batch });
  };

  const onReset = () => {
    setVisible('');
    setBatch('');
    setSubmitted(null);
  };

  const strongCount = result ? result.matches.filter((m) => m.confidence === 'strong').length : 0;

  return (
    <div className="app">
      <nav className="view-tabs">
        <button
          type="button"
          className={'view-tab' + (view === 'lookup' ? ' active' : '')}
          onClick={() => setView('lookup')}
          aria-pressed={view === 'lookup'}
        >
          🔍 Lookup
        </button>
        <button
          type="button"
          className={'view-tab' + (view === 'collection' ? ' active' : '')}
          onClick={() => setView('collection')}
          aria-pressed={view === 'collection'}
        >
          ✓ My Collection
        </button>
      </nav>

      {view === 'collection' && <CollectionView />}

      {view === 'lookup' && (
      <>
      <header className="hero">
        <div className="logo">🫧 Clickeez Lookup</div>
        <p className="tagline">
          Enter the <strong>visible</strong> Clickeez and your <strong>batch code</strong> to find the
          possible hidden Clickeez inside.
        </p>
        <span className="region-pill">🇺🇸 US assortments · Series 1 &amp; 2</span>
        <DataStatus dataset={dataset} loading={loading} onRefresh={() => refresh()} />
      </header>

      <form className="panel" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="visible">Visible Clickeez <span className="req">*</span></label>
          <input
            id="visible"
            list="visibles"
            placeholder="e.g. angel.eyes"
            value={visible}
            onChange={(e) => setVisible(e.target.value)}
            autoComplete="off"
          />
          <datalist id="visibles">
            {dataset.visibles.map((v) => <option key={v} value={v} />)}
          </datalist>
        </div>

        <div className="field">
          <label htmlFor="batch">Batch Code <span className="opt">(optional)</span></label>
          <input
            id="batch"
            list="batches"
            placeholder="e.g. YH1505"
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
            autoComplete="off"
          />
          <datalist id="batches">
            {dataset.batches.map((b) => <option key={b} value={b} />)}
          </datalist>
        </div>

        <div className="actions">
          <button type="submit" className="btn primary">Find Hidden Clickeez</button>
          <button type="button" className="btn ghost" onClick={onReset}>Reset</button>
        </div>
      </form>

      {result && (
        <section className="results">
          {result.matches.length === 0 ? (
            <div className="empty">
              <h3>No matches found</h3>
              <p>
                No documented pattern for <strong>“{submitted.visible}”</strong>. Check the spelling —
                names are exact (including symbols like <code>.x</code>, <code>!!</code>, <code>&lt;3</code>),
                or pick one from the suggestions.
              </p>
            </div>
          ) : (
            <>
              <div className="results-head">
                <h2>
                  {result.matches.length} possible hidden{' '}
                  {result.matches.length === 1 ? 'result' : 'results'} for “{submitted.visible}”
                </h2>
                {result.hasBatch && (
                  <p className="batch-note">
                    {strongCount > 0
                      ? `${strongCount} match the batch code ${submitted.batch.toUpperCase()} (shown first).`
                      : `Batch ${submitted.batch.toUpperCase()} isn't listed for these — shown as lower-confidence possibilities.`}
                  </p>
                )}
              </div>
              <div className="grid">
                {result.matches.map((m) => <ResultCard key={m.id} entry={m} />)}
              </div>
            </>
          )}

          <div className="disclaimer">
            <strong>Heads up:</strong> Batch codes don’t definitively predict the hidden Clickeez — they
            often overlap across assortments. Assortments seem driven by the “Try Me” box sample, and
            Limited Editions appear at random. Treat results as <em>possibilities</em>, not guarantees.
          </div>
        </section>
      )}
      </>
      )}
    </div>
  );
}
