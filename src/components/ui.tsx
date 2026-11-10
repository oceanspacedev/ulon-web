import { useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import { img, stripPhotos } from '../data/site';

import { Reveal, Title } from './motion';
export { Reveal };

export function ArrowIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PinIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 14.5s4.5-4.2 4.5-7.7a4.5 4.5 0 0 0-9 0c0 3.5 4.5 7.7 4.5 7.7Z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="6.8" r="1.6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/* The signature detail: a shop's #TEMANULON number, in mono, wherever a shop appears and nowhere else. */
export function StoreNo({ code, className = '' }: { code: string; className?: string }) {
  return <span className={`font-mono text-xs tabular-nums text-muted ${className}`}>No. {code}</span>;
}

type ButtonProps = { to?: string; href?: string; children: ReactNode; variant?: 'solid' | 'outline' | 'light' | 'onDark' | 'ghostDark'; className?: string };

/* One button shape: 48 tall, 10 radius. Primary is filled with the text colour; secondary is the raised surface with a hairline.
   On a dark photo the primary turns light (onDark) and the secondary becomes a quiet translucent one (ghostDark). */
export function Button({ to, href, children, variant = 'solid', className = '' }: ButtonProps) {
  const look = {
    solid: 'bg-paper text-ink hover:bg-[#40372f]',
    outline: 'border border-latte bg-raised text-espresso hover:border-muted',
    light: 'bg-paper text-ink hover:bg-[#40372f]',
    onDark: 'bg-ink text-espresso hover:bg-white',
    ghostDark: 'border border-white/25 bg-white/10 text-ink hover:bg-white/20',
  }[variant];
  const cls = `nudge inline-flex h-11 items-center gap-2 rounded-[10px] px-4 text-sm font-medium md:h-12 md:px-5 md:text-[15px] transition-[background-color,border-color,transform] duration-150 ease-[var(--ease-soft)] active:scale-[0.98] ${look} ${className}`;
  const inner = (
    <>
      {children}
      <ArrowIcon />
    </>
  );
  if (to) return <Link to={to} className={cls}>{inner}</Link>;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  );
}

/* A quiet text link with an arrow, for secondary actions inside sections. */
export function TextLink({ to, href, children, className = '' }: { to?: string; href?: string; children: ReactNode; className?: string }) {
  const cls = `nudge inline-flex items-center gap-2 text-[15px] font-medium text-espresso transition-colors duration-150 hover:text-caramel ${className}`;
  const inner = (
    <>
      {children}
      <ArrowIcon />
    </>
  );
  if (to) return <Link to={to} className={cls}>{inner}</Link>;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  );
}

/* A small label above a heading, sentence case, muted. */
export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`mb-4 text-sm text-muted ${className}`}>{children}</p>;
}

/* A row of Ulon photographs that drifts sideways on its own, end to end, without a seam (the list is drawn twice and
   the row slides by exactly one copy). It pauses under the pointer, and a small button stops and restarts it. */
export function PhotoMarquee({ tall = false }: { tall?: boolean }) {
  const [paused, setPaused] = useState(false);
  const row = [...stripPhotos, ...stripPhotos];
  return (
    <section aria-label="Foto suasana Ini Kopi Ulon">
      <Reveal className="marquee-mask overflow-hidden">
        <div className={`marquee flex w-max gap-4 ${paused ? 'is-paused' : ''}`}>
          {row.map((p, i) => (
            <figure
              key={i}
              aria-hidden={i >= stripPhotos.length}
              className={`aspect-[4/5] shrink-0 overflow-hidden rounded-2xl bg-oat ${tall ? 'h-[300px] md:h-[440px]' : 'h-64 md:h-80'}`}
            >
              <img src={img(p.name)} alt={i < stripPhotos.length ? p.alt : ''} className="h-full w-full object-cover" loading={i < 4 ? 'eager' : 'lazy'} />
            </figure>
          ))}
        </div>
      </Reveal>
      <div className="mx-auto mt-4 flex max-w-7xl justify-end px-5 md:px-10">
        <button
          type="button"
          onClick={() => setPaused((v) => !v)}
          aria-pressed={paused}
          className="inline-flex h-9 items-center gap-2 rounded-lg px-2 text-sm text-muted transition-colors duration-150 hover:text-espresso"
        >
          <svg className="size-3.5" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            {paused ? <path d="M5 3.5v9l7-4.5-7-4.5Z" /> : <path d="M4.5 3h2.5v10H4.5zM9 3h2.5v10H9z" />}
          </svg>
          {paused ? 'Putar foto' : 'Jeda foto'}
        </button>
      </div>
    </section>
  );
}

/* The title block that opens every inner page. */
export function PageHeader({ eyebrow, title, intro }: { eyebrow: string; title: ReactNode; intro?: ReactNode }) {
  return (
    <header className="mx-auto max-w-7xl px-5 pb-12 pt-32 md:px-10 md:pb-16 md:pt-40">
      <Eyebrow className="enter">{eyebrow}</Eyebrow>
      {typeof title === 'string' ? (
        <Title as="h1" className="max-w-4xl text-5xl leading-[1.04] md:text-7xl">{title}</Title>
      ) : (
        <h1 className="enter max-w-4xl text-5xl leading-[1.04] md:text-7xl">{title}</h1>
      )}
      {intro && <p className="enter-late mt-6 max-w-xl text-lg leading-[1.6] text-mocha">{intro}</p>}
    </header>
  );
}
