import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { byName } from '../../../assets/images.js';
import { useLanguage } from '../../../i18n/LanguageContext.jsx';
import useStickerDrag from './useStickerDrag.js';
import './Stickers.css';

// Stickers (src/assets/stickers/, generados desde design-originals/stickers con `npm run images`). Cualquier imagen
// nueva de esa carpeta aparece sola en el panel; su nombre accesible va en translations.js (stickers.names).
const img = byName(import.meta.glob('../../../assets/stickers/*', { eager: true, import: 'default' }));
const IDS = Object.keys(img).sort();

// Cada cuánto cambia el sticker de la pestaña y cuánto dura su fundido (ms)
const ROTATE_MS = 10000;
const FADE_MS = 300;

// Stickers colocados: se recuerdan mientras la pestaña del navegador siga abierta (también al recargar)
const STORAGE_KEY = 'portfolio-stickers';

// Lado del cuadrado que ocupa cada sticker colocado (la imagen se ajusta dentro sin recortarse)
const sizeFor = (w) => (w <= 768 ? 104 : Math.round(Math.min(140, Math.max(96, w * 0.09))));

const fill = (text, vars) => Object.entries(vars).reduce((t, [k, v]) => t.replace(`{${k}}`, v), text);
const clamp = (v, min, max) => Math.min(Math.max(v, min), Math.max(min, max));
const pickOther = (current) => {
  const others = IDS.filter((id) => id !== current);
  return others.length ? others[Math.floor(Math.random() * others.length)] : current;
};

const readStored = () => {
  try {
    const list = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    return Array.isArray(list) ? list.filter((s) => s && img[s.id] && Number.isFinite(s.x) && Number.isFinite(s.y)) : [];
  } catch {
    return [];
  }
};

