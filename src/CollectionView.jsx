import { useState } from 'react';
import { SECTIONS } from './sections';
import { imageFor } from './images';
import { useOwnedCollection } from './useOwnedCollection';

function CheckCell({ name, owned, onToggle }) {
  const image = imageFor(name);
  return (
    <button
      type="button"
      className={'cell' + (owned ? ' owned' : '')}
      onClick={() => onToggle(name)}
      aria-pressed={owned}
      title={owned ? `Owned — ${name}` : `Mark ${name} as owned`}
    >
      <span className="check" aria-hidden="true" />
      <span className="cell-face">
        {image ? (
          <img src={image.url} alt={name} loading="lazy" />
        ) : (
          <span className="cell-face-missing" title="No image (Series 2)">?</span>
        )}
      </span>
      <span className="cell-name">{name}</span>
    </button>
  );
}

function Section({ section, isOwned, onToggle }) {
  const ownedInSection = section.members.filter(isOwned).length;
  return (
    <section className="cz-block" style={{ '--block': section.color }}>
      <header className="cz-block-head">
        <h3>{section.name}</h3>
        <span className="cz-block-count">
          {ownedInSection} / {section.members.length}
        </span>
      </header>
      <div className="cz-grid">
        {section.members.map((name) => (
          <CheckCell key={name} name={name} owned={isOwned(name)} onToggle={onToggle} />
        ))}
      </div>
    </section>
  );
}

export default function CollectionView() {
  const { isOwned, toggle, reset, count, total, exportCode, importCode } = useOwnedCollection();
  const pct = Math.round((count / total) * 100);

  // Share-code panel: mode is null | 'export' | 'import'; `code` is the exported
  // string (export) or the user's draft (import).
  const [mode, setMode] = useState(null);
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [msg, setMsg] = useState(null); // { ok: boolean, text: string }

  const copyToClipboard = (text) => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => setCopied(true)).catch(() => {});
    }
  };

  const openExport = () => {
    const c = exportCode();
    setMode('export');
    setCode(c);
    setMsg(null);
    setCopied(false);
    copyToClipboard(c);
  };

  const openImport = () => {
    setMode((m) => (m === 'import' ? null : 'import'));
    setCode('');
    setMsg(null);
    setCopied(false);
  };

  const restore = () => {
    if (count > 0 && !window.confirm(`Replace your current ${count} collected with this code?`)) return;
    const res = importCode(code);
    setMsg(res.ok ? { ok: true, text: `Imported ${res.count} collected.` } : { ok: false, text: res.error });
  };

  return (
    <div className="collection">
      <div className="cz-banner">
        <div className="cz-banner-top">
          <span className="cz-series">Series 1</span>
          <span className="cz-title">Collector&apos;s Checklist</span>
        </div>
        <div className="cz-counter">
          <strong>{count}</strong> / {total} collected
        </div>
        <div className="cz-progress" role="progressbar" aria-valuenow={count} aria-valuemin={0} aria-valuemax={total}>
          <span className="cz-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <button type="button" className="cz-reset" onClick={reset} disabled={count === 0}>
          Reset
        </button>
      </div>

      <div className="cz-share">
        <div className="cz-share-actions">
          <button type="button" className={'cz-share-btn' + (mode === 'export' ? ' active' : '')} onClick={openExport}>
            🔗 Share code
          </button>
          <button type="button" className={'cz-share-btn' + (mode === 'import' ? ' active' : '')} onClick={openImport}>
            📥 Import code
          </button>
        </div>

        {mode === 'export' && (
          <div className="cz-share-panel">
            <input
              className="cz-code"
              readOnly
              value={code}
              onFocus={(e) => e.target.select()}
              aria-label="Your collection code"
            />
            <button type="button" className="cz-share-go" onClick={() => copyToClipboard(code)}>
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <p className="cz-share-hint">
              {count} collected · paste this code on another device — or share it — to load this exact collection.
            </p>
          </div>
        )}

        {mode === 'import' && (
          <div className="cz-share-panel">
            <input
              className="cz-code"
              value={code}
              onChange={(e) => { setCode(e.target.value); setMsg(null); }}
              placeholder="Paste a collection code (CZ1…)"
              aria-label="Collection code to import"
            />
            <button type="button" className="cz-share-go" onClick={restore} disabled={!code.trim()}>
              Restore
            </button>
            <p className={'cz-share-hint' + (msg ? (msg.ok ? ' ok' : ' err') : '')}>
              {msg ? msg.text : 'Restoring replaces your current checklist.'}
            </p>
          </div>
        )}
      </div>

      {SECTIONS.map((section) => (
        <Section key={section.name} section={section} isOwned={isOwned} onToggle={toggle} />
      ))}

      <p className="cz-foot">
        Tap a face to mark it collected. Saved to this browser — use <strong>Share code</strong> to back it up or
        move it · {total} to collect them all!
      </p>
    </div>
  );
}
