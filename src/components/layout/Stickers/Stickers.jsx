import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../../i18n/LanguageContext.jsx';
import StickerArt, { STICKER_IDS as IDS, artSize, stickerImg as img } from './StickerArt.jsx';
import useStickerDrag from './useStickerDrag.js';
import './Stickers.css';

// Cualquier imagen nueva de design-originals/stickers (tras `npm run images`) aparece sola en el panel; su nombre
// accesible va en translations.js (stickers.names).

// Cada cuánto cambia el sticker de la pestaña y cuánto dura su fundido (ms)
const ROTATE_MS = 10000;
const FADE_MS = 300;

// Stickers colocados: se recuerdan mientras la pestaña del navegador siga abierta (también al recargar)
const STORAGE_KEY = 'portfolio-stickers';

// Tamaño común de los stickers (lado del cuadrado con la misma área visible, ver artSize en StickerArt.jsx) y lado
// mayor permitido: en la página, en las celdas del panel y en la pestaña (su interior)
const sidesFor = (w) =>
  w <= 768
    ? { page: 72, pageMax: 108, tile: 52, tileMax: 84, tab: 32, tabMax: 40 }
    : { page: 88, pageMax: 132, tile: 46, tileMax: 64, tab: 42, tabMax: 56 };

// Sombra en reposo (pegado) y en el aire; las mismas que .sticker-art y .is-lifted en Stickers.css
const SHADOW_REST = 'drop-shadow(0 2px 3px rgba(67, 47, 46, 0.25))';
const SHADOW_LIFT = 'drop-shadow(0 14px 14px rgba(67, 47, 46, 0.22))';
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const fill = (text, vars) => Object.entries(vars).reduce((t, [k, v]) => t.replace(`{${k}}`, v), text);
const clamp = (v, min, max) => Math.min(Math.max(v, min), Math.max(min, max));
const pickOther = (current) => {
  const others = IDS.filter((id) => id !== current);
  return others.length ? others[Math.floor(Math.random() * others.length)] : current;
};

const readStored = () => {
  try {
    const list = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    return Array.isArray(list)
      ? list.filter((s) => s && img[s.id] && Number.isFinite(s.x) && Number.isFinite(s.y)).map(({ fresh, arriving, ...p }) => p)
      : [];
  } catch {
    return [];
  }
};

