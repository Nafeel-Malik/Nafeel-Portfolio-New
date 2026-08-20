import { useEffect, useRef } from 'react';

const MAGNET_RADIUS = 14;
const MAGNET_STRENGTH = 0.28;

export function TechChip({ label, revealed, magnetic }) {
  const ref = useRef(null);
  const rafRef = useRef(0);
  const current = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const tick = () => {
      const cur = current.current;
      const next = target.current;
      cur.x += (next.x - cur.x) * 0.2;
      cur.y += (next.y - cur.y) * 0.2;

      if (Math.abs(cur.x) < 0.05 && Math.abs(cur.y) < 0.05 && next.x === 0 && next.y === 0) {
        cur.x = 0;
        cur.y = 0;
        el.style.transform = '';
        rafRef.current = 0;
        return;
      }

      el.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`;
      rafRef.current = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
    };

    const onMove = (event) => {
      if (!magnetic || !revealed) return;
      const rect = el.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      target.current = {
        x: Math.max(-MAGNET_RADIUS, Math.min(MAGNET_RADIUS, dx * MAGNET_STRENGTH)),
        y: Math.max(-MAGNET_RADIUS, Math.min(MAGNET_RADIUS, dy * MAGNET_STRENGTH)),
      };
      start();
    };

    const onLeave = () => {
      target.current = { x: 0, y: 0 };
      start();
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    el.addEventListener('pointercancel', onLeave);

    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      el.removeEventListener('pointercancel', onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [magnetic, revealed]);

  return (
    <li>
      <span
        ref={ref}
        className={`about__chip ${revealed ? 'is-revealed' : ''}`}
        data-about-chip
      >
        <span className="about__chip-mark" aria-hidden="true">
          {label.slice(0, 1)}
        </span>
        {label}
      </span>
    </li>
  );
}
