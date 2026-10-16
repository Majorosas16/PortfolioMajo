import P from '../components/P.jsx';
import { porNombre } from '../assets/imagenes.js';
import Message from '../components/Message.jsx';
import './Aporto.css';

// Imágenes de esta sección (src/assets/sections/lo-que-aporto/)
const img = porNombre(import.meta.glob('../assets/sections/lo-que-aporto/*', { eager: true, import: 'default' }));

// Fotos que salen de la carpeta (coordenadas relativas a la carpeta de 1082 × 787)
// Orden = orden de capas en Figma (la primera queda más atrás)
const fotos = [
  {
    src: 'proyecto-1.png', alt: 'Proyecto: pantalla de app',
    x: 545, y: 138, bw: 321.13, bh: 597.58, w: 194, h: 568, r: 13.49,
  },
  {
    src: 'proyecto-2.png', alt: 'Proyecto: collage',
    x: 475, y: 153, bw: 207.44, bh: 351.92, w: 193.72, h: 344.39, r: 2.31,
  },
  {
    src: 'proyecto-3.png', alt: 'Proyecto: interfaz en pantalla',
    x: 280, y: 138, bw: 253.04, bh: 283.15, w: 226.93, h: 261.01, r: -5.96, borde: 'suave',
    crop: { w: 145, h: 224.15, left: -16.29, top: -91.68 },
  },
  {
    src: 'proyecto-4.png', alt: 'Proyecto: pantallas oscuras',
    x: 204.83, y: 168.7, bw: 270.07, bh: 328.1, w: 208.74, h: 287.29, r: -13.51,
    crop: { w: 116.49, h: 150.75, left: 0, top: -50.76 },
  },
];

const tags = [
  { texto: 'Front-End', bg: 'tag-frontend.svg', w: 207.46, icono: 'tag-frontend-icono.svg', emoji: '📱' },
  { texto: 'UX / UI', bg: 'tag-uxui.svg', w: 164.57, icono: 'tag-uxui-icono.svg', emoji: '🧩' },
  { texto: 'Design Systems', bg: 'tag-ds.svg', w: 288.87, icono: 'tag-ds-icono.svg', emoji: '🎨' },
];

// Frame 3 de Figma — "WEB" 1512 × 1792 (fondo oscuro)
export default function Aporto() {
  return (
    <section id="lo-que-aporto" className="section section--oscura aporto" data-tema="oscuro" style={{ '--alto': 1792 }}>
      <div className="stage">
        <div className="grp grp--titulo">
          <P x={755.71} y={308.2} fs={109.02} r={2.73} cx cy className="hand aporto__lo-que">
            <span>Lo que</span>
          </P>
          <P x={415} y={357} w={683} className="aporto__titulo">
            <h2>
              <img src={img['titulo-aporto.png']} alt="Aporto" />
            </h2>
          </P>
        </div>

        <P x={756} y={542} w={1082} h={787} cx className="carpeta">
          <img className="carpeta__atras" src={img['carpeta-atras.png']} alt="" />
          {fotos.map((f) => (
            <div
              key={f.src}
              className="carpeta__foto"
              style={{ '--fx': f.x, '--fy': f.y, '--bw': f.bw, '--bh': f.bh, '--iw': f.w, '--ih': f.h, '--r': `${f.r}deg` }}
            >
              <div className={`carpeta__marco ${f.borde === 'suave' ? 'is-suave' : ''}`}>
                {f.crop ? (
                  <img
                    className="is-crop"
                    src={img[f.src]}
                    alt={f.alt}
                    style={{ width: `${f.crop.w}%`, height: `${f.crop.h}%`, left: `${f.crop.left}%`, top: `${f.crop.top}%` }}
                  />
                ) : (
                  <img src={img[f.src]} alt={f.alt} />
                )}
              </div>
            </div>
          ))}
          <div className="carpeta__frente" style={{ '--textura': `url(${img['carpeta-textura.png']})` }}>
            <span className="carpeta__tira carpeta__tira--1" />
            <span className="carpeta__tira carpeta__tira--2" />
          </div>
        </P>

        <P x={1009.3} y={1352} cx className="aporto__toca">
          <Message text="Toca las imagenes" emoji="👆🏽" />
        </P>

        <P x={756.5} y={1522} cx className="tags">
          {tags.map((t) => (
            <div key={t.texto} className="tag">
              <div className="tag__label" style={{ '--tw': t.w }}>
                <img src={img[t.bg]} alt="" />
                <span>{t.texto}</span>
              </div>
              <div className="tag__icono">
                <img src={img[t.icono]} alt="" />
                <span aria-hidden="true">{t.emoji}</span>
              </div>
            </div>
          ))}
        </P>
      </div>
    </section>
  );
}
