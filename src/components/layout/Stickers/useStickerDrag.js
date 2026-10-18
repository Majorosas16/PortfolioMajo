import { useEffect, useRef } from 'react';

// Distancia mínima (px) para que el gesto cuente como arrastre y no como toque (igual que useDraggableObjects)
const THRESHOLD = 6;

// Arrastre de los stickers (mouse, lápiz y pantalla táctil). Mismo patrón que useDraggableObjects: el gesto solo
// cuenta como arrastre al pasar THRESHOLD, el elemento captura el puntero y, si hubo arrastre, se descarta el clic
// que el navegador dispara al soltar (así un arrastre nunca coloca ni selecciona un sticker por accidente).
// Devuelve start(e, target): se llama en onPointerDown. target es lo que se arrastra ({ uid } de un sticker
// colocado o { id } de uno del panel) y se pasa tal cual a los avisos:
//   onMove(target, clientX, clientY, startX, startY) en cada movimiento del arrastre
//   onEnd(target, moved) al soltar o cancelar
export default function useStickerDrag({ onMove, onEnd }) {
  const handlers = useRef({ onMove, onEnd });
  handlers.current = { onMove, onEnd };
  const active = useRef(null);

  useEffect(() => () => active.current?.(), []);

  return (e, target) => {
    if (e.button !== 0 || active.current) return;
    const el = e.currentTarget;
    const id = e.pointerId;
    const startX = e.clientX;
    const startY = e.clientY;
    let moved = false;
    try {
      el.setPointerCapture(id);
    } catch {
      // Puntero ya liberado: los avisos de window siguen llegando mientras se mueva
    }

    const swallowClick = (ev) => {
      ev.stopPropagation();
      ev.preventDefault();
    };

    const onPointerMove = (ev) => {
      if (ev.pointerId !== id) return;
      if (!moved) {
        if (Math.hypot(ev.clientX - startX, ev.clientY - startY) < THRESHOLD) return;
        moved = true;
      }
      ev.preventDefault();
      handlers.current.onMove(target, ev.clientX, ev.clientY, startX, startY);
    };

    const cleanup = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerEnd);
      window.removeEventListener('pointercancel', onPointerEnd);
      active.current = null;
    };

    function onPointerEnd(ev) {
      if (ev.pointerId !== id) return;
      cleanup();
      if (moved) {
        window.addEventListener('click', swallowClick, { capture: true, once: true });
        // Si el navegador no dispara clic (p. ej. al soltar fuera del elemento), se quita el filtro
        setTimeout(() => window.removeEventListener('click', swallowClick, { capture: true }), 100);
      }
      handlers.current.onEnd(target, moved);
    }

    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerEnd);
    window.addEventListener('pointercancel', onPointerEnd);
    active.current = cleanup;
  };
}
