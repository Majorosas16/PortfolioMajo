import P from '../../components/P.jsx';
import { byName } from '../../assets/images.js';
import Message from '../../components/Message.jsx';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { localizedSrc } from '../../i18n/images.js';
import './WhatIBring.css';

// Imágenes de esta sección (src/assets/sections/what-i-bring/). Están debajo del inicio: se cargan al acercarse con el scroll (loading="lazy")
const img = byName(import.meta.glob('../../assets/sections/what-i-bring/*', { eager: true, import: 'default' }));

// Fotos que salen de la carpeta (coordenadas relativas a la carpeta de 1082 × 787)
// Orden = orden de capas en Figma (la primera queda más atrás). El alt de cada foto está en translations.js (whatIBring.photos).
const photos = [
  {
    src: 'project-1',
    x: 545, y: 138, bw: 321.13, bh: 597.58, w: 194, h: 568, r: 13.49,
  },
  {
    src: 'project-2',
    x: 475, y: 153, bw: 207.44, bh: 351.92, w: 193.72, h: 344.39, r: 2.31,
  },
  {
    src: 'project-3',
    x: 280, y: 138, bw: 253.04, bh: 283.15, w: 226.93, h: 261.01, r: -5.96, border: 'soft',
    crop: { w: 145, h: 224.15, left: -16.29, top: -91.68 },
  },
  {
    src: 'project-4',
    x: 204.83, y: 168.7, bw: 270.07, bh: 328.1, w: 208.74, h: 287.29, r: -13.51,
    crop: { w: 116.49, h: 150.75, left: 0, top: -50.76 },
  },
];

// El texto y el ancho de cada etiqueta están en translations.js (whatIBring.tags[id])
const tags = [
  { id: 'frontend', bg: 'tag-frontend', icon: 'tag-frontend-icon', emoji: '📱' },
  { id: 'uxui', bg: 'tag-uxui', icon: 'tag-uxui-icon', emoji: '🧩' },
  { id: 'ds', bg: 'tag-ds', icon: 'tag-ds-icon', emoji: '🎨' },
];

// Frame 3 de Figma — "WEB" 1512 × 1792 (fondo oscuro)
export default function WhatIBring() {
  const { lang, t } = useLanguage();
  const photoAlt = (src) => t.whatIBring.photos[src];
  return (
    <section id="what-i-bring" className="section section--dark what-i-bring" data-theme="dark" style={{ '--height': 1792 }}>
      <div className="stage">
        <div className="grp grp--title">
          <P x={755.71} y={308.2} fs={109.02} r={2.73} cx cy className="hand what-i-bring__lead">
            <span>{t.whatIBring.lead}</span>
          </P>
          <P x={415} y={357} w={683} className="what-i-bring__title">
            <h2>
              <img loading="lazy" decoding="async" src={localizedSrc(img, 'title-what-i-bring', lang)} alt={t.whatIBring.titleAlt} />
            </h2>
          </P>
        </div>

        <P x={756} y={542} w={1082} h={787} cx className="folder">
          <img loading="lazy" decoding="async" className="folder__back" src={img['folder-back']} alt="" />
          {photos.map((f) => (
            <div
              key={f.src}
              className="folder__photo"
              style={{ '--fx': f.x, '--fy': f.y, '--bw': f.bw, '--bh': f.bh, '--iw': f.w, '--ih': f.h, '--r': `${f.r}deg` }}
            >
              <div className={`folder__frame ${f.border === 'soft' ? 'is-soft' : ''}`}>
                {f.crop ? (
                  <img loading="lazy" decoding="async"
                    className="is-crop"
                    src={img[f.src]}
                    alt={photoAlt(f.src)}
                    style={{ width: `${f.crop.w}%`, height: `${f.crop.h}%`, left: `${f.crop.left}%`, top: `${f.crop.top}%` }}
                  />
                ) : (
                  <img loading="lazy" decoding="async" src={img[f.src]} alt={photoAlt(f.src)} />
                )}
              </div>
            </div>
          ))}
          <div className="folder__front" style={{ '--texture': `url("${img['folder-texture']}")` }}>
            <span className="folder__strip folder__strip--1" />
            <span className="folder__strip folder__strip--2" />
          </div>
        </P>

        <P x={1009.3} y={1352} cx className="what-i-bring__tap">
          <Message text={t.whatIBring.tap} emoji="👆🏽" />
        </P>

        <P x={756.5} y={1522} cx className="tags">
          {tags.map((tag) => (
            <div key={tag.id} className="tag">
              <div className="tag__label" style={{ '--tw': t.whatIBring.tags[tag.id].w }}>
                <img loading="lazy" decoding="async" src={img[tag.bg]} alt="" />
                <span>{t.whatIBring.tags[tag.id].text}</span>
              </div>
              <div className="tag__icon">
                <img loading="lazy" decoding="async" src={img[tag.icon]} alt="" />
                <span aria-hidden="true">{tag.emoji}</span>
              </div>
            </div>
          ))}
        </P>
      </div>
    </section>
  );
}
