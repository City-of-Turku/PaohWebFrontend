const SupportedLanguages = ['en', 'fi', 'sv'];
export type Language = typeof SupportedLanguages[number];

export function isSupportedLanguage(lang: string): lang is Language {
  return SupportedLanguages.indexOf(lang) !== -1;
}

export type LangStringList = {
  [lang in Language]: string[];
};
