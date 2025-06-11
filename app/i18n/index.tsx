import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import en from "./locales/en.json";
import vi from "./locales/vi.json";

const LANGUAGE_KEY = "appLanguage";

const initI18n = async () => {
  const savedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
  const lang = savedLang || "vi";

  await i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        vi: { translation: vi },
      },
      lng: lang,
      fallbackLng: "vi",
      compatibilityJSON: "v4", // ✅ fix here
      interpolation: {
        escapeValue: false,
      },
    });
};

initI18n();

export default i18n;
