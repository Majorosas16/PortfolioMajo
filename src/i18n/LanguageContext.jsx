import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { translations } from './translations.js';

// Idioma activo de toda la página. Empieza en español y recuerda la elección del visitante
// (si el navegador no permite guardar, simplemente vuelve a español al recargar).
const STORAGE_KEY = 'portfolio-lang';
const DEFAULT_LANG = 'es';

const readStored = () => {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v in translations ? v : DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
};

const LanguageContext = createContext({ lang: DEFAULT_LANG, setLang: () => {}, t: translations[DEFAULT_LANG] });

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(readStored);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* sin almacenamiento: la elección dura mientras la página esté abierta */
    }
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t: translations[lang] }), [lang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);
