import { createContext, useContext, useEffect, useMemo, useState } from "react";
import en from "../i18n/en.json";
import zh from "../i18n/zh.json";

const LOCALES = { en, zh };
const LANG_KEY = "kentshen_lang";

function detectDefaultLang() {
  try {
    const saved = window.localStorage.getItem(LANG_KEY);
    if (saved === "en" || saved === "zh") return saved;
  } catch (e) {
    /* localStorage unavailable — fall through to the site default */
  }
  // Traditional Chinese is the primary language for this site. The
  // English locale file and the toggle stay fully wired up for later —
  // this only changes which one loads first when there's no saved
  // preference (browser-language auto-detection removed on purpose).
  return "zh";
}

const LocaleContext = createContext(null);

export function LocaleProvider({ children }) {
  const [lang, setLang] = useState(detectDefaultLang);

  useEffect(() => {
    try {
      window.localStorage.setItem(LANG_KEY, lang);
    } catch (e) {
      /* ignore — persistence is a nicety, not a requirement */
    }
    document.documentElement.setAttribute("lang", LOCALES[lang].meta.htmlLang);
    document.title = LOCALES[lang].meta.title;
    document.body.classList.toggle("lang-zh", LOCALES[lang].meta.htmlLang.indexOf("zh") === 0);
  }, [lang]);

  const toggleLang = () => setLang((prev) => (prev === "en" ? "zh" : "en"));

  const value = useMemo(
    () => ({ lang, data: LOCALES[lang], toggleLang }),
    [lang]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
