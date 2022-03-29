import { makeAutoObservable, runInAction } from 'mobx';
import { Language, isSupportedLanguage } from 'types';

class SettingsStore {
  constructor() {
    makeAutoObservable(this);
  }

  localLang: Language = 'fi'; // Default to Finnish
  chatId = '';

  /**
   * Used language is determined by saved localStorage value or defaults to Finnish
   */
  set selectedLanguage(language: Language) {
    localStorage.setItem('palveluohjain_bot_lang', language);
    runInAction(() => {
      this.localLang = language;
    });
  }

  /**
   * Computed property setter for selected UI language. Used language is determined
   * by saved localStorage value or defaults to Finnish.
   */
  get selectedLanguage(): Language {
    runInAction(() => {
      const storedLanguage = localStorage.getItem('palveluohjain_bot_lang');
      if (storedLanguage && isSupportedLanguage(storedLanguage)) {
        this.localLang = storedLanguage;
      }
    });
    return this.localLang;
  }

  set chatSessionId(id: string) {
    runInAction(() => {
      this.chatId = id;
    });
  }

  get chatSessionId(): string {
    return this.chatId;
  }
}

export default SettingsStore;
