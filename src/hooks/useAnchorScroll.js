import { useLenis } from 'lenis/react';
import { requestCorridorSync } from '../utils/corridorSync';

/**
 * Corridor sections are tall pins. Scrolling to the element top lands at
 * progress≈0 (still blurred/faded). Aim into the focused rest zone instead.
 */
function corridorScrollTarget(hash) {
  if (hash === '#hero' || hash === '#home') return 0;

  const el = document.querySelector(hash === '#home' ? '#hero' : hash);
  if (!el) return hash;

  const isPinned = el.classList.contains('pinned-section');
  if (!isPinned) {
    const nav = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--nav-height'),
    );
    const navPx = Number.isFinite(nav) ? nav * 16 : 76;
    const top = el.getBoundingClientRect().top + window.scrollY;
    return Math.max(0, top - navPx * 0.55);
  }

  const pinDistance = el.offsetHeight - window.innerHeight;
  if (pinDistance <= 0) {
    return el.getBoundingClientRect().top + window.scrollY;
  }

  /*
   * About: focused after arrive (~0.24), before exit (~0.58).
   * Projects: gallery cards finish entering at ~0.72 — landing earlier
   * leaves the right-hand cards blurred (measured at 0.30).
   */
  const focus =
    hash === '#about' ? 0.36 : hash === '#projects' ? 0.74 : 0.3;
  const top = el.getBoundingClientRect().top + window.scrollY;
  return top + pinDistance * focus;
}

export function useAnchorScroll() {
  const lenis = useLenis();

  return (target, event) => {
    event?.preventDefault();
    event?.stopPropagation();

    const hash = target.startsWith('#') ? target : `#${target}`;
    const destination = corridorScrollTarget(hash);

    const finish = () => {
      requestAnimationFrame(() => {
        requestCorridorSync();
        window.dispatchEvent(new Event('scroll'));
      });
    };

    if (lenis) {
      lenis.scrollTo(destination, {
        duration: 1.35,
        lock: true,
        force: true,
        onComplete: finish,
      });
    } else if (hash === '#hero' || hash === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      finish();
    } else if (typeof destination === 'number') {
      window.scrollTo({ top: destination, behavior: 'smooth' });
      finish();
    } else {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
      finish();
    }

    if (hash.length > 1) {
      history.replaceState(null, '', hash === '#home' ? '#hero' : hash);
    }
  };
}
