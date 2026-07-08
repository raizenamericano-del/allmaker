import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "id" | "en";

interface I18nState {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

import idTranslations from "@/i18n/id.json";
import enTranslations from "@/i18n/en.json";

const translations: Record<Language, Record<string, string>> = {
  id: idTranslations,
  en: enTranslations,
};

function getNestedValue(obj: Record<string, string>, key: string): string | undefined {
  return obj[key];
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set, get) => ({
      lang: "id",
      setLang: (lang: Language) => set({ lang }),
      t: (key: string) => {
        const { lang } = get();
        const trans = translations[lang];
        return getNestedValue(trans, key) || key;
      },
    }),
    {
      name: "darkforge-language",
      partialize: (state) => ({ lang: state.lang }),
    }
  )
);

export function useTranslation() {
  const { lang, setLang, t } = useI18nStore();
  return { lang, setLang, t };
}
