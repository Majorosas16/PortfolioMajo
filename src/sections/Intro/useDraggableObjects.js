import { useEffect } from 'react';

// Distancia mínima (px) para que el gesto cuente como arrastre y no como clic
const THRESHOLD = 6;

// Caja que ocupa el objeto en pantalla, incluida su etiqueta (que queda fuera del <figure>)
const boundsOf = (el) => {
  const r = el.getBoundingClientRect();
  const label = el.querySelector('.obj__label');
  if (!label) return r;
  const l = label.getBoundingClientRect();
  return {
    left: Math.min(r.left, l.left),
    top: Math.min(r.top, l.top),
    right: Math.max(r.right, l.right),
    bottom: Math.max(r.bottom, l.bottom),
  };
};

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

// Permite agarrar y mover los objetos de la caja (mouse y pantalla táctil) dentro de la sección.
// El desplazamiento se guarda en --dx / --dy (ver Intro.css). Solo se encarga del arrastre:
// el clic de cada objeto sigue siendo cosa de ObjectItem (onClick). Si hubo arrastre,
// se descarta el clic que el navegador dispara al soltar.
export default function useDraggableObjects(sectionRef, enabled) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!enabled || !section) return undefined;

    let drag = null;
    let topZ = 3;

    const onPointerDown = (e) => {
      if (e.button !== 0 || drag) return;
      const el = e.target.closest('.objects--box .obj');
      if (!el) return;
      const sec = section.getBoundingClientRect();
      const box = boundsOf(el);
      drag = {
        el,
        id: e.pointerId,
        x: e.clientX,
        y: e.clientY,
        dx: parseFloat(el.style.getPropertyValue('--dx')) || 0,
        dy: parseFloat(el.style.getPropertyValue('--dy')) || 0,
        // Cuánto se puede mover hacia cada lado sin salir de la sección
        minX: sec.left - box.left,
        maxX: sec.right - box.right,
        minY: sec.top - box.top,
        maxY: sec.bottom - box.bottom,
        moved: false,
      };
      // Captura el puntero para seguir recibiendo el movimiento aunque salga del objeto
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        // Puntero ya liberado: el arrastre sigue funcionando mientras se mueva sobre la sección
      }
    };

    const onPointerMove = (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const mx = e.clientX - drag.x;
      const my = e.clientY - drag.y;
      if (!drag.moved) {
        if (Math.hypot(mx, my) < THRESHOLD) return;
        drag.moved = true;
        drag.el.classList.add('is-dragging');
        drag.el.style.zIndex = String(++topZ);
      }
      e.preventDefault();
      drag.el.style.setProperty('--dx', `${drag.dx + clamp(mx, drag.minX, drag.maxX)}px`);
      drag.el.style.setProperty('--dy', `${drag.dy + clamp(my, drag.minY, drag.maxY)}px`);
    };

    // Descarta el clic que llega justo después de soltar un objeto arrastrado
    const swallowClick = (e) => {
      e.stopPropagation();
      e.preventDefault();
    };

    const onPointerEnd = (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const { el, moved } = drag;
      drag = null;
      el.classList.remove('is-dragging');
      if (!moved) return;
      window.addEventListener('click', swallowClick, { capture: true, once: true });
      // Si el navegador no dispara clic (p. ej. al soltar fuera del objeto), se quita el filtro
      setTimeout(() => window.removeEventListener('click', swallowClick, { capture: true }), 100);
    };

    // La posición de los objetos cambia con el ancho de la pantalla: al redimensionar vuelven a su sitio
    let width = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth === width) return;
      width = window.innerWidth;
      section.querySelectorAll('.objects--box .obj').forEach((el) => {
        el.style.removeProperty('--dx');
        el.style.removeProperty('--dy');
      });
    };

    section.addEventListener('pointerdown', onPointerDown);
    section.addEventListener('pointermove', onPointerMove);
    section.addEventListener('pointerup', onPointerEnd);
    section.addEventListener('pointercancel', onPointerEnd);
    window.addEventListener('resize', onResize);
    return () => {
      section.removeEventListener('pointerdown', onPointerDown);
      section.removeEventListener('pointermove', onPointerMove);
      section.removeEventListener('pointerup', onPointerEnd);
      section.removeEventListener('pointercancel', onPointerEnd);
      window.removeEventListener('resize', onResize);
    };
  }, [sectionRef, enabled]);
}
