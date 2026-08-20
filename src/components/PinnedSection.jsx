import { useRef } from 'react';
import { usePinnedSection } from '../hooks/usePinnedSection';
import './PinnedSection.css';

export function PinnedSection({
  id,
  height = '220vh',
  overlap,
  className = '',
  onProgress,
  children,
}) {
  const sectionRef = useRef(null);
  const { progress, isActive } = usePinnedSection(sectionRef, {
    range: 'pin',
    onProgress,
    syncState: true,
  });

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`pinned-section ${overlap ? 'pinned-section--overlay' : ''} ${className}`.trim()}
      style={{
        ...(height ? { height } : {}),
        ...(overlap ? { marginTop: `calc(-1 * ${overlap})` } : {}),
      }}
    >
      <div className="pinned-section__sticky">
        {typeof children === 'function'
          ? children({ progress, isActive })
          : children}
      </div>
    </section>
  );
}
