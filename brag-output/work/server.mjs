// Serves the work folder to the headless Chrome and saves what the page posts back (stills, the poster, the video).
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json' };

export function serve(port = 5199) {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://x');
    if (req.method === 'POST' && url.pathname === '/save') {
      const name = url.searchParams.get('name') ?? 'out.bin';
      if (!/^[\w./-]+$/.test(name) || name.includes('..')) return res.writeHead(400).end();
      const chunks = [];
      for await (const c of req) chunks.push(c);
      const target = join(here, '..', name);
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, Buffer.concat(chunks));
      return res.writeHead(200).end('ok');
    }
    const file = normalize(join(here, url.pathname === '/' ? 'compose.html' : url.pathname));
    if (!file.startsWith(here)) return res.writeHead(403).end();
    try {
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' }).end(body);
    } catch {
      res.writeHead(404).end();
    }
  });
  return new Promise((r) => server.listen(port, '127.0.0.1', () => r(server)));
}
