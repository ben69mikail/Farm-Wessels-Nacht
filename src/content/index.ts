import { de } from './de';
import { en } from './en';
export type Locale = 'de' | 'en';
export const dict = { de, en } as const;
export function t(locale: Locale) { return dict[locale] as typeof de; }
export { de, en };
