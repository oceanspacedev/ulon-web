// Content for the Ini Kopi Ulon site. Facts come from inikopiulon.com (home, about, store-location, news).
// Lines marked "draft" are written for the redesign and should be checked with the Ulon team.

export const site = {
  name: 'Ini Kopi Ulon',
  tagline: '#SUMPAHGAKENCER',
  orderUrl: 'https://linktr.ee/inikopiulon',
  partnerUrl: 'https://desty.page/inikopiulon/sagan',
  instagram: 'https://www.instagram.com/inikopiulon',
  tiktok: 'https://www.tiktok.com/@inikopiulon',
  facebook: 'https://www.facebook.com/inikopiulon',
  phone: '0822-6836-7017',
  phoneHref: 'tel:+6282268367017',
  headOffice: 'Jalan Kebon Balok No.18, Pekalangan, Pekalipan, Kota Cirebon 45118',
} as const;

export const img = (name: string) => `/img/${name}.webp`;

/* ---------------------------------------------------------------- stores */

export type City = 'Cirebon' | 'Jakarta' | 'Bekasi' | 'Tangerang' | 'Subang' | 'Yogyakarta';
export type Store = { code: string; name: string; address: string; city: City; map: string };

const g = (id: string) => `https://maps.app.goo.gl/${id}`;

// In the order of their #TEMANULON numbers.
export const stores: Store[] = [
  { code: '001', name: 'Pulasaren', address: 'Jl. Pulasaren No.26, Kota Cirebon', city: 'Cirebon', map: g('NHnZiKyfXS7GKtCz8') },
  { code: '002', name: 'Perumnas', address: 'Jl. Ciremai Raya No.109, Perumnas, Kota Cirebon', city: 'Cirebon', map: g('knzdmwPxcQsrUBEi6') },
  { code: '003', name: 'Mertapada', address: 'Jl. KH Wahid Hasyim No.27, Mertapada Wetan, Kab. Cirebon', city: 'Cirebon', map: g('DXNf857cw2wDzSfh8') },
  { code: '004', name: 'Binus Syahdan', address: 'Food Court Pisang Ijo, Jl. KH Syahdan No.18C, Jakarta Barat', city: 'Jakarta', map: g('Vzbcut6kRp41pnT68') },
  { code: '005', name: 'Menara Satu Sentra', address: 'Jl. Boulevard Raya No.1, Kelapa Gading, Jakarta Utara', city: 'Jakarta', map: g('Gu1bu9Q2VBKfnpTT9') },
  { code: '006', name: 'Graha Aktiva', address: 'Jl. HR Rasuna Said Kav.3, Kuningan Timur, Jakarta Selatan', city: 'Jakarta', map: g('1q8NVNx9yBmrUk638') },
  { code: '007', name: 'Menara Latumenten', address: 'Kios B28, Jl. Jelambar Baru, Jakarta Barat', city: 'Jakarta', map: g('EMcnRNqpb41H1phbA') },
  { code: '008', name: 'Sedayu City', address: 'Rukan Boulevard Raya Blok F No.028, Kelapa Gading, Jakarta Utara', city: 'Jakarta', map: g('Mg7jyL4Ebx2aM6ue9') },
  { code: '009', name: 'Sagan', address: 'Claus Building, Jl. Prof. Herman Yohanes No.73, Sagan, Yogyakarta', city: 'Yogyakarta', map: g('HjqtNpgex2sS7j2h9') },
  { code: '010', name: 'Muara Karang', address: 'Jl. Pluit Karang Niaga 1 Blok Z8 Selatan No.23, Jakarta Utara', city: 'Jakarta', map: g('Ydp5ozbeSUB2cKX79') },
  { code: '011', name: 'Ranch Market Kemang', address: 'Lt.2, Jl. Kemang Raya No.66, Mampang Prapatan, Jakarta Selatan', city: 'Jakarta', map: g('rGKjWSxzhdRP18XX8') },
  { code: '012', name: 'Ruko Maxwell', address: 'Blok C No.08, Jl. Maxwell Raya, Medang, Pagedangan, Kab. Tangerang', city: 'Tangerang', map: g('wQEUdz8FPwiJF153A') },
  { code: '015', name: 'RS Atma Jaya', address: 'Lobby Lt.2, Jl. Pluit Raya No.2, Penjaringan, Jakarta Utara', city: 'Jakarta', map: g('296pu9i2ZPWib98f6') },
  { code: '016', name: 'Pamanukan', address: 'Jl. Raya Rancasari, Kec. Pamanukan, Kab. Subang', city: 'Subang', map: g('nu4vkjzDtDh2Mctq6') },
  { code: '017', name: 'Jababeka', address: 'Ruko Hollywood Boulevard Jababeka, Cikarang, Kab. Bekasi', city: 'Bekasi', map: g('EmoAvSzzVGe88d5d7') },
  { code: '018', name: 'Tuparev', address: 'Jl. Tuparev No.20, Sutawinangun, Kedawung, Kab. Cirebon', city: 'Cirebon', map: g('YopcScxhydcFpxe5A') },
];

