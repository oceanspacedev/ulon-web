import { useEffect, useRef, useState } from 'react';
import { img, pillars } from '../data/site';
import { getLenis, Reveal, Title } from './motion';

const n = pillars.length;
const GESTURE_GAP = 180; // ms of wheel silence that ends one gesture (a trackpad flick keeps firing for a while)

/* The four pillars, one per scroll, like a vertical video feed.
   The section pins to the screen; one wheel gesture, swipe or arrow key moves exactly one pillar,
   then the page carries on past the last one (or back above the first).
   Desktop: the wheel and keys are taken over only while the section is pinned.
   Touch: native CSS snap points (one per pillar, never skipped) keep the phone's own feel. */
export function Pillars({ title = 'Kenapa Ulon' }: { title?: string }) {
  const [active, setActive] = useState(0);
  const track = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    const st = stage.current;
    if (!el || !st) return;

    let moving = false;
    let consumed = false;
    let lastWheel = 0;

    const step = () => st.offsetHeight;
    const progress = () => -el.getBoundingClientRect().top; // px scrolled into the section
    const indexAt = () => Math.min(n - 1, Math.max(0, Math.round(progress() / step())));

    // where a step in this direction should land, or null when the page should simply scroll on
    const target = (dir: 1 | -1): number | null => {
      const s = step();
      const r = progress();
      const end = (n - 1) * s;
      if (dir > 0) {
        if (r < -s * 0.35 || r >= end - 2) return null;
        return r < -2 ? 0 : Math.min(n - 1, Math.round(r / s) + 1);
      }
      if (r <= 2 || r > end + s * 0.35) return null;
      return r > end + 2 ? n - 1 : Math.max(0, Math.round(r / s) - 1);
    };
    const pinned = () => {
      const r = progress();
      return r > -2 && r < (n - 1) * step() + 2;
    };

    const go = (to: number) => {
      const lenis = getLenis();
      const top = el.getBoundingClientRect().top + window.scrollY + to * step();
      moving = true;
      setActive(to);
      const done = () => {
        moving = false;
      };
      if (lenis) lenis.scrollTo(top, { duration: 0.85, lock: true, onComplete: done });
      else {
        // no smooth scroller (reduced motion): jump straight to the pillar; the words and photo still crossfade
        const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top, behavior: calm ? 'instant' : 'smooth' });
        window.setTimeout(done, calm ? 450 : 750);
      }
    };

    const onScroll = () => {
      if (!moving) setActive(indexAt());
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      const now = performance.now();
      if (now - lastWheel > GESTURE_GAP) consumed = false;
      lastWheel = now;
      const t = target(e.deltaY > 0 ? 1 : -1);
      if (!moving && t === null && !(consumed && pinned())) return; // outside: the page scrolls as usual
      e.preventDefault();
      e.stopImmediatePropagation(); // keep the smooth scroller from also moving the page
      if (moving || consumed || t === null) return;
      consumed = true;
      go(t);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      const down = e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey);
      const up = e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey);
      if (!down && !up) return;
      if (moving && pinned()) {
        e.preventDefault();
        return;
      }
      const t = target(down ? 1 : -1);
      if (t === null) return;
      e.preventDefault();
      go(t);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: false, capture: true });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onWheel, { capture: true });
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <section ref={track} className="relative" style={{ height: `${n * 100}svh` }} aria-labelledby="pillars-h">
      {/* one snap point per pillar, used by touch screens */}
      {pillars.map((p, i) => (
        <div key={p.tag} className="snap-step pointer-events-none absolute inset-x-0 h-[100svh]" style={{ top: `${i * 100}svh` }} aria-hidden="true" />
      ))}

      <div ref={stage} className="sticky top-0 h-[100svh] overflow-hidden pt-20">
        <div className="mx-auto grid h-full max-w-7xl grid-rows-[auto_minmax(0,1fr)_auto] gap-5 px-5 pb-6 pt-6 md:px-10 lg:grid-cols-2 lg:grid-rows-[auto_minmax(0,1fr)] lg:gap-x-20 lg:gap-y-8 lg:pb-12 lg:pt-10">
          <Reveal className="lg:col-start-1 lg:row-start-1">
            <Title as="h2" id="pillars-h" className="text-4xl leading-[1.04] md:text-6xl">{title}</Title>
            <p className="mt-3 hidden max-w-sm text-mocha md:block">Empat hal yang kami jaga di setiap gerai, dari biji sampai gelas</p>
          </Reveal>

          {/* the photo of the pillar in view */}
          <div className="grid min-h-0 overflow-hidden rounded-2xl border border-latte bg-oat lg:col-start-1 lg:row-start-2">
            {pillars.map((p, i) => (
              <img
                key={p.tag}
                src={img(p.image)}
                alt={i === active ? p.title : ''}
                aria-hidden={i !== active}
                className={`h-full min-h-0 w-full object-cover transition-[opacity,transform] duration-700 ease-[var(--ease-soft)] [grid-area:1/1] ${
                  i === active ? 'scale-100 opacity-100' : 'scale-[1.04] opacity-0'
                }`}
              />
            ))}
          </div>

          {/* the words: the next pillar rises in from below, the last one leaves upward */}
          <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
            <div className="grid">
              {pillars.map((p, i) => (
                <div
                  key={p.tag}
                  // the old words leave quickly, the new ones arrive just after, so the two never sit on top of each other
                  className={`transition-[opacity,transform] ease-[var(--ease-soft)] [grid-area:1/1] ${
                    i === active
                      ? 'translate-y-0 opacity-100 delay-200 duration-700'
                      : `pointer-events-none opacity-0 duration-300 ${i < active ? '-translate-y-8' : 'translate-y-8'}`
                  }`}
                >
                  <p className="flex items-center gap-3 text-sm text-muted">
                    <span className="font-mono text-xs tabular-nums">0{i + 1}</span>
                    {p.tag}
                  </p>
                  <h3 className="mt-2 font-display text-3xl font-normal leading-[1.08] md:mt-3 md:text-5xl">{p.title}</h3>
                  <p className="mt-3 max-w-md leading-[1.6] text-mocha md:mt-4 md:text-lg">{p.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-4 lg:mt-12" aria-hidden="true">
              <span className="font-mono text-xs tabular-nums text-muted">
                0{active + 1} / 0{n}
              </span>
              <span className="flex flex-1 gap-1">
                {pillars.map((p, i) => (
                  <span key={p.tag} className="h-0.5 flex-1 overflow-hidden rounded-full bg-latte">
                    <span className={`block h-full origin-left bg-caramel transition-transform duration-500 ease-[var(--ease-soft)] ${i <= active ? 'scale-x-100' : 'scale-x-0'}`} />
                  </span>
                ))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
