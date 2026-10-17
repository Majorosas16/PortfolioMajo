import { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import Message from '../../components/ui/Message/Message.jsx';
import './ObjectMessage.css';

const clamp = (v, min, max) => Math.min(Math.max(v, min), Math.max(min, max));

// Mensaje del objeto seleccionado en el inicio (Figma 130:4479, instancias "Message" 170:111…170:272).
// Se coloca junto al objeto según anchor { ax, ay, side }: la esquina de la cola cae en (ax, ay) del objeto
// (fracciones de su ancho/alto). Si no cabe del lado preferido pasa al otro y se voltea; si no cabe a
// ningún lado va encima (o debajo) del objeto. Siempre queda dentro de la sección y de la pantalla.
// El contenedor está siempre montado y es una región viva: los lectores de pantalla anuncian cada mensaje.
// index: posición del objeto en .objects--box. place() (vía ref) lo recoloca, p. ej. mientras se arrastra.
const ObjectMessage = forwardRef(function ObjectMessage({ id, index, anchor, text, stageRef, sectionRef }, ref) {
  const boxRef = useRef(null);
  const [flip, setFlip] = useState(false);

  const place = useCallback(() => {
    const box = boxRef.current;
    const stage = stageRef.current;
    const section = sectionRef.current;
    if (!id || !box || !stage || !section || !anchor) return;
    const el = stage.querySelectorAll('.objects--box .obj')[index];
    if (!el) return;

    // Tamaño natural del mensaje (en 0,0 el ancho disponible no lo recorta)
    box.style.left = '0px';
    box.style.top = '0px';
    const bw = box.offsetWidth;
    const bh = box.offsetHeight;

    // Objeto en coordenadas del lienzo: incluye el arrastre (--dx/--dy) pero no la flotación
    const ox = el.offsetLeft;
    const oy = el.offsetTop;
    const ow = el.offsetWidth;
    const oh = el.offsetHeight;
    const label = el.querySelector('.obj__label');
    const labelBottom = oy + (label ? label.offsetTop + label.offsetHeight : oh);

    // Zona permitida: la sección, recortada al ancho de la pantalla y por debajo del encabezado fijo
    const st = stage.getBoundingClientRect();
    const sec = section.getBoundingClientRect();
    const margin = window.matchMedia('(max-width: 768px)').matches ? 16 : 24;
    const headerBottom = document.querySelector('.header')?.getBoundingClientRect().bottom ?? 0;
    const L = Math.max(sec.left, 0) + margin - st.left;
    const R = Math.min(sec.right, document.documentElement.clientWidth) - margin - st.left;
    const T = Math.max(sec.top, headerBottom) + margin / 2 - st.top;
    const B = sec.bottom - margin - st.top;

    const right = { x: ox + anchor.ax * ow, flip: false };
    const left = { x: ox + (1 - anchor.ax) * ow - bw, flip: true };
    const order = anchor.side === 'left' ? [left, right] : [right, left];
    const side = order.find((c) => c.x >= L && c.x + bw <= R);

    let x;
    let y;
    let flipped;
    if (side) {
      x = side.x;
      y = oy + anchor.ay * oh - bh;
      flipped = side.flip;
    } else {
      // No cabe al lado: centrado sobre el objeto, encima o, si no hay sitio, debajo de su etiqueta
      x = clamp(ox + ow / 2 - bw / 2, L, R - bw);
      y = oy - bh - 8;
      if (y < T) y = labelBottom + 8;
      // La cola queda del lado más cercano al objeto
      flipped = x + bw / 2 < ox + ow / 2;
    }

    box.style.left = `${clamp(x, L, R - bw)}px`;
    box.style.top = `${clamp(y, T, B - bh)}px`;
    setFlip(flipped);
  }, [id, index, anchor, stageRef, sectionRef]);

  useImperativeHandle(ref, () => ({ place }), [place]);

  // Al abrir, al cambiar de objeto o de idioma (otro texto) y al voltear (puede cambiar el alto)
  useLayoutEffect(() => {
    place();
  }, [place, text, flip]);

  useEffect(() => {
    if (!id) return undefined;
    // Después del reajuste de useDraggableObjects (que devuelve los objetos a su sitio al cambiar el ancho)
    const onResize = () => requestAnimationFrame(place);
    window.addEventListener('resize', onResize);
    document.fonts?.ready.then(place);
    return () => window.removeEventListener('resize', onResize);
  }, [id, place]);

  return (
    <div id="obj-msg" ref={boxRef} className="obj-msg" role="status" aria-live="polite" data-open={id ? 'true' : undefined}>
      {id && <Message key={id} variant="blue" k={0.86} flip={flip} text={text} emoji="🎯" />}
    </div>
  );
});

export default ObjectMessage;
