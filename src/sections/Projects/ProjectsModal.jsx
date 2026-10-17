import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { byName } from '../../assets/images.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import MediaCarousel from './MediaCarousel.jsx';
import { projectsIn, tagColors, tagsIn } from './projects.js';
import './ProjectsModal.css';

const img = byName(import.meta.glob('../../assets/sections/projects/*', { eager: true, import: 'default' }));

const FOCUSABLE = 'a[href], button:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])';

// Modal de una categoría, con forma de carpeta de anillos (Figma 190:2799): cada objeto de la sección abre el suyo,
// solo con sus proyectos, escritos sobre la hoja de la carpeta.
// Lista: arriba, el ícono de la categoría sobre un bolsillo de cuero y, a su lado, un desplegable «Filtros» con las
// etiquetas que tienen esos proyectos (App móvil, UI Design, Cliente real…; al elegir varias quedan los proyectos que
// tienen todas); debajo, una tarjeta con forma de libreta por proyecto con su portada, nombre y etiquetas. Al tocar
// una tarjeta se ve el detalle de ese proyecto (descripción, aporte, herramientas, medios en carrusel y Behance)
// dentro del mismo modal, con un botón para volver a la lista en la cabecera.
// Los filtros solo afectan a este modal y empiezan vacíos cada vez que se abre; al volver del detalle se conservan.
// category: id del objeto (projects.js) · onClose: cerrar (Escape, el botón de cerrar o el fondo); antes de cerrar,
// el modal se desvanece (CLOSE_MS, la animación .is-closing de ProjectsModal.css).
// Mientras está abierto, la página no se desplaza ni recibe el foco.
const CLOSE_MS = 260;

export default function ProjectsModal({ category, onClose }) {
  // Cierre con fundido: se marca .is-closing y se cierra al terminar (sin espera con «reducir movimiento»)
  const [closing, setClosing] = useState(false);
  const closingRef = useRef(false);
  const timer = useRef(null);
  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    timer.current = setTimeout(onClose, reduced ? 0 : CLOSE_MS);
  }, [onClose]);
  useEffect(() => () => clearTimeout(timer.current), []);

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

  // Al abrir un detalle, el foco va al botón de volver
  const backRef = useRef(null);
  useEffect(() => {
    if (detail) backRef.current?.focus({ preventScroll: true });
  }, [detail]);

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
        else requestClose();
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
  }, [requestClose]);

  // Al cambiar los filtros la lista vuelve arriba
  useEffect(() => {
    listRef.current?.scrollTo({ top: 0 });
  }, [active]);

  return createPortal(
    <div className={`pmodal${closing ? ' is-closing' : ''}`} onClick={(e) => e.target === e.currentTarget && requestClose()}>
      <div
        ref={windowRef}
        id={`projects-modal-${category}`}
        className="pmodal__window"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pmodal-title"
      >
        {/* Carpeta de anillos (Figma 190:2799): el contenido va sobre la hoja; el botón de cerrar, en la tapa */}
        <button ref={closeRef} type="button" className="pmodal__close" onClick={requestClose} aria-label={m.close}>
          <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        <div className="pmodal__page">
          {/* Cabecera (Figma 194:5885): el ícono de la categoría sobre el bolsillo de cuero de la hoja y, a su derecha
              y a la misma altura, los filtros y el número de proyectos (en el detalle, el botón para volver) */}
          <div className="pmodal__head">
            <h2 id="pmodal-title" className="pmodal__pocket">
              <img src={img[category]} alt="" />
              <span className="visually-hidden">{title}</span>
            </h2>

            {detail ? (
              <button ref={backRef} type="button" className="pdetail__back" onClick={backToList}>
                <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                  <path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{m.back.replace('{category}', title)}</span>
              </button>
            ) : (
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
            )}
          </div>

          {detail ? (
            <ProjectDetail
              proj={all.find((x) => x.id === detail)}
              name={nameOf(all.find((x) => x.id === detail))}
              tags={tagText(all.find((x) => x.id === detail))}
              item={p.items[detail]}
              m={m}
              behanceIcon={img['icon-behance']}
            />
          ) : (
            <>
              {/* Filtros por etiqueta, en un desplegable bajo la cabecera */}
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

              <div ref={listRef} className="pmodal__list">
                {list.length === 0 && (
                  <div className="pmodal__empty">
                    <p>{m.noResults}</p>
                    <button type="button" className="pmodal__clear" onClick={() => setActive([])}>
                      {m.clear}
                    </button>
                  </div>
                )}
                {/* Tarjetas con forma de libreta blanca (Figma 194:5911): portada, nombre y etiquetas. Toda la
                    tarjeta abre el detalle (el botón del nombre la cubre). */}
                <ul className="pcards">
                  {list.map((proj) => {
                    const name = nameOf(proj);
                    return (
                      <li key={proj.id} className="pcard">
                        <ProjectCover media={proj.media} labels={m} />
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
                        <ul className="pcard__tags" aria-label={m.tagsLabel}>
                          {proj.tags.map((tag) => (
                            <li key={tag} style={{ '--c': tagColors[tag] }}>
                              {p.tags[tag]}
                            </li>
                          ))}
                        </ul>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

// Portada de la tarjeta: la primera foto del proyecto (o la portada / el primer cuadro de su primer video); sin
// medios, un recuadro gris con el aviso de «próximamente».
function ProjectCover({ media, labels }) {
  const first = media[0];
  if (!first) {
    return (
      <div className="pcover pcover--empty" role="img" aria-label={labels.mediaSoon}>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <rect x="2.5" y="4" width="19" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="8.5" cy="9.5" r="1.8" fill="currentColor" />
          <path d="M3.5 18l5.6-5.4 3.4 3.2 2.6-2.4 5 4.6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
        <span>{labels.mediaSoon}</span>
      </div>
    );
  }
  if (first.type === 'video' && !first.poster) {
    return <video className="pcover" src={first.src} muted playsInline preload="metadata" aria-hidden="true" tabIndex={-1} />;
  }
  return (
    <img
      className="pcover"
      src={first.type === 'video' ? first.poster : first.src}
      alt=""
      loading="lazy"
      decoding="async"
      draggable="false"
    />
  );
}

// Detalle de un proyecto dentro del modal de su categoría (el botón para volver está en la cabecera): sus
// fotos/videos (Polaroid grande con carrusel) y su información completa.
function ProjectDetail({ proj, name, tags, item, m, behanceIcon }) {
  return (
    <div className="pdetail">
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
