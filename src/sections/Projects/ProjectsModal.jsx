import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { byName } from '../../assets/images.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import MediaCarousel from './MediaCarousel.jsx';
import { projectsIn, tagColors, tagsIn } from './projects.js';
import './ProjectsModal.css';

const img = byName(import.meta.glob('../../assets/sections/projects/*', { eager: true, import: 'default' }));

const FOCUSABLE = 'a[href], button:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])';

// Modal de una categoría (Figma 157:2338): cada objeto de la sección abre el suyo, solo con sus proyectos. Arriba,
// un desplegable «Filtros» con las etiquetas que tienen esos proyectos (App móvil, UI Design, Cliente real…): al
// elegir varias quedan los proyectos que tienen todas. Los filtros solo afectan a este modal y empiezan vacíos cada
// vez que se abre. Debajo, la lista de proyectos, que se desplaza dentro de la ventana.
// category: id del objeto (projects.js) · onClose: cerrar (Escape, el botón rojo de la ventana o el fondo).
// Mientras está abierto, la página no se desplaza ni recibe el foco.
export default function ProjectsModal({ category, onClose }) {
  const { lang, t } = useLanguage();
  const p = t.projects;
  const m = p.modal;
  const windowRef = useRef(null);
  const listRef = useRef(null);
  const closeRef = useRef(null);
  const all = projectsIn(category);
  const tags = tagsIn(category);
  const label = p.objects[category].label;
  const title = m.title.replace('{category}', label);

  // Filtros por etiqueta: el panel abierto o cerrado y las etiquetas elegidas (el proyecto debe tenerlas todas)
  const [panelOpen, setPanelOpen] = useState(false);
  const [active, setActive] = useState([]);
  const matches = (proj, selected) => selected.every((tag) => proj.tags.includes(tag));
  const list = all.filter((proj) => matches(proj, active));
  const toggleTag = (tag) => setActive((cur) => (cur.includes(tag) ? cur.filter((x) => x !== tag) : [...cur, tag]));
  const count =
    active.length === 0
      ? all.length === 1
        ? m.countOne
        : m.count.replace('{n}', all.length)
      : m.countFiltered.replace('{n}', list.length).replace('{total}', all.length);
  const panelOpenRef = useRef(panelOpen);
  panelOpenRef.current = panelOpen;

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
        // Primero cierra el panel de filtros; si ya está cerrado, el modal
        if (panelOpenRef.current) setPanelOpen(false);
        else onClose();
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

  // Al cambiar los filtros la lista vuelve arriba
  useEffect(() => {
    listRef.current?.scrollTo({ top: 0 });
  }, [active]);

  return createPortal(
    <div className="pmodal" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={windowRef}
        id={`projects-modal-${category}`}
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

        {/* Filtros por etiqueta, en un desplegable */}
        <div className="pmodal__tools">
          <div className="pmodal__toolbar">
            <button
              type="button"
              className={`pmodal__filters-btn${panelOpen ? ' is-open' : ''}`}
              aria-expanded={panelOpen}
              aria-controls={`pmodal-filters-${category}`}
              onClick={() => setPanelOpen((v) => !v)}
            >
              <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                <path d="M3 4.5h14l-5.5 6.4v4.6l-3 1.5v-6.1z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
              <span>{m.filtersButton}</span>
              {active.length > 0 && <span className="pmodal__filters-count">{active.length}</span>}
            </button>
            <p className="pmodal__count" aria-live="polite">
              {count}
            </p>
            {active.length > 0 && (
              <button type="button" className="pmodal__clear" onClick={() => setActive([])}>
                {m.clear}
              </button>
            )}
          </div>

          <div
            id={`pmodal-filters-${category}`}
            className="pmodal__panel"
            role="group"
            aria-label={m.filtersLabel}
            hidden={!panelOpen}
          >
            {tags.map((tag) => {
              const on = active.includes(tag);
              // Cuántos proyectos quedarían con esta etiqueta añadida a las elegidas
              const n = all.filter((proj) => matches(proj, on ? active : [...active, tag])).length;
              return (
                <button
                  key={tag}
                  type="button"
                  className={`pmodal__tag${on ? ' is-active' : ''}`}
                  style={{ '--c': tagColors[tag] }}
                  aria-pressed={on}
                  disabled={!on && n === 0}
                  onClick={() => toggleTag(tag)}
                >
                  {p.tags[tag]}
                  <span className="pmodal__tag-n">{n}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div ref={listRef} className="pmodal__list">
          {list.length === 0 && (
            <div className="pmodal__empty">
              <p>{m.noResults}</p>
              <button type="button" className="pmodal__clear" onClick={() => setActive([])}>
                {m.clear}
              </button>
            </div>
          )}
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
