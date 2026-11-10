import { img, news } from '../data/site';
import { ArrowIcon } from './ui';
import { Reveal } from './motion';

export function NewsCards({ featured = false }: { featured?: boolean }) {
  return (
    <div className={`grid gap-6 ${featured ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
      {news.map((n, i) => {
        const big = featured && i === 0;
        return (
          <Reveal key={n.url} delay={i * 100} className={big ? 'md:row-span-2' : ''}>
          <a
            href={n.url}
            target="_blank"
            rel="noopener noreferrer"
            className="lift-img group flex h-full flex-col overflow-hidden rounded-2xl border border-latte bg-oat transition-colors duration-150 hover:border-muted"
          >
            <img src={img(n.image)} alt="" className={`w-full object-cover ${big ? 'aspect-[4/3] md:aspect-auto md:flex-1' : 'aspect-[4/3]'}`} loading="lazy" />
            <div className="flex flex-col gap-6 p-6">
              <div>
                <p className="font-mono text-xs tabular-nums text-muted">{n.date}</p>
                <h3 className={`mt-2 ${big ? 'font-display text-4xl font-normal leading-[1.1]' : 'text-lg leading-snug'}`}>{n.title}</h3>
              </div>
              <span className="inline-flex items-center gap-2 text-[15px] font-medium transition-colors duration-150 group-hover:text-caramel">
                Baca artikel <ArrowIcon />
              </span>
            </div>
          </a>
          </Reveal>
        );
      })}
    </div>
  );
}
