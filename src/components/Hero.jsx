import { useEffect } from 'react';
import { avatarSrc } from '../data/site';
import { useAnchorScroll } from '../hooks/useAnchorScroll';
import { useMotionFlags } from '../hooks/useMotionFlags';
import { getHeroCamera } from '../utils/corridorCamera';
import { Avatar } from './Avatar';
import './Hero.css';

const NAME_LINES = ['Muhammad', 'Nafeel'];

function splitChars(word) {
  return word.split('').map((char, index) => (
    <span className="hero__char" key={`${word}-${index}`}>
      {char}
    </span>
  ));
}

export function Hero({ progress = 0 }) {
  const scrollTo = useAnchorScroll();
  const { skipBlur, reducedMotion } = useMotionFlags();

  useEffect(() => {
    if (reducedMotion) {
      document.querySelectorAll('.hero [data-intro]').forEach((el) => {
        el.style.opacity = '1';
        el.style.filter = 'none';
        el.style.transform = 'none';
      });
      return undefined;
    }

    let animation;
    let cancelled = false;

    (async () => {
      const anime = (await import('animejs')).default;
      if (cancelled) return;

      animation = anime.timeline({
        easing: 'easeOutExpo',
        autoplay: true,
      });

      animation
        .add({
          targets: '.hero__portrait',
          opacity: [0, 1],
          scale: [0.88, 1],
          translateY: [28, 0],
          filter: ['blur(12px)', 'blur(0px)'],
          duration: 920,
        })
        .add(
          {
            targets: '.hero__kicker',
            opacity: [0, 1],
            translateY: [16, 0],
            duration: 720,
          },
          '-=520',
        )
        .add(
          {
            targets: '.hero__char',
            opacity: [0, 1],
            rotateX: [48, 0],
            translateY: [36, 0],
            translateZ: [-48, 0],
            filter: ['blur(12px)', 'blur(0px)'],
            duration: 980,
            delay: anime.stagger(28),
          },
          '-=420',
        )
        .add(
          {
            targets: '.hero__meta',
            opacity: [0, 1],
            translateY: [22, 0],
            duration: 760,
            delay: anime.stagger(110),
          },
          '-=560',
        )
        .add(
          {
            targets: '.hero__scroll',
            opacity: [0, 1],
            duration: 640,
          },
          '-=400',
        );
    })();

    return () => {
      cancelled = true;
      animation?.pause();
    };
  }, [reducedMotion]);

  const camera = getHeroCamera(progress, { skipBlur, reducedMotion });
  const indicatorOpacity = camera.hidden
    ? 0
    : 1 - Math.min(1, progress / 0.1);
  const stageStyle = camera.hidden
    ? {
        opacity: 0,
        visibility: 'hidden',
        pointerEvents: 'none',
        transform: 'translate3d(0, -18vh, 0) scale(1.15)',
        filter: 'none',
      }
    : {
        transform: `translate3d(0, ${camera.translateY}vh, 0) scale(${camera.scale})`,
        filter: camera.blur > 0.2 ? `blur(${camera.blur}px)` : 'none',
        opacity: camera.opacity,
        pointerEvents: camera.opacity < 0.45 ? 'none' : 'auto',
      };

  return (
    <div
      className={`hero${camera.hidden ? ' is-exited' : ''}`}
      aria-hidden={camera.hidden || undefined}
    >
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__floor" aria-hidden="true" />

      <div className="hero__stage" style={stageStyle}>
        <div className="hero__layout">
          <div className="hero__portrait" data-intro>
            <Avatar src={avatarSrc} size="hero" initials="NM" />
          </div>

          <div className="hero__copy">
            <h1 className="hero__heading">
              <span className="hero__kicker" data-intro>
                Hi, I&apos;m
              </span>
              {NAME_LINES.map((word) => (
                <span className="hero__line" key={word} data-intro>
                  {splitChars(word)}
                </span>
              ))}
            </h1>

            <p className="hero__subtitle hero__meta" data-intro>
              Software Engineering Undergraduate
              <span className="hero__dot" aria-hidden="true">
                •
              </span>
              Full-Stack Web Developer
              <span className="hero__dot" aria-hidden="true">
                •
              </span>
              Aspiring DevOps Engineer
            </p>

            <p className="hero__intro hero__meta" data-intro>
              I build full-stack products with a bias for clean systems, and
              I&apos;m learning the infrastructure that keeps them running. This
              site is a scroll through that work — like a camera pushing deeper
              into the corridor.
            </p>

            <div className="hero__actions hero__meta" data-intro>
              <a
                className="hero__btn hero__btn--primary"
                href="#projects"
                onClick={(e) => scrollTo('#projects', e)}
              >
                View Projects
              </a>
              <a
                className="hero__btn hero__btn--ghost"
                href="/resume.pdf"
                download="Muhammad-Nafeel-Resume.pdf"
              >
                Download Resume
              </a>
            </div>
          </div>
        </div>
      </div>

      <div
        className="hero__scroll"
        style={
          camera.hidden || progress > 0.001
            ? { opacity: indicatorOpacity }
            : undefined
        }
        data-intro
        aria-hidden={camera.hidden || progress > 0.08}
      >
        <span className="hero__scroll-mouse" aria-hidden="true">
          <span className="hero__scroll-dot" />
        </span>
        <span className="hero__scroll-label">Scroll</span>
      </div>
    </div>
  );
}
