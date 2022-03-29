export type Language = 'en' | 'fi' | 'sv';

export type LangStringList = {
  [lang in Language]: string[];
};
