import { useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { byName } from '../../assets/images.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import MediaCarousel from './MediaCarousel.jsx';
import { categories, projectsIn } from './projects.js';
import './ProjectsModal.css';

const img = byName(import.meta.glob('../../assets/sections/projects/*', { eager: true, import: 'default' }));

const FOCUSABLE = 'a[href], button:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])';

// Ventana con los proyectos de una categoría (Figma 157:2338): barra de ventana con el objeto de la categoría,
// filtros de las seis categorías (con su color) y la lista de proyectos, que se desplaza dentro de la ventana.
// category: id del objeto (projects.js) · onCategoryChange: filtro elegido · onClose: cerrar (Escape, el botón
// rojo de la ventana o el fondo). Mientras está abierta, la página no se desplaza ni recibe el foco.
export default function ProjectsModal({ category, onCategoryChange, onClose }) {
  const { lang, t } = useLanguage();
  const p = t.projects;
  const m = p.modal;
  const windowRef = useRef(null);
  const listRef = useRef(null);
  const closeRef = useRef(null);
  const list = projectsIn(category);
  const label = p.objects[category].label;
  const title = m.title.replace('{category}', label);

  // Página inactiva y sin scroll (conserva la posición, como el menú del celular en Header.jsx); foco dentro
  useLayoutEffect(() => {
    const outside = [document.querySelector('.header'), document.querySelector('main')].filter(Boolean);
    outside.forEach((el) => (el.inert = true));
    const body = document.body;
    const scrollY = window.scrollY;
    const prevBody = body.getAttribute('style');
    Object.assign(body.style, { position: 'fixed', top: `-${scrollY}px`, left: '0', right: '0' });
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      outside.forEach((el) => (el.inert = false));
      if (prevBody === null) body.removeAttribute('style');
      else body.setAttribute('style', prevBody);
      window.scrollTo({ top: scrollY, behavior: 'instant' });
    };
  }, []);

  // Escape cierra; Tab no sale de la ventana
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = [...windowRef.current.querySelectorAll(FOCUSABLE)];
      if (!items.length) return;
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
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Al cambiar de categoría la lista vuelve arriba
  useEffect(() => {
    listRef.current?.scrollTo({ top: 0 });
  }, [category]);

  return createPortal(
    <div className="pmodal" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={windowRef}
        id="projects-modal"
        className="pmodal__window"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pmodal-title"
      >
        <header className="pmodal__bar">
          <span className="pmodal__lights" aria-hidden="true">
            <img src={img['window-controls']} alt="" />
          </span>
          <button ref={closeRef} type="button" className="pmodal__close" onClick={onClose} aria-label={m.close} />
          <h2 id="pmodal-title" className="pmodal__title">
            <img src={img[category]} alt="" />
            <span>{title}</span>
          </h2>
        </header>

        <div className="pmodal__filters" role="group" aria-label={m.filters}>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`pmodal__filter${c.id === category ? ' is-active' : ''}`}
              style={{ '--c': c.color }}
              aria-pressed={c.id === category}
              onClick={() => onCategoryChange(c.id)}
            >
              {p.objects[c.id].label}
            </button>
          ))}
        </div>

        <div ref={listRef} className="pmodal__list">
          {list.length === 0 && <p className="pmodal__empty">{m.empty}</p>}
          {list.map((proj) => {
            const item = p.items[proj.id];
            const name = lang === 'en' && proj.nameEn ? proj.nameEn : proj.name;
            return (
              <article key={proj.id} className="project" aria-labelledby={`project-${proj.id}`}>
                <MediaCarousel media={proj.media} name={name} labels={m} />
                <div className="project__body">
                  <h3 id={`project-${proj.id}`} className="project__name">
                    {name}
                  </h3>
                  <p className="project__tags">
                    <span className="visually-hidden">{m.tagsLabel}: </span>
                    {proj.tags.map((tag) => p.tags[tag]).join(' · ')}
                  </p>
                  <p className="project__text">{item.description}</p>
                  <p className="project__text">
                    <strong>{m.contribution}</strong> {item.contribution}
                  </p>
                  <p className="project__text">
                    <strong>{m.tools}</strong> {proj.tools.join(', ')}.
                  </p>
                  {proj.behance && (
                    <a className="project__behance" href={proj.behance} target="_blank" rel="noreferrer">
                      <img src={img['icon-behance']} alt="" />
                      <span>{m.behance}</span>
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}
