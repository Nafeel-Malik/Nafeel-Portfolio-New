import { ReactLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';

const lenisOptions = {
  autoRaf: true,
  lerp: 0.075,
  smoothWheel: true,
  syncTouch: false,
  anchors: false,
  respectReducedMotion: true,
};

export function LenisProvider({ children }) {
  return (
    <ReactLenis root options={lenisOptions}>
      {children}
    </ReactLenis>
  );
}
