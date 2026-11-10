import { Link } from 'react-router';
import { cities, img, site, stores } from '../data/site';
import { Button, TextLink } from './ui';
import { Reveal, Title } from './motion';

const explore = [
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

const linkCls = 'text-mocha transition-colors duration-150 hover:text-espresso';

/* A quiet close: one line and the two actions on the left, three short link lists on the right, one thin bottom row. */
export function Footer() {
  return (
    <footer className="mt-24 border-t border-latte md:mt-32">
      <div className="mx-auto grid max-w-7xl gap-16 px-5 py-20 md:px-10 md:py-24 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-5">
          <Title as="h2" className="text-5xl leading-[1.04] md:text-6xl">Sampai ketemu di gerai</Title>
          <p className="mt-4 max-w-sm text-mocha">
            {stores.length} gerai di {cities.join(', ').replace(/, ([^,]*)$/, ', dan $1')}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Button href={site.orderUrl}>Pesan online</Button>
            <TextLink to="/lokasi">Cari gerai</TextLink>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
          <div>
            <h3 className="mb-4 text-sm font-normal text-muted">Jelajahi</h3>
            <ul className="space-y-3">
              {explore.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className={linkCls}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-normal text-muted">Ikuti</h3>
            <ul className="space-y-3">
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className={linkCls}>{s.label}</a>
                </li>
              ))}
              <li>
                <a href={site.partnerUrl} target="_blank" rel="noopener noreferrer" className={linkCls}>Kemitraan</a>
              </li>
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <h3 className="mb-4 text-sm font-normal text-muted">Kantor pusat</h3>
            <p className="text-mocha">{site.headOffice}</p>
            <a href={site.phoneHref} className={`mt-3 inline-block font-mono text-sm tabular-nums ${linkCls}`}>{site.phone}</a>
          </div>
        </div>
      </div>

      <div className="border-t border-latte">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between md:px-10">
          <div className="flex items-center gap-4">
            <img src={img('logo-ink')} alt="Ini Kopi Ulon" className="h-7 w-auto" />
            <span>© 2026 Ini Kopi Ulon</span>
          </div>
          <span>{site.tagline}</span>
        </div>
      </div>
    </footer>
  );
}
