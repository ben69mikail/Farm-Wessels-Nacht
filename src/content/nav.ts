export type Locale = 'de' | 'en';

/** Ein Eintrag = eine Seite in beiden Sprachen. `path` ist der Slug ohne Sprachpräfix. */
export const PAGES = [
  { key: 'home',    de: { path: '',                  label: 'Start' },            en: { path: '',                 label: 'Home' } },
  { key: 'hunting', de: { path: 'die-jagd',          label: 'Die Jagd' },         en: { path: 'hunting',          label: 'The Hunt' } },
  { key: 'species', de: { path: 'wildarten-preise',  label: 'Wildarten & Preise'},en: { path: 'species-rates',    label: 'Species & Rates' } },
  { key: 'lodge',   de: { path: 'lodge',             label: 'Lodge' },            en: { path: 'lodge',            label: 'Lodge' } },
  { key: 'travel',  de: { path: 'anreise',           label: 'Anreise' },          en: { path: 'travel',           label: 'Getting Here' } },
  { key: 'about',   de: { path: 'ueber-uns',         label: 'Über uns' },         en: { path: 'about',            label: 'About Us' } },
  { key: 'contact', de: { path: 'kontakt',           label: 'Kontakt' },          en: { path: 'contact',          label: 'Contact' } },
] as const;

export const LEGAL = [
  { key: 'imprint', de: { path: 'impressum',   label: 'Impressum' },     en: { path: 'imprint', label: 'Imprint' } },
  { key: 'privacy', de: { path: 'datenschutz', label: 'Datenschutz' },   en: { path: 'privacy', label: 'Privacy' } },
] as const;

const ALL = [...PAGES, ...LEGAL];

/** Baut den fertigen URL-Pfad für eine Seite in einer Sprache. */
export function href(key: string, locale: Locale): string {
  const page = ALL.find((p) => p.key === key);
  if (!page) return locale === 'de' ? '/' : '/en';
  const slug = page[locale].path;
  const base = locale === 'de' ? '' : '/en';
  return slug ? `${base}/${slug}` : base || '/';
}

/** Gegenstück derselben Seite in der anderen Sprache. */
export function alternate(key: string, locale: Locale): string {
  return href(key, locale === 'de' ? 'en' : 'de');
}

export function navItems(locale: Locale) {
  return PAGES.map((p) => ({ key: p.key, label: p[locale].label, href: href(p.key, locale) }));
}
export function legalItems(locale: Locale) {
  return LEGAL.map((p) => ({ key: p.key, label: p[locale].label, href: href(p.key, locale) }));
}
