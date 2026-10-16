import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Message from '../../components/Message.jsx';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

// Carpeta de «Lo que aporto».
// Cerrada y vacía al empezar (Figma 182:1015), con una burbuja encima que invita a abrirla. Al tocarla la burbuja
// baja y se esconde detrás de la carpeta, y salen las cuatro fotos casi al mismo nivel, asomándose (grupo oculto
// 182:1027 del mismo frame), junto con la nota de la lista de aportes (146:5632).
// Al tocar una foto (o su línea en la nota) esa foto sube y aparece su detalle: título y mensaje azul (Figma 183:2691 +
// 183:2671). Las otras tres se oscurecen un poco; la carpeta, la nota y la página no. Tocar fuera o Escape lo cierran.
// Coordenadas: px de Figma dentro de la carpeta (1082 × 787).

// En el orden de la nota (01–04), que es también el orden del teclado. z = orden de capas en Figma (mayor = delante).
// x, y, bw, bh: caja de la foto ya girada · w, h: la foto sin girar · r: giro (CSS) · bd: grosor del borde
// tip: punta de la cola del detalle, sobre el borde de arriba de la foto ya elevada (LIFT en Folder.css: 40)
const photos = [
  {
    id: 'listening', src: 'project-4', z: 4,
    x: 204.83, y: 168.7, bw: 270.07, bh: 328.1, w: 208.74, h: 287.29, r: -13.51,
    crop: { w: 116.49, h: 150.75, left: 0, top: -50.76 },
    tip: { x: 228, y: 168 },
  },
  {
    id: 'curiosity', src: 'project-3', z: 3,
    x: 280, y: 138, bw: 253.04, bh: 283.15, w: 226.93, h: 261.01, r: -5.96, soft: true,
    crop: { w: 145, h: 224.15, left: -16.29, top: -91.68 },
    tip: { x: 300, y: 110 },
  },
  {
    id: 'teamwork', src: 'project-2', z: 2,
    x: 475, y: 153, bw: 207.44, bh: 351.92, w: 193.72, h: 344.39, r: 2.31,
    tip: { x: 506, y: 105 },
  },
  {
    id: 'detail', src: 'project-1', z: 1,
    x: 545, y: 138, bw: 321.13, bh: 597.58, w: 194, h: 568, r: 13.49,
    tip: { x: 692, y: 91 },
  },
];

