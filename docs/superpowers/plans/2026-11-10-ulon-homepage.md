# Ini Kopi Ulon Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A single-page, cozy redesign of the inikopiulon.com homepage that follows Tuku's "Tentang Kami" section flow.

**Architecture:** Static Vite + React SPA. Content lives in typed data modules (`src/data/*`). Each homepage section is one component in `src/components/`, and `App.tsx` stacks them in spec order. Tailwind v4 `@theme` tokens hold the palette and fonts. Photos are copied from the live site into `src/assets/photos/` and imported, so Vite fingerprints them.

**Tech Stack:** React 19, TypeScript, Vite 8, Tailwind CSS 4.3 (`@tailwindcss/vite`), `@fontsource-variable/fraunces`, `@fontsource-variable/plus-jakarta-sans`, Vitest + @testing-library/react + jsdom.

**Spec:** `docs/superpowers/specs/2026-11-10-ulon-homepage-design.md`

## Global Constraints

- Language: Indonesian UI copy (`<html lang="id">`), sentence case. Brand strings kept as-is: "Ini Kopi Ulon", "#SUMPAHGAKENCER", "#TEMANULON".
- Palette tokens (only these): cream `#FBF7F1`, oat `#F1E7DA`, espresso `#3B2A20`, mocha `#6E5444`, caramel `#B8733A` (the only accent).
- Fonts: Fraunces for headings, Plus Jakarta Sans for body. Self-hosted, no Google Fonts request.
- No black borders and no all-caps handwritten type (anti-Tuku). Hairlines use mocha at low opacity.
- External links: order `https://linktr.ee/inikopiulon`, kemitraan `https://desty.page/inikopiulon/sagan`, IG `https://www.instagram.com/inikopiulon`, TikTok `https://www.tiktok.com/@inikopiulon`, FB `https://www.facebook.com/inikopiulon`. All open in a new tab with `rel="noopener noreferrer"`.
- Head office: "Jalan Kebon Balok No.18, Pekalangan, Pekalipan, Kota Cirebon. 45118", phone "0822-6836-7017".
- Motion respects `prefers-reduced-motion: reduce` (no transforms; content visible immediately).
- The project is not a git repository: skip commit steps and don't `git init` unless the user asks.

## Review Focus

1. Mobile width 375px: no horizontal page scroll. The hero strip scrolls inside its own container only. → test in Task 8 (browser check), plus `overflow-x-auto` on the strip asserted in Task 3.
2. Reduced motion: every `Reveal` child is visible, and the store counter shows the final number at once. → tests in Task 3 and Task 6.
3. Keyboard: menu tabs follow the WAI-ARIA tabs pattern (ArrowLeft/ArrowRight move and select, wrapping). Store finder buttons have accessible names. → tests in Task 5 and Task 7.
4. Long addresses (outlets 006, 012) wrap inside the store finder card without overflow. → `break-words` asserted in Task 7, visual check in Task 8.
5. Slow or failed images: every `<img>` has non-empty `alt` plus explicit `width`/`height` or an aspect-ratio box, so the layout doesn't jump. → App-level test in Task 8.

---

### Task 1: Tooling, tokens, clean slate

**Files:**
- Delete: `src/App.css`, `src/assets/react.svg`, `src/assets/vite.svg`, `src/assets/hero.png`, `public/icons.svg` (if present; keep `public/favicon.svg` until a logo favicon replaces it in Task 2)
- Modify: `src/index.css` (replace the demo vars entirely), `index.html`, `package.json` (scripts), `vite.config.ts` (add `test` block)
- Create: `src/test/setup.ts`, `src/App.test.tsx`

**Interfaces:**
- Produces: Tailwind color utilities `bg-cream bg-oat text-espresso text-mocha bg-caramel text-caramel border-mocha/20`, font utilities `font-display` (Fraunces) and `font-sans` (Plus Jakarta Sans); `npm test` runs Vitest once.

- [ ] **Step 1: Install dev and runtime deps**
  Run: `npm i @fontsource-variable/fraunces @fontsource-variable/plus-jakarta-sans && npm i -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event`
