import { useCallback, useEffect, useRef, useState } from 'react';
import './PhotoStack.css';

// Pila de fotos impresas: una al frente y las demás asomándose detrás, giradas.
// Cambia sola cada INTERVAL ms; al hacer clic / tocar pasa a la siguiente y el cambio automático se detiene
// HOLD ms para que dé tiempo de verla. Se detiene también con el ratón encima, con el foco del teclado,
// fuera de pantalla, con la pestaña oculta y con «reducir movimiento» activado (ahí solo cambia al hacer clic).
const INTERVAL = 4500;
const HOLD = 9000;
// Fotos detrás de la del frente que se ven (posiciones --1, --2, --3 en PhotoStack.css). Las demás esperan ocultas.
const VISIBLE_BEHIND = 3;

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
};

// photos: [{ id, src, srcSet }]; labels: { label, next, position, alts }
export default function PhotoStack({ photos, labels, sizes }) {
  const n = photos.length;
  const rootRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const [leaving, setLeaving] = useState(null);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [held, setHeld] = useState(false);
  const [pageHidden, setPageHidden] = useState(document.hidden);
  // Solo se anuncia el cambio a lectores de pantalla cuando lo pidió la persona (no en cada cambio automático)
  const [announce, setAnnounce] = useState(false);
  const reduced = usePrefersReducedMotion();
  const holdTimer = useRef(null);

  // Las fotos se piden poco antes de verse: la del frente, las de detrás y la siguiente en asomarse.
  // Una vez pedida, una foto se queda en el DOM (ya está descargada).
  const [requested, setRequested] = useState(() => new Set(photos.slice(0, VISIBLE_BEHIND + 2).map((p) => p.id)));
  useEffect(() => {
    const ids = Array.from({ length: Math.min(n, VISIBLE_BEHIND + 2) }, (_, k) => photos[(current + k) % n].id);
    setRequested((prev) => (ids.every((id) => prev.has(id)) ? prev : new Set([...prev, ...ids])));
  }, [current, n, photos]);

  const advance = useCallback(() => {
    setLeaving(current);
    setCurrent((current + 1) % n);
  }, [current, n]);

  const playing = n > 1 && inView && !hovered && !keyboardFocus && !held && !pageHidden && !reduced;

  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(advance, INTERVAL);
    return () => clearTimeout(id);
  }, [playing, advance]);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(rootRef.current);
    const onVisibility = () => setPageHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      clearTimeout(holdTimer.current);
    };
  }, []);

  const onClick = () => {
    if (n < 2) return;
    advance();
    setAnnounce(true);
    setHeld(true);
    clearTimeout(holdTimer.current);
    holdTimer.current = setTimeout(() => setHeld(false), HOLD);
  };

  const position = labels.position.replace('{n}', current + 1).replace('{total}', n);

  return (
    <div
      ref={rootRef}
      className={`photo-stack${reduced ? ' photo-stack--still' : ''}`}
      role="group"
      aria-label={labels.label}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <button
        type="button"
        className="photo-stack__button"
        onClick={onClick}
        onFocus={(e) => setKeyboardFocus(e.currentTarget.matches(':focus-visible'))}
        onBlur={() => setKeyboardFocus(false)}
        aria-label={labels.next}
        aria-describedby="photo-stack-status"
      >
        {photos.map((p, i) => {
          const k = (i - current + n) % n;
          const slot = i === leaving ? 'leaving' : k <= VISIBLE_BEHIND ? k : 'hidden';
          return (
            <span key={p.id} className={`photo-stack__card photo-stack__card--${slot}`} style={{ zIndex: i === leaving ? n + 1 : n - k }}>
              {requested.has(p.id) && (
                <img
                  loading="lazy"
                  decoding="async"
                  src={p.src}
                  srcSet={p.srcSet}
                  sizes={sizes}
                  alt=""
                  draggable="false"
                />
              )}
            </span>
          );
        })}

        <span className="photo-stack__progress" aria-hidden="true">
          {photos.map((p, i) => (
            <span key={p.id} className={`photo-stack__bar${i < current ? ' is-done' : ''}`}>
              {i === current && (
                <span
                  key={`${current}-${playing}`}
                  className={`photo-stack__fill${playing ? ' is-running' : ''}`}
                  style={{ animationDuration: `${INTERVAL}ms` }}
                />
              )}
            </span>
          ))}
        </span>
      </button>

      <p id="photo-stack-status" className="visually-hidden" aria-live={announce ? 'polite' : 'off'}>
        {position}: {labels.alts[photos[current].id]}
      </p>
    </div>
  );
}
