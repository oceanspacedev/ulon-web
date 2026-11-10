import { useEffect, useMemo, useRef, useState } from 'react';
import { cities, img, site, stores, type City, type Store } from '../data/site';
import { getLenis, Reveal, Title } from '../components/motion';

/* The store finder laid out like Tuku's: a centred title over a street of shopfronts, two centred pickers,
   a three-column grid of shop cards (photo, a tinted panel with name, address, directions and photos, and a dark bar
   that unfolds more information), and "load more" under the grid. */

const PAGE = 6;

// Card panels take turns between three soft tints, as Tuku's do between its colours.
const tints = ['bg-[#efe4d6]', 'bg-[#e6e6da]', 'bg-[#f1ddcb]'];

// Approximate city centres, used only to pick the closest city for "Cek gerai terdekat". The position never leaves the browser.
const cityCentre: Record<City, [number, number]> = {
  Cirebon: [-6.7063, 108.557],
  Jakarta: [-6.2088, 106.8456],
  Bekasi: [-6.2383, 106.9756],
  Tangerang: [-6.1783, 106.6319],
  Subang: [-6.5715, 107.7587],
  Yogyakarta: [-7.7956, 110.3695],
};
const nearestCity = (lat: number, lon: number) =>
  (Object.keys(cityCentre) as City[]).reduce((best, c) => {
    const d = (p: [number, number]) => (p[0] - lat) ** 2 + ((p[1] - lon) * Math.cos((lat * Math.PI) / 180)) ** 2;
    return d(cityCentre[c]) < d(cityCentre[best]) ? c : best;
  }, 'Cirebon' as City);

