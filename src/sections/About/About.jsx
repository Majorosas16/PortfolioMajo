import { useEffect, useRef, useState } from 'react';
import Message from '../../components/ui/Message/Message.jsx';
import P from '../../components/ui/P/P.jsx';
import useDraggableObjects from '../../components/hooks/useDraggableObjects.js';
import { byName } from '../../assets/images.js';
import Pill from '../../components/ui/Pill/Pill.jsx';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { localizedSrc } from '../../i18n/images.js';
import Rich from '../../i18n/Rich.jsx';
import PhotoStack from './PhotoStack.jsx';
import './About.css';

// Imágenes de esta sección (src/assets/sections/about/). Están debajo del inicio: se cargan al acercarse con el scroll (loading="lazy")
const img = byName(import.meta.glob('../../assets/sections/about/*', { eager: true, import: 'default' }));

// Fotos del carrusel, en el orden en que pasan al frente. Cada una existe en 2 anchos (<nombre>-<ancho>.webp, generadas
// con `npm run images` desde design-originals/sections/about/Photos Majo/) y el navegador elige con srcset.
const PHOTO_ORDER = ['photo-majo', 'img-2467', 'img-1704', 'img-1112', 'img-4897', 'img-8454', 'img-6987'];
const photoFiles = Object.entries(byName(import.meta.glob('../../assets/sections/about/photos/*.webp', { eager: true, import: 'default' })));
const PHOTOS = PHOTO_ORDER.map((id) => {
  const versions = photoFiles
    .filter(([name]) => name.replace(/-\d+$/, '') === id)
    .map(([name, url]) => ({ w: Number(name.match(/-(\d+)$/)[1]), url }))
    .sort((a, b) => a.w - b.w);
  return { id, src: versions[0].url, srcSet: versions.map((v) => `${v.url} ${v.w}w`).join(', ') };
});
// Ancho con el que se ve la foto: 352.31 px del diseño en escritorio; en celular, el 78 % de la columna (máx. 330 px)
const PHOTO_SIZES = '(max-width: 768px) min(calc((100vw - 40px) * 0.78), 330px), calc(min(100vw, 1512px) * 352.31 / 1512)';

// Frame 2 de Figma — "WEB" 1512 × 2888.
// La caja abierta y los objetos (parte superior del frame) ahora están en Intro.jsx;
// .about__canvas sube el resto TRIM px para no dejar ese espacio vacío.
const TRIM = 1040;

// Ajustes sobre las coordenadas de Figma:
// - Columnas: el texto de la izquierda termina y la bio empieza a la misma distancia de la foto (95).
// - LEFT_DY centra en la foto (y = 1582) el texto de la izquierda («Hola! soy» → «de Cali», el
//   sticker se mueve con él pero no cuenta para el centrado); la bio se centra en PHOTO_CY.
// - GRAD_Y: texto de la graduación, centrado bajo las fotos.
// - COLS_DY baja «Mi enfoque» / «Mi toolkit» para dejar aire tras las fotos y el texto de la graduación.
const LEFT_DY = -6;
// Centro vertical de la foto: la bio se centra en él (cy), así queda alineada en cualquier idioma
const PHOTO_CY = 1582;
const GRAD_Y = 2075;
const COLS_DY = 312;
// «Mi enfoque» / «Mi toolkit»: los textos empiezan a la misma altura bajo su subtítulo (TEXT_Y, borde superior);
// los dos textos miden lo mismo, así que los recuadros y sus cursores suben BOX_DY para quedar a 26 de ellos.
const TEXT_Y = 2214;
const BOX_DY = -18;
// Centro de cada columna, simétricos respecto al centro de la sección (756): icono, subtítulo, texto y recuadro
// se centran en él; cada cursor conserva su posición respecto a su recuadro.
const APPROACH_X = 428;
const TOOLKIT_X = 1084;
const COL_TEXT_W = 500;

// Tiempo que se ve el mensaje del sticker o del perrito al tocarlos
const BUBBLE_MS = 2600;
// Duración del desvanecimiento al ocultarse (About.css: .about__bubble .msg)
const BUBBLE_FADE_MS = 350;

