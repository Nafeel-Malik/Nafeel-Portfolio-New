import { easeInCubic, easeOutCubic, mapProgress } from '../hooks/usePinnedSection';

const HERO_EXIT = {
  hold: 0.05,
  /** Gentle push — avoid a huge blurred slab filling the viewport. */
  scale: 0.2,
  /** Max blur (px); kept low and tied to remaining opacity. */
  blur: 8,
  /** Upward drift in vh as the section exits. */
  translateY: -16,
  /** Opacity reaches 0 by this exit amount (before pin ends). */
  fadeBy: 0.55,
};

/**
 * Shared corridor exit: fade + lift + light blur, then fully hide.
 * Opacity drops ahead of blur so content never sits as an illegible overlay.
 */
function exitCamera(exit, { skipBlur = false } = {}) {
  const fadeT = Math.min(1, exit / HERO_EXIT.fadeBy);
  const opacity = Math.max(0, 1 - easeOutCubic(fadeT));
  const hidden = opacity < 0.025 || exit >= 0.92;

  if (hidden) {
    return {
      scale: 1 + exit * HERO_EXIT.scale,
      translateY: exit * HERO_EXIT.translateY,
      blur: 0,
      opacity: 0,
      hidden: true,
    };
  }

  const blur =
    skipBlur || opacity < 0.12
      ? 0
      : Math.min(HERO_EXIT.blur, (1 - opacity) * HERO_EXIT.blur);

  return {
    scale: 1 + exit * HERO_EXIT.scale,
    translateY: exit * HERO_EXIT.translateY,
    blur,
    opacity,
    hidden: false,
  };
}

export function getHeroCamera(progress, { skipBlur = false, reducedMotion = false } = {}) {
  if (reducedMotion) {
    return { scale: 1, translateY: 0, blur: 0, opacity: 1, hidden: false };
  }

  const push = mapProgress(progress, HERO_EXIT.hold, 1, easeInCubic);
  return exitCamera(push, { skipBlur });
}

/**
 * Arrive into focus, rest, then push past — same exit curve as Hero
 * so the corridor reads as one camera move.
 *
 * Returns `focus` 0–1 for scroll-triggered child animations (chips, etc).
 */
export function getAboutCamera(progress, { skipBlur = false, reducedMotion = false } = {}) {
  if (reducedMotion) {
    return {
      scale: 1,
      translateY: 0,
      blur: 0,
      opacity: 1,
      focus: 1,
      veil: 1,
      hidden: false,
    };
  }

  /* Mobile / coarse: keep content readable in document flow (no sticky clip). */
  if (skipBlur) {
    const exit = mapProgress(progress, 0.88, 1, easeInCubic);
    const exiting = exit > 0;
    return {
      scale: 1 + exit * 0.1,
      translateY: exit * -8,
      blur: 0,
      opacity: 1 - exit * 0.35,
      focus: 1,
      veil: 1,
      hidden: exiting && exit > 0.95,
    };
  }

  const arrive = mapProgress(progress, 0, 0.24, easeOutCubic);
  const exit = mapProgress(progress, 0.58, 1, easeInCubic);
  const veil = mapProgress(progress, 0, 0.12, easeOutCubic);

  if (exit > 0) {
    return {
      ...exitCamera(exit, { skipBlur }),
      focus: 1 - exit,
      veil: 1,
    };
  }

  const unfocused = 1 - arrive;
  return {
    scale: 1 - unfocused * 0.1,
    translateY: unfocused * 4,
    /* Softer arrive blur — heavy blur over Hero caused the glass leak. */
    blur: unfocused * 6,
    opacity: 1 - unfocused * 0.7,
    focus: arrive,
    veil,
    hidden: false,
  };
}

export function getProjectsCamera(progress, { skipBlur = false, reducedMotion = false } = {}) {
  if (reducedMotion) {
    return {
      scale: 1,
      translateY: 0,
      blur: 0,
      opacity: 1,
      focus: 1,
      veil: 1,
      hidden: false,
    };
  }

  if (skipBlur) {
    const exit = mapProgress(progress, 0.9, 1, easeInCubic);
    return {
      scale: 1 + exit * 0.08,
      translateY: exit * -6,
      blur: 0,
      opacity: 1 - exit * 0.3,
      focus: 1,
      veil: 1,
      hidden: exit > 0.95,
    };
  }

  const arrive = mapProgress(progress, 0, 0.14, easeOutCubic);
  const exit = mapProgress(progress, 0.82, 1, easeInCubic);
  const veil = mapProgress(progress, 0, 0.08, easeOutCubic);

  if (exit > 0) {
    return {
      ...exitCamera(exit, { skipBlur }),
      focus: 1 - exit,
      veil: 1,
    };
  }

  const unfocused = 1 - arrive;
  return {
    scale: 1 - unfocused * 0.08,
    translateY: unfocused * 3,
    blur: 0,
    opacity: 1 - unfocused * 0.55,
    focus: arrive,
    veil,
    hidden: false,
  };
}

export function getCardEntrance(
  progress,
  index,
  count,
  { skipBlur = false, reducedMotion = false } = {},
) {
  if (reducedMotion || skipBlur) {
    return { rotateX: 0, rotateY: 0, scale: 1, blur: 0, opacity: 1, lit: 1 };
  }

  const galleryStart = 0.12;
  const galleryEnd = 0.72;
  const span = (galleryEnd - galleryStart) / Math.max(count, 1);
  const start = galleryStart + index * span * 0.72;
  const end = Math.min(galleryEnd, start + span * 1.15);
  const t = mapProgress(progress, start, end, easeOutCubic);
  const side = index % 2 === 0 ? 1 : -1;

  return {
    rotateX: (1 - t) * 14,
    rotateY: (1 - t) * 16 * side,
    scale: 0.9 + t * 0.1,
    blur: (1 - t) * 4,
    opacity: 0.12 + t * 0.88,
    lit: t,
  };
}
