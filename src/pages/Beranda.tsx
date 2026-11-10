import { useState } from 'react';
import { img, menu, menuGroups, quotes, site, stores } from '../data/site';
import { NewsCards } from '../components/NewsCards';
import { CountUp, Reveal, useParallax, Title } from '../components/motion';
import { Button, Eyebrow, TextLink } from '../components/ui';

/* Hero: a scene. The Tuparev shop at night fills the screen; the words sit in the calm dark sky above it.
   The photo drifts slower than the page as you scroll (a gentle parallax). */
function Hero() {
  const photo = useParallax<HTMLDivElement>(0.3);
  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden">
      <div ref={photo} className="absolute inset-0 will-change-transform">
        <picture>
          <source media="(max-width: 767px)" srcSet={img('hero-scene-tall')} />
          <source media="(max-width: 1440px)" srcSet={img('hero-scene-1440')} />
          <img
            src={img('hero-scene-2400')}
            alt="Gerai Ini Kopi Ulon Signature di Jalan Tuparev pada malam hari, ramai pengunjung di depan pintu"
            className="settle h-full w-full object-cover object-bottom"
          />
        </picture>
      </div>
      {/* a soft mask so the photo's foot fades into the next section */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-cream to-transparent" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-3xl px-5 pt-32 text-center md:pt-40">
        <Title as="h1" className="text-[2.75rem] leading-[1.04] text-ink md:text-[4.5rem]">Kopi susu kental dari Cirebon</Title>
        <p className="enter-late mx-auto mt-6 max-w-xl text-lg leading-[1.6] text-ink/75">
          Legit, gurih, dan creamy di {stores.length} gerai, dari Cirebon sampai Jakarta dan Yogyakarta
        </p>
        <div className="enter-late mt-8 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: '750ms' }}>
          <Button href={site.orderUrl} variant="onDark">Pesan online</Button>
          <Button to="/lokasi" variant="ghostDark">Cari gerai</Button>
        </div>
      </div>
    </section>
  );
}

/* The one bright element: the Signature cup, espresso swirling into milk, on a quiet raised card. */
function Spotlight() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 md:px-10 md:py-32 lg:grid-cols-2 lg:gap-16" aria-labelledby="spot-h">
      <div>
        <Reveal>
          <Eyebrow>Signature</Eyebrow>
          <Title as="h2" id="spot-h" className="text-5xl leading-[1.04] md:text-6xl">Satu gelas yang bikin orang balik lagi</Title>
        </Reveal>
        <Reveal delay={100}>
          <p className="mt-6 max-w-md text-lg leading-[1.6] text-mocha">
            Kopi susu khas Ulon. Kental, creamy, dan legit, dengan takaran yang sama di setiap gerai.
          </p>
        </Reveal>
        <Reveal delay={200}>
          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-latte pt-6">
            <div>
              <dt className="text-sm text-muted">Gerai</dt>
              <dd className="mt-1 text-3xl font-medium text-caramel"><CountUp to={stores.length} /></dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Kota</dt>
              <dd className="mt-1 text-3xl font-medium"><CountUp to={6} /></dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Kategori menu</dt>
              <dd className="mt-1 text-3xl font-medium"><CountUp to={menu.length} /></dd>
            </div>
          </dl>
        </Reveal>
      </div>
      <Reveal delay={120}>
        <figure className="rounded-[20px] border border-latte bg-oat p-4">
          <Reveal clip className="rounded-2xl">
            <div className="relative grid aspect-[4/5] place-items-center overflow-hidden rounded-2xl bg-raised">
              <img
                src={img('cut-signature')}
                alt="Es kopi susu Signature Ini Kopi Ulon, espresso berputar ke dalam susu"
                className="w-[56%] drop-shadow-[0_32px_32px_rgba(43,37,32,0.35)]"
                loading="lazy"
              />
            </div>
          </Reveal>
          <figcaption className="flex items-center justify-between px-2 pb-1 pt-4 text-sm">
            <span>Signature</span>
            <span className="text-muted">Es kopi susu</span>
          </figcaption>
        </figure>
      </Reveal>
    </section>
  );
}

