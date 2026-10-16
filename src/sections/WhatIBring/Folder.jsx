import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Message from '../../components/Message.jsx';
import useDraggableObjects from '../../components/useDraggableObjects.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

// Carpeta de «Lo que aporto».
// Cerrada y vacía al empezar (Figma 182:1015), con una burbuja encima que invita a abrirla. Al tocarla la burbuja
// baja y se esconde detrás de la carpeta, y salen las cuatro fotos casi al mismo nivel, asomándose (grupo oculto
// 182:1027 del mismo frame), junto con la nota de la lista de aportes (146:5632).
// Al tocar una foto (o su línea en la nota) esa foto sube y aparece su detalle: título, explicación y mensaje azul
// (Figma 183:2691 + 183:2671). Las otras tres se oscurecen un poco; la carpeta, la nota y la página no. La foto elevada
// se puede arrastrar y su detalle la sigue. Tocar fuera o Escape lo cierran.
// Coordenadas: px de Figma dentro de la carpeta (1082 × 787).

// En el orden de la nota (01–04), que es también el orden del teclado. z = orden de capas en Figma (mayor = delante).
// x, y, bw, bh: caja de la foto ya girada · w, h: la foto sin girar · r: giro (CSS) · bd: grosor del borde
// side / anchor: en escritorio y tablet el detalle va a un lado de las fotos (01 y 02 a la izquierda, 03 y 04 a la
//   derecha; 02 y 03 más cerca de los bordes). anchor = punta de la cola, sin contar el arrastre.
// tip: en celular el detalle va encima de la foto: punta de la cola sobre el punto más alto de la foto
//   ya elevada (y de su caja − LIFT 40 − 6 del zoom; Folder.css), para no taparla
const photos = [
  {
    id: 'listening', src: 'project-4', z: 4, side: 'left', anchor: { x: 180, y: 215 },
    x: 204.83, y: 168.7, bw: 270.07, bh: 328.1, w: 208.74, h: 287.29, r: -13.51,
    crop: { w: 116.49, h: 150.75, left: 0, top: -50.76 },
    tip: { x: 228, y: 123 },
  },
  {
    id: 'curiosity', src: 'project-3', z: 3, side: 'left', anchor: { x: 90, y: 215 },
    x: 280, y: 138, bw: 253.04, bh: 283.15, w: 226.93, h: 261.01, r: -5.96, soft: true,
    crop: { w: 145, h: 224.15, left: -16.29, top: -91.68 },
    tip: { x: 300, y: 92 },
  },
  {
    id: 'teamwork', src: 'project-2', z: 2, side: 'right', anchor: { x: 980, y: 215 },
    x: 475, y: 153, bw: 207.44, bh: 351.92, w: 193.72, h: 344.39, r: 2.31,
    tip: { x: 506, y: 107 },
  },
  {
    id: 'detail', src: 'project-1', z: 1, side: 'right', anchor: { x: 890, y: 215 },
    x: 545, y: 138, bw: 321.13, bh: 597.58, w: 194, h: 568, r: 13.49,
    tip: { x: 692, y: 92 },
  },
];

const clamp = (v, min, max) => Math.min(Math.max(v, min), Math.max(min, max));

