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
  const { isOwned, toggle, reset, count, total } = useOwnedCollection();
  const pct = Math.round((count / total) * 100);

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

      {SECTIONS.map((section) => (
        <Section key={section.name} section={section} isOwned={isOwned} onToggle={toggle} />
      ))}

      <p className="cz-foot">
        Tap a face to mark it collected. Saved to this browser only · {total} to collect them all!
      </p>
    </div>
  );
}
