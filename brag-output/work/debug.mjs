import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { launch } from './cdp.mjs';
import { serve } from './server.mjs';
const here = dirname(fileURLToPath(import.meta.url));
const server = await serve(5199);
const b = await launch({ port: 9336, profile: join(here, 'chrome-verify') });
try {
  await b.goto('http://127.0.0.1:5199/blank.html');
  console.log(JSON.stringify(await b.evaluate(`(async () => {
    const v = document.createElement('video'); v.src = URL.createObjectURL(await (await fetch('/check.mp4')).blob()); v.muted = true; document.body.append(v);
    await new Promise((r, j) => { v.onloadedmetadata = r; v.onerror = () => j(new Error('err ' + v.error?.code + ' ' + v.error?.message)); });
    const out = { duration: v.duration, w: v.videoWidth };
    const c = document.createElement('canvas'); c.width = 64; c.height = 36; const x = c.getContext('2d', { willReadFrequently: true });
    const sig = () => { x.drawImage(v, 0, 0, 64, 36); const d = x.getImageData(0, 0, 64, 36).data; let s = 0; for (let i = 0; i < d.length; i += 4) s += d[i] * (i % 97); return s; };
    out.sigs = [];
    for (const t of [0.1, 1.5, 5, 11, 20]) { v.currentTime = t; await new Promise((r) => (v.onseeked = r)); await new Promise(r => setTimeout(r, 300)); out.sigs.push([t, v.currentTime, sig()]); }
    return out;
  })()`)));
} finally { b.close(); server.close(); }
process.exit(0);
