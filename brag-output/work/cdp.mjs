// Minimal Chrome DevTools Protocol driver: launches the installed Chrome headless and talks to it over Node's WebSocket.
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

export async function launch({ port = 9333, profile, width = 1920, height = 1080 }) {
  mkdirSync(profile, { recursive: true });
  const chrome = spawn(
    CHROME,
    [
      '--headless=new',
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profile}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--autoplay-policy=no-user-gesture-required',
      '--hide-scrollbars',
      '--disable-background-timer-throttling',
      '--disable-renderer-backgrounding',
      `--window-size=${width},${height}`,
      'about:blank',
    ],
    { stdio: 'ignore' },
  );
  let ok = false;
  for (let i = 0; i < 100 && !ok; i++) {
    try {
      ok = (await fetch(`http://127.0.0.1:${port}/json/version`)).ok;
    } catch {
      await sleep(150);
    }
  }
  if (!ok) throw new Error('Chrome did not start');
  const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const page = list.find((t) => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r, j) => {
    ws.onopen = r;
    ws.onerror = j;
  });
  let id = 0;
  const pending = new Map();
  const listeners = [];
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) {
      const { res, rej } = pending.get(m.id);
      pending.delete(m.id);
      m.error ? rej(new Error(`${m.error.message}`)) : res(m.result);
    } else listeners.forEach((l) => l(m));
  };
  const send = (method, params = {}) =>
    new Promise((res, rej) => {
      const i = ++id;
      pending.set(i, { res, rej });
      ws.send(JSON.stringify({ id: i, method, params }));
    });
  const evaluate = async (expression) => {
    const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  };
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
  const goto = async (url) => {
    await send('Page.navigate', { url });
    for (let i = 0; i < 100; i++) {
      await sleep(100);
      try {
        if ((await evaluate('document.readyState')) === 'complete') break;
      } catch {
        /* navigating */
      }
    }
    await evaluate('document.fonts.ready.then(() => true)');
  };
  return {
    chrome,
    send,
    evaluate,
    goto,
    on: (f) => listeners.push(f),
    close: () => {
      ws.close();
      chrome.kill();
    },
  };
}