// Pestaña flotante (a la derecha, centrada) con un sticker que cambia cada 10 s. Al tocarla abre el panel con todos
// los stickers: tocar uno lo despega del panel y lo lleva volando hasta el centro de la pantalla, donde se pega con un
// pequeño rebote; con el mouse también se puede arrastrar directo a la página (se levanta al agarrarlo y rebota al
// soltarlo). Los colocados se arrastran (mouse y dedo), se mueven con las flechas y se quitan con su × o con Suprimir.
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
  const flyerRef = useRef(null);
  // Capa más alta en uso: el sticker que se agarra pasa por encima de los demás
  const zTop = useRef(null);

  const [placed, setPlaced] = useState(readStored);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  // El panel se esconde mientras se arrastra un sticker desde él (sigue montado: su botón tiene capturado el puntero)
  const [draggingOut, setDraggingOut] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [sides, setSides] = useState(() => sidesFor(window.innerWidth));
  // Sticker que se lleva en el aire (se inclina y su sombra crece mientras se arrastra)
  const [lifted, setLifted] = useState(null);
  // Sticker que viaja del panel a la página: { uid, id, from (rect de su celda), to (centro final), r }
  const [flight, setFlight] = useState(null);
  // El panel sigue montado mientras se desvanece al cerrarse
  const [panelMounted, setPanelMounted] = useState(false);

  if (zTop.current === null) zTop.current = placed.reduce((m, p) => Math.max(m, p.z || 0), 0);

  // Guarda los colocados (sin la marca de «en vuelo», que solo sirve para la animación)
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(placed.map(({ arriving, ...p }) => p)));
    } catch {
      /* sin almacenamiento: los stickers duran mientras la página esté abierta */
    }
  }, [placed]);

  useEffect(() => {
    const onResize = () => setSides(sidesFor(window.innerWidth));
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

  const pageSize = (id) => artSize(id, sides.page, sides.pageMax);

  // Centro (px de la capa) → posición guardada, sin que el sticker salga de <main>
  const positionAt = (id, cx, cy, w, h) => {
    const size = pageSize(id);
    return {
      x: clamp(cx, size.w / 2, w - size.w / 2) / w,
      y: clamp(cy, size.h / 2, h - size.h / 2),
    };
  };

  const add = (id, cx, cy, extra) => {
    const { w, h } = toLayer(0, 0);
    const uid = `${id}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const sticker = { uid, id, ...positionAt(id, cx, cy, w, h), r: Math.round(Math.random() * 16 - 8), z: ++zTop.current, ...extra };
    setPlaced((list) => [...list, sticker]);
    return sticker;
  };

  const update = (uid, patch) => setPlaced((list) => list.map((p) => (p.uid === uid ? { ...p, ...patch } : p)));

  const remove = (uid) => {
    setPlaced((list) => list.filter((p) => p.uid !== uid));
    setSelected(null);
    tabRef.current?.focus({ preventScroll: true });
  };

  // Rebote al pegarse: llega un poco grande y en el aire, se aplasta contra la página y se asienta
  const land = (uid) => {
    if (reducedMotion()) return;
    layerRef.current?.querySelector(`[data-uid="${uid}"] .sticker-art`)?.animate(
      [
        { opacity: 1, scale: 1.1, filter: SHADOW_LIFT },
        { opacity: 1, scale: 0.93, filter: SHADOW_REST, offset: 0.45 },
        { opacity: 1, scale: 1.03, filter: SHADOW_REST, offset: 0.75 },
        { opacity: 1, scale: 1, filter: SHADOW_REST },
      ],
      { duration: 300, easing: 'ease-out' }
    );
  };

  // Tocar (o Enter) un sticker del panel: se despega de su celda y vuela hasta el centro de la pantalla (un poco
  // movido para que no se apilen exactos). El sticker real ya está en su sitio, invisible (arriving) pero con el foco,
  // así se puede mover enseguida; al aterrizar el que vuela, aparece y rebota.
  const placeAtCenter = (id, tile) => {
    const from = tile?.querySelector('.sticker-art')?.getBoundingClientRect();
    const fly = Boolean(from) && !reducedMotion();
    const layer = toLayer(window.innerWidth / 2 + (Math.random() * 60 - 30), window.innerHeight / 2 + (Math.random() * 60 - 30));
    const sticker = add(id, layer.x, layer.y, fly ? { arriving: true } : undefined);
    if (fly) {
      const r = layerRef.current.getBoundingClientRect();
      setFlight({ uid: sticker.uid, id, from, to: { x: r.left + sticker.x * r.width, y: r.top + sticker.y }, r: sticker.r });
    }
    focusUid.current = sticker.uid;
    setSelected(sticker.uid);
    setOpen(false);
  };

  // Vuelo: despega (sube, gira y su sombra crece), hace un arco y llega al sitio donde se pega
  useLayoutEffect(() => {
    if (!flight) return undefined;
    const { uid, from, to, r } = flight;
    const size = pageSize(flight.id);
    const s0 = from.width / size.w;
    const dx = from.left + from.width / 2 - to.x;
    const dy = from.top + from.height / 2 - to.y;
    const anim = flyerRef.current.animate(
      [
        { translate: `${dx}px ${dy}px`, scale: s0, rotate: '0deg', filter: SHADOW_REST, easing: 'ease-out' },
        { translate: `${dx}px ${dy - 14}px`, scale: s0 * 1.15, rotate: '-10deg', filter: SHADOW_LIFT, offset: 0.18, easing: 'cubic-bezier(0.45, 0, 0.3, 1)' },
        { translate: `${dx / 2}px ${dy / 2 - 70}px`, scale: 1.15, rotate: `${r + 10}deg`, filter: SHADOW_LIFT, offset: 0.6, easing: 'cubic-bezier(0.3, 0.6, 0.4, 1)' },
        { translate: '0px 0px', scale: 1.1, rotate: `${r}deg`, filter: SHADOW_LIFT },
      ],
      { duration: 560, fill: 'both' }
    );
    anim.onfinish = () => {
      update(uid, { arriving: false });
      setFlight(null);
      land(uid);
    };
    return () => {
      anim.onfinish = null;
      anim.cancel();
    };
  }, [flight]); // Solo al empezar cada vuelo

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
        // Desde el panel: el primer movimiento crea el sticker bajo el puntero, ya en el aire
        if (!target.uid) {
          target.uid = add(target.id, x, y).uid;
          setDraggingOut(true);
          setLifted(target.uid);
        }
        update(target.uid, positionAt(target.id, x, y, w, h));
        return;
      }
      const p = placed.find((q) => q.uid === target.uid);
      if (!p) return;
      if (!target.start) {
        target.start = { cx: p.x * w, cy: p.y };
        update(target.uid, { z: ++zTop.current });
        setLifted(target.uid);
      }
      update(target.uid, positionAt(p.id, target.start.cx + clientX - startX, target.start.cy + clientY - startY, w, h));
    },
    onEnd(target, moved) {
      if (!moved) return;
      setLifted(null);
      if (target.uid) land(target.uid);
      if (target.id) {
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
      update(p.uid, positionAt(p.id, p.x * w + moves[e.key][0], p.y + moves[e.key][1], w, h));
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
  // Al cerrarse se desvanece (0.2 s) antes de desmontarse
  useEffect(() => {
    if (open) {
      setPanelMounted(true);
      return undefined;
    }
    if (reducedMotion()) {
      setPanelMounted(false);
      return undefined;
    }
    const timer = setTimeout(() => setPanelMounted(false), 200);
    return () => clearTimeout(timer);
  }, [open]);

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
      <div ref={layerRef} className="stickers-layer">
        {placed.map((p) => (
          <div
            key={p.uid}
            data-uid={p.uid}
            className={`sticker${selected === p.uid ? ' is-selected' : ''}${lifted === p.uid ? ' is-lifted' : ''}${p.arriving ? ' is-arriving' : ''}`}
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
              <StickerArt id={p.id} side={sides.page} max={sides.pageMax} />
            </button>
            {selected === p.uid && !p.arriving && (
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
        <StickerArt id={tabId} side={sides.tab} max={sides.tabMax} className={fading ? 'is-fading' : ''} />
      </button>

      {(open || panelMounted) && (
        <div
          ref={panelRef}
          id="stickers-panel"
          className={`stickers-panel${draggingOut ? ' is-dragging-out' : ''}${open ? '' : ' is-leaving'}`}
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
                  onClick={(e) => placeAtCenter(id, e.currentTarget)}
                >
                  <StickerArt id={id} side={sides.tile} max={sides.tileMax} />
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

      {/* Sticker en vuelo del panel a la página: fijo y por encima del panel, en el sitio donde aterriza */}
      {flight &&
        createPortal(
          <StickerArt
            ref={flyerRef}
            id={flight.id}
            side={sides.page}
            max={sides.pageMax}
            className="sticker-flyer"
            aria-hidden="true"
            style={{ left: flight.to.x - pageSize(flight.id).w / 2, top: flight.to.y - pageSize(flight.id).h / 2 }}
          />,
          document.body,
        )}
    </>
  );
}