// open / onOpen: el estado lo guarda la sección (al abrirla la composición baja y aparece «Toca las imágenes»)
export default function Folder({ img, open, onOpen }) {
  const { t } = useLanguage();
  const a = t.whatIBring;
  const [selected, setSelected] = useState(null);
  const photoRefs = useRef({});
  const openRef = useRef(null);
  const detailRef = useRef(null);
  const detailWrapRef = useRef(null);
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

  // Posición del detalle (left/top en px dentro de la carpeta; el punto es la esquina inferior del lado de la cola).
  // Prueba, en orden: a su lado de las fotos (escritorio y tablet), al otro lado de la foto y encima de ella (la única
  // en celular). Se queda con la primera que no tapa ninguna foto, o con la que menos tapa. Siempre suma el arrastre
  // de la foto, así la sigue mientras se mueve, y nunca sale de la pantalla ni queda bajo el header.
  const place = useCallback(() => {
    const root = rootRef.current;
    const det = detailWrapRef.current;
    const box = detailRef.current;
    const p = photos.find((ph) => ph.id === selected);
    const el = root?.querySelector('.folder__photo.is-selected .folder__frame');
    if (!p || !det || !box || !el) return;

    const u = root.offsetWidth / 1082;
    const dx = parseFloat(el.style.getPropertyValue('--dx')) || 0;
    const dy = parseFloat(el.style.getPropertyValue('--dy')) || 0;
    const R = root.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const tail = 0.4574 * parseFloat(getComputedStyle(det).fontSize);
    const bw = box.offsetWidth;
    const bh = box.offsetHeight;
    const margin = 16;
    const vw = document.documentElement.clientWidth;
    const sec = root.closest('section').getBoundingClientRect();
    const headerBottom = document.querySelector('.header')?.getBoundingClientRect().bottom ?? 0;
    const minBottom = Math.max(sec.top, headerBottom) + 8 + bh;
    const frames = [...root.querySelectorAll('.folder__frame')].map((f) => f.getBoundingClientRect());

    // Caja en pantalla para la cola en (ax, ay) px de la carpeta, ajustada a la pantalla y a la sección
    const candidate = (side, ax, ay) => {
      const x = clamp(R.left + (side === 'left' ? ax + tail - bw : ax - tail), margin, vw - margin - bw);
      const bottom = clamp(R.top + ay, minBottom, sec.bottom - 8);
      const covered = frames.reduce((sum, f) => {
        const w = Math.min(x + bw, f.right) - Math.max(x, f.left);
        const h = Math.min(bottom, f.bottom) - Math.max(bottom - bh, f.top);
        return sum + (w > 0 && h > 0 ? w * h : 0);
      }, 0);
      return { side, x, bottom, covered };
    };

    const other = p.side === 'left' ? 'right' : 'left';
    const top = candidate('top', p.tip.x * u + dx, (p.tip.y - 14) * u + dy);
    const options = window.matchMedia('(max-width: 768px)').matches
      ? [top]
      : [
          candidate(p.side, p.anchor.x * u + dx, p.anchor.y * u + dy),
          candidate(other, (other === 'right' ? r.right + 24 * u : r.left - 24 * u) - R.left, p.anchor.y * u + dy),
          top,
        ];
    // «No tapa»: menos del 3 % de la caja sobre las fotos (sus cajas giradas son algo más grandes que la foto)
    const best = options.find((o) => o.covered < bw * bh * 0.03) ?? options.reduce((a, b) => (b.covered < a.covered ? b : a));

    det.style.left = `${Math.round(best.x - R.left)}px`;
    det.style.top = `${Math.round(best.bottom - R.top)}px`;
    det.dataset.side = best.side;
  }, [selected]);

  // Al elegir otra foto, al cambiar de idioma (otro texto) y al terminar de elevarse la foto
  useLayoutEffect(() => {
    if (!selected) return undefined;
    place();
    const timer = setTimeout(place, 550);
    const onResize = () => requestAnimationFrame(place);
    window.addEventListener('resize', onResize);
    document.fonts?.ready.then(place);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', onResize);
    };
  }, [selected, t, place]);

  // La foto elevada se arrastra dentro de la sección (ratón y dedo); el detalle la sigue
  const sectionRef = useRef(null);
  useLayoutEffect(() => {
    sectionRef.current = rootRef.current.closest('section');
  }, []);
  useDraggableObjects(sectionRef, open, place, '.folder__photo.is-selected .folder__frame');

  // Las posiciones dependen del ancho: al cambiarlo todas las fotos vuelven a su sitio
  useEffect(() => {
    let width = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth === width) return;
      width = window.innerWidth;
      rootRef.current?.querySelectorAll('.folder__frame').forEach((el) => {
        el.style.removeProperty('--dx');
        el.style.removeProperty('--dy');
      });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Cuando ya salieron las fotos se quita el recorte de abajo (solo hace falta mientras suben): así una foto
  // arrastrada nunca se corta
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    if (!open) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = setTimeout(() => setRevealed(true), reduced ? 0 : 1600);
    return () => clearTimeout(timer);
  }, [open]);

  const closedProps = open ? {} : { inert: '', 'aria-hidden': true };

  return (
    <div
      ref={rootRef}
      className="folder__inner"
      data-state={open ? 'open' : 'closed'}
      data-selected={selected ? 'true' : undefined}
      data-seen={seen ? 'true' : undefined}
      data-revealed={revealed ? 'true' : undefined}
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

      {/* «Toca las imágenes»: pequeña, en la esquina superior derecha de la carpeta; aparece cuando ya salieron las fotos */}
      <div className="folder__tap" aria-hidden={!open}>
        <Message text={a.tap} emoji="👆🏽" k={0.4} />
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
        ref={detailWrapRef}
        className="folder-detail"
        role="status"
        aria-live="polite"
        data-open={current ? 'true' : undefined}
      >
        {current && (
          <div key={current.id} ref={detailRef} className="folder-detail__box">
            <p className="folder-detail__title">{a.aportes[current.id].title}</p>
            <p className="folder-detail__caption">{a.aportes[current.id].caption}</p>
            <Message variant="blue" text={a.aportes[current.id].text} />
          </div>
        )}
      </div>
    </div>
  );
}
