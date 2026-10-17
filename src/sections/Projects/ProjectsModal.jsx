import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { byName } from '../../assets/images.js';
import { localizedSrc } from '../../i18n/images.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import MediaCarousel from './MediaCarousel.jsx';
import { projectsIn, subcategoriesOf } from './projects.js';
import './ProjectsModal.css';

const img = byName(import.meta.glob('../../assets/sections/projects/*', { eager: true, import: 'default' }));
// Íconos del bolsillo: los objetos de la sección recortados a su contorno (sin el margen transparente de cada uno)
const pocketIcon = byName(import.meta.glob('../../assets/sections/projects/pocket-icons/*', { eager: true, import: 'default' }));

const FOCUSABLE = 'a[href], button:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])';

// Modal de una categoría, con forma de carpeta de anillos (Figma 190:2799): cada objeto de la sección abre el suyo,
// solo con sus proyectos, escritos sobre la hoja de la carpeta.
// Lista: arriba, el ícono de la categoría sobre un bolsillo de cuero y, a su lado, el título y cuántos proyectos hay;
// debajo, una tarjeta con forma de libreta por proyecto con su portada, nombre y etiquetas. Al tocar una tarjeta se
// ve el detalle de ese proyecto (descripción, aporte, herramientas, medios en carrusel y Behance) dentro del mismo
// modal, con un botón para volver a la lista en la cabecera.
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
  const list = projectsIn(category);
  const label = p.objects[category].label;
  const title = m.title.replace('{category}', label);

  // La lista en grupos por subcategoría (solo las que tienen proyectos); sin subcategorías, un solo grupo sin nombre
  const subs = subcategoriesOf(category);
  const groups = subs
    ? subs.map((id) => ({ id, items: list.filter((proj) => proj.sub === id) })).filter((g) => g.items.length)
    : [{ id: null, items: list }];
  const count = list.length === 1 ? m.countOne : m.count.replace('{n}', list.length);
  // Proyecto abierto en detalle (id) o null = lista. Al volver, la lista recupera su posición y el foco su tarjeta.
  const [detail, setDetail] = useState(null);
  const listScroll = useRef(0);
  const openDetail = (id) => {
    listScroll.current = listRef.current?.scrollTop ?? 0;
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
  // Stickers «Nuevo proyecto» (isNew) y «Trabajando en ello» (wip) de projects.js, en el idioma de la página
  const newSticker = localizedSrc(img, 'sticker-new', lang);
  const wipSticker = localizedSrc(img, 'sticker-wip', lang);

  // Al abrir un detalle, el foco va al botón de volver
  const backRef = useRef(null);
  useEffect(() => {
    if (detail) backRef.current?.focus({ preventScroll: true });
  }, [detail]);

  const stateRef = useRef({});
  stateRef.current = { detail, backToList };

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
        // Primero vuelve del detalle a la lista y después cierra el modal
        const st = stateRef.current;
        if (st.detail) st.backToList();
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
        {/* Carpeta de anillos (Figma 190:2799): todo va sobre la hoja, también el botón de cerrar */}
        <div className="pmodal__page">
          {/* Cabecera (Figma 194:5885): el ícono de la categoría sobre el bolsillo de cuero de la hoja y, a su derecha
              y a la misma altura, el título y el número de proyectos (en el detalle, el botón para volver) */}
          <div className="pmodal__head">
            <div className="pmodal__pocket" aria-hidden="true">
              {/* --a = proporción del ícono; el CSS la usa para que todos ocupen la misma superficie */}
              <img
                src={pocketIcon[category]}
                alt=""
                onLoad={(e) => e.currentTarget.style.setProperty('--a', e.currentTarget.naturalWidth / e.currentTarget.naturalHeight)}
              />
            </div>

            {/* Título de la categoría y, debajo, cuántos proyectos hay o el botón para volver */}
            <div className="pmodal__heading">
              <h2 id="pmodal-title" className="pmodal__title">
                {title}
              </h2>

              {detail ? (
                <button ref={backRef} type="button" className="pdetail__back" onClick={backToList}>
                  <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                    <path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{m.back.replace('{category}', title)}</span>
                </button>
              ) : (
                <p className="pmodal__count">{count}</p>
              )}
            </div>

            {/* Cerrar: una X dibujada a lápiz a la derecha de la cabecera, centrada con el título y el número (trazos
                dobles algo torcidos y el filtro #pmodal-pencil, que los hace irregulares y les da el grano del grafito) */}
            <button ref={closeRef} type="button" className="pmodal__close" onClick={requestClose} aria-label={m.close}>
              <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
                <defs>
                  <filter id="pmodal-pencil" x="-20%" y="-20%" width="140%" height="140%">
                    <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="4" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.6" result="rough" />
                    <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2 0 0 0 -0.35" result="grain" />
                    <feComposite in="rough" in2="grain" operator="in" />
                  </filter>
                </defs>
                <g filter="url(#pmodal-pencil)" fill="none" stroke="currentColor" strokeLinecap="round">
                  <path d="M7.5 8.2C12 13 18 18.6 24.6 24.2" strokeWidth="2.1" />
                  <path d="M8.6 7.3C13.2 12.5 19 18 23.7 25" strokeWidth="1.1" opacity="0.6" />
                  <path d="M24.3 7.5C19 12.4 13.4 18.7 7.7 24.7" strokeWidth="2.1" />
                  <path d="M23.3 8.7C18.5 13.5 13 19.1 8.9 23.6" strokeWidth="1.1" opacity="0.6" />
                </g>
              </svg>
            </button>
          </div>

          {detail ? (
            <ProjectDetail
              proj={list.find((x) => x.id === detail)}
              name={nameOf(list.find((x) => x.id === detail))}
              tags={tagText(list.find((x) => x.id === detail))}
              item={p.items[detail]}
              m={m}
              behanceIcon={img['icon-behance']}
              newSticker={newSticker}
              wipSticker={wipSticker}
            />
          ) : (
            <div ref={listRef} className="pmodal__list">
              {/* Tarjetas con forma de libreta blanca (Figma 194:5911): portada, nombre y etiquetas. Toda la
                  tarjeta abre el detalle (el botón del nombre la cubre). En las categorías con subcategorías (UX/UI),
                  las tarjetas van en grupos, cada uno con su nombre escrito a lápiz y encerrado en un óvalo
                  (Figma 195:5967). */}
              {groups.map((group) => (
                <section key={group.id ?? 'all'} className="pgroup" aria-labelledby={group.id ? `psub-${group.id}` : undefined}>
                  {group.id && <SubLabel id={`psub-${group.id}`} text={p.subcategories[group.id]} />}
                  <ul className="pcards">
                    {group.items.map((proj) => {
                      const name = nameOf(proj);
                      const Name = group.id ? 'h4' : 'h3';
                      return (
                        <li key={proj.id} className="pcard" style={{ '--i': list.indexOf(proj) }}>
                          {proj.isNew && <img className="pnew pnew--card" src={newSticker} alt={m.newProject} />}
                        {proj.wip && <img className="pnew pwip pwip--card" src={wipSticker} alt={m.wipProject} />}
                          <ProjectCover media={proj.media} labels={m} />
                          <Name className="pcard__name">
                            <button
                              type="button"
                              className="pcard__open"
                              data-open-project={proj.id}
                              onClick={() => openDetail(proj.id)}
                              aria-label={m.open.replace('{project}', name)}
                            >
                              {name}
                            </button>
                          </Name>
                          <p className="pcard__tags">
                            <span className="visually-hidden">{m.tagsLabel}: </span>
                            {tagText(proj)}
                          </p>
                          {/* Enlace a Behance (solo los proyectos que lo tienen), por encima del botón que abre el detalle */}
                          {proj.behance && (
                            <a
                              className="pcard__behance"
                              href={proj.behance}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`${m.behance}: ${name}`}
                              title={m.behance}
                            >
                              <img src={img['icon-behance']} alt="" />
                            </a>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

// Nombre de una subcategoría escrito a lápiz y encerrado en un óvalo. Se escribe al verse por primera vez: el texto
// aparece de izquierda a derecha y luego se traza el óvalo (.is-written, ProjectsModal.css).
function SubLabel({ id, text }) {
  const ref = useRef(null);
  const [written, setWritten] = useState(false);
  useEffect(() => {
    const el = ref.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setWritten(true);
        io.disconnect();
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <h3 ref={ref} id={id} className={`psub${written ? ' is-written' : ''}`}>
      <span>{text}</span>
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <ellipse cx="50" cy="20" rx="49" ry="19" vectorEffect="non-scaling-stroke" />
      </svg>
    </h3>
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
function ProjectDetail({ proj, name, tags, item, m, behanceIcon, newSticker, wipSticker }) {
  return (
    <div className="pdetail">
      <article className="project" aria-labelledby={`project-${proj.id}`}>
        <div className="polaroid polaroid--detail">
          <MediaCarousel media={proj.media} name={name} labels={m} />
          {proj.isNew && <img className="pnew pnew--detail" src={newSticker} alt={m.newProject} />}
          {proj.wip && <img className="pnew pwip pwip--detail" src={wipSticker} alt={m.wipProject} />}
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
