import { cities, stores, type City } from '../data/site';
import { useInView } from './motion';

const count = (c: City) => stores.filter((s) => s.city === c).length;

/* Shops per city as a ranked list with thin bars. The city with the most shops leads in the accent; the rest stay neutral. */
export function CityMap() {
  const rows = [...cities].sort((a, b) => count(b) - count(a));
  const max = count(rows[0]);
  const { ref, inView } = useInView<HTMLUListElement>(0.3);
  return (
    <ul ref={ref} className="divide-y divide-latte border-y border-latte" aria-label="Jumlah gerai per kota">
      {rows.map((c, i) => (
        <li key={c} className="grid grid-cols-[8rem_1fr_2rem] items-center gap-4 py-4">
          <span className={i === 0 ? 'text-espresso' : 'text-mocha'}>{c}</span>
          <span className="h-1 overflow-hidden rounded-full bg-raised">
            <span
              className={`block h-full rounded-full transition-[width] duration-1000 ease-[var(--ease-soft)] ${i === 0 ? 'bg-caramel' : 'bg-muted'}`}
              style={{ width: inView ? `${(count(c) / max) * 100}%` : '0%', transitionDelay: `${i * 90}ms` }}
            />
          </span>
          <span className="text-right font-mono text-sm tabular-nums text-mocha">{count(c)}</span>
        </li>
      ))}
    </ul>
  );
}
