import { NewsCards } from '../components/NewsCards';
import { PageHeader } from '../components/ui';

export default function Kabar() {
  return (
    <>
      <PageHeader eyebrow="Kabar Ulon" title="Cerita dari dapur kami" intro="Tulisan tentang kopi, proses kami, dan kabar terbaru dari Ini Kopi Ulon" />
      <section className="mx-auto max-w-7xl px-5 md:px-10" aria-label="Artikel">
        <NewsCards featured />
      </section>
    </>
  );
}
