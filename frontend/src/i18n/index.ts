import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import fr from './fr.json';
import ar from './ar.json';

export const LANGUAGES = ['en', 'fr', 'ar'] as const;
export type Language = (typeof LANGUAGES)[number];

const saved = localStorage.getItem('lang');
const browser = navigator.language?.slice(0, 2);
const initial: Language = (LANGUAGES as readonly string[]).includes(saved || '')
  ? (saved as Language)
  : (LANGUAGES as readonly string[]).includes(browser)
  ? (browser as Language)
  : 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    ar: { translation: ar },
  },
  lng: initial,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

const applyDirection = (lng: string) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
};

applyDirection(initial);

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('lang', lng);
  applyDirection(lng);
});

export default i18n;
