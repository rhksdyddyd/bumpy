import i18next, { i18n as I18n } from 'i18next';
import Backend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

/**
 * i18n 관련 초기화 함수입니다.
 *
 * @returns i18next instance
 */
const i18nInit = (): I18n => {
  if (i18next.isInitialized === true) {
    return i18next;
  }

  i18next
    .use(Backend((lng: string, ns: string) => import(`resource/${lng}/${ns}`)))
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: 'ko',
      load: 'languageOnly',
      keySeparator: false,
      nsSeparator: false,
      interpolation: {
        escapeValue: false,
      },
      defaultNS: 'ResourceData.json',
      ns: ['ResourceData.json'],
      fallbackNS: ['ResourceData.json'],
      react: {
        useSuspense: true,
        nsMode: 'fallback',
      },
    });

  return i18next;
};

export default i18nInit;
