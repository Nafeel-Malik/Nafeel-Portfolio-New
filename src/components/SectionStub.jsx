import './SectionStub.css';

export function SectionStub({ id, label }) {
  return (
    <section id={id} className="section-stub" aria-label={label}>
      <p className="section-stub__label">{label}</p>
      <p className="section-stub__note">Arrives in a later phase</p>
    </section>
  );
}
