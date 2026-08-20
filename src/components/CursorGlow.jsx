import { useEffect, useRef } from 'react';
import { useMotionFlags } from '../hooks/useMotionFlags';
import './CursorGlow.css';

const LERP = 0.1;

export function CursorGlow() {
  const blobRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(0);
  const { reducedMotion, finePointer } = useMotionFlags();

  useEffect(() => {
    const blob = blobRef.current;
    if (!blob) return undefined;

    const place = (x, y) => {
      blob.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    posRef.current = { x: centerX, y: centerY };
    targetRef.current = { x: centerX, y: centerY };
    place(centerX, centerY);

    if (!finePointer || reducedMotion) {
      return undefined;
    }

    const tick = () => {
      const pos = posRef.current;
      const target = targetRef.current;
      pos.x += (target.x - pos.x) * LERP;
      pos.y += (target.y - pos.y) * LERP;
      place(pos.x, pos.y);

      const dx = target.x - pos.x;
      const dy = target.y - pos.y;
      if (dx * dx + dy * dy > 0.35) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = 0;
        place(target.x, target.y);
        pos.x = target.x;
        pos.y = target.y;
      }
    };

    const onMove = (event) => {
      targetRef.current = { x: event.clientX, y: event.clientY };
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, [finePointer, reducedMotion]);

  return (
    <div className="cursor-glow-root" aria-hidden="true">
      <div
        ref={blobRef}
        className={`cursor-glow ${finePointer && !reducedMotion ? 'is-live' : 'is-static'}`}
      />
    </div>
  );
}
