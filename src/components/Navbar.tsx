import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { img, site, stores } from '../data/site';
import { getLenis } from './motion';
import { ArrowIcon } from './ui';

const links = [
  { to: '/tentang', label: 'Tentang' },
  { to: '/menu', label: 'Menu' },
  { to: '/lokasi', label: 'Lokasi' },
  { to: '/kabar', label: 'Kabar' },
];

const socials = [
  { href: site.instagram, label: 'Instagram' },
  { href: site.tiktok, label: 'TikTok' },
  { href: site.facebook, label: 'Facebook' },
];

/* A floating bar that lines up with the page's content edges. Over the night photo on the home page it is a dark glass;
   everywhere else (and once the page scrolls) it is frosted white with a hairline and a soft shadow.
   A small surface slides behind the link under the pointer and comes back to the current page's link.
   On a phone the menu opens to a full screen of large serif links that rise in one after another. */
export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [mark, setMark] = useState<{ x: number; w: number } | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) getLenis()?.stop();
    else getLenis()?.start();
  }, [open]);

  const current = links.find((l) => pathname.startsWith(l.to))?.to ?? null;

  // place the sliding surface under the hovered link, or the current page's link
  const place = useCallback(() => {
    const key = hovered ?? current;
    const el = key ? navRef.current?.querySelector<HTMLElement>(`[data-to="${key}"]`) : null;
    setMark(el ? { x: el.offsetLeft, w: el.offsetWidth } : null);
  }, [hovered, current]);
  useLayoutEffect(place, [place]);
  useEffect(() => {
    document.fonts?.ready.then(place);
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [place]);

  const dark = pathname === '/' && !scrolled && !open;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 pt-3">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div
            className={`grid h-14 grid-cols-[1fr_auto] items-center rounded-2xl border pl-4 pr-2 backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-300 lg:grid-cols-[1fr_auto_1fr] ${
              dark
                ? 'border-white/15 bg-black/20'
                : 'border-latte bg-white/85 shadow-[0_10px_30px_-18px_rgba(43,37,32,0.35)]'
            }`}
          >
            {/* logo and the shop count, the site's mono detail */}
            <div className="flex items-center gap-4">
              <Link to="/" className="shrink-0" aria-label="Ini Kopi Ulon, ke beranda">
                <img src={img(dark ? 'logo-cream' : 'logo-ink')} alt="" className="h-8 w-auto" />
              </Link>
              <span className={`hidden h-5 w-px xl:block ${dark ? 'bg-white/20' : 'bg-latte'}`} aria-hidden="true" />
              <Link
                to="/lokasi"
                className={`hidden font-mono text-xs tabular-nums transition-colors duration-150 xl:block ${dark ? 'text-ink/70 hover:text-ink' : 'text-muted hover:text-espresso'}`}
              >
                {stores.length} gerai · 6 kota
              </Link>
            </div>

            {/* the page links, with the sliding surface behind them */}
            <nav
              ref={navRef}
              className="relative hidden h-10 items-center lg:flex"
              aria-label="Utama"
              onMouseLeave={() => setHovered(null)}
            >
              <span
                aria-hidden="true"
                className={`absolute inset-y-0 left-0 rounded-xl transition-[transform,width,opacity] duration-300 ease-[var(--ease-soft)] ${dark ? 'bg-ink' : 'bg-paper'}`}
                style={{ transform: `translateX(${mark?.x ?? 0}px)`, width: mark?.w ?? 0, opacity: mark ? 1 : 0 }}
              />
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  data-to={l.to}
                  onMouseEnter={() => setHovered(l.to)}
                  onFocus={() => setHovered(l.to)}
                  onBlur={() => setHovered(null)}
                  // the link sitting on the solid surface flips to the contrasting text colour
                  className={`relative flex h-10 items-center px-4 text-[15px] transition-colors duration-200 ${
                    (hovered ?? current) === l.to
                      ? dark ? 'text-espresso' : 'text-ink'
                      : dark ? 'text-ink/75' : 'text-mocha'
                  }`}
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center justify-end gap-2">
              <a
                href={site.partnerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`hidden px-3 text-[15px] transition-colors duration-150 lg:block ${dark ? 'text-ink/75 hover:text-ink' : 'text-mocha hover:text-espresso'}`}
              >
                Kemitraan
              </a>
              <a
                href={site.orderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`nudge inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-medium transition-colors duration-150 ${
                  dark ? 'bg-ink text-espresso hover:bg-white' : 'bg-paper text-ink hover:bg-[#40372f]'
                }`}
              >
                <span className="sm:hidden">Pesan</span>
                <span className="hidden sm:inline">Pesan online</span>
                <ArrowIcon className="hidden size-4 sm:block" />
              </a>
              <button
                type="button"
                className={`flex h-10 items-center gap-2 rounded-xl border px-3 text-sm transition-colors duration-150 lg:hidden ${
                  dark ? 'border-white/20 text-ink' : 'border-latte text-espresso'
                }`}
                aria-expanded={open}
                aria-controls="phone-menu"
                onClick={() => setOpen((o) => !o)}
              >
                {open ? 'Tutup' : 'Menu'}
                <span className="relative block h-2.5 w-4" aria-hidden="true">
                  <span className={`absolute left-0 block h-[1.5px] w-4 bg-current transition-transform duration-300 ease-[var(--ease-soft)] ${open ? 'top-1 rotate-45' : 'top-0'}`} />
                  <span className={`absolute left-0 block h-[1.5px] w-4 bg-current transition-transform duration-300 ease-[var(--ease-soft)] ${open ? 'top-1 -rotate-45' : 'top-2.5'}`} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* phone menu: large serif links rising in one after another, the order button and the socials at the foot */}
      <div
        id="phone-menu"
        className={`fixed inset-0 z-40 flex flex-col bg-cream px-5 pb-8 pt-28 transition-[opacity,visibility] duration-300 lg:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <nav className="flex flex-col" aria-label="Menu ponsel">
          {[{ to: '/', label: 'Beranda' }, ...links].map((l, i) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              style={{ transitionDelay: open ? `${80 + i * 60}ms` : '0ms' }}
              className={({ isActive }) =>
                `flex items-baseline gap-4 border-b border-latte py-3 transition-[opacity,transform] duration-500 ease-[var(--ease-soft)] ${
                  open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                } ${isActive ? 'text-espresso' : 'text-mocha'}`
              }
            >
              <span className="w-6 font-mono text-xs tabular-nums text-muted">0{i + 1}</span>
              <span className="font-display text-[2.75rem] leading-[1.1]">{l.label}</span>
            </NavLink>
          ))}
        </nav>

        <div
          className={`mt-auto transition-[opacity,transform] duration-500 ease-[var(--ease-soft)] ${open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
          style={{ transitionDelay: open ? '420ms' : '0ms' }}
        >
          <div className="mb-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-mocha">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-espresso">
                {s.label}
              </a>
            ))}
            <a href={site.partnerUrl} target="_blank" rel="noopener noreferrer" className="hover:text-espresso">
              Kemitraan
            </a>
          </div>
          <a
            href={site.orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-paper text-[15px] font-medium text-ink"
          >
            Pesan online
            <ArrowIcon />
          </a>
        </div>
      </div>
    </>
  );
}
