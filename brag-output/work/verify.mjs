// Plays the finished MP4 back in Chrome: duration, size, frames at chosen times, and the decoded audio.
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { launch } from './cdp.mjs';
import { serve } from './server.mjs';
const here = dirname(fileURLToPath(import.meta.url));
const server = await serve(5199);
const b = await launch({ port: 9335, profile: join(here, 'chrome-verify') });
try {
  await b.goto('http://127.0.0.1:5199/blank.html');
  console.log(await b.evaluate(`(async () => {
    const v = document.createElement('video'); v.src = URL.createObjectURL(await (await fetch('/check.mp4')).blob()); v.muted = true; document.body.append(v);
    await new Promise((r, j) => { v.onloadeddata = r; v.onerror = () => j(new Error('video error ' + v.error?.code)); });
    const c = document.createElement('canvas'); c.width = 640; c.height = 360; const x = c.getContext('2d');
    const times = [0, 0.3, 0.7, 1.4, 2.0, 3.5, 5.5, 9.4, 10.6, 13.6, 16.0, 19.6];
    for (const t of times) {
      v.currentTime = t; await new Promise((r) => (v.onseeked = r));
      x.drawImage(v, 0, 0, 640, 360);
      const blob = await new Promise((r) => c.toBlob(r, 'image/jpeg', 0.85));
      await fetch('/save?name=work/verify/f' + t.toFixed(1) + '.jpg', { method: 'POST', body: blob });
    }
    const ab = await (await fetch('/check.mp4')).arrayBuffer();
    const audio = await new OfflineAudioContext(2, 48000, 48000).decodeAudioData(ab);
    let s = 0; const d = audio.getChannelData(0); for (let i = 0; i < d.length; i++) s += d[i] * d[i];
    return { duration: v.duration, w: v.videoWidth, h: v.videoHeight, audioSeconds: audio.duration.toFixed(2), audioRmsDb: (10 * Math.log10(s / d.length)).toFixed(1) };
  })()`));
} finally { b.close(); server.close(); }
process.exit(0);