// open / onOpen: el estado lo guarda la sección (al abrirla la composición baja y aparece «Toca las imágenes»)
export default function Folder({ img, open, onOpen }) {
  const { t } = useLanguage();
  const a = t.whatIBring;
  const [selected, setSelected] = useState(null);
  const photoRefs = useRef({});
  const openRef = useRef(null);
  const detailRef = useRef(null);
  const rootRef = useRef(null);
  // La sección ya se vio: el sticker de papaya se pega (una sola vez)
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      setSeen(true);
      io.disconnect();
    }, { threshold: 0.35 });
    io.observe(rootRef.current);
    return () => io.disconnect();
  }, []);

  const openFolder = () => {
    // Con el teclado el foco pasa a la primera foto (el botón de la carpeta desaparece)
    const fromKeyboard = openRef.current?.matches(':focus-visible');
    onOpen();
    if (fromKeyboard) requestAnimationFrame(() => photoRefs.current[photos[0].id]?.focus({ preventScroll: true }));
  };

  // Tocar la foto seleccionada la deselecciona; otra foto mueve el resaltado
  const toggle = (id) => setSelected((cur) => (cur === id ? null : id));

  useEffect(() => {
    if (!selected) return undefined;
    const onClick = (e) => {
      if (!e.target.closest?.('.folder__photo-btn, .folder__note-item, .folder-detail .msg')) setSelected(null);
    };
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setSelected(null);
      photoRefs.current[selected]?.focus({ preventScroll: true });
    };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [selected]);

  const current = photos.find((p) => p.id === selected);

  // El detalle se corre a un lado si no cabe en la pantalla (p. ej. la última foto en celular)
  useLayoutEffect(() => {
    const box = detailRef.current;
    if (!box) return undefined;
    const fit = () => {
      box.style.setProperty('--shift', '0px');
      // Sin getBoundingClientRect de la caja: al aparecer está reducida por la animación de entrada
      const left = box.offsetParent.getBoundingClientRect().left + box.offsetLeft;
      const right = left + box.offsetWidth;
      const margin = 16;
      const max = document.documentElement.clientWidth - margin;
      const shift = right > max ? max - right : left < margin ? margin - left : 0;
      box.style.setProperty('--shift', `${Math.round(shift)}px`);
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [selected, t]);
  const closedProps = open ? {} : { inert: '', 'aria-hidden': true };

  return (
    <div
      ref={rootRef}
      className="folder__inner"
      data-state={open ? 'open' : 'closed'}
      data-selected={selected ? 'true' : undefined}
      data-seen={seen ? 'true' : undefined}
    >
      {/* Invitación a abrir la carpeta. Va antes de la carpeta en el orden de capas: al abrirla baja y queda detrás */}
      <div className="folder__hint" onClick={open ? undefined : openFolder} aria-hidden="true">
        <Message text={a.tapFolder} emoji="👆🏽" k={0.55} />
      </div>

      <img loading="lazy" decoding="async" className="folder__back" src={img['folder-back']} alt="" />

      <div className="folder__photos" {...closedProps}>
        {photos.map((p, i) => {
          const item = a.aportes[p.id];
          const isSelected = selected === p.id;
          return (
            <div
              key={p.id}
              className={`folder__photo ${isSelected ? 'is-selected' : ''}`}
              style={{
                '--fx': p.x, '--fy': p.y, '--bw': p.bw, '--bh': p.bh, '--iw': p.w, '--ih': p.h,
                '--r': `${p.r}deg`, '--i': i, zIndex: isSelected ? 10 : p.z,
              }}
            >
              <button
                ref={(el) => (photoRefs.current[p.id] = el)}
                type="button"
                className={`folder__frame folder__photo-btn ${p.soft ? 'is-soft' : ''}`}
                onClick={() => toggle(p.id)}
                aria-label={`${String(i + 1).padStart(2, '0')}. ${item.title}. ${item.alt}`}
                aria-expanded={isSelected}
                aria-controls="folder-detail"
              >
                {p.crop ? (
                  <img
                    loading="lazy"
                    decoding="async"
                    className="is-crop"
                    src={img[p.src]}
                    alt=""
                    draggable="false"
                    style={{ width: `${p.crop.w}%`, height: `${p.crop.h}%`, left: `${p.crop.left}%`, top: `${p.crop.top}%` }}
                  />
                ) : (
                  <img loading="lazy" decoding="async" src={img[p.src]} alt="" draggable="false" />
                )}
                {/* Capa oscura: solo se ve en las fotos no seleccionadas mientras hay una seleccionada */}
                <span className="folder__veil" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="folder__front" style={{ '--texture': `url("${img['folder-texture']}")` }}>
        <span className="folder__strip folder__strip--1" />
        <span className="folder__strip folder__strip--2" />
      </div>

      {/* Nota con clip y sticker (Figma 183:1323 y 183:2670). Se ve desde el principio, más abajo, dentro de la
          carpeta; al abrirla la misma nota sube a su sitio. Sus líneas también seleccionan la foto (solo abierta):
          la 02 queda casi tapada por la 01 y así se puede elegir con el ratón o el dedo. El teclado usa las fotos. */}
      <div className="folder__note" {...closedProps}>
        <img className="folder__note-paper" src={img['note-paper']} alt="" />
        <img className="folder__note-yellow" src={img['note-yellow']} alt="" />
        <ol className="folder__note-list" aria-hidden="true">
          {photos.map((p, i) => (
            <li key={p.id}>
              <button
                type="button"
                className={`folder__note-item ${selected === p.id ? 'is-selected' : ''}`}
                tabIndex={-1}
                onClick={() => toggle(p.id)}
              >
                <b>{String(i + 1).padStart(2, '0')}.</b> {a.aportes[p.id].title}
              </button>
            </li>
          ))}
        </ol>
        <img className="folder__note-clip" src={img['note-clip']} alt="" />
        {/* El contenedor lleva la posición y el giro de Figma; el img hace la animación de pegarse */}
        <span className="folder__sticker">
          <img loading="lazy" decoding="async" src={img['sticker-papaya']} alt="" />
        </span>
      </div>

      {!open && (
        <button ref={openRef} type="button" className="folder__open" onClick={openFolder} aria-label={a.openFolder} aria-expanded="false" />
      )}

      {/* Detalle de la foto seleccionada: siempre montado y región viva, así los lectores de pantalla lo anuncian */}
      <div
        id="folder-detail"
        className="folder-detail"
        role="status"
        aria-live="polite"
        data-open={current ? 'true' : undefined}
        style={current ? { '--tx': current.tip.x, '--ty': current.tip.y } : undefined}
      >
        {current && (
          <div key={current.id} ref={detailRef} className="folder-detail__box">
            <p className="folder-detail__title">{a.aportes[current.id].title}</p>
            <Message variant="blue" text={a.aportes[current.id].text} />
          </div>
        )}
      </div>
    </div>
  );
}