function Chevron({ className = '' }: { className?: string }) {
  return (
    <svg className={`size-4 ${className}`} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* Shopfronts standing side by side on one ground line, like Tuku's drawn street. */
const street = [
  { code: '005', h: 'h-[62%]' },
  { code: '015', h: 'h-[84%]' },
  { code: '018', h: 'h-full' },
  { code: '006', h: 'h-[74%]' },
  { code: '008', h: 'h-[88%]' },
];
function Street() {
  return (
    <div className="mx-auto mt-12 max-w-5xl px-5 md:mt-14 md:px-10" aria-hidden="true">
      <div className="flex h-48 items-end gap-2 md:h-72 md:gap-3">
        {street.map((s, i) => (
          <Reveal key={s.code} delay={i * 90} className={`flex-1 ${s.h} ${i === 0 || i === 4 ? 'hidden sm:block' : ''}`}>
            <img src={img(`store-${s.code}`)} alt="" className="h-full w-full rounded-t-2xl object-cover" />
          </Reveal>
        ))}
      </div>
      <div className="h-px bg-espresso/40" />
    </div>
  );
}

/* A centred pill that opens a short list: the city picker. */
function CitySelect({ value, onChange }: { value: 'Semua' | City; onChange: (c: 'Semua' | City) => void }) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [open]);

  const options = ['Semua', ...cities] as const;
  const count = (c: 'Semua' | City) => (c === 'Semua' ? stores.length : stores.filter((s) => s.city === c).length);

  return (
    <div ref={box} className="relative min-w-0 flex-1 basis-0 sm:flex-none sm:basis-auto">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-12 w-full items-center justify-between gap-3 rounded-full border border-espresso/20 bg-oat px-5 text-[15px] text-espresso transition-colors duration-150 hover:border-espresso/50 sm:w-56"
      >
        {value === 'Semua' ? 'Semua kota' : value}
        <Chevron className={`transition-transform duration-300 ease-[var(--ease-soft)] ${open ? 'rotate-180' : ''}`} />
      </button>
      <ul
        role="listbox"
        aria-label="Kota"
        className={`absolute left-0 top-full z-30 mt-2 w-full origin-top overflow-hidden rounded-2xl border border-latte bg-cream p-1 text-left shadow-[0_16px_40px_-20px_rgba(43,37,32,0.4)] transition-[opacity,transform] duration-200 ease-[var(--ease-soft)] sm:w-56 ${
          open ? 'visible scale-100 opacity-100' : 'invisible scale-95 opacity-0'
        }`}
      >
        {options.map((c) => (
          <li key={c} role="option" aria-selected={c === value}>
            <button
              type="button"
              onClick={() => {
                onChange(c);
                setOpen(false);
              }}
              className={`flex h-10 w-full items-center justify-between rounded-xl px-3 text-[15px] transition-colors duration-150 ${
                c === value ? 'bg-paper text-ink' : 'text-mocha hover:bg-raised hover:text-espresso'
              }`}
            >
              {c === 'Semua' ? 'Semua kota' : c}
              <span className={`text-xs tabular-nums ${c === value ? 'text-ink/60' : 'text-muted'}`}>{count(c)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* One shop card: photo, a tinted panel with the name, address, directions and photos, and a dark bar that unfolds more. */
function StoreCard({ s, tint, onPhoto }: { s: Store; tint: string; onPhoto: () => void }) {
  const [more, setMore] = useState(false);
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`Ini Kopi Ulon ${s.name}, ${s.address}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked: nothing to do */
    }
  };

  return (
    <article className="lift-img overflow-hidden rounded-2xl">
      <button type="button" onClick={onPhoto} className="block w-full overflow-hidden" aria-label={`Lihat foto gerai ${s.name}`}>
        <img src={img(`store-${s.code}`)} alt={`Gerai Ini Kopi Ulon ${s.name}`} className="aspect-[3/2] w-full object-cover" loading="lazy" />
      </button>

      <div className={`${tint} px-6 pb-5 pt-6 text-center`}>
        <p className="text-xs tabular-nums text-mocha">
          No. {s.code} · {s.city}
        </p>
        <h2 className="mt-1.5 font-sans text-xl font-medium tracking-normal">Ini Kopi Ulon {s.name}</h2>
        <p className="mx-auto mt-2 line-clamp-2 min-h-10 max-w-xs text-sm text-mocha">{s.address}</p>
        <div className="mt-4 flex items-center justify-center gap-6 text-sm font-medium">
          <a href={s.map} target="_blank" rel="noopener noreferrer" className="underline decoration-espresso/30 underline-offset-4 transition-colors duration-150 hover:decoration-espresso">
            Petunjuk arah
          </a>
          <button type="button" onClick={onPhoto} className="underline decoration-espresso/30 underline-offset-4 transition-colors duration-150 hover:decoration-espresso">
            Galeri foto
          </button>
        </div>

        {/* more information, unfolding inside the panel */}
        <div className={`grid transition-[grid-template-rows] duration-500 ease-[var(--ease-soft)] ${more ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
          <div className="overflow-hidden">
            <div className="mt-5 border-t border-espresso/15 pt-4 text-sm">
              <p className="text-mocha">{s.address}</p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <a
                  href={site.orderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 items-center rounded-full bg-paper px-4 text-sm font-medium text-ink transition-colors duration-150 hover:bg-[#40372f]"
                >
                  Pesan online
                </a>
                <button type="button" onClick={copy} className="inline-flex h-9 items-center rounded-full border border-espresso/20 px-4 text-sm transition-colors duration-150 hover:border-espresso/50">
                  {copied ? 'Alamat disalin' : 'Salin alamat'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-expanded={more}
        onClick={() => setMore((m) => !m)}
        className="flex h-11 w-full items-center justify-center gap-2 bg-paper text-sm font-medium text-ink transition-colors duration-150 hover:bg-[#40372f]"
      >
        {more ? 'Tutup informasi' : 'Informasi lebih lanjut'}
        <Chevron className={`transition-transform duration-300 ease-[var(--ease-soft)] ${more ? 'rotate-180' : ''}`} />
      </button>
    </article>
  );
}

/* A large view of a shop's photo; the arrows step through the shops in the current list. */
function Viewer({ list, index, onClose, onStep }: { list: Store[]; index: number | null; onClose: () => void; onStep: (d: 1 | -1) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const s = index === null ? null : list[index];
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (s && !d.open) {
      d.showModal();
      getLenis()?.stop();
    }
    if (!s && d.open) d.close();
  }, [s]);
  useEffect(() => {
    if (!s) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') onStep(1);
      if (e.key === 'ArrowLeft') onStep(-1);
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [s, onStep]);

  return (
    <dialog
      ref={ref}
      onClose={() => {
        getLenis()?.start();
        onClose();
      }}
      onClick={(e) => e.target === ref.current && ref.current?.close()}
      className="m-auto w-[min(64rem,calc(100%-2.5rem))] overflow-hidden rounded-2xl bg-cream p-0 text-espresso backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      aria-label={s ? `Foto gerai ${s.name}` : 'Foto gerai'}
    >
      {s && (
        <div>
          <img key={s.code} src={img(`store-${s.code}`)} alt={`Gerai Ini Kopi Ulon ${s.name}`} className="step-photo aspect-[4/3] max-h-[70vh] w-full object-cover md:aspect-[16/9]" />
          <div className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <p className="text-sm tabular-nums text-muted">
                No. {s.code} · {s.city} · {(index ?? 0) + 1} dari {list.length}
              </p>
              <p className="mt-1 text-xl font-medium">Ini Kopi Ulon {s.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => onStep(-1)} className="grid size-10 place-items-center rounded-full border border-latte hover:border-muted" aria-label="Gerai sebelumnya">
                <Chevron className="rotate-90" />
              </button>
              <button type="button" onClick={() => onStep(1)} className="grid size-10 place-items-center rounded-full border border-latte hover:border-muted" aria-label="Gerai berikutnya">
                <Chevron className="-rotate-90" />
              </button>
              <button type="button" onClick={() => ref.current?.close()} className="ml-2 h-10 rounded-full bg-paper px-5 text-sm font-medium text-ink">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}

export default function Lokasi() {
  const [city, setCity] = useState<'Semua' | City>('Semua');
  const [limit, setLimit] = useState(PAGE);
  const [viewing, setViewing] = useState<number | null>(null);
  const [locating, setLocating] = useState<'idle' | 'busy' | 'done' | 'denied'>('idle');

  const shown = useMemo(() => stores.filter((s) => city === 'Semua' || s.city === city), [city]);
  useEffect(() => setLimit(PAGE), [city]);

  const findNearest = () => {
    if (!navigator.geolocation) return setLocating('denied');
    setLocating('busy');
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setCity(nearestCity(p.coords.latitude, p.coords.longitude));
        setLocating('done');
      },
      () => setLocating('denied'),
      { timeout: 10000, maximumAge: 600000 },
    );
  };

  const step = (d: 1 | -1) => setViewing((v) => (v === null ? v : (v + d + shown.length) % shown.length));

  return (
    <>
      <header className="px-5 pt-32 text-center md:pt-40">
        <p className="enter text-sm text-muted">Lokasi gerai</p>
        <Title as="h1" className="mt-3 text-5xl leading-[1.04] md:text-7xl">Lokasi Ini Kopi Ulon</Title>
        <p className="enter-late mx-auto mt-5 max-w-md text-lg text-mocha">
          {stores.length} gerai di {cities.length} kota. Pilih kotamu, atau biar kami carikan yang terdekat.
        </p>
      </header>

      <Street />

      <section className="mx-auto max-w-7xl px-5 pt-12 md:px-10 md:pt-16" aria-label="Daftar gerai">
        {/* the two centred pickers */}
        <Reveal className="relative z-20 grid grid-cols-2 gap-3 sm:flex sm:items-center sm:justify-center">
          <CitySelect value={city} onChange={setCity} />
          <button
            type="button"
            onClick={findNearest}
            disabled={locating === 'busy'}
            className="flex h-12 min-w-0 flex-1 basis-0 items-center justify-center gap-2 rounded-full border border-espresso/20 bg-oat px-4 text-[15px] text-espresso transition-colors duration-150 hover:border-espresso/50 disabled:opacity-60 sm:w-56 sm:flex-none sm:px-5"
          >
            <svg className="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {locating === 'busy' ? 'Mencari…' : <><span className="sm:hidden">Terdekat</span><span className="hidden sm:inline">Cek gerai terdekat</span></>}
          </button>
        </Reveal>
        {(locating === 'done' || locating === 'denied') && (
          <p className="mt-4 text-center text-sm text-mocha" aria-live="polite">
            {locating === 'denied' ? 'Lokasi tidak bisa dibaca. Pilih kotanya dari daftar.' : `Kota terdekat darimu: ${city}`}
          </p>
        )}

        {/* the cards */}
        <div className="mt-10 grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3 md:mt-12">
          {shown.slice(0, limit).map((s, i) => (
            <Reveal key={s.code} delay={(i % 3) * 90}>
              <StoreCard s={s} tint={tints[i % tints.length]} onPhoto={() => setViewing(i)} />
            </Reveal>
          ))}
        </div>

        {limit < shown.length && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => setLimit((l) => l + PAGE)}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-paper px-7 text-[15px] font-medium text-ink transition-colors duration-150 hover:bg-[#40372f]"
            >
              Muat gerai lainnya
            </button>
          </div>
        )}
      </section>

      <Viewer list={shown} index={viewing} onClose={() => setViewing(null)} onStep={step} />
    </>
  );
}
