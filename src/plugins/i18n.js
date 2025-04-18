// i18n.js
import { createI18n } from "vue-i18n";
import en from "../locales/en.json";
import vi from "../locales/vi.json";

const messages = {
  en,
  vi,
};

const i18n = createI18n({
  locale: localStorage.getItem("locale") || "vi", // Lấy ngôn ngữ từ localStorage
  fallbackLocale: "vi",
  messages,
});

export default i18n;
