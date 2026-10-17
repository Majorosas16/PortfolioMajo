import { useEffect, useRef, useState } from 'react';
import P from '../../components/ui/P/P.jsx';
import { byName } from '../../assets/images.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { localizedSrc } from '../../i18n/images.js';
import Folder from './Folder.jsx';
import './WhatIBring.css';
import './Folder.css';

// Imágenes de esta sección (src/assets/sections/what-i-bring/). Están debajo del inicio: se cargan al acercarse con el scroll (loading="lazy")
const img = byName(import.meta.glob('../../assets/sections/what-i-bring/*', { eager: true, import: 'default' }));

// El texto y el ancho de cada etiqueta están en translations.js (whatIBring.tags[id])
const tags = [
  { id: 'frontend', bg: 'tag-frontend', icon: 'tag-frontend-icon', emoji: '📱' },
  { id: 'uxui', bg: 'tag-uxui', icon: 'tag-uxui-icon', emoji: '🧩' },
  { id: 'ds', bg: 'tag-ds', icon: 'tag-ds-icon', emoji: '🎨' },
];

// Desplazamiento vertical (px de Figma) de la carpeta y de todo lo que va debajo, respecto al frame de Figma.
// Cerrada la carpeta queda cerca del título (con la invitación encima); al abrirla todo baja un poco para dar sitio
// a las fotos. El cambio se anima en WhatIBring.css.
// Abierta deja sitio para la foto elevada y su detalle sin tapar el título.
const DY = { closed: -330, open: -185 };

// Etiquetas de habilidades (web): a la misma distancia (TAGS_GAP) del borde inferior de la carpeta (y 542 + 759) y
// del final de la sección. Alto de cada grupo: 102.42 × 0.8 (WhatIBring.css las reduce al 80 %).
const FOLDER_BOTTOM = 542 + 759;
const TAGS_GAP = 165;
const TAGS_H = 102.42 * 0.8;

// Frame 3 de Figma — "WEB" 1512 × 1792 (fondo oscuro)
export default function WhatIBring() {
  const { lang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const dy = open ? DY.open : DY.closed;

  // Las etiquetas entran (una tras otra, rasgándose) cuando llegan a la pantalla
  const tagsRef = useRef(null);
  const [tagsIn, setTagsIn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      setTagsIn(true);
      io.disconnect();
    }, { threshold: 0.4 });
    io.observe(tagsRef.current);
    return () => io.disconnect();
  }, []);
  return (
    <section
      id="what-i-bring"
      className="section section--dark what-i-bring"
      data-theme="dark"
      style={{ '--height': FOLDER_BOTTOM + TAGS_GAP + TAGS_H + TAGS_GAP + dy }}
    >
      <div className="stage">
        <div className="grp grp--title">
          {/* Título más pequeño que en Figma (×0.73) y más cerca del header */}
          <P x={755.71} y={215} fs={80} r={2.73} cx cy className="hand what-i-bring__lead">
            <span>{t.whatIBring.lead}</span>
          </P>
          <P x={506.5} y={247} w={500} className="what-i-bring__title">
            <h2>
              <img loading="lazy" decoding="async" src={localizedSrc(img, 'title-what-i-bring', lang)} alt={t.whatIBring.titleAlt} />
            </h2>
          </P>
        </div>

        <P x={756} y={542 + dy} w={1082} h={787} cx className="folder">
          <Folder img={img} open={open} onOpen={() => setOpen(true)} />
        </P>

        {/* Aparece cuando ya salieron las cuatro fotos (la invitación a abrir la carpeta está en Folder.jsx) */}
        <P
          ref={tagsRef}
          x={756.5}
          y={FOLDER_BOTTOM + TAGS_GAP + dy}
          cx
          className={`tags${tagsIn ? ' is-in' : ''}`}
        >
          {tags.map((tag, i) => (
            <div key={tag.id} className="tag" style={{ '--i': i }}>
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
