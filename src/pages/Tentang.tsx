import { useEffect, useRef, useState } from 'react';
import { about, cities, img, site, stores } from '../data/site';
import { CityMap } from '../components/CityMap';
import { Pillars } from '../components/Pillars';
import { CountUp, Reveal, Title, useInView } from '../components/motion';
import { Button, Eyebrow, PhotoMarquee, PinIcon, StoreNo, TextLink } from '../components/ui';

/* Who Ulon is, beside a photo from the bar. */
function Manifesto() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 md:px-10 md:py-32 lg:grid-cols-2 lg:gap-16" aria-labelledby="manifesto-h">
      <div>
        <Reveal>
          <Eyebrow>Ini Kopi Ulon</Eyebrow>
          <Title as="h2" id="manifesto-h" className="text-5xl leading-[1.04] md:text-6xl">Kualitas yang terjaga, rasa yang tak terlupakan</Title>
        </Reveal>
        <Reveal delay={100}>
          <p className="mt-6 max-w-lg text-lg leading-[1.6] text-mocha">{about.quality}</p>
          <p className="mt-4 max-w-lg text-lg leading-[1.6] text-mocha">{about.choose}</p>
          <p className="mt-8 text-sm text-muted">{site.tagline}</p>
        </Reveal>
      </div>
      <Reveal clip delay={120}>
        <div className="overflow-hidden rounded-[20px] border border-latte bg-oat">
          <img src={img('split-barista')} alt="Barista Ulon menuang biji kopi ke grinder" className="aspect-square w-full object-cover" loading="lazy" />
        </div>
      </Reveal>
    </section>
  );
}