- [ ] **Step 2: Configure Vitest.** In `vite.config.ts`, add `test: { environment: 'jsdom', setupFiles: './src/test/setup.ts', css: false }` (with `/// <reference types="vitest/config" />`). `setup.ts` imports `@testing-library/jest-dom/vitest` and stubs `window.matchMedia` and `IntersectionObserver` (jsdom has neither). Add the script `"test": "vitest run"`. Add `"types": ["vitest/globals"]` only if globals are used (they aren't: import from `vitest`).
- [ ] **Step 3: Write the failing smoke test** `src/App.test.tsx`: `render(<App />)` and expect `screen.getByRole('heading', { level: 1, name: /good days start with a good coffee/i })`.
- [ ] **Step 4: Run** `npm test`. Expected: FAIL (the demo App has no such heading).
- [ ] **Step 5: Tokens and base.** `src/index.css` = `@import "tailwindcss";`, the two fontsource imports, and `@theme { --color-cream:#FBF7F1; --color-oat:#F1E7DA; --color-espresso:#3B2A20; --color-mocha:#6E5444; --color-caramel:#B8733A; --font-display:"Fraunces Variable", serif; --font-sans:"Plus Jakarta Sans Variable", system-ui, sans-serif; }`. Body: `bg-cream text-espresso font-sans antialiased`, `scroll-behavior: smooth` unless reduced motion. `index.html`: `lang="id"`, title "Ini Kopi Ulon — #SUMPAHGAKENCER", meta description "Kopi legit, gurih, dan creamy dari Cirebon. Kunjungi 16 gerai Ini Kopi Ulon.".
- [ ] **Step 6: Temporary `App.tsx`** renders `<main><h1>Good days start with a good coffee</h1></main>` (Task 3 replaces it).
- [ ] **Step 7: Run** `npm test && npm run build`. Expected: PASS, build OK.

### Task 2: Content data and photos

**Files:**
- Create: `src/data/site.ts`, `src/data/stores.ts`, `src/data/menu.ts`, `src/data/testimonials.ts`, `src/data/pillars.ts`, `src/data/data.test.ts`, `src/assets/photos/*`

**Interfaces:**
- Produces:
  - `site: { orderUrl, partnerUrl, phone, headOffice, socials: { label: 'Instagram'|'TikTok'|'Facebook'; href: string }[] }`
  - `type Store = { code: string; address: string; city: City; mapsUrl: string }`, `type City = 'Cirebon'|'Jakarta'|'Bekasi'|'Tangerang'|'Subang'|'Yogyakarta'`, `stores: Store[]`, `cities: City[]` (unique, in first-appearance order)
  - `type MenuCategory = { id: string; name: string; blurb: string; image: string }`, `menu: MenuCategory[]`
  - `type Testimonial = { name: string; quote: string; avatar: string }`, `testimonials: Testimonial[]`
  - `type Pillar = { title: string; body: string; image: string }`, `pillars: Pillar[]`
  - Photo imports: `logo`, `heroStrip: { src: string; alt: string }[]` (5 photos), `storyPhoto`, `processPhoto`, `partnerPhoto` (exported from `src/data/photos.ts`)

- [ ] **Step 1: Download photos** with `curl -L -o` into `src/assets/photos/`, using readable names. Logo `https://inikopiulon.com/wp-content/uploads/2024/10/png-removebg-preview.webp` → `logo.webp`. Menu (in order): `…/2024/10/225709223_2616554461973199_1877232357459728381_n.webp` signature, `…/2024/10/271755657_2728416370787007_8855633677975333276_n.webp` non-coffee, `…/elementor/thumbs/324427298_916585643044180_3111221114877381240_n-qvynaw0mk58fuxnld3buvbwdc6vr3pxpg0cz13zfo0.webp` squash, `…/2024/10/324743713_1936451840019735_8040649388827085393_n.webp` ncream, `…/2024/10/324403659_480770257351913_4136759990488025326_n.webp` premium-tea, `…/elementor/thumbs/224847830_2619991184962860_1753165607023091299_n-qvyq86vq6zduiap5h3y8p9ad35v2f0z697e7i1uols.jpg` literan, `…/elementor/thumbs/271539727_2725868477708463_302337070201039665_n_1-qvyna7ktmgazh2n3bsrk2i2dw687jl8oonecjwzo5s.webp` bites, `…/elementor/thumbs/312143307_634304048087784_6410045498657492197_n-qvypn4byzojg8zazii2bb2pdp7puvabscwxd7r3e34.webp` snack, `…/elementor/thumbs/Snapinsta.app_409801292_2754664491357535_1862520534073390351_n_1080-qvyptev2qr5jz05xrpzehzjgv2pbecb3k25dvfrifk.jpg` rice-bowl. Space/people: `…/2024/11/Picture1.jpg`, `…/2024/10/230384288_2618621715099807_6636743250168015730_n-1.jpg`, `…/2024/10/136430175_2484887985139848_6037017305656041468_n_1.webp`, `…/2024/10/varieties-of-coffee-beans.jpg`, `…/2024/10/222013586_2611756519119660_3309224678269141946_n_1.webp`, `…/2026/06/cafe-ulon-signature-tuparev-cirebon.jpg`, `…/2024/10/2024-09-18.jpg`, `…/2024/10/IMG_8979.jpg`, `…/2024/10/444929177_18101005303404291_5412553942538480144_n.webp`, `…/2024/10/395089420_18077851069404291_373964468845833793_n.jpg`. Avatars: `…/2024/10/unnamed-1.png` (Danu AJ), `…/2024/10/unnamed.png` (Farhan Wali). Base URL: `https://inikopiulon.com/wp-content/uploads`. Then open each one with Read to pick the hero, story, process and partner shots (prefer warm interiors and drinks; skip stock-looking ones).
- [ ] **Step 2: Write failing tests** `src/data/data.test.ts`:
  - `stores` has length 16; codes are unique and match `/^\d{3}$/`; every `mapsUrl` starts with `https://maps.app.goo.gl/`.
  - `cities` equals `['Cirebon','Subang','Bekasi','Jakarta','Tangerang','Yogyakarta']` (first-appearance order of the store list below).
  - `menu.map(m => m.name)` equals `['Signature','Non coffee','Squash series',"N'cream series",'Premium tea','Literan coffee','Bites','Snack','Rice bowl']`; ids are unique.
  - `testimonials` has 2 entries, names `['Danu AJ','Farhan Wali']`.
  - `pillars` has 4 entries.
- [ ] **Step 3: Run** `npm test`. Expected: FAIL (modules missing).
- [ ] **Step 4: Write the data.** Stores, in this order (code · address · city · maps):
  001 · Jl. Pulasaren No.26, Kota Cirebon · Cirebon · NHnZiKyfXS7GKtCz8
  002 · Perumnas, Jl. Ciremai Raya No.109, Kota Cirebon · Cirebon · knzdmwPxcQsrUBEi6
  003 · Mertapada Wetan, Jl. KH Wahid Hasyim No.27, Kab. Cirebon · Cirebon · DXNf857cw2wDzSfh8
  016 · Jl. Raya Rancasari, Kec. Pamanukan, Kab. Subang · Subang · nu4vkjzDtDh2Mctq6
  017 · Ruko Hollywood Boulevard Jababeka, Cikarang, Kab. Bekasi · Bekasi · EmoAvSzzVGe88d5d7
  018 · Jl. Tuparev No.20, Sutawinangun, Kedawung, Kab. Cirebon · Cirebon · YopcScxhydcFpxe5A
  004 · Food Court Pisang Ijo (seberang Binus Syahdan), Jl. KH Syahdan No.18C, Jakarta Barat · Jakarta · Vzbcut6kRp41pnT68
  005 · Gedung Menara Satu Sentra, Jl. Boulevard Raya No.1, Kelapa Gading, Jakarta Utara · Jakarta · Gu1bu9Q2VBKfnpTT9
  006 · Gedung Graha Aktiva, Jl. H.R. Rasuna Said Kav.3, Kuningan Timur, Setiabudi, Jakarta Selatan · Jakarta · 1q8NVNx9yBmrUk638
  007 · Apartemen Menara Latumenten Kios B28, Jl. Jelambar Baru, Jakarta Barat · Jakarta · EMcnRNqpb41H1phbA
  008 · Sedayu City, Rukan Boulevard Raya Blok F No.028, Kelapa Gading, Jakarta Utara · Jakarta · Mg7jyL4Ebx2aM6ue9
  010 · Jl. Pluit Karang Niaga 1 Blok Z8 Selatan No.23, Muara Karang, Jakarta Utara · Jakarta · Ydp5ozbeSUB2cKX79
  011 · Ranch Market Kemang Lt.2, Jl. Kemang Raya No.66, Jakarta Selatan · Jakarta · rGKjWSxzhdRP18XX8
  012 · Ruko Maxwell Blok C No.08, Jl. Maxwell Raya, Medang, Pagedangan, Kab. Tangerang · Tangerang · wQEUdz8FPwiJF153A
  015 · RS Atma Jaya Lobby Lt.2, Jl. Pluit Raya No.2, Penjaringan, Jakarta Utara · Jakarta · 296pu9i2ZPWib98f6
  009 · Claus Building, Jl. Prof. Herman Yohanes No.73, Sagan, Yogyakarta · Yogyakarta · HjqtNpgex2sS7j2h9
  (`mapsUrl` = `https://maps.app.goo.gl/` + id.) Testimonial quotes are verbatim from the live site:
  Danu AJ: "Rekomendet bangettt!!! Tempatnya bagus adem dan enak buat nyantai sambil buat tugas kuliah. Suasana nya juga enak, kopi nya juga enak pkknya. Gak akan nyesel"
  Farhan Wali: "Kopinya enak beneran kental jadi kerasa banget ga encer. terus tempat nya cozy banget di lantai atas ada co working space gitu jadi nyaman buat nugas. sangat recommended apalagi suasana tuh enak tenang ga berisik serta tempat duduknya nyaman."
  Pillars (title → body taken from the site's "Temukan keunggulan kami" paragraphs, in order): "Biji premium", "SOP dan barista terlatih", "Menu selalu baru", "Pengalaman yang hangat". Menu `blurb`s are one sentence each, written by us. Mark them with a `// placeholder copy — confirm with Ulon` comment.
- [ ] **Step 5: Run** `npm test`. Expected: PASS.

### Task 3: Reveal, Navbar, HeroStrip

**Files:** Create `src/components/Reveal.tsx`, `src/components/Navbar.tsx`, `src/components/HeroStrip.tsx`, `src/components/sections.test.tsx`

**Interfaces:**
- Consumes: `site`, `logo`, `heroStrip` (Task 2)
- Produces: `Reveal({ children, delay?: number, className?: string })`, which fades up on first intersection and renders visible immediately when `matchMedia('(prefers-reduced-motion: reduce)').matches`. `Navbar()` has anchors `#tentang #menu #gerai #cerita #kemitraan`. `HeroStrip()` holds the page `<h1>`. Every later section uses an `id` matching these anchors.

- [ ] **Step 1: Failing tests** in `sections.test.tsx`: (a) with reduced motion stubbed true, `<Reveal><p>x</p></Reveal>` wrapper has no `opacity-0` class; (b) Navbar link "Menu" has `href="#menu"`, and "Pesan sekarang" has `href=site.orderUrl`, `target="_blank"`, `rel` containing `noopener`; (c) HeroStrip renders the h1 and #SUMPAHGAKENCER, its photo list container has class `overflow-x-auto`, and every img has non-empty alt.
- [ ] **Step 2: Run** `npm test -- sections`. Expected: FAIL.
- [ ] **Step 3: Implement.** Navbar: sticky, transparent over the hero, switches to `bg-cream/90 backdrop-blur` after `scrollY > 24`. Mobile: a menu button (`aria-expanded`) opens a stacked link sheet. Logo: if the downloaded logo is white, render it with CSS `filter: brightness(0) sepia(1) saturate(.6)` or similar so it reads as espresso on cream. Decide after viewing the file. HeroStrip: h1 in `font-display`, large; below it a snap-scroll row of 5 photos with alternating arch (`rounded-t-full`) and rounded rectangle frames.
- [ ] **Step 4: Run** `npm test`. Expected: PASS.

### Task 4: StorySplit, ProcessSplit, Pillars

**Files:** Create `src/components/StorySplit.tsx`, `src/components/ProcessSplit.tsx`, `src/components/Pillars.tsx`; extend `sections.test.tsx`

**Interfaces:**
- Consumes: `pillars`, `storyPhoto`, `processPhoto`, `Reveal`
- Produces: `StorySplit()` (`id="tentang"`), `ProcessSplit()`, `Pillars()`

- [ ] **Step 1: Failing tests:** StorySplit has heading "Kualitas yang terjaga, rasa yang tak terlupakan" and the words Legit, Gurih, Creamy. ProcessSplit has heading "Fresh coffee, refresh memories". Pillars renders 4 `article`s and the heading "Kenapa Ulon".
- [ ] **Step 2: Run.** Expected: FAIL.
- [ ] **Step 3: Implement.** Splits are `lg:grid-cols-2 lg:min-h-[calc(100svh-64px)]`. Text side on `bg-oat`; photo side full-bleed `object-cover`. On mobile the photo comes first. Body copy is verbatim from the site's two paragraphs. Pillars: `lg:grid-cols-[auto_repeat(4,1fr)]`, title column with `writing-mode: vertical-rl` on lg and horizontal on mobile.
- [ ] **Step 4: Run.** Expected: PASS.

### Task 5: MenuTabs

**Files:** Create `src/components/MenuTabs.tsx`, `src/components/MenuTabs.test.tsx`

**Interfaces:**
- Consumes: `menu`
- Produces: `MenuTabs()` (`id="menu"`)

- [ ] **Step 1: Failing tests:** (a) 9 `tab` roles; "Signature" has `aria-selected="true"` initially and the `tabpanel` shows its blurb; (b) clicking "Rice bowl" selects it and the panel's img alt contains "Rice bowl"; (c) focus "Signature" + ArrowLeft selects "Rice bowl" (wrap), ArrowRight from "Rice bowl" selects "Signature"; (d) only the selected tab has `tabIndex=0`.
- [ ] **Step 2: Run** `npm test -- MenuTabs`. Expected: FAIL.
- [ ] **Step 3: Implement** with `useState<string>(menu[0].id)`. The tablist scrolls horizontally on mobile. Active tab gets a caramel underline. The panel cross-fades (`key` on the image, plus a CSS opacity transition).
- [ ] **Step 4: Run.** Expected: PASS.

### Task 6: StoresMap (sticky)

**Files:** Create `src/components/StoresMap.tsx`, `src/components/CitiesMap.tsx` (inline SVG), `src/components/StoresMap.test.tsx`

**Interfaces:**
- Consumes: `stores`, `cities`
- Produces: `StoresMap()` (`id="gerai"`)

- [ ] **Step 1: Failing tests:** with reduced motion, the text "sudah hadir di 16 gerai" is present (number = `stores.length`, not hard-coded) and all 6 city names render.
- [ ] **Step 2: Run.** Expected: FAIL.
- [ ] **Step 3: Implement.** The desktop wrapper is `lg:h-[220vh]` with an inner `lg:sticky lg:top-16 lg:h-[calc(100svh-64px)]`. Scroll progress (from `getBoundingClientRect` in a passive scroll listener with rAF) drives the counter from 0 → `stores.length` and lights up the city pins in order. Mobile and reduced motion use a plain block with the final values. `CitiesMap` is a hand-placed SVG with soft dashed route lines between the city dots, roughly positioned west → east (Jakarta, Tangerang, Bekasi, Subang, Cirebon, Yogyakarta south-east), drawn in mocha/caramel, with no country outline.
- [ ] **Step 4: Run.** Expected: PASS.

### Task 7: Testimonials, PartnerBand, Footer + StoreFinder

**Files:** Create `src/components/Testimonials.tsx`, `src/components/PartnerBand.tsx`, `src/components/StoreFinder.tsx`, `src/components/Footer.tsx`, `src/components/StoreFinder.test.tsx`

**Interfaces:**
- Consumes: `testimonials`, `stores`, `site`, `partnerPhoto`
- Produces: `Testimonials()` (`id="cerita"`), `PartnerBand()` (`id="kemitraan"`), `Footer()`, `StoreFinder()`

- [ ] **Step 1: Failing tests** for StoreFinder: it shows "#TEMANULON 001" initially, plus a counter "1 / 16". The button named "Gerai sebelumnya" goes to "#TEMANULON 009" ("16 / 16"), and "Gerai selanjutnya" from there goes back to 001. The "Buka di Google Maps" link has the store's `mapsUrl`, `target="_blank"` and `rel` containing `noopener`. The address element has class `break-words`. PartnerBand CTA has `href=site.partnerUrl`.
- [ ] **Step 2: Run** `npm test -- StoreFinder`. Expected: FAIL.
- [ ] **Step 3: Implement.** Testimonials: 2 quote cards in `font-display` italic with round avatars, side by side on md+. PartnerBand: caramel-tinted oat band with photo, "Buka gerai Ulon di kotamu" heading, CTA. Footer: StoreFinder card (left), head office + phone `tel:` link + socials (right), then the copyright line "© 2026 Ini Kopi Ulon".
- [ ] **Step 4: Run.** Expected: PASS.

### Task 8: Compose, polish, verify

**Files:** Modify `src/App.tsx`, `src/App.test.tsx`

**Interfaces:**
- Consumes: all section components.

- [ ] **Step 1: Failing tests** in `App.test.tsx`: there are sections with ids `tentang, menu, gerai, cerita, kemitraan`; every `img` has non-empty `alt` and either `width`+`height` attributes or a parent with an `aspect-` class.
- [ ] **Step 2: Compose** in order Navbar, HeroStrip, StorySplit, MenuTabs, ProcessSplit, Pillars, StoresMap, Testimonials, PartnerBand, Footer. Run `npm test`. Expected: PASS.
- [ ] **Step 3: Design pass** with the `design-taste-frontend` skill (spacing rhythm, type scale, hero entrance), then an `unslop` pass. Keep the spec's palette and fonts. Re-run `npm test`.
- [ ] **Step 4: Browser check.** Run `npm run dev` via preview, take screenshots at 1280 and 375 widths. Assert `document.documentElement.scrollWidth <= innerWidth` at 375, the sticky map counter reaches 16, tabs and the store finder work, and photos load (no broken images: `[...document.images].every(i => i.naturalWidth > 0)`).
- [ ] **Step 5:** `npm run build`. Expected: success, no TS errors.
