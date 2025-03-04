import { create } from "zustand";

type LanguageState = {
  language: string;
  toggleLanguage: () => void;
};

export const useLanguageStore = create<LanguageState>((set) => ({
  language: typeof window !== "undefined" ? localStorage.getItem("language") || "ru" : "ru",
  toggleLanguage: () =>
    set((state) => {
      const newLang = state.language === "ru" ? "en" : "ru";
      localStorage.setItem("language", newLang);
      return { language: newLang };
    }),
}));
