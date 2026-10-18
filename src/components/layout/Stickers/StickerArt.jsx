import { forwardRef } from 'react';
import { byName } from '../../../assets/images.js';
import measures from '../../../assets/stickers/stickers.json';

// Stickers (src/assets/stickers/), generados con `npm run images` desde design-originals/stickers: recortados a su
// contenido y con el borde blanco troquelado ya incluido. stickers.json trae el ancho, el alto y el fill (fracción
// no transparente) de cada uno.
export const stickerImg = byName(import.meta.glob('../../../assets/stickers/*.webp', { eager: true, import: 'default' }));
export const STICKER_IDS = Object.keys(stickerImg).sort();

// Si un sticker aún no tiene medidas (no se generó con el script), se trata como un cuadrado medio lleno
const FALLBACK = { w: 1, h: 1, fill: 0.65 };

// Medidas en pantalla de un sticker para que su parte visible (sin lo transparente) ocupe side² px: así todos tienen
// el mismo peso visual, sean macizos (pizza) o con huecos (yoshi). Mantiene su proporción; si su lado mayor pasa de
// max, se reduce entero hasta caber.
export function artSize(id, side, max = Infinity) {
  const m = measures[id] ?? FALLBACK;
  const k = side / Math.sqrt(m.w * m.h * m.fill);
  const fit = Math.min(1, max / (Math.max(m.w, m.h) * k));
  return { w: Math.round(m.w * k * fit), h: Math.round(m.h * k * fit) };
}

// Imagen de un sticker a su tamaño común, con la sombra y la textura de pegatina física (.sticker-art en Stickers.css;
// --src recorta la textura con la silueta de la imagen)
const StickerArt = forwardRef(function StickerArt({ id, side, max, className = '', style, ...rest }, ref) {
  const { w, h } = artSize(id, side, max);
  const src = stickerImg[id];
  return (
    <span ref={ref} className={`sticker-art ${className}`} style={{ width: w, height: h, '--src': `url("${src}")`, ...style }} {...rest}>
      <img src={src} alt="" draggable={false} decoding="async" />
    </span>
  );
});

export default StickerArt;
