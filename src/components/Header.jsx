import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal, flushSync } from 'react-dom';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import LanguageSwitch from './LanguageSwitch.jsx';
import { socials } from './socials.js';
import './Header.css';
import './MobileMenu.css';

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

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Encabezado fijo. Cambia a texto claro cuando pasa sobre la sección oscura ("Lo que aporto")
// y se vuelve discreto sobre la caja cerrada del inicio.
export default function Header() {
  const { t } = useLanguage();
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [atIntro, setAtIntro] = useState(true);
  // Menú hamburguesa a pantalla completa (solo en celular; en escritorio el botón no se muestra)
  const [menuOpen, setMenuOpen] = useState(false);
  // El panel sigue montado mientras hace su animación de salida (menu--closing)
  const [menuMounted, setMenuMounted] = useState(false);
  const headerRef = useRef(null);
  const toggleRef = useRef(null);
  const menuRef = useRef(null);
  const closeRef = useRef(null);

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

  const openMenu = () => {
    setMenuMounted(true);
    setMenuOpen(true);
  };

  // Al terminar el fundido de salida se desmonta el panel
  const onMenuAnimationEnd = (e) => {
    if (e.target === e.currentTarget && !menuOpen) setMenuMounted(false);
  };

  // Respaldo por si no llega animationend (sin animaciones con prefers-reduced-motion, pestaña oculta…)
  useEffect(() => {
    if (menuOpen || !menuMounted) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = setTimeout(() => setMenuMounted(false), reduced ? 0 : 400);
    return () => clearTimeout(timer);
  }, [menuOpen, menuMounted]);

  const closeMenu = () => {
    // flushSync: el scroll de la página se libera antes de que un enlace la desplace
    flushSync(() => setMenuOpen(false));
    toggleRef.current?.focus({ preventScroll: true });
  };

  // Con el menú abierto: el foco entra al panel y no sale de él, el resto de la página queda
  // inactivo (inert) y sin scroll. Escape o pasar a escritorio lo cierran.
  useLayoutEffect(() => {
    if (!menuOpen) return undefined;
    const outside = [headerRef.current, document.querySelector('main')].filter(Boolean);
    outside.forEach((el) => (el.inert = true));
    // Bloqueo del scroll que conserva la posición: el body queda fijo en el punto donde estaba
    // (top negativo) y al cerrar se vuelve exactamente ahí. Con overflow: hidden en <html> el body
    // (que tiene overflow-x: hidden) pasaba a ser el contenedor de scroll y la página volvía al inicio,
    // y en iOS overflow: hidden no impide desplazarse.
    const body = document.body;
    const scrollY = window.scrollY;
    const prevBody = body.getAttribute('style');
    Object.assign(body.style, { position: 'fixed', top: `-${scrollY}px`, left: '0', right: '0' });
    closeRef.current?.focus({ preventScroll: true });

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = menuRef.current?.querySelectorAll(FOCUSABLE);
      if (!items?.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const desktop = window.matchMedia('(min-width: 769px)');
    const onMedia = () => {
      if (!desktop.matches) return;
      setMenuOpen(false);
      setMenuMounted(false);
    };
    document.addEventListener('keydown', onKey);
    desktop.addEventListener('change', onMedia);
    return () => {
      outside.forEach((el) => (el.inert = false));
      if (prevBody === null) body.removeAttribute('style');
      else body.setAttribute('style', prevBody);
      // 'instant': sin la animación de scroll-behavior: smooth (styles.css)
      window.scrollTo({ top: scrollY, behavior: 'instant' });
      document.removeEventListener('keydown', onKey);
      desktop.removeEventListener('change', onMedia);
    };
  }, [menuOpen]);

  const onMenuLinkClick = (e) => {
    closeMenu();
    goToSection(e);
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`header ${dark ? 'header--dark' : ''} ${scrolled ? 'header--scrolled' : ''} ${atIntro ? 'header--intro' : ''}`}
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
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={t.header.menuOpen}
              onClick={openMenu}
            >
              <span className="header__toggle-icon" aria-hidden="true" />
            </button>
            <nav className="header__nav" aria-label={t.header.nav}>
              {links.map((l) => (
                <a key={l.href} href={l.href} className="header__link" onClick={goToSection}>
                  {t.header.links[l.key]}
                </a>
              ))}
            </nav>
            <LanguageSwitch />
          </div>
        </div>
      </header>

      {/* Fuera del header: su backdrop-filter haría que el panel fijo no cubriera toda la pantalla */}
      {menuMounted &&
        createPortal(
          <div
            id="mobile-menu"
            className={`menu ${menuOpen ? '' : 'menu--closing'}`}
            role="dialog"
            aria-modal="true"
            aria-label={t.header.menu}
            aria-hidden={!menuOpen}
            inert={menuOpen ? undefined : ''}
            ref={menuRef}
            onAnimationEnd={onMenuAnimationEnd}
          >
            <div className="menu__top">
              <div className="header__brand menu__brand">
                <span className="header__role">{t.header.role}</span>
                <span className="header__name">María José Rosas Cuellar</span>
              </div>
              <button ref={closeRef} type="button" className="menu__close" aria-label={t.header.menuClose} onClick={closeMenu}>
                <span className="menu__close-icon" aria-hidden="true" />
              </button>
            </div>

            <nav className="menu__nav" aria-label={t.header.nav}>
              {links.map((l) => (
                <a key={l.href} href={l.href} className="menu__link" onClick={onMenuLinkClick}>
                  {t.header.links[l.key]}
                </a>
              ))}
            </nav>

            <div className="menu__footer">
              <LanguageSwitch />
              <ul className="menu__socials" aria-label={t.header.socials}>
                {socials.map((s) => (
                  <li key={s.name}>
                    <a href={s.href} target="_blank" rel="noreferrer" aria-label={s.name}>
                      <img src={s.icon} alt="" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
