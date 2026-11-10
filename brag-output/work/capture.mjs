// Captures the real Ulon pages from the running dev server as 1920x1080 stills, plus where the cursor should go.
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { launch, sleep } from './cdp.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, 'shots');
const BASE = 'http://localhost:5173';
const b = await launch({ profile: join(here, 'chrome-capture') });
const meta = {};

const settle = () =>
  b.evaluate(`(async () => {
    document.querySelectorAll('.reveal, .reveal-clip, .split').forEach((e) => e.classList.add('is-in'));
    await new Promise((r) => setTimeout(r, 50));
    document.getAnimations().forEach((a) => { try { if (a.effect?.getTiming().iterations !== Infinity) a.finish(); } catch {} });
    return true;
  })()`);
const shot = async (name) => {
  const { data } = await b.send('Page.captureScreenshot', { format: 'jpeg', quality: 92 });
  writeFileSync(join(out, `${name}.jpg`), Buffer.from(data, 'base64'));
  console.log('shot', name);
};
const move = (x, y) => b.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
const click = async (x, y) => {
  await move(x, y);
  await b.send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
  await b.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });
};
const center = (sel) =>
  b.evaluate(`(() => { const r = ${sel}.getBoundingClientRect(); return [Math.round(r.left + r.width / 2), Math.round(r.top + r.height / 2)]; })()`);

const ONLY = process.env.ONLY;
if (!ONLY) {
// 1. Beranda, first screen
await b.goto(`${BASE}/`);
await sleep(3200);
await shot('home');
meta.homeMenuLink = await center(`document.querySelector('nav[aria-label="Utama"] [data-to="/menu"]')`);

// 2. Menu: the Kopi group, pointing at each item in turn
await b.goto(`${BASE}/menu`);
await sleep(1500);
await b.evaluate(`window.scrollTo(0, document.getElementById('kopi').getBoundingClientRect().top + scrollY - 150); true`);
await sleep(600);
await settle();
meta.menuRows = [];
for (let i = 0; i < 3; i++) {
  const c = await center(`document.querySelectorAll('#kopi li')[${i}]`);
  meta.menuRows.push(c);
  await move(c[0], c[1]);
  await sleep(1000);
  await settle();
  await shot(`menu-${i}`);
}
await move(5, 5);

// 3. Tentang: Pilar Ulon, one pillar at a time
await b.goto(`${BASE}/tentang`);
await sleep(1500);
const top = await b.evaluate(`document.getElementById('pillars-h').closest('section').getBoundingClientRect().top + scrollY`);
const step = await b.evaluate(`document.getElementById('pillars-h').closest('section').querySelector('.sticky').offsetHeight`);
for (let i = 0; i < 4; i++) {
  await b.evaluate(`window.scrollTo(0, ${top + i * step}); true`);
  await sleep(1400);
  await settle();
  await shot(`pillar-${i}`);
}

}
// 4. Lokasi: the street and pickers, open the city list, pick Jakarta
await b.goto(`${BASE}/lokasi`);
await sleep(1500);
await b.evaluate(`window.scrollTo(0, document.querySelector('header + div').getBoundingClientRect().top + scrollY - 104); true`);
await sleep(900);
await settle();
await shot('lokasi-a');
meta.citySelect = await center(`document.querySelector('[aria-haspopup="listbox"]')`);
await click(...meta.citySelect);
await sleep(500);
await settle();
await shot('lokasi-b');
meta.jakarta = await center(`[...document.querySelectorAll('[role=option] button')].find((x) => x.textContent.startsWith('Jakarta'))`);
await click(...meta.jakarta);
await move(...meta.jakarta);
await sleep(1500);
await settle();
await shot('lokasi-c');

const prev = ONLY ? JSON.parse((await import('node:fs')).readFileSync(join(out, 'meta.json'), 'utf8')) : {};
writeFileSync(join(out, 'meta.json'), JSON.stringify({ ...prev, ...meta }, null, 2));
console.log(meta);
b.close();
process.exit(0);
