import translationsEn from './en.json';
import translationsFi from './fi.json';
import translationsSv from './sv.json';

const translations: Record<string, Record<string, string>> = {
  fi: translationsFi,
  en: translationsEn,
  sv: translationsSv,
};

/*
 * Default to Finnish when a string isn't available for a particular language.
 * Theoretically we should be passing a default value to intl.formatMessage()
 * every time we call it, but it's safer to do this than to change every call
 * throughout the codebase.
 */
export const getTranslations = (language: string): Record<string, string> => ({
  ...translations['fi'],
  ...translations[language],
});

export const getLocale = (language: string): string => {
  switch (language) {
    case 'fi':
      return 'fi_FI';
    case 'en':
      return 'en_GB';
    case 'sv':
      return 'se_SV';
    default:
      return 'fi_FI';
  }
};