// Pestaña flotante (a la derecha, centrada) con un sticker que cambia cada 10 s. Al tocarla abre el panel con todos
// los stickers: tocar uno lo pone en el centro de la pantalla; con el mouse también se puede arrastrar directo a la
// página. Los colocados se arrastran (mouse y dedo), se mueven con las flechas y se quitan con su × o con Suprimir.
// Los stickers viven en una capa que cubre todo <main> sin recibir toques (pointer-events: none): solo cada sticker
// los recibe, así el scroll y las secciones funcionan igual. Posición: x en fracción del ancho de <main> (sigue en su
// columna si cambia el ancho de la ventana) e y en px desde arriba de <main>.
export default function Stickers() {
  const { t } = useLanguage();
  const s = t.stickers;
  const layerRef = useRef(null);
  const tabRef = useRef(null);
  const panelRef = useRef(null);
  const focusUid = useRef(null);
  // Capa más alta en uso: el sticker que se agarra pasa por encima de los demás
  const zTop = useRef(null);

  const [placed, setPlaced] = useState(readStored);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  // El panel se esconde mientras se arrastra un sticker desde él (sigue montado: su botón tiene capturado el puntero)
  const [draggingOut, setDraggingOut] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [size, setSize] = useState(() => sizeFor(window.innerWidth));

  if (zTop.current === null) zTop.current = placed.reduce((m, p) => Math.max(m, p.z || 0), 0);

  // Guarda los colocados (sin la marca de recién puesto, que solo sirve para la animación)
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(placed.map(({ fresh, ...p }) => p)));
    } catch {
      /* sin almacenamiento: los stickers duran mientras la página esté abierta */
    }
  }, [placed]);

  useEffect(() => {
    const onResize = () => setSize(sizeFor(window.innerWidth));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Oculta mientras la caja del inicio está cerrada y se ve el inicio (como el header, ver Header.jsx). Si alguien
  // baja sin abrir la caja, aparece al salir del inicio.
  useEffect(() => {
    const update = () => {
      const intro = document.getElementById('intro');
      const r = intro?.getBoundingClientRect();
      const atIntro = Boolean(r && r.bottom > window.innerHeight / 2);
      setHidden(document.documentElement.dataset.box === 'closed' && atIntro);
    };
    update();
    const mo = new MutationObserver(update);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-box'] });
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      mo.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  useEffect(() => {
    if (hidden) setOpen(false);
  }, [hidden]);

  // ---------- Sticker de la pestaña: uno al azar cada 10 s, sin repetir el anterior ----------
  const [tabId, setTabId] = useState(() => IDS[Math.floor(Math.random() * IDS.length)]);
  const [fading, setFading] = useState(false);
  const [pageHidden, setPageHidden] = useState(document.hidden);
  useEffect(() => {
    const onVisibility = () => setPageHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);
  useEffect(() => {
    // En pausa con el panel abierto, la pestaña oculta o la página en segundo plano
    if (open || hidden || pageHidden || IDS.length < 2) return undefined;
    let swap;
    const interval = setInterval(() => {
      const next = pickOther(tabId);
      setFading(true);
      // Se decodifica mientras la actual se desvanece, así la nueva aparece ya cargada
      const im = new Image();
      im.src = img[next];
      const ready = im.decode ? im.decode().catch(() => {}) : Promise.resolve();
      const wait = new Promise((r) => {
        swap = setTimeout(r, FADE_MS);
      });
      Promise.all([ready, wait]).then(() => {
        setTabId(next);
        setFading(false);
      });
    }, ROTATE_MS);
    return () => {
      clearInterval(interval);
      clearTimeout(swap);
    };
  }, [open, hidden, pageHidden, tabId]);

  // ---------- Colocar, mover y quitar ----------
  const toLayer = (clientX, clientY) => {
    const r = layerRef.current.getBoundingClientRect();
    return { x: clientX - r.left, y: clientY - r.top, w: r.width, h: r.height };
  };

  // Centro (px de la capa) → posición guardada, sin que el sticker salga de <main>
  const positionAt = (cx, cy, w, h) => ({
    x: clamp(cx, size / 2, w - size / 2) / w,
    y: clamp(cy, size / 2, h - size / 2),
  });

  const add = (id, cx, cy) => {
    const { w, h } = toLayer(0, 0);
    const uid = `${id}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const sticker = { uid, id, ...positionAt(cx, cy, w, h), r: Math.round(Math.random() * 16 - 8), z: ++zTop.current, fresh: true };
    setPlaced((list) => [...list, sticker]);
    return uid;
  };

  const update = (uid, patch) => setPlaced((list) => list.map((p) => (p.uid === uid ? { ...p, ...patch } : p)));

  const remove = (uid) => {
    setPlaced((list) => list.filter((p) => p.uid !== uid));
    setSelected(null);
    tabRef.current?.focus({ preventScroll: true });
  };

  // Tocar (o Enter) un sticker del panel: va al centro de la pantalla, un poco movido para que no se apilen exactos
  const placeAtCenter = (id) => {
    const { x, y } = toLayer(window.innerWidth / 2, window.innerHeight / 2);
    const uid = add(id, x + (Math.random() * 60 - 30), y + (Math.random() * 60 - 30));
    focusUid.current = uid;
    setSelected(uid);
    setOpen(false);
  };

  // Tras colocar con el panel, el foco pasa al sticker para moverlo enseguida con las flechas
  useLayoutEffect(() => {
    if (!focusUid.current) return;
    layerRef.current?.querySelector(`[data-uid="${focusUid.current}"] .sticker__body`)?.focus({ preventScroll: true });
    focusUid.current = null;
  });

  const startDrag = useStickerDrag({
    onMove(target, clientX, clientY, startX, startY) {
      const { x, y, w, h } = toLayer(clientX, clientY);
      if (target.id) {
        // Desde el panel: el primer movimiento crea el sticker bajo el puntero
        if (!target.uid) {
          target.uid = add(target.id, x, y);
          setDraggingOut(true);
        }
        update(target.uid, positionAt(x, y, w, h));
        return;
      }
      if (!target.start) {
        const p = placed.find((q) => q.uid === target.uid);
        if (!p) return;
        target.start = { cx: p.x * w, cy: p.y };
        update(target.uid, { z: ++zTop.current });
      }
      update(target.uid, positionAt(target.start.cx + clientX - startX, target.start.cy + clientY - startY, w, h));
    },
    onEnd(target, moved) {
      if (target.id && moved) {
        setDraggingOut(false);
        setOpen(false);
      }
    },
  });

  const onStickerKey = (e, p) => {
    const step = e.shiftKey ? 40 : 10;
    const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (moves[e.key]) {
      e.preventDefault();
      const { w, h } = toLayer(0, 0);
      update(p.uid, positionAt(p.x * w + moves[e.key][0], p.y + moves[e.key][1], w, h));
      setSelected(p.uid);
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      remove(p.uid);
    } else if (e.key === 'Escape') {
      setSelected(null);
    }
  };

  // Tocar fuera de un sticker lo deselecciona
  useEffect(() => {
    if (!selected) return undefined;
    const onDown = (e) => {
      if (!e.target.closest?.('.sticker')) setSelected(null);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [selected]);

  // ---------- Panel ----------
  const closePanel = useCallback(() => {
    setOpen(false);
    tabRef.current?.focus({ preventScroll: true });
  }, []);

  // Al abrir, el foco pasa al primer sticker; Escape o un toque fuera lo cierran
  useEffect(() => {
    if (!open) return undefined;
    panelRef.current?.querySelector('.stickers-panel__item')?.focus({ preventScroll: true });
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      e.preventDefault();
      closePanel();
    };
    const onDown = (e) => {
      if (panelRef.current?.contains(e.target) || tabRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [open, closePanel]);

  const nameOf = (id) => s.names[id] ?? id;

  return (
    <>
      <div ref={layerRef} className="stickers-layer" style={{ '--sticker-size': `${size}px` }}>
        {placed.map((p) => (
          <div
            key={p.uid}
            data-uid={p.uid}
            className={`sticker${selected === p.uid ? ' is-selected' : ''}${p.fresh ? ' is-fresh' : ''}`}
            style={{ left: `${p.x * 100}%`, top: `${p.y}px`, '--r': `${p.r}deg`, zIndex: p.z }}
          >
            <button
              type="button"
              className="sticker__body"
              aria-label={fill(s.placed, { name: nameOf(p.id) })}
              onPointerDown={(e) => startDrag(e, { uid: p.uid })}
              onClick={() => setSelected((cur) => (cur === p.uid ? null : p.uid))}
              onKeyDown={(e) => onStickerKey(e, p)}
            >
              <img src={img[p.id]} alt="" draggable={false} decoding="async" />
            </button>
            {selected === p.uid && (
              <button type="button" className="sticker__remove" aria-label={fill(s.remove, { name: nameOf(p.id) })} onClick={() => remove(p.uid)}>
                <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                  <path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        ref={tabRef}
        type="button"
        className={`stickers-tab${hidden ? ' is-hidden' : ''}${open ? ' is-open' : ''}`}
        aria-label={s.open}
        aria-expanded={open}
        aria-controls="stickers-panel"
        tabIndex={hidden ? -1 : undefined}
        onClick={() => (open ? closePanel() : setOpen(true))}
      >
        <img className={fading ? 'is-fading' : ''} src={img[tabId]} alt="" draggable={false} />
      </button>

      {open && (
        <div
          ref={panelRef}
          id="stickers-panel"
          className={`stickers-panel${draggingOut ? ' is-dragging-out' : ''}`}
          role="dialog"
          aria-labelledby="stickers-panel-title"
          aria-describedby="stickers-panel-hint"
        >
          <div className="stickers-panel__head">
            <h2 id="stickers-panel-title" className="stickers-panel__title">
              {s.title}
            </h2>
            <button type="button" className="stickers-panel__close" aria-label={s.close} onClick={closePanel}>
              <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                <path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <p id="stickers-panel-hint" className="stickers-panel__hint">
            {s.hint}
          </p>
          <ul className="stickers-panel__grid">
            {IDS.map((id) => (
              <li key={id}>
                <button
                  type="button"
                  className="stickers-panel__item"
                  aria-label={fill(s.place, { name: nameOf(id) })}
                  // Con mouse o lápiz se puede arrastrar directo a la página; con el dedo, un toque lo pone en el
                  // centro (así el panel se sigue desplazando con el dedo)
                  onPointerDown={(e) => e.pointerType !== 'touch' && startDrag(e, { id })}
                  onClick={() => placeAtCenter(id)}
                >
                  <img src={img[id]} alt="" draggable={false} decoding="async" />
                </button>
              </li>
            ))}
          </ul>
          {placed.length > 0 && (
            <button type="button" className="stickers-panel__clear" onClick={() => setPlaced([])}>
              {s.removeAll}
            </button>
          )}
        </div>
      )}
    </>
  );
}
