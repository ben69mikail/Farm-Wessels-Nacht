# Wild Wessels Safaris — Website v2 („Nacht im Bushveld")

Zweite, eigenständige Website: dunkel, filmisch, animiert. Läuft parallel zu v1 auf einer eigenen Netlify-Site.

## Stack
Astro 5 · GSAP ScrollTrigger · Lenis · Bodoni Moda + Hanken Grotesk (lokal via Fontsource) · Netlify Forms

## Befehle
```
npm install
npm run dev      # http://localhost:4321
npm run build    # -> dist/
```

## Pflege
- Texte: `src/content/de.ts`, `src/content/en.ts` (Seitentexte), `src/content/v2.ts` (Interaktionen, neue Sektionen)
- Kontaktdaten: `src/content/contact.ts` (leere Felder blenden Buttons aus)
- Farben/Radien/Schriften: `src/styles/global.css` (`:root`)
- Bewegung: `src/scripts/motion.ts` (data-Attribute, siehe Kopfkommentar)
- Bilder: `src/assets/…`, Videos: `public/video/…`
- Trophäenbilder: `sections/HuntingPage.astro` → `trophies` (bleiben verdeckt bis Klick)

## Deploy
Netlify: Build `npm run build`, Publish `dist`, Node 22 (siehe `netlify.toml`).
Nach Verbinden der Site die URL in `astro.config.mjs` (`SITE`) und `public/robots.txt` eintragen.
