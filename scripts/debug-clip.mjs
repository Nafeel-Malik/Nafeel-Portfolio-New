import { chromium } from 'playwright';

const url = 'http://127.0.0.1:5174/';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: 'networkidle' });

// Jump near projects — scroll until projects heading visible
await page.evaluate(() => {
  document.getElementById('projects')?.scrollIntoView({ block: 'start' });
});
await page.waitForTimeout(800);
// Nudge into the pin so cards are lit
await page.evaluate(() => window.scrollBy(0, window.innerHeight * 0.55));
await page.waitForTimeout(600);

const report = await page.evaluate(() => {
  const card = [...document.querySelectorAll('.project-card')].find((el) =>
    el.textContent.includes('Tic-Tac-Toe'),
  );
  if (!card) return { error: 'card not found', titles: [...document.querySelectorAll('.project-card__title')].map((t) => t.textContent) };

  const featured = document.querySelector('.project-card--featured');
  const inner = card.querySelector('.project-card__inner');

  function chain(el) {
    const rows = [];
    let node = el;
    while (node && node !== document.documentElement) {
      const cs = getComputedStyle(node);
      const r = node.getBoundingClientRect();
      rows.push({
        tag: node.tagName.toLowerCase(),
        id: node.id || '',
        class: (node.className && String(node.className).slice?.(0, 120)) || '',
        overflow: cs.overflow,
        overflowX: cs.overflowX,
        overflowY: cs.overflowY,
        contain: cs.contain,
        filter: cs.filter,
        transform: cs.transform === 'none' ? 'none' : cs.transform.slice(0, 80),
        isolation: cs.isolation,
        clipPath: cs.clipPath,
        borderRadius: cs.borderRadius,
        width: Math.round(r.width),
        height: Math.round(r.height),
        left: Math.round(r.left),
        right: Math.round(r.right),
        top: Math.round(r.top),
      });
      node = node.parentElement;
    }
    return rows;
  }

  const cardRect = card.getBoundingClientRect();
  const stage = document.querySelector('.projects__stage');
  const grid = document.querySelector('.projects__grid');
  const sticky = document.querySelector('#projects .pinned-section__sticky');
  const projects = document.querySelector('.projects');

  return {
    viewport: { w: innerWidth, h: innerHeight },
    cardRect: {
      left: Math.round(cardRect.left),
      right: Math.round(cardRect.right),
      width: Math.round(cardRect.width),
    },
    featuredRight: featured ? Math.round(featured.getBoundingClientRect().right) : null,
    stageRight: stage ? Math.round(stage.getBoundingClientRect().right) : null,
    gridRight: grid ? Math.round(grid.getBoundingClientRect().right) : null,
    projectsRight: projects ? Math.round(projects.getBoundingClientRect().right) : null,
    stickyRight: sticky ? Math.round(sticky.getBoundingClientRect().right) : null,
    deltas: {
      cardToStage: stage ? Math.round(stage.getBoundingClientRect().right - cardRect.right) : null,
      cardToGrid: grid ? Math.round(grid.getBoundingClientRect().right - cardRect.right) : null,
      cardToProjects: projects ? Math.round(projects.getBoundingClientRect().right - cardRect.right) : null,
      cardToSticky: sticky ? Math.round(sticky.getBoundingClientRect().right - cardRect.right) : null,
    },
    chain: chain(inner || card),
  };
});

console.log(JSON.stringify(report, null, 2));

// Hover the card and screenshot
const tic = page.locator('.project-card', { hasText: 'Tic-Tac-Toe' });
await tic.hover();
await page.waitForTimeout(400);
await page.screenshot({
  path: '/Users/muhammadwaleed/Desktop/Nafeel-Portfolio-New/debug-projects-hover.png',
  fullPage: false,
});

await browser.close();
