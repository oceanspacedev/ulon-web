// Cleans the background-removed PNGs (photos-src/cut) and writes them as WebP with alpha to public/img/cut-*.webp.
// Drops the faint haze the remover leaves (alpha under 50%), crops to the subject, trims.
// Run: node scripts/cutout-export.mjs
import sharp from 'sharp';

/** [source png, output name, crop {left, top, width, height} or null, output height] */
const jobs = [
  ['m-signature.png', 'cut-signature', { left: 560, top: 260, width: 640, height: 760 }, 1100],
  ['s-400605032.png', 'cut-iced', { left: 180, top: 90, width: 360, height: 470 }, 900],
  ['m-noncoffee.png', 'cut-hands', null, 1000],
  ['m-bites.png', 'cut-croissant', null, 700],
];

for (const [file, name, crop, h] of jobs) {
  let img = sharp(`photos-src/cut/${file}`).ensureAlpha();
  if (crop) img = img.extract(crop);
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  for (let i = 3; i < data.length; i += 4) data[i] = data[i] < 128 ? 0 : Math.min(255, Math.round((data[i] - 128) * 2));
  const out = await sharp(data, { raw: info })
    .trim()
    .resize({ height: h, withoutEnlargement: true })
    .webp({ quality: 85, alphaQuality: 90 })
    .toFile(`public/img/${name}.webp`);
  console.log(`${name}.webp ${out.width}x${out.height} ${Math.round(out.size / 1024)}KB`);
}