export const cities: City[] = ['Cirebon', 'Jakarta', 'Bekasi', 'Tangerang', 'Subang', 'Yogyakarta'];

/* ---------------------------------------------------------------- menu */

export type MenuGroup = 'Kopi' | 'Non kopi' | 'Makanan';
export type MenuItem = { id: string; name: string; group: MenuGroup; blurb: string };

// Category names are the site's own; the one-line blurbs are draft copy.
export const menu: MenuItem[] = [
  { id: 'signature', name: 'Signature', group: 'Kopi', blurb: 'Kopi susu khas Ulon yang legit, gurih, dan creamy' },
  { id: 'literan', name: 'Literan coffee', group: 'Kopi', blurb: 'Kopi favorit dalam botol satu liter, untuk dibagi ramai-ramai' },
  { id: 'ncream', name: "N'cream series", group: 'Kopi', blurb: 'Minuman dingin dengan lapisan cream lembut di atasnya' },
  { id: 'noncoffee', name: 'Non coffee', group: 'Non kopi', blurb: 'Pilihan susu dingin tanpa kopi, tetap manis dan creamy' },
  { id: 'squash', name: 'Squash series', group: 'Non kopi', blurb: 'Minuman soda buah yang segar untuk siang yang panas' },
  { id: 'tea', name: 'Premium tea', group: 'Non kopi', blurb: 'Teh dingin dengan rasa buah, ringan dan menyegarkan' },
  { id: 'bites', name: 'Bites', group: 'Makanan', blurb: 'Croissant dan pastry renyah, teman pas segelas kopi' },
  { id: 'snack', name: 'Snack', group: 'Makanan', blurb: 'Camilan untuk dinikmati sambil nongkrong atau nugas' },
  { id: 'ricebowl', name: 'Rice bowl', group: 'Makanan', blurb: 'Nasi dengan lauk, untuk yang datang dalam keadaan lapar' },
];

export const menuGroups: MenuGroup[] = ['Kopi', 'Non kopi', 'Makanan'];

/* ---------------------------------------------------------------- words from the current site */

export const about = {
  quality:
    'Ini Kopi Ulon hadir dengan mengusung menu-menu yang memiliki cita rasa legit, gurih, dan creamy. Kami menggunakan bahan baku terbaik dengan produksi berstandar internasional sehingga menghasilkan rasa kopi yang nikmat dan khas.',
  sop:
    'Demi menjaga konsistensi kualitas, Ini Kopi Ulon menerapkan Standard Operating Procedure (SOP) yang telah teruji. Setiap cangkir kopi yang Anda nikmati adalah bukti dari dedikasi dan keahlian tim kami.',
  choose:
    'Memilih Ini Kopi Ulon berarti memilih kualitas, rasa, dan pengalaman yang tak terlupakan. Bergabunglah dengan kami dan nikmati setiap momen di setiap seduhan.',
};

