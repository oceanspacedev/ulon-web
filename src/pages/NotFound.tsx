import { Button, PageHeader } from '../components/ui';

export default function NotFound() {
  return (
    <>
      <PageHeader eyebrow="404" title="Halaman ini tidak ada" intro="Mungkin tautannya sudah berubah. Coba kembali ke beranda atau cari gerai terdekat." />
      <div className="mx-auto flex max-w-7xl flex-wrap gap-3 px-5 md:px-10">
        <Button to="/">Ke beranda</Button>
        <Button to="/lokasi" variant="outline">Cari gerai</Button>
      </div>
    </>
  );
}