/* How the coffee is kept the same everywhere, beside the espresso machine. */
function Process() {
  return (
    <section className="border-y border-latte bg-roast" aria-labelledby="process-h">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 md:px-10 md:py-32 lg:grid-cols-2 lg:gap-16">
        <Reveal clip className="order-2 lg:order-1">
          <div className="overflow-hidden rounded-[20px] border border-latte bg-oat">
            <img src={img('split-machine')} alt="Espresso mengalir dari mesin ke gelas di atas timbangan" className="aspect-[4/5] w-full object-cover" loading="lazy" />
          </div>
        </Reveal>
        <Reveal delay={120} className="order-1 lg:order-2">
          <Eyebrow>Cara kami bekerja</Eyebrow>
          <Title as="h2" id="process-h" className="text-5xl leading-[1.04] md:text-6xl">Fresh coffee, refresh memories</Title>
          <p className="mt-6 max-w-lg text-lg leading-[1.6] text-mocha">{about.sop}</p>
          <div className="mt-8">
            <Button to="/menu" variant="outline">Lihat menu</Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* The shops in the order of their #TEMANULON numbers. It moves on to the next shop by itself: a thin line fills under the
   current number, and when it is full the next shop comes in. It waits while the pointer is over it, while it is off screen,
   or when the visitor presses pause; picking a number jumps there and starts the line again. */
function Steps() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const { ref, inView } = useInView<HTMLElement>(0.3);
  const rail = useRef<HTMLDivElement>(null);
  const s = stores[i];
  const running = !paused && !hover && inView;

  // keep the current number in sight in the sideways row
  useEffect(() => {
    const c = rail.current;
    const b = c?.querySelectorAll<HTMLElement>('[role="tab"]')[i];
    if (c && b) c.scrollTo({ left: b.offsetLeft - c.clientWidth / 2 + b.offsetWidth / 2, behavior: 'smooth' });
  }, [i]);

  return (
    <section
      ref={ref}
      className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32"
      aria-labelledby="steps-h"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <Reveal>
          <Eyebrow>Langkah Ulon</Eyebrow>
          <Title as="h2" id="steps-h" className="text-5xl leading-[1.04] md:text-6xl">Dari gerai 001 sampai 018</Title>
          <p className="mt-4 max-w-lg text-mocha">Setiap gerai punya nomor #TEMANULON. Gerainya berganti sendiri, atau pilih nomornya.</p>
        </Reveal>
        <button
          type="button"
          onClick={() => setPaused((v) => !v)}
          aria-pressed={paused}
          className="inline-flex h-9 shrink-0 items-center gap-2 self-start rounded-lg border border-latte px-3 text-sm text-mocha transition-colors duration-150 hover:border-muted hover:text-espresso md:self-auto"
        >
          <svg className="size-3.5" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            {paused ? <path d="M5 3.5v9l7-4.5-7-4.5Z" /> : <path d="M4.5 3h2.5v10H4.5zM9 3h2.5v10H9z" />}
          </svg>
          {paused ? 'Putar' : 'Jeda'}
        </button>
      </div>

      <Reveal delay={100}>
        <div ref={rail} className="no-scrollbar relative mt-10 overflow-x-auto">
          <div role="tablist" aria-label="Nomor gerai" className="flex w-max gap-1 border-b border-latte">
            {stores.map((st, n) => (
              <button
                key={st.code}
                role="tab"
                type="button"
                aria-selected={n === i}
                onClick={() => setI(n)}
                className={`relative px-3 pb-3 pt-2 font-mono text-sm tabular-nums transition-colors duration-150 ${
                  n === i ? 'text-espresso' : 'text-muted hover:text-mocha'
                }`}
              >
                {st.code}
                {n === i && (
                  <span
                    key={i}
                    aria-hidden="true"
                    className="step-fill absolute inset-x-0 -bottom-px h-0.5 origin-left bg-caramel"
                    style={{ animationPlayState: running ? 'running' : 'paused' }}
                    onAnimationEnd={() => setI((x) => (x + 1) % stores.length)}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="mt-10 grid items-center gap-8 md:grid-cols-2 md:gap-12" role="tabpanel" aria-live={running ? 'off' : 'polite'}>
        <div className="overflow-hidden rounded-[20px] border border-latte bg-oat">
          <img key={s.code} src={img(`store-${s.code}`)} alt={`Gerai Ini Kopi Ulon ${s.name}`} className="step-photo aspect-[4/3] w-full object-cover" />
        </div>
        <div key={s.code} className="enter-2">
          <p className="flex items-center gap-3 text-sm text-mocha">
            <StoreNo code={s.code} />
            <span>{s.city}</span>
          </p>
          <h3 className="mt-3 font-display text-5xl font-normal">{s.name}</h3>
          <p className="mt-4 flex max-w-md gap-2 text-mocha">
            <PinIcon className="mt-1 size-4 shrink-0 text-muted" />
            {s.address}
          </p>
          <TextLink href={s.map} className="mt-6">Petunjuk arah</TextLink>
        </div>
      </div>
    </section>
  );
}

/* Where Ulon is: the count and the shops per city; the number counts up and the bars grow in. */
function Universe() {
  return (
    <section className="mx-auto grid max-w-7xl gap-12 px-5 md:px-10 lg:grid-cols-2 lg:gap-16" aria-labelledby="universe-h">
      <Reveal>
        <Eyebrow>Peta #TEMANULON</Eyebrow>
        <Title as="h2" id="universe-h" className="text-5xl leading-[1.04] md:text-6xl">Selamat datang di rumah #TEMANULON</Title>
        <p className="mt-6 text-lg text-mocha">
          Sudah hadir di <CountUp to={stores.length} className="font-medium text-caramel" /> <span className="font-medium text-caramel">gerai</span> di {cities.length} kota, dan terus bertambah
        </p>
        <div className="mt-8">
          <Button to="/lokasi">Lihat semua lokasi</Button>
        </div>
      </Reveal>
      <Reveal delay={120}>
        <CityMap />
      </Reveal>
    </section>
  );
}

export default function Tentang() {
  return (
    <>
      <header className="mx-auto max-w-7xl px-5 pb-12 pt-32 md:px-10 md:pb-16 md:pt-40">
        <Eyebrow className="enter">Tentang kami</Eyebrow>
        <Title as="h1" className="max-w-4xl text-5xl leading-[1.04] md:text-7xl">Kopi susu dari Cirebon untuk teman-teman di enam kota</Title>
      </header>
      <PhotoMarquee tall />
      <Manifesto />
      <Process />
      <Pillars title="Pilar Ulon" />
      <Steps />
      <Universe />
    </>
  );
}