// Marco de selección «estilo Figma» de los recuadros de Mi enfoque / Mi toolkit: trazo SVG (se dibuja al
// aparecer, ver About.css) y las 4 esquinas.
function SelectionFrame() {
  return (
    <>
      <svg className="selection__stroke" aria-hidden="true">
        <rect width="100%" height="100%" pathLength="1" />
      </svg>
      <i className="c c--tl" />
      <i className="c c--tr" />
      <i className="c c--br" />
      <i className="c c--bl" />
    </>
  );
}

export default function About() {
  const sectionRef = useRef(null);
  // Las etiquetas de cursor («al final…» / «y así…») se pueden arrastrar, como los objetos del inicio
  useDraggableObjects(sectionRef, true, undefined, '.cursor-tag');
  const { lang, t } = useLanguage();
  const a = t.about;

  // Mensaje del sticker o del perrito (Figma 178:624 / 178:605): aparece al tocarlos y se desvanece solo.
  // pop: entra con animación solo si estaba oculto; si se toca mientras se ve o se desvanece, solo se
  // reinicia el temporizador y recupera la opacidad (sin parpadeo).
  const [bubble, setBubble] = useState({ id: null, pop: false, hidden: null, hiddenAt: 0 });
  const bubbleTimer = useRef(null);
  const showBubble = (id) => {
    setBubble((b) => {
      const visible = b.id === id || (b.hidden === id && performance.now() - b.hiddenAt < BUBBLE_FADE_MS);
      return { id, pop: visible ? b.pop && b.id === id : true, hidden: null, hiddenAt: 0 };
    });
    clearTimeout(bubbleTimer.current);
    bubbleTimer.current = setTimeout(
      () => setBubble((b) => ({ id: null, pop: false, hidden: b.id, hiddenAt: performance.now() })),
      BUBBLE_MS
    );
  };
  useEffect(() => () => clearTimeout(bubbleTimer.current), []);
  const bubbleFor = (id, variant, emoji, text) => (
    <div
      className={`about__bubble about__bubble--${id}${bubble.id === id ? ' is-on' : ''}${bubble.id === id && bubble.pop ? ' is-pop' : ''}`}
      aria-hidden="true"
    >
      <Message variant={variant} emoji={emoji} text={text} className="msg--small" />
    </div>
  );

  // Cada elemento aparece (opacidad 0 → 1) al entrar en pantalla. Lo que ya está visible al cargar
  // se marca en el primer aviso del observador, así nunca queda transparente.
  useEffect(() => {
    const section = sectionRef.current;
    const elements = section.querySelectorAll('.abs');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' }
    );
    elements.forEach((el) => io.observe(el));
    section.classList.add('reveal-ready');
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="section section--paper about" style={{ '--height': 2888 - TRIM + COLS_DY }}>
      <div className="stage">
        <div className="about__canvas" style={{ '--trim': TRIM, '--extra': COLS_DY }}>
          {/* Presentación */}
          <div className="grp grp--presentation">
            <P x={140} y={1212 + LEFT_DY} w={257} r={-6.44} className="about__sticker">
              <button type="button" className="about__tap" onClick={(e) => { e.stopPropagation(); showBubble('sticker'); }}>
                <img loading="lazy" decoding="async" src={localizedSrc(img, 'sticker-about-me', lang)} alt={a.stickerAlt} />
              </button>
              {bubbleFor('sticker', 'green', '🥭', a.stickerMsg)}
            </P>
            <P x={337.4} y={1461.19 + LEFT_DY} fs={85.35} r={-2.6} cx cy className="hand about__hello">
              <h2>{a.hello}</h2>
            </P>
            <P x={177.61} y={1484.35 + LEFT_DY} w={328.68} className="about__majo">
              <img loading="lazy" decoding="async" src={img['majo-letters']} alt="MAJO" />
            </P>
            <P x={98.9} y={1596.16 + LEFT_DY} w={384} fs={34.81} className="about__role">
              <p>
                <Rich text={a.role} />
                <small className="about__role-note">{a.roleNote}</small>
              </p>
            </P>
            <P x={281.8} y={1712 + LEFT_DY} r={-0.53} className="about__city">
              <Pill size="lg">{a.from}</Pill>
            </P>
          </div>

          <div className="grp grp--photo">
            <P x={756.16} y={1269} w={352.31} h={626} cx className="about__photo">
              <PhotoStack photos={PHOTOS} labels={a.photos} sizes={PHOTO_SIZES} />
            </P>
            <P x={518} y={1341} w={208} className="about__note">
              <img loading="lazy" decoding="async" src={img['note-orange']} alt="" />
            </P>
            <P x={804} y={1651} w={256} h={455.11} className="about__dog">
              <button type="button" className="about__tap" onClick={(e) => { e.stopPropagation(); showBubble('dog'); }}>
                <img loading="lazy" decoding="async" src={img['dog']} alt={a.dogAlt} />
              </button>
              {bubbleFor('dog', 'light', '🐕', a.dogMsg)}
            </P>
          </div>

          <P x={1027} y={PHOTO_CY} w={400} fs={32} cy className="about__bio">
            <p>
              <Rich text={a.bio} />
            </p>
          </P>

          <P x={756} y={GRAD_Y} w={900} fs={30} cx className="about__grad">
            <p>
              <Rich text={a.graduation} />
            </p>
          </P>

          {/* Mi enfoque */}
          <div className="grp grp--col">
            <P x={APPROACH_X - 67.82 / 2} y={2006 + COLS_DY} w={67.82} className="about__reaction">
              <img loading="lazy" decoding="async" src={img['reaction-approach']} alt="" />
            </P>
            <P x={APPROACH_X} y={2138.68 + COLS_DY} fs={81.68} r={-0.97} cx cy className="hand about__subtitle">
              <h3>{a.approach.title}</h3>
            </P>
            <P x={APPROACH_X} y={TEXT_Y + COLS_DY} w={COL_TEXT_W} fs={29} cx className="about__text">
              <p>
                <Rich text={a.approach.text} />
              </p>
            </P>
            <P x={APPROACH_X} y={2438.4 + COLS_DY + BOX_DY} w={446} h={127} r={-2.22} fs={32} cx className="selection selection--orange">
              <p>{a.approach.highlight}</p>
              <SelectionFrame />
            </P>
            <P x={APPROACH_X + 126} y={2589 + COLS_DY + BOX_DY} className="cursor-tag cursor-tag--orange">
              <img loading="lazy" decoding="async" src={img['cursor-orange']} alt="" />
              <span>{a.approach.cursor}</span>
            </P>
          </div>

          {/* Lectores de pantalla: anuncia el mensaje del sticker o del perrito */}
          <p className="visually-hidden" role="status">
            {bubble.id === 'sticker' ? a.stickerMsg : bubble.id === 'dog' ? a.dogMsg : ''}
          </p>

          {/* Mi toolkit */}
          <div className="grp grp--col">
            <P x={TOOLKIT_X - 69.01 / 2} y={1996 + COLS_DY} w={69.01} className="about__reaction">
              <img loading="lazy" decoding="async" src={img['reaction-toolkit']} alt="" />
            </P>
            <P x={TOOLKIT_X} y={2138.89 + COLS_DY} fs={81.68} r={-0.97} cx cy className="hand about__subtitle">
              <h3>{a.toolkit.title}</h3>
            </P>
            <P x={TOOLKIT_X} y={TEXT_Y + COLS_DY} w={COL_TEXT_W} fs={29} cx className="about__text">
              <p>
                <Rich text={a.toolkit.text} />
              </p>
            </P>
            <P x={TOOLKIT_X} y={2438.4 + COLS_DY + BOX_DY} w={470} h={150} r={2.25} fs={32} cx className="selection selection--blue">
              <p>{a.toolkit.highlight}</p>
              <SelectionFrame />
            </P>
            <P x={TOOLKIT_X + 163} y={2589 + 23 + COLS_DY + BOX_DY} className="cursor-tag cursor-tag--blue">
              <img loading="lazy" decoding="async" src={img['cursor-blue']} alt="" />
              <span>{a.toolkit.cursor}</span>
            </P>
          </div>
        </div>
      </div>
    </section>
  );
}
