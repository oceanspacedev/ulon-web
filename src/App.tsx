import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { getLenis, SmoothScroll } from './components/motion';
import Beranda from './pages/Beranda';
import Tentang from './pages/Tentang';
import MenuPage from './pages/Menu';
import Lokasi from './pages/Lokasi';
import Kabar from './pages/Kabar';
import NotFound from './pages/NotFound';

const titles: Record<string, string> = {
  '/': 'Ini Kopi Ulon — #SUMPAHGAKENCER',
  '/tentang': 'Tentang — Ini Kopi Ulon',
  '/menu': 'Menu — Ini Kopi Ulon',
  '/lokasi': 'Lokasi gerai — Ini Kopi Ulon',
  '/kabar': 'Kabar — Ini Kopi Ulon',
};

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    document.title = titles[pathname] ?? 'Ini Kopi Ulon';
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="min-h-screen">
      <SmoothScroll />
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Beranda />} />
          <Route path="/tentang" element={<Tentang />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/lokasi" element={<Lokasi />} />
          <Route path="/kabar" element={<Kabar />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
