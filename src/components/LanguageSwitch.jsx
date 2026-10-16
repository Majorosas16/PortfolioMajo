import { useLanguage } from '../i18n/LanguageContext.jsx';
import { languages } from '../i18n/translations.js';
import './LanguageSwitch.css';

// Selector Español / English del header. Botones nativos (Tab, Enter, Espacio);
// aria-pressed marca el idioma activo, que además se ve relleno.
export default function LanguageSwitch() {
  const { lang, setLang } = useLanguage();
  return (
    <div className="lang-switch" role="group" aria-label="Idioma / Language">
      {languages.map((l) => (
        <button
          key={l.code}
          type="button"
          lang={l.code}
          className="lang-switch__option"
          aria-pressed={lang === l.code}
          aria-label={l.name}
          title={l.name}
          onClick={() => setLang(l.code)}
        >
          {l.short}
        </button>
      ))}
    </div>
  );
}
