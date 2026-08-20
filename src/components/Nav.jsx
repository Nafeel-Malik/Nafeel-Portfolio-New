import { useEffect, useState } from 'react';
import { useLenis } from 'lenis/react';
import { useAnchorScroll } from '../hooks/useAnchorScroll';
import { Avatar } from './Avatar';
import './Nav.css';

const links = [
  { href: '#hero', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
];

function sectionInFocus(id) {
  const el = document.getElementById(id);
  if (!el) return false;
  const vh = window.innerHeight || 1;
  if (el.classList.contains('pinned-section')) {
    const sticky = el.querySelector('.pinned-section__sticky');
    const stickyRect = sticky?.getBoundingClientRect();
    if (!stickyRect) return false;
    return stickyRect.top <= vh * 0.2 && stickyRect.bottom >= vh * 0.55;
  }
  const rect = el.getBoundingClientRect();
  return rect.top < vh * 0.45 && rect.bottom > vh * 0.35;
}

export function Nav() {
  const scrollTo = useAnchorScroll();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('#hero');

  useLenis(() => {
    const next = window.scrollY > 24;
    setScrolled((prev) => (prev === next ? prev : next));

    let nextActive = '#hero';
    if (sectionInFocus('contact')) nextActive = '#contact';
    else if (sectionInFocus('projects')) nextActive = '#projects';
    else if (sectionInFocus('about')) nextActive = '#about';
    else if (sectionInFocus('hero') || window.scrollY < 80) nextActive = '#hero';
    setActive((prev) => (prev === nextActive ? prev : nextActive));
  });

  useEffect(() => {
    if (location.hash === '#home' || location.hash === '#hero') {
      setActive('#hero');
    } else if (location.hash) {
      setActive(location.hash);
    }
  }, []);

  return (
    <header className={`site-nav ${scrolled ? 'is-scrolled' : ''}`}>
      <a
        href="#hero"
        className="site-nav__brand"
        aria-label="Muhammad Nafeel — Home"
        onClick={(e) => scrollTo('#hero', e)}
      >
        <Avatar size="nav" initials="NM" />
      </a>
      <nav aria-label="Primary">
        <ul className="site-nav__links">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={active === link.href ? 'is-active' : undefined}
                aria-current={active === link.href ? 'page' : undefined}
                onClick={(e) => scrollTo(link.href, e)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