export const pillars = [
  {
    tag: 'Biji premium',
    title: 'Dari perkebunan terpilih',
    body: 'Kami hanya menggunakan biji kopi premium. Setiap biji melewati seleksi ketat sebelum sampai ke tangan Anda.',
    image: 'strip-pourover',
  },
  {
    tag: 'SOP dan barista',
    title: 'Satu standar di semua gerai',
    body: 'Prosedur yang telah teruji menjaga cita rasa dan aroma. Barista kami terlatih menyajikan setiap cangkir dengan sempurna.',
    image: 'strip-grinder',
  },
  {
    tag: 'Menu selalu baru',
    title: 'Selalu ada yang baru',
    body: 'Menu yang terus diperbarui dan inovasi dalam penyajian, jadi selalu ada yang menarik setiap kali berkunjung.',
    image: 'strip-iced',
  },
  {
    tag: 'Pengalaman',
    title: 'Hangat dari pintu masuk',
    body: 'Dari saat Anda masuk sampai kopi habis, kami ingin setiap kunjungan terasa menyenangkan.',
    image: 'strip-bar',
  },
];

export type Quote = { name: string; text: string; avatar: string };

// Two reviews published on inikopiulon.com, word for word.
export const quotes: Quote[] = [
  {
    name: 'Danu AJ',
    text: 'Rekomendet bangettt!!! Tempatnya bagus adem dan enak buat nyantai sambil buat tugas kuliah. Suasana nya juga enak, kopi nya juga enak pkknya. Gak akan nyesel',
    avatar: 'av-danu',
  },
  {
    name: 'Farhan Wali',
    text: 'Kopinya enak beneran kental jadi kerasa banget ga encer. terus tempat nya cozy banget di lantai atas ada co working space gitu jadi nyaman buat nugas. sangat recommended apalagi suasana tuh enak tenang ga berisik serta tempat duduknya nyaman.',
    avatar: 'av-farhan',
  },
];

export type News = { title: string; date: string; url: string; image: string };

export const news: News[] = [
  {
    title: 'Proses pembuatan Ini Kopi Ulon: dari kebun ke cangkir',
    date: '24 Oktober 2024',
    url: 'https://inikopiulon.com/proses-pembuatan-ini-kopi-ulon-dari-kebun-ke-cangkir/',
    image: 'news-proses',
  },
  {
    title: 'Manfaat Ini Kopi Ulon bagi kesehatan',
    date: '24 Oktober 2024',
    url: 'https://inikopiulon.com/manfaat-ini-kopi-ulon-bagi-kesehatan/',
    image: 'news-manfaat',
  },
  {
    title: 'Sejarah dan evolusi kopi di dunia',
    date: '24 Oktober 2024',
    url: 'https://inikopiulon.com/sejarah-dan-evolusi-kopi-di-dunia/',
    image: 'news-sejarah',
  },
];

// Photos for the scrolling strips, with what each shows.
export const stripPhotos = [
  { name: 'strip-barista', alt: 'Barista menuang biji kopi ke grinder' },
  { name: 'strip-signature', alt: 'Es kopi susu Signature Ulon' },
  { name: 'strip-bar', alt: 'Meja bar putih dengan logo Ulon di dinding' },
  { name: 'strip-machine', alt: 'Espresso mengalir dari mesin kopi' },
  { name: 'strip-tuparev', alt: 'Gerai Ulon Tuparev pada malam hari' },
  { name: 'strip-table', alt: 'Es kopi dan pastry di atas nampan kayu' },
  { name: 'strip-croissant', alt: 'Croissant almond di atas rak' },
  { name: 'strip-iced', alt: 'Es kopi dan croissant di atas papan kayu' },
];
