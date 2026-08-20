import './SectionHeader.css';

export function SectionHeader({ index, eyebrow, title }) {
  const number = String(index).padStart(2, '0');

  return (
    <header className="section-header">
      <p className="section-header__eyebrow">
        {number} — {eyebrow}
      </p>
      <div className="section-header__row">
        <h2 className="section-header__title">{title}</h2>
        <span className="section-header__rule" aria-hidden="true" />
      </div>
    </header>
  );
}
