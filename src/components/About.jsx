import { useEffect, useRef, useState } from 'react';
import { avatarSrc, social } from '../data/site';
import { useMotionFlags } from '../hooks/useMotionFlags';
import { getAboutCamera } from '../utils/corridorCamera';
import { OrbitFrame } from './OrbitFrame';
import { SectionHeader } from './SectionHeader';
import { TechChip } from './TechChip';
import './About.css';

const TECH = [
  'C++',
  'JavaScript',
  'React',
  'HTML5',
  'CSS3',
  'Vite',
  'Node.js',
  'Git',
];

const CHIP_TRIGGER = 0.72;
const CHIP_RESET = 0.22;

function MailIcon() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
      <path
        fill="currentColor"
        d="M1.5 3h13A1.5 1.5 0 0 1 16 4.5v7A1.5 1.5 0 0 1 14.5 13h-13A1.5 1.5 0 0 1 0 11.5v-7A1.5 1.5 0 0 1 1.5 3Zm.44 1.5 5.5 3.67a.9.9 0 0 0 1.12 0l5.5-3.67H1.94Zm12.56 1.2-5.16 3.44a2.4 2.4 0 0 1-2.68 0L1.5 5.7v5.8h13V5.7Z"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
      <path
        fill="currentColor"
        d="M6.4 11.3 3.2 8.1l1.13-1.13 2.07 2.07 5.27-5.27L12.8 4.9 6.4 11.3Z"
      />
    </svg>
  );
}

function EmailTag({ email }) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(0);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const field = document.createElement('textarea');
      field.value = email;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.left = '-9999px';
      document.body.appendChild(field);
      field.select();
      document.execCommand('copy');
      document.body.removeChild(field);
    }

    setCopied(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      className={`about__tag about__tag--button ${copied ? 'is-copied' : ''}`}
      onClick={copyEmail}
      aria-label={copied ? 'Email copied' : `Copy email ${email}`}
    >
      {copied ? <CheckIcon /> : <MailIcon />}
      <span aria-live="polite">{copied ? 'Copied!' : email}</span>
    </button>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
      <path
        fill="currentColor"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.68 7.68 0 0 1 8 4.07c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
      <path
        fill="currentColor"
        d="M14.5 0h-13A1.5 1.5 0 0 0 0 1.5v13A1.5 1.5 0 0 0 1.5 16h13a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 14.5 0ZM4.75 13.5H2.5V6h2.25v7.5ZM3.63 4.97a1.31 1.31 0 1 1 0-2.62 1.31 1.31 0 0 1 0 2.62ZM13.5 13.5h-2.24V9.75c0-.9-.02-2.05-1.25-2.05-1.25 0-1.44.98-1.44 1.98V13.5H6.33V6h2.15v1.03h.03c.3-.57 1.03-1.17 2.12-1.17 2.27 0 2.69 1.49 2.69 3.43V13.5Z"
      />
    </svg>
  );
}

export function About({ progress = 0 }) {
  const { skipBlur, reducedMotion, coarsePointer } = useMotionFlags();
  const camera = getAboutCamera(progress, { skipBlur, reducedMotion });
  const chipsRef = useRef(null);
  const playedRef = useRef(reducedMotion);
  const [chipsRevealed, setChipsRevealed] = useState(reducedMotion);
  const [chipsSettled, setChipsSettled] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      playedRef.current = true;
      setChipsRevealed(true);
      setChipsSettled(true);
      return;
    }

    if (camera.focus >= CHIP_TRIGGER && !playedRef.current) {
      playedRef.current = true;
      setChipsRevealed(true);
      return;
    }

    if (camera.focus <= CHIP_RESET && playedRef.current) {
      playedRef.current = false;
      setChipsRevealed(false);
      setChipsSettled(false);
    }
  }, [camera.focus, reducedMotion]);

  useEffect(() => {
    const chips = chipsRef.current?.querySelectorAll('[data-about-chip]');
    if (!chips?.length) return undefined;

    if (reducedMotion) {
      chips.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return undefined;
    }

    if (!chipsRevealed) {
      chips.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'scale(0)';
      });
      return undefined;
    }

    let animation;
    let cancelled = false;

    (async () => {
      const anime = (await import('animejs')).default;
      if (cancelled) return;

      animation = anime({
        targets: chips,
        opacity: [0, 1],
        scale: [0, 1],
        translateY: [18, 0],
        delay: anime.stagger(70),
        duration: 780,
        easing: 'easeOutElastic(1, .82)',
        complete: () => {
          if (!cancelled) setChipsSettled(true);
        },
      });
    })();

    return () => {
      cancelled = true;
      animation?.pause();
    };
  }, [chipsRevealed, reducedMotion]);

  return (
    <div
      className={`about${camera.hidden ? ' is-exited' : ''}`}
      aria-hidden={camera.hidden || undefined}
    >
      <div
        className="about__veil"
        aria-hidden="true"
        style={{ opacity: camera.veil }}
      />
      <div className="about__glow" aria-hidden="true" />

      <div
        className="about__stage"
        style={
          camera.hidden
            ? {
                opacity: 0,
                visibility: 'hidden',
                pointerEvents: 'none',
                transform: 'none',
                filter: 'none',
              }
            : {
                transform: `translate3d(0, ${camera.translateY ?? 0}vh, 0) scale(${camera.scale})`,
                filter: camera.blur > 0.2 ? `blur(${camera.blur}px)` : 'none',
                opacity: camera.opacity,
                pointerEvents: camera.opacity < 0.4 ? 'none' : 'auto',
              }
        }
      >
        <SectionHeader index={1} eyebrow="About" title="Who Am I" />

        <div className="about__layout">
          <div className="about__portrait">
            <OrbitFrame src={avatarSrc} initials="NM" />
          </div>

          <div className="about__copy">
            <p className="about__bio">
              I specialize in building{' '}
              <strong>efficient full-stack web applications</strong>, exploring
              modern DevOps automation practices, and solving complex
              algorithmic challenges through <strong>clean code</strong>.
            </p>
            <p className="about__bio">
              With a strong foundation in{' '}
              <strong>core computer science principles and C++</strong>, I enjoy
              bridging lower-level systems thinking with{' '}
              <strong>intuitive frontend web design</strong>.
            </p>

            <div className="about__tags">
              <EmailTag email={social.email} />
              <a
                className="about__tag"
                href={social.github.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`GitHub — ${social.github.label}`}
                title={social.github.label}
              >
                <GitHubIcon />
                <span className="about__tag-label about__tag-label--full" aria-hidden="true">
                  {social.github.label}
                </span>
                <span className="about__tag-label about__tag-label--short" aria-hidden="true">
                  GitHub
                </span>
              </a>
              <a
                className="about__tag"
                href={social.linkedin.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`LinkedIn — ${social.linkedin.label}`}
                title={social.linkedin.label}
              >
                <LinkedInIcon />
                <span className="about__tag-label about__tag-label--full" aria-hidden="true">
                  {social.linkedin.label}
                </span>
                <span className="about__tag-label about__tag-label--short" aria-hidden="true">
                  LinkedIn
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="about__stack">
          <p className="about__stack-label">Tech stack</p>
          <ul className="about__chips" ref={chipsRef}>
            {TECH.map((label) => (
              <TechChip
                key={label}
                label={label}
                revealed={chipsRevealed}
                magnetic={!reducedMotion && !coarsePointer && chipsSettled}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
