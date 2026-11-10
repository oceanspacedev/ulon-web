# Redesign Ini Kopi Ulon — homepage

## Context
https://inikopiulon.com/ is a WordPress site that's mostly images, with thin structure. It belongs to a modern cafe chain with 16 outlets ("#TEMANULON") in Cirebon, Jakarta, Bekasi, Tangerang, Subang and Yogyakarta. The user wants a redesign that follows the section flow of https://www.tuku.coffee/id/tentang-kami, but in its own aesthetic, cozy modern-cafe style, unlike Tuku's bold black, all-caps handwritten look.

Decisions from the user: start with the **homepage only** (one long page), and **reuse photos from the current site**. For the section changes the user said "atur ama km" (you decide), so the order below is my call. Project: `C:\Users\AHTAR\ulon-web`, already set up with Vite + React 19 + TS + Tailwind v4 (`@tailwindcss/vite`, with an inline PostCSS override in `vite.config.ts`).

## Section order (final; my call)
| # | Section | Tuku equivalent | Content source |
|---|---|---|---|
| 0 | Sticky navbar: logo, Tentang · Menu · Gerai · Cerita · Kemitraan, "Pesan sekarang" pill → linktr.ee/inikopiulon | top nav | site |
| 1 | Hero: large serif tagline "Good days start with a good coffee" + #SUMPAHGAKENCER above a horizontally scrollable photo strip | scrolling illustration banner | site photos |
| 2 | Split 50/50, full height: "Kualitas yang terjaga, rasa yang tak terlupakan" text on the left; photo with big overlay words Legit / Gurih / Creamy on the right | Maka Group split | site copy |
| 3 | Menu: 9 category tabs (Signature … Rice bowl), with a photo and short description of the selected category | year timeline | category names from site; short descriptions written by me (placeholder, marked) |
| 4 | Mirrored split: warm interior photo on the left; "Fresh coffee, refresh memories" (SOP, barista) on the right | Arah/Langkah split | site copy |
| 5 | Pillars: vertical title "Kenapa Ulon" + 4 cards (biji premium, SOP dan barista, menu selalu baru, pengalaman hangat) | Pilar Utama | site copy |
| 6 | Sticky scroll section: stylized SVG map of the 6 cities, counter "sudah hadir di 16 gerai" | Semesta Tuku | store list |
| 7 | Cerita pelanggan: testimonial cards you can swipe | — | site (Danu AJ, Farhan Wali, …) |
| 8 | Kemitraan band: short pitch + CTA → desty.page/inikopiulon/sagan | — | site |
| 9 | Footer: store finder with prev/next across all 16 outlets (address + Google Maps), head office Cirebon, phone, socials | footer locator | site |

## Visual style (cozy, not Tuku)
- Tailwind v4 `@theme` tokens in `src/index.css`: cream `#FBF7F1` (page), oat `#F1E7DA` (alternate panels), espresso `#3B2A20` (text), mocha `#6E5444` (secondary text), caramel `#B8733A` (the only accent, for CTAs and active tab).
- Type: Fraunces (soft serif display, sentence case) for headings; Plus Jakarta Sans for body. Self-hosted via `@fontsource-variable/*`.
- Arched/rounded photo frames, generous whitespace, thin mocha hairlines instead of black borders, a subtle warm grain overlay on photos only.
- Motion: slow fade-up on enter, the sticky map counter, tab cross-fade. Honor `prefers-reduced-motion`. Mobile: the sticky section becomes a plain block, and splits stack (photo first).
- Remove the Vite demo (`App.css`, `src/assets/*` demo SVGs, demo `index.css` vars).

## Files
- `src/index.css` — Tailwind import, `@theme` tokens, font faces, base styles
- `src/App.tsx` — composes the sections
- `src/components/` — `Navbar`, `HeroStrip`, `StorySplit`, `MenuTabs`, `ProcessSplit`, `Pillars`, `StoresMap`, `Testimonials`, `PartnerBand`, `Footer` (+ `StoreFinder`), plus a shared `Reveal` (IntersectionObserver fade-up)
- `src/data/` — `stores.ts` (16 outlets: code, address, city, maps URL), `menu.ts` (9 categories), `testimonials.ts`, `site.ts` (links, head office, socials)
- `src/assets/photos/` — photos downloaded from inikopiulon.com `wp-content/uploads` (logo, bar, drinks, beans, interior, testimonial avatars). Scrape Google Maps links and testimonial text from the live pages at build time.
- `docs/superpowers/specs/2026-11-10-ulon-homepage-design.md` — this design saved as the spec
- `index.html` — title "Ini Kopi Ulon", lang="id", meta description

## Process
1. Save the spec, then superpowers:writing-plans → execute task by task.
2. TDD with Vitest + Testing Library for the logic pieces: `MenuTabs` (switching category), `StoreFinder` (prev/next wraps around 16 outlets), store count derived from data.
3. Build the visuals with the design-taste-frontend skill, then run an unslop pass on the result.

## Verification
- `npm test` and `npm run build` pass.
- `npm run dev` via the preview browser: screenshots at desktop (1280) and mobile (375). Check there's no horizontal page scroll, the sticky map works on desktop, tabs and the store finder work, all external links are correct, and the photos load.
- superpowers:verification-before-completion before reporting done.
