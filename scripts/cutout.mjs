// Removes the background from a few of Ulon's product photos (dev tool, run once).
// Needs the remover, installed only for this: npm i --no-save @imgly/background-removal-node
// node scripts/cutout.mjs [files...]  ->  photos-src/cut/<name>.png
import { removeBackground } from '@imgly/background-removal-node';
import { writeFileSync, mkdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

mkdirSync('photos-src/cut', { recursive: true });
const files = process.argv.slice(2).length ? process.argv.slice(2) : ['m-signature.webp', 's-222013586.webp', 'm-noncoffee.webp', 's-400605032.webp', 'm-bites.webp', 's-271155170.webp'];
for (const f of files) {
  try {
    const blob = await removeBackground(pathToFileURL(resolve('photos-src', f)).href, { output: { format: 'image/png' } });
    const out = resolve('photos-src/cut', f.replace(/\.\w+$/, '.png'));
    writeFileSync(out, Buffer.from(await blob.arrayBuffer()));
    console.log('cut', out);
  } catch (e) {
    console.log('failed', f, e.message.split('\n')[0]);
  }
}
