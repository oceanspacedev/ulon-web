import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* True once the element has come into view (and stays true). */
export function useInView<T extends Element>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // also observed under reduced motion: there the CSS turns every entrance into a plain fade, with no movement
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* Fades and rises its content into place the first time it scrolls into view.
   `clip` opens a photo like a curtain from the bottom while the image settles from a slight zoom. */
export function Reveal({
  children,
  className = '',
  delay = 0,
  clip = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  clip?: boolean;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(clip ? 0.12 : 0.2);
  return (
    <div ref={ref} className={`${clip ? 'reveal-clip' : 'reveal'} ${inView ? 'is-in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* A headline whose words rise one after another from behind a mask the first time it comes into view.
   Screen readers get the plain sentence. */
export function Title({
  as: Tag = 'h2',
  children,
  className = '',
  id,
  delay = 0,
}: {
  as?: 'h1' | 'h2' | 'h3';
  children: string;
  className?: string;
  id?: string;
  delay?: number;
}) {
  const { ref, inView } = useInView<HTMLHeadingElement>(0.2);
  const words = children.split(' ');
  return (
    <Tag ref={ref} id={id} aria-label={children} className={`split ${inView ? 'is-in' : ''} ${className}`}>
      {words.map((w, i) => (
        <Fragment key={i}>
          {i > 0 && ' '}
          <span className="split-w" aria-hidden="true">
            <span style={{ transitionDelay: `${delay + i * 55}ms` }}>{w}</span>
          </span>
        </Fragment>
      ))}
    </Tag>
  );
}

/* Counts a number up from zero once it is in view. */
export function CountUp({ to, className = '', duration = 1200 }: { to: number; className?: string; duration?: number }) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.6);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduced()) {
      setN(to);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {n}
    </span>
  );
}

/* How far the page has scrolled past an element's top, in px; drives a gentle parallax. */
export function useParallax<T extends HTMLElement>(speed = 0.25) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    // Written in the same frame as the scroll (no extra rAF), so the photo never trails the page by a frame.
    // Past the hero there is nothing to move, so the write is skipped.
    let last = -1;
    const onScroll = () => {
      const y = Math.min(window.scrollY, window.innerHeight * 1.2);
      if (y === last) return;
      last = y;
      el.style.transform = `translate3d(0, ${(y * speed).toFixed(1)}px, 0) scale(1.06)`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [speed]);
  return ref;
}

/* Smooth wheel scrolling (Lenis): the page glides to a stop instead of jumping in wheel-sized steps.
   Touch keeps the phone's own scrolling. Off when the visitor asks for reduced motion. */
let lenis: Lenis | null = null;
export const getLenis = () => lenis;

export function SmoothScroll() {
  useEffect(() => {
    if (reduced()) return;
    lenis = new Lenis({ lerp: 0.1, autoRaf: true, anchors: true, stopInertiaOnNavigate: true });
    return () => {
      lenis?.destroy();
      lenis = null;
    };
  }, []);
  return null;
}
