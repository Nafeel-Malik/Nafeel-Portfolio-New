import { useEffect, useState } from 'react';

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function shouldSkipBlur() {
  return window
    .matchMedia('(max-width: 900px), (max-height: 760px), (pointer: coarse)')
    .matches;
}

function isCoarsePointer() {
  return window.matchMedia('(pointer: coarse)').matches;
}

function isFinePointer() {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

export function useMotionFlags() {
  const [flags, setFlags] = useState(() => ({
    skipBlur: shouldSkipBlur(),
    reducedMotion: prefersReducedMotion(),
    coarsePointer: isCoarsePointer(),
    finePointer: isFinePointer(),
  }));

  useEffect(() => {
    const blurQuery = window.matchMedia(
      '(max-width: 900px), (max-height: 760px), (pointer: coarse)',
    );
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarseQuery = window.matchMedia('(pointer: coarse)');
    const fineQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

    const onChange = () => {
      setFlags({
        skipBlur: shouldSkipBlur(),
        reducedMotion: prefersReducedMotion(),
        coarsePointer: isCoarsePointer(),
        finePointer: isFinePointer(),
      });
    };

    blurQuery.addEventListener('change', onChange);
    motionQuery.addEventListener('change', onChange);
    coarseQuery.addEventListener('change', onChange);
    fineQuery.addEventListener('change', onChange);

    return () => {
      blurQuery.removeEventListener('change', onChange);
      motionQuery.removeEventListener('change', onChange);
      coarseQuery.removeEventListener('change', onChange);
      fineQuery.removeEventListener('change', onChange);
    };
  }, []);

  return flags;
}
