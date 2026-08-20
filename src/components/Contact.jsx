import { useEffect, useRef, useState } from 'react';
import { social } from '../data/site';
import { easeOutCubic, mapProgress, usePinnedSection } from '../hooks/usePinnedSection';
import { useMotionFlags } from '../hooks/useMotionFlags';
import { SectionHeader } from './SectionHeader';
import './Contact.css';

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

function CopyIcon() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
      <path
        fill="currentColor"
        d="M6 2.5A1.5 1.5 0 0 1 7.5 1h5A1.5 1.5 0 0 1 14 2.5v7A1.5 1.5 0 0 1 12.5 11H12v.5A1.5 1.5 0 0 1 10.5 13h-5A1.5 1.5 0 0 1 4 11.5v-7A1.5 1.5 0 0 1 5.5 3H6V2.5Zm1.5-.5a.5.5 0 0 0-.5.5V3h3.5A1.5 1.5 0 0 1 12 4.5V10h.5a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5h-5ZM5.5 4a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5h-5Z"
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

async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const field = document.createElement('textarea');
    field.value = value;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.left = '-9999px';
    document.body.appendChild(field);
    field.select();
    document.execCommand('copy');
    document.body.removeChild(field);
  }
}

const INITIAL_FORM = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

export function Contact() {
  const sectionRef = useRef(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState('idle');
  const timerRef = useRef(0);
  const { reducedMotion } = useMotionFlags();
  const { progress } = usePinnedSection(sectionRef, { range: 'enter-exit' });

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const arrive = reducedMotion
    ? 1
    : mapProgress(progress, 0.08, 0.42, easeOutCubic);
  const stageStyle = reducedMotion
    ? undefined
    : {
        opacity: 0.2 + arrive * 0.8,
        transform: `translate3d(0, ${(1 - arrive) * 2.75}rem, 0) scale(${0.96 + arrive * 0.04})`,
        filter: arrive > 0.75 ? 'none' : `blur(${(1 - arrive) * 2.5}px)`,
      };

  const onCopyEmail = async () => {
    await copyText(social.email);
    setCopied(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), 1600);
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();
    const subject = form.subject.trim() || 'Portfolio inquiry';
    const message = form.message.trim();

    if (!name || !email || !message) {
      setStatus('error');
      return;
    }

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      '',
      message,
    ].join('\n');

    const mailto = `mailto:${social.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus('sent');
    window.location.href = mailto;
    setForm(INITIAL_FORM);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setStatus('idle'), 4000);
  };

  return (
    <section id="contact" className="contact" aria-label="Contact" ref={sectionRef}>
      <div className="contact__glow" aria-hidden="true" />

      <div className="contact__inner" style={stageStyle}>
        <SectionHeader index={3} eyebrow="Contact" title="Get In Touch" />

        <div className="contact__layout">
          <div className="contact__info">
            <p className="contact__bio">
              I build full-stack products with a bias for clean systems. Feel
              free to reach out for collaborations or opportunities.
            </p>

            <div className="contact__pills">
              <a
                className="contact__pill"
                href={`mailto:${social.email}`}
                aria-label={`Email ${social.email}`}
              >
                <MailIcon />
                <span>{social.email}</span>
              </a>

              <button
                type="button"
                className={`contact__pill contact__pill--button ${copied ? 'is-copied' : ''}`}
                onClick={onCopyEmail}
                aria-label={copied ? 'Email copied' : `Copy email ${social.email}`}
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
                <span aria-live="polite">{copied ? 'Copied!' : 'Copy email'}</span>
              </button>

              <a
                className="contact__pill"
                href={social.github.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`GitHub — ${social.github.label}`}
                title={social.github.label}
              >
                <GitHubIcon />
                <span className="contact__pill-label contact__pill-label--full">
                  {social.github.label}
                </span>
                <span className="contact__pill-label contact__pill-label--short" aria-hidden="true">
                  GitHub
                </span>
              </a>

              <a
                className="contact__pill"
                href={social.linkedin.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`LinkedIn — ${social.linkedin.label}`}
                title={social.linkedin.label}
              >
                <LinkedInIcon />
                <span className="contact__pill-label contact__pill-label--full">
                  {social.linkedin.label}
                </span>
                <span className="contact__pill-label contact__pill-label--short" aria-hidden="true">
                  LinkedIn
                </span>
              </a>
            </div>
          </div>

          <form className="contact__form" onSubmit={onSubmit} noValidate>
            <div className="contact__field">
              <label htmlFor="contact-name">Name</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                value={form.name}
                onChange={onChange}
                required
              />
            </div>

            <div className="contact__field">
              <label htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={onChange}
                required
              />
            </div>

            <div className="contact__field">
              <label htmlFor="contact-subject">Subject</label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                placeholder="What’s this about?"
                value={form.subject}
                onChange={onChange}
              />
            </div>

            <div className="contact__field">
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                placeholder="Tell me a bit about the project or opportunity…"
                value={form.message}
                onChange={onChange}
                required
              />
            </div>

            <div className="contact__actions">
              <button type="submit" className="contact__submit">
                Send Message
              </button>
              <p
                className={`contact__status${status !== 'idle' ? ' is-visible' : ''}`}
                role="status"
                aria-live="polite"
              >
                {status === 'error' && 'Please fill in name, email, and message.'}
                {status === 'sent' && 'Opening your email client…'}
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
