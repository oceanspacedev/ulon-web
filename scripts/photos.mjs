// Crops Ulon's own photographs (photos-src/, downloaded from inikopiulon.com) into the WebP files
// the site uses (public/img/). Run: node scripts/photos.mjs
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const SRC = 'photos-src/';
const OUT = 'public/img/';
mkdirSync(OUT, { recursive: true });

/** [source, output name, ratio w/h, width] */
const jobs = [
  // tall photos for the scrolling strips (4:5)
  ['bar-picture1.jpg', 'strip-bar', 4 / 5, 720],
  ['s-307942901.webp', 'strip-barista', 4 / 5, 720],
  ['m-signature.webp', 'strip-signature', 4 / 5, 720],
  ['s-444929177.webp', 'strip-machine', 4 / 5, 720],
  ['s-tuparev.jpg', 'strip-tuparev', 4 / 5, 720],
  ['s-400605032.webp', 'strip-table', 4 / 5, 720],
  ['s-222013586.webp', 'strip-iced', 4 / 5, 720],
  ['s-395089420.jpg', 'strip-grinder', 4 / 5, 720],
  ['s-136430175.webp', 'strip-pourover', 4 / 5, 720],
  ['s-271155170.webp', 'strip-croissant', 4 / 5, 720],
  // big split photos
  ['bar-picture1.jpg', 'split-bar', 1, 1000],
  ['s-307942901.webp', 'split-barista', 1, 1080],
  ['s-444929177.webp', 'split-machine', 4 / 5, 1200],
  ['s-tuparev.jpg', 'split-tuparev', 4 / 5, 1200],
  ['s-tuparev.jpg', 'wide-tuparev', 16 / 9, 1920],
  ['s-136430175.webp', 'split-pourover', 1, 1200],
  // menu categories (1:1)
  ['m-signature.webp', 'menu-signature', 1, 900],
  ['m-literan.jpg', 'menu-literan', 1, 900],
  ['m-noncoffee.webp', 'menu-noncoffee', 1, 900],
  ['m-ncream.webp', 'menu-ncream', 1, 900],
  ['m-squash.webp', 'menu-squash', 1, 900],
  ['m-tea.webp', 'menu-tea', 1, 900],
  ['m-bites.webp', 'menu-bites', 1, 900],
  ['m-snack.webp', 'menu-snack', 1, 900],
  ['m-ricebowl.jpg', 'menu-ricebowl', 1, 900],
  // store cards (4:3), the photo the current site shows for each shop
  ['barista-stock.jpg', 'store-001', 4 / 3, 640],
  ['s-444929177.webp', 'store-002', 4 / 3, 640],
  ['s-136430175.webp', 'store-003', 4 / 3, 640],
  ['s-2021-07-02.jpg', 'store-004', 4 / 3, 640],
  ['s-img8979.jpg', 'store-005', 4 / 3, 640],
  ['s-2022-02-14.jpg', 'store-006', 4 / 3, 640],
  ['s-271155170.webp', 'store-007', 4 / 3, 640],
  ['s-2023-07-01.jpg', 'store-008', 4 / 3, 640],
  ['s-2023-04-14.jpg', 'store-009', 4 / 3, 640],
  ['s-400605032.webp', 'store-010', 4 / 3, 640],
  ['s-222013586.webp', 'store-011', 4 / 3, 640],
  ['s-307942901.webp', 'store-012', 4 / 3, 640],
  ['s-2022-02-15.jpg', 'store-015', 4 / 3, 640],
  ['s-2024-09-18.jpg', 'store-016', 4 / 3, 640],
  ['s-395089420.jpg', 'store-017', 4 / 3, 640],
  ['s-tuparev.jpg', 'store-018', 4 / 3, 640],
  // news
  ['s-230384288.jpg', 'news-proses', 4 / 3, 900],
  ['s-444929177.webp', 'news-manfaat', 4 / 3, 900],
  ['beans.jpg', 'news-sejarah', 4 / 3, 900],
  // faces
  ['av-danu.png', 'av-danu', 1, 120],
  ['av-farhan.png', 'av-farhan', 1, 120],
];

for (const [file, name, ratio, w] of jobs) {
  const meta = await sharp(SRC + file).metadata();
  // never upscale past the source: shrink the box to what the source can fill
  const maxW = Math.min(w, meta.width, Math.round(meta.height * ratio));
  const width = Math.max(1, maxW);
  const height = Math.round(width / ratio);
  const info = await sharp(SRC + file)
    .rotate()
    .resize({ width, height, fit: 'cover', position: 'attention' })
    .webp({ quality: 80 })
    .toFile(`${OUT}${name}.webp`);
  console.log(`${name}.webp ${info.width}x${info.height} ${Math.round(info.size / 1024)}KB`);
}

await sharp(SRC + 'png-1.webp').trim().resize({ height: 160 }).webp({ quality: 90 }).toFile(OUT + 'logo-ink.webp');
await sharp(SRC + 'logo.webp').trim().resize({ height: 160 }).webp({ quality: 90 }).toFile(OUT + 'logo-cream.webp');
console.log('logos done');
