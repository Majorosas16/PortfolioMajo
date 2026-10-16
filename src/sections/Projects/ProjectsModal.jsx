import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { byName } from '../../assets/images.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import MediaCarousel from './MediaCarousel.jsx';
import { projectsIn, tagColors, tagsIn } from './projects.js';
import './ProjectsModal.css';

const img = byName(import.meta.glob('../../assets/sections/projects/*', { eager: true, import: 'default' }));

const FOCUSABLE = 'a[href], button:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])';

// Modal de una categoría (Figma 157:2338): cada objeto de la sección abre el suyo, solo con sus proyectos.
// Lista: arriba, un desplegable «Filtros» con las etiquetas que tienen esos proyectos (App móvil, UI Design, Cliente
// real…; al elegir varias quedan los proyectos que tienen todas); debajo, una tarjeta tipo Polaroid por proyecto con
// sus fotos/videos (carrusel manual), nombre y etiquetas. Al tocar una tarjeta se ve el detalle de ese proyecto
// (descripción, aporte, herramientas, medios y Behance) dentro del mismo modal, con un botón para volver a la lista.
// Los filtros solo afectan a este modal y empiezan vacíos cada vez que se abre; al volver del detalle se conservan.
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
  // Proyecto abierto en detalle (id) o null = lista. Al volver, la lista recupera su posición y el foco su tarjeta.
  const [detail, setDetail] = useState(null);
  const listScroll = useRef(0);
  const openDetail = (id) => {
    listScroll.current = listRef.current?.scrollTop ?? 0;
    setPanelOpen(false);
    setDetail(id);
  };
  const backToList = () => {
    const id = detail;
    setDetail(null);
    requestAnimationFrame(() => {
      if (listRef.current) listRef.current.scrollTop = listScroll.current;
      windowRef.current?.querySelector(`[data-open-project="${id}"]`)?.focus({ preventScroll: true });
    });
  };
  const nameOf = (proj) => (lang === 'en' && proj.nameEn ? proj.nameEn : proj.name);
  const tagText = (proj) => proj.tags.map((tag) => p.tags[tag]).join(' · ');

  const stateRef = useRef({});
  stateRef.current = { panelOpen, detail, backToList };

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
        // Primero cierra el panel de filtros, luego vuelve del detalle a la lista y por último cierra el modal
        const st = stateRef.current;
        if (st.panelOpen) setPanelOpen(false);
        else if (st.detail) st.backToList();
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

        {detail ? (
          <ProjectDetail
            proj={all.find((x) => x.id === detail)}
            name={nameOf(all.find((x) => x.id === detail))}
            tags={tagText(all.find((x) => x.id === detail))}
            item={p.items[detail]}
            m={m}
            backLabel={m.back.replace('{category}', title)}
            onBack={backToList}
            behanceIcon={img['icon-behance']}
          />
        ) : (
          <>
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
              {/* Tarjetas tipo Polaroid: fotos (carrusel), nombre y etiquetas. Toda la tarjeta abre el detalle (el
                  botón del nombre la cubre); el carrusel queda por encima y sus botones no la abren. */}
              <ul className="pcards">
                {list.map((proj, i) => {
                  const name = nameOf(proj);
                  return (
                    <li key={proj.id} className="pcard" style={{ '--tilt': `${[-1.6, 1.2, -0.6, 1.8, -1.1, 0.7][i % 6]}deg` }}>
                      <div className="polaroid">
                        <MediaCarousel media={proj.media} name={name} labels={m} />
                        <div className="polaroid__caption">
                          <h3 className="pcard__name">
                            <button
                              type="button"
                              className="pcard__open"
                              data-open-project={proj.id}
                              onClick={() => openDetail(proj.id)}
                              aria-label={m.open.replace('{project}', name)}
                            >
                              {name}
                            </button>
                          </h3>
                          <p className="pcard__tags">
                            <span className="visually-hidden">{m.tagsLabel}: </span>
                            {tagText(proj)}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

// Detalle de un proyecto dentro del modal de su categoría: botón para volver a la lista, sus fotos/videos (Polaroid
// grande con carrusel) y su información completa.
function ProjectDetail({ proj, name, tags, item, m, backLabel, onBack, behanceIcon }) {
  const backRef = useRef(null);
  useEffect(() => {
    backRef.current?.focus({ preventScroll: true });
  }, []);
  return (
    <div className="pdetail">
      <div className="pdetail__top">
        <button ref={backRef} type="button" className="pdetail__back" onClick={onBack}>
          <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{backLabel}</span>
        </button>
      </div>
      <article className="project" aria-labelledby={`project-${proj.id}`}>
        <div className="polaroid polaroid--detail">
          <MediaCarousel media={proj.media} name={name} labels={m} />
        </div>
        <div className="project__body">
          <h3 id={`project-${proj.id}`} className="project__name">
            {name}
          </h3>
          <p className="project__tags">
            <span className="visually-hidden">{m.tagsLabel}: </span>
            {tags}
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
              <img src={behanceIcon} alt="" />
              <span>{m.behance}</span>
            </a>
          )}
        </div>
      </article>
    </div>
  );
}
