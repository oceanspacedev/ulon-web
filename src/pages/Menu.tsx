import { useState } from 'react';
import { img, menu, menuGroups, site, type MenuGroup, type MenuItem } from '../data/site';
import { Button, PageHeader, TextLink } from '../components/ui';
import { Reveal, Title } from '../components/motion';

// Anchor id, the one-line intro and the layout for each group. The three groups are laid out differently on purpose,
// so the page reads like turning pages of a menu, not the same block three times.
type Layout = 'split' | 'mirror' | 'cards';
const groupInfo: Record<MenuGroup, { id: string; line: string; layout: Layout }> = {
  Kopi: { id: 'kopi', line: 'Kopi susu yang kental dan creamy, dari segelas sampai seliter', layout: 'split' },
  'Non kopi': { id: 'non-kopi', line: 'Untuk yang ingin yang manis dan segar tanpa kopi', layout: 'mirror' },
  Makanan: { id: 'makanan', line: 'Teman ngopi, dari pastry sampai rice bowl', layout: 'cards' },
};

function OrderLink({ item }: { item: MenuItem }) {
  return (
    <a
      href={site.orderUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-9 items-center rounded-lg border border-latte bg-cream px-3 text-sm text-espresso transition-colors duration-150 hover:border-muted"
      aria-label={`Pesan ${item.name}`}
    >
      Pesan
    </a>
  );
}

/* The heading for a group: number and name on one side, the intro line on the other (swapped for the mirrored group). */
function GroupHead({ group, index, flip }: { group: MenuGroup; index: number; flip?: boolean }) {
  const info = groupInfo[group];
  return (
    <Reveal className="mb-8 grid gap-3 md:mb-12 lg:grid-cols-12 lg:items-end lg:gap-12">
      <div className={flip ? 'lg:order-2 lg:col-span-5 lg:col-start-8 lg:text-right' : 'lg:col-span-5'}>
        <p className="font-mono text-xs tabular-nums text-muted">0{index + 1}</p>
        <Title as="h2" id={`${info.id}-h`} className="mt-2 text-5xl leading-[1.04] md:text-6xl">{group}</Title>
      </div>
      <p className={`max-w-md text-mocha lg:pb-2 ${flip ? 'lg:order-1 lg:col-span-7' : 'lg:col-span-7'}`}>{info.line}</p>
    </Reveal>
  );
}

/* Photo beside a list: the photo shows the item under the pointer; on a phone each row keeps its own thumbnail.
   `flip` puts the list on the left and the photo on the right. */
function ListWithPhoto({ items, flip }: { items: MenuItem[]; flip?: boolean }) {
  const [active, setActive] = useState(0);
  return (
    <div className="grid lg:grid-cols-12 lg:gap-12">
      <Reveal clip delay={100} className={`hidden lg:col-span-5 lg:block ${flip ? 'lg:order-2' : ''}`}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-latte bg-oat">
          {items.map((m, i) => (
            <img
              key={m.id}
              src={img(`menu-${m.id}`)}
              alt={i === active ? m.name : ''}
              aria-hidden={i !== active}
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-[var(--ease-soft)] ${i === active ? 'scale-100 opacity-100' : 'scale-105 opacity-0'}`}
            />
          ))}
        </div>
      </Reveal>

      <ul className={`flex flex-col divide-y divide-latte border-y border-latte lg:col-span-7 ${flip ? 'lg:order-1' : ''}`}>
        {items.map((m, i) => (
          <li key={m.id} className="flex lg:flex-1" onMouseEnter={() => setActive(i)} onFocusCapture={() => setActive(i)}>
            <Reveal delay={i * 90} className="grid w-full grid-cols-[64px_1fr_auto] items-center gap-4 py-4 lg:grid-cols-[2.5rem_1fr_auto] lg:gap-6 lg:py-0">
              <img src={img(`menu-${m.id}`)} alt="" className="size-16 rounded-lg object-cover lg:hidden" loading="lazy" />
              <span className={`hidden font-mono text-xs tabular-nums transition-colors duration-150 lg:block ${i === active ? 'text-caramel' : 'text-muted'}`} aria-hidden="true">
                0{i + 1}
              </span>
              <div className="min-w-0">
                <h3 className="text-[17px] leading-snug md:text-lg">{m.name}</h3>
                <p className="mt-1 text-sm text-mocha md:text-[15px]">{m.blurb}</p>
              </div>
              <OrderLink item={m} />
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* Three tall photo cards side by side; on a phone they slide sideways by hand. */
function Cards({ items }: { items: MenuItem[] }) {
  return (
    <div className="no-scrollbar -mx-5 flex snap-x scroll-px-5 gap-4 overflow-x-auto px-5 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0">
      {items.map((m, i) => (
        <article key={m.id} className="lift-img w-[78%] shrink-0 snap-start md:w-auto">
          <Reveal clip delay={i * 120}>
            <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-oat">
              <img src={img(`menu-${m.id}`)} alt={m.name} className="h-full w-full object-cover" loading="lazy" />
            </div>
          </Reveal>
          <Reveal delay={150 + i * 120} className="mt-5">
            <p className="font-mono text-xs tabular-nums text-muted">0{i + 1}</p>
            <h3 className="mt-1 font-display text-3xl font-normal leading-[1.1]">{m.name}</h3>
            <p className="mt-2 text-mocha">{m.blurb}</p>
            <TextLink href={site.orderUrl} className="mt-4">Pesan {m.name.toLowerCase()}</TextLink>
          </Reveal>
        </article>
      ))}
    </div>
  );
}

function Group({ group, index }: { group: MenuGroup; index: number }) {
  const info = groupInfo[group];
  const items = menu.filter((m) => m.group === group);
  const band = info.layout === 'mirror';

  return (
    <section
      id={info.id}
      className={`scroll-mt-36 ${index > 0 ? 'border-t border-latte' : ''} ${band ? 'bg-roast' : ''}`}
      aria-labelledby={`${info.id}-h`}
    >
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
        <GroupHead group={group} index={index} flip={band} />
        {info.layout === 'cards' ? <Cards items={items} /> : <ListWithPhoto items={items} flip={band} />}
      </div>
    </section>
  );
}

export default function MenuPage() {
  return (
    <>
      <PageHeader
        eyebrow="Menu"
        title="Menu Ini Kopi Ulon"
        intro="Sembilan kategori dalam tiga kelompok. Harga dan pilihan lengkap ada di halaman pesan online kami."
      />

      {/* group shortcuts, held under the navigation while the menu scrolls */}
      <nav className="sticky top-20 z-20 border-y border-latte bg-cream" aria-label="Kelompok menu">
        <div className="no-scrollbar mx-auto flex max-w-7xl gap-6 overflow-x-auto px-5 md:px-10">
          {menuGroups.map((g) => (
            <a key={g} href={`#${groupInfo[g].id}`} className="flex h-12 shrink-0 items-center gap-2 text-[15px] text-mocha transition-colors duration-150 hover:text-espresso">
              {g}
              <span className="font-mono text-xs tabular-nums text-muted">{menu.filter((m) => m.group === g).length}</span>
            </a>
          ))}
        </div>
      </nav>

      {menuGroups.map((g, gi) => (
        <Group key={g} group={g} index={gi} />
      ))}

      <section className="mx-auto mt-8 max-w-7xl px-5 md:px-10">
        <div className="flex flex-col items-start justify-between gap-8 rounded-[20px] border border-latte bg-oat p-8 md:flex-row md:items-center md:p-12">
          <div>
            <Title as="h2" className="text-4xl leading-[1.04] md:text-5xl">Pesan untuk diantar atau ambil di gerai</Title>
            <p className="mt-3 max-w-md text-mocha">Semua menu bisa dipesan lewat halaman pesan online kami</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href={site.orderUrl}>Pesan online</Button>
            <Button to="/lokasi" variant="outline">Cari gerai</Button>
          </div>
        </div>
      </section>
    </>
  );
}
