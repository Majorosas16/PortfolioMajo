import { useLanguage } from '../../../i18n/LanguageContext.jsx';
import { goToSection } from '../../utils/goToSection.js';
import './Footer.css';

// Pie de página discreto: volver al inicio, crédito con el año actual y el correo de contacto
// (el mismo de la sección Contacto). Las redes ya están en Contacto, aquí no se repiten.
const EMAIL = 'multimedia.mr16@gmail.com';

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();
  return (
    <footer className="footer section section--paper">
      <div className="footer__inner">
        <a href="#intro" className="footer__link footer__top" onClick={goToSection}>
          {t.footer.backToTop} <span aria-hidden="true">↑</span>
        </a>
        <p className="footer__credit">
          {t.footer.credit} · © {year}
        </p>
        <a href={`mailto:${EMAIL}`} className="footer__link footer__email">
          {EMAIL}
        </a>
      </div>
    </footer>
  );
}
