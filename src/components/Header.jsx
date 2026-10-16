import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import LanguageSwitch from './LanguageSwitch.jsx';
import './Header.css';

// Secciones del menú; el texto de cada enlace está en translations.js (header.links)
const links = [
  { href: '#about', key: 'about' },
  { href: '#what-i-bring', key: 'whatIBring' },
  { href: '#projects', key: 'projects' },
  { href: '#contact', key: 'contact' },
];

// Lleva a una sección sin escribir el #ancla en la URL (así, al recargar, la página abre en el inicio)
const goToSection = (e) => {
  const target = document.querySelector(e.currentTarget.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
};

// Encabezado fijo. Cambia a texto claro cuando pasa sobre la sección oscura ("Lo que aporto")
// y se vuelve discreto sobre la caja cerrada del inicio.
export default function Header() {
  const { t } = useLanguage();
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [atIntro, setAtIntro] = useState(true);
  // Menú hamburguesa (solo en celular; en escritorio el botón no se muestra)
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const header = document.querySelector('.header');
      const mid = header ? header.offsetHeight / 2 : 40;
      const darkSections = document.querySelectorAll('[data-theme="dark"]');
      let overDark = false;
      darkSections.forEach((section) => {
        const r = section.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) overDark = true;
      });
      setDark(overDark);
      // Sobre la sección de la caja (con la caja cerrada se oculta la navegación, ver Header.css)
      const intro = document.querySelector('#intro');
      const ri = intro && intro.getBoundingClientRect();
      setAtIntro(Boolean(ri && ri.top <= mid && ri.bottom >= mid));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Con el menú abierto: Escape lo cierra (y devuelve el foco al botón), igual que tocar fuera
  // del encabezado o pasar a escritorio
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setMenuOpen(false);
      toggleRef.current?.focus();
    };
    const onPointer = (e) => {
      if (!headerRef.current?.contains(e.target)) setMenuOpen(false);
    };
    const desktop = window.matchMedia('(min-width: 769px)');
    const onMedia = () => desktop.matches && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    desktop.addEventListener('change', onMedia);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
      desktop.removeEventListener('change', onMedia);
    };
  }, [menuOpen]);

  const onLinkClick = (e) => {
    setMenuOpen(false);
    goToSection(e);
  };

  return (
    <header
      ref={headerRef}
      className={`header ${dark ? 'header--dark' : ''} ${scrolled ? 'header--scrolled' : ''} ${atIntro ? 'header--intro' : ''} ${menuOpen ? 'header--menu-open' : ''}`}
    >
      <div className="header__inner">
        <a href="#intro" className="header__brand" onClick={goToSection}>
          <span className="header__role">{t.header.role}</span>
          <span className="header__name">María José Rosas Cuellar</span>
        </a>
        <div className="header__actions">
          <button
            ref={toggleRef}
            type="button"
            className="header__toggle"
            aria-expanded={menuOpen}
            aria-controls="header-nav"
            aria-label={menuOpen ? t.header.menuClose : t.header.menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="header__toggle-icon" aria-hidden="true" />
          </button>
          <nav id="header-nav" className="header__nav" aria-label={t.header.nav}>
            {links.map((l) => (
              <a key={l.href} href={l.href} className="header__link" onClick={onLinkClick}>
                {t.header.links[l.key]}
              </a>
            ))}
          </nav>
          <LanguageSwitch />
        </div>
      </div>
    </header>
  );
}
