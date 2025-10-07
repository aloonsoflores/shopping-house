import { languages, type TLanguageCode } from "countries-list";
import { flagsByLang } from "./flagsByLang";

export const languageOptions = (Object.keys(languages) as TLanguageCode[]).map((code) => {
  const lang = languages[code];
  return {
    code,
    name: lang.name,       // English name
    native: lang.native,   // Native name
    flag: flagsByLang[code] || "🌐", // fallback
  };
});