/* How it is made: one large photo, the three steps, a second photo and a link, in a grid of varied sizes. */
function Craft() {
  const steps = [
    ['1', 'Biji pilihan', 'Biji kopi premium dari perkebunan terpilih, lewat seleksi ketat'],
    ['2', 'SOP yang teruji', 'Satu resep dan satu takaran untuk semua gerai'],
    ['3', 'Barista terlatih', 'Setiap gelas disajikan dengan cara yang sama'],
  ];
  return (
    <section className="mx-auto max-w-7xl px-5 md:px-10" aria-labelledby="craft-h">
      <div className="mb-12 grid gap-6 lg:grid-cols-2 lg:items-end">
        <Reveal>
          <Eyebrow>Cara kami bekerja</Eyebrow>
          <Title as="h2" id="craft-h" className="text-5xl leading-[1.04] md:text-6xl">Diracik lebih dari sekadar kopi</Title>
        </Reveal>
        <Reveal delay={100} className="lg:justify-self-end">
          <p className="max-w-md text-mocha">
            Dari biji sampai gelas, setiap langkah mengikuti prosedur yang sama, supaya rasa Ulon tidak berubah di gerai mana pun.
          </p>
          <TextLink to="/tentang" className="mt-5">Tentang Ulon</TextLink>
        </Reveal>
      </div>

      <div className="grid gap-4 md:grid-cols-6 md:grid-rows-[repeat(2,minmax(0,280px))]">
        <Reveal clip className="min-h-[400px] md:col-span-3 md:row-span-2">
          <div className="h-full overflow-hidden rounded-2xl bg-oat">
            <img src={img('split-machine')} alt="Espresso mengalir dari mesin ke gelas di atas timbangan" className="h-full w-full object-cover" loading="lazy" />
          </div>
        </Reveal>
        <Reveal delay={120} className="md:col-span-3">
          <div className="h-full rounded-2xl border border-latte bg-oat p-6">
            <ol className="divide-y divide-latte">
              {steps.map(([n, t, d]) => (
                <li key={n} className="grid grid-cols-[2rem_1fr] gap-3 py-4 first:pt-0 last:pb-0">
                  <span className="font-mono text-sm tabular-nums text-muted">0{n}</span>
                  <span>
                    <span className="block font-medium">{t}</span>
                    <span className="mt-1 block text-sm text-mocha">{d}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
        <Reveal clip delay={200} className="min-h-[240px] md:col-span-3">
          <div className="h-full overflow-hidden rounded-2xl bg-oat">
            <img src={img('strip-grinder')} alt="Barista menakar kopi dari grinder ke portafilter" className="h-full w-full object-cover" loading="lazy" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* The menu, short: one photo beside the nine categories grouped as on a menu board. */
function MenuIndex() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32" aria-labelledby="menu-h">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow>Menu</Eyebrow>
            <Title as="h2" id="menu-h" className="text-5xl leading-[1.04] md:text-6xl">Sembilan kategori menu</Title>
            <p className="mt-4 max-w-sm text-mocha">Kopi susu, minuman tanpa kopi, dan makanan untuk teman nongkrong</p>
          </Reveal>
          <Reveal clip delay={100} className="mt-8">
            <div className="overflow-hidden rounded-2xl border border-latte bg-oat">
              <img src={img('strip-iced')} alt="Es kopi Ulon dan croissant di atas papan kayu" className="aspect-[4/5] w-full object-cover" loading="lazy" />
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7 lg:pt-14">
          <div className="grid gap-10 sm:grid-cols-2">
            {menuGroups.map((g, gi) => (
              <Reveal key={g} delay={gi * 120} className={gi === 0 ? 'sm:col-span-2' : ''}>
                <p className="flex items-center justify-between border-b border-latte pb-3 text-sm text-muted">
                  <span>{g}</span>
                  <span className="font-mono text-xs tabular-nums">{menu.filter((m) => m.group === g).length}</span>
                </p>
                <ul className={gi === 0 ? 'grid gap-x-8 sm:grid-cols-3' : ''}>
                  {menu
                    .filter((m) => m.group === g)
                    .map((m) => (
                      <li key={m.id} className="border-b border-latte py-4">
                        <p className="font-medium">{m.name}</p>
                        <p className="mt-1 text-sm text-mocha">{m.blurb}</p>
                      </li>
                    ))}
                </ul>
              </Reveal>
            ))}
          </div>
          <Reveal delay={360}>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Button to="/menu" variant="outline">Lihat menu lengkap</Button>
              <TextLink href={site.orderUrl}>Pesan online</TextLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* One review at a time, switched by the names beside it; the quote fades in when it changes. */
function Voices() {
  const [i, setI] = useState(0);
  const q = quotes[i];
  return (
    <section className="border-y border-latte bg-roast" aria-labelledby="voices-h">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 md:px-10 md:py-32 lg:grid-cols-[1fr_2fr] lg:items-center">
        <Reveal>
          <Eyebrow>Ulasan pelanggan</Eyebrow>
          <Title as="h2" id="voices-h" className="text-4xl leading-[1.04] md:text-5xl">Momen yang bikin balik lagi</Title>
          <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Ulasan">
            {quotes.map((x, n) => (
              <button
                key={x.name}
                type="button"
                role="tab"
                aria-selected={n === i}
                onClick={() => setI(n)}
                className={`flex h-10 items-center gap-2 rounded-lg border pl-1.5 pr-3 text-sm transition-colors duration-150 ${
                  n === i ? 'border-latte bg-raised text-espresso' : 'border-transparent text-mocha hover:text-espresso'
                }`}
              >
                <img src={img(x.avatar)} alt="" className="size-7 rounded-md" />
                {x.name}
              </button>
            ))}
          </div>
        </Reveal>
        <Reveal delay={120}>
          <figure aria-live="polite">
            <blockquote key={q.name} className="enter font-display text-3xl leading-[1.25] text-choco md:text-[2.5rem]">“{q.text}”</blockquote>
            <figcaption className="mt-6 text-sm text-muted">{q.name}, pelanggan Ulon</figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

/* The closing band: a photo from the bar with the order action on its calm left side. */
function OrderBand() {
  return (
    <section className="mx-auto max-w-7xl px-5 pt-24 md:px-10 md:pt-32" aria-labelledby="order-h">
      <Reveal clip>
        <div className="relative overflow-hidden rounded-[20px] border border-latte">
          <img src={img('split-pourover')} alt="Kopi diseduh di atas timbangan di bar Ulon" className="h-[480px] w-full object-cover object-right md:h-[560px]" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" aria-hidden="true" />
          <div className="absolute inset-y-0 left-0 flex max-w-lg flex-col justify-center p-8 md:p-12">
            <Title as="h2" id="order-h" className="text-5xl leading-[1.04] text-ink md:text-6xl">Temukan signature-mu</Title>
            <p className="mt-4 max-w-sm text-ink/75">Pesan untuk diantar, atau mampir ke salah satu dari {stores.length} gerai kami</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href={site.orderUrl} variant="onDark">Pesan online</Button>
              <Button to="/lokasi" variant="ghostDark">Cari gerai</Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default function Beranda() {
  return (
    <>
      <Hero />
      <Spotlight />
      <Craft />
      <MenuIndex />
      <Voices />
      <OrderBand />
      <section className="mx-auto max-w-7xl px-5 pt-24 md:px-10 md:pt-32" aria-labelledby="news-h">
        <Reveal>
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <Eyebrow>Kabar Ulon</Eyebrow>
              <Title as="h2" id="news-h" className="text-5xl leading-[1.04] md:text-6xl">Cerita dari dapur kami</Title>
            </div>
            <TextLink to="/kabar">Semua kabar</TextLink>
          </div>
        </Reveal>
        <NewsCards />
      </section>
    </>
  );
}
