/* -----------------------------------------------------------
   ZENTRALE KONTAKTDATEN — hier und nur hier pflegen.
   Leere Werte blenden den jeweiligen Button automatisch aus.
   ----------------------------------------------------------- */
export const CONTACT = {
  brand: 'Wild Wessels Safaris',
  email: 'info@wildwessels.com',
  /** Internationales Format ohne Leerzeichen, z. B. '+27761252537' */
  phone: '',
  /** Nur Ziffern, ohne + und ohne Leerzeichen, z. B. '27761252537' */
  whatsapp: '',
  place: 'Modimolle, Limpopo',
  country: { de: 'Südafrika', en: 'South Africa' },
  address: 'Elandspoort, Modimolle 0510, Limpopo',
  geo: { lat: -24.65093, lng: 28.38087 },
  maps: 'https://www.google.com/maps/search/?api=1&query=-24.65093,28.38087',
} as const;

export const telHref = CONTACT.phone ? `tel:${CONTACT.phone}` : null;
export const waHref = CONTACT.whatsapp ? `https://wa.me/${CONTACT.whatsapp}` : null;
export const mailHref = `mailto:${CONTACT.email}`;
