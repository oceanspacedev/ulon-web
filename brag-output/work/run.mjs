// Drives the composition in headless Chrome. Usage: node run.mjs stills 0.5 3 ... | node run.mjs audio | node run.mjs record
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { launch } from './cdp.mjs';
import { serve } from './server.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const [mode, ...args] = process.argv.slice(2);
const server = await serve(5199);
const b = await launch({ port: 9334, profile: join(here, 'chrome-compose') });
try {
  await b.goto('http://127.0.0.1:5199/compose.html');
  await b.evaluate('window.READY');
  if (mode === 'stills') console.log(await b.evaluate(`window.stills(${JSON.stringify(args.map(Number))})`));
  if (mode === 'audio') console.log('peak', await b.evaluate('window.audioWav()'));
  if (mode === 'record') {
    console.log('mime', await b.evaluate('window.record()'));
    console.log(await b.evaluate('window.poster()'));
  }
  if (mode === 'encode') { console.log(await b.evaluate('window.encode()')); console.log(await b.evaluate('window.poster()')); }
  if (mode === 'probe') console.log(await b.evaluate(`['video/mp4;codecs=avc1.640028,mp4a.40.2','video/mp4'].map(m => m + ' ' + MediaRecorder.isTypeSupported(m)).join('\\n')`));
} finally {
  b.close();
  server.close();
}
process.exit(0);
