import { useCallback, useEffect, useRef, useState } from 'react';
import { useLenis } from 'lenis/react';
import { onCorridorSync } from '../utils/corridorSync';

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export function mapProgress(progress, start = 0, end = 1, ease = (t) => t) {
  if (end === start) return ease(progress >= end ? 1 : 0);
  return ease(clamp((progress - start) / (end - start)));
}

export function easeInCubic(t) {
  return t * t * t;
}

export function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

function readProgress(el, range) {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || 1;

  if (range === 'enter-exit') {
    return clamp((vh - rect.top) / (vh + rect.height));
  }

  const pinDistance = rect.height - vh;
  if (pinDistance <= 0) {
    return clamp((vh - rect.top) / (vh + rect.height));
  }

  return clamp(-rect.top / pinDistance);
}

/**
 * Tracks 0–1 scroll progress through a specific section.
 * Always measures layout on Lenis/native scroll AND on corridor sync
 * (nav jumps), so a programmatic scrollTo cannot leave stale blur/scale.
 */
export function usePinnedSection(sectionRef, options = {}) {
  const {
    range = 'pin',
    onProgress,
    syncState = true,
    disabled = false,
  } = options;

  const [progress, setProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const onProgressRef = useRef(onProgress);
  const rangeRef = useRef(range);
  const syncStateRef = useRef(syncState);
  const disabledRef = useRef(disabled);
  const activeRef = useRef(false);
  const rafRef = useRef(0);
  const lastProgressRef = useRef(-1);
  /** Smoothed progress for React consumers — reduces scroll stutter. */
  const smoothRef = useRef(0);
  const targetRef = useRef(0);
  const lerpRafRef = useRef(0);

  onProgressRef.current = onProgress;
  rangeRef.current = range;
  syncStateRef.current = syncState;
  disabledRef.current = disabled;

  const publishSmooth = useCallback((next) => {
    const rounded = Math.round(next * 1000) / 1000;
    if (Math.abs(rounded - lastProgressRef.current) < 0.001) return;
    lastProgressRef.current = rounded;
    onProgressRef.current?.(rounded);
    if (syncStateRef.current) setProgress(rounded);
  }, []);

  const stopLerp = useCallback(() => {
    if (lerpRafRef.current) {
      cancelAnimationFrame(lerpRafRef.current);
      lerpRafRef.current = 0;
    }
  }, []);

  const lerpTick = useCallback(() => {
    lerpRafRef.current = 0;
    const target = targetRef.current;
    const current = smoothRef.current;
    const delta = target - current;

    if (Math.abs(delta) < 0.0008) {
      smoothRef.current = target;
      publishSmooth(target);
      return;
    }

    /* Tight follow — micro-smooth without fighting Lenis. */
    smoothRef.current = current + delta * 0.38;
    publishSmooth(smoothRef.current);
    lerpRafRef.current = requestAnimationFrame(lerpTick);
  }, [publishSmooth]);

  const setTarget = useCallback(
    (next, { immediate = false } = {}) => {
      targetRef.current = next;
      if (immediate) {
        stopLerp();
        smoothRef.current = next;
        publishSmooth(next);
        return;
      }
      if (!lerpRafRef.current) {
        lerpRafRef.current = requestAnimationFrame(lerpTick);
      }
    },
    [lerpTick, publishSmooth, stopLerp],
  );

  const measure = useCallback(() => {
    if (disabledRef.current) return;
    const el = sectionRef.current;
    if (!el) return;
    setTarget(readProgress(el, rangeRef.current));
  }, [sectionRef, setTarget]);

  const tick = useCallback(() => {
    rafRef.current = 0;
    measure();
  }, [measure]);

  const schedule = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const scheduleRef = useRef(schedule);
  scheduleRef.current = schedule;

  const onLenisScroll = useCallback(() => {
    /* Skip work for off-screen sections pinned at endpoints. */
    if (
      !activeRef.current &&
      (smoothRef.current <= 0.002 || smoothRef.current >= 0.998)
    ) {
      return;
    }
    scheduleRef.current();
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const nextActive = entry.isIntersecting;
        activeRef.current = nextActive;
        setIsActive(nextActive);
        if (nextActive) {
          measure();
        } else {
          /* Snap to endpoint once so exit/hide state settles cleanly. */
          const raw = readProgress(el, rangeRef.current);
          const snapped = raw < 0.5 ? 0 : 1;
          setTarget(snapped, { immediate: true });
        }
      },
      { threshold: 0, rootMargin: '20% 0px' },
    );

    observer.observe(el);
    measure();

    const onScrollOrResize = () => {
      if (
        !activeRef.current &&
        (smoothRef.current <= 0.002 || smoothRef.current >= 0.998)
      ) {
        return;
      }
      schedule();
    };
    window.addEventListener('resize', onScrollOrResize);
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    const offSync = onCorridorSync(() => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
      setTarget(readProgress(el, rangeRef.current), { immediate: true });
    });

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', onScrollOrResize);
      window.removeEventListener('scroll', onScrollOrResize);
      offSync();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      stopLerp();
    };
  }, [measure, schedule, sectionRef, setTarget, stopLerp]);

  useLenis(onLenisScroll, [onLenisScroll]);

  return { progress, isActive };
}
