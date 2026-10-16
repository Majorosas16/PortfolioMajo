import { useEffect, useRef } from 'react';
import P from '../../components/P.jsx';
import { byName } from '../../assets/images.js';
import Pill from '../../components/Pill.jsx';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { localizedSrc } from '../../i18n/images.js';
import Rich from '../../i18n/Rich.jsx';
import './About.css';

// Imágenes de esta sección (src/assets/sections/about/). Están debajo del inicio: se cargan al acercarse con el scroll (loading="lazy")
const img = byName(import.meta.glob('../../assets/sections/about/*', { eager: true, import: 'default' }));

// Frame 2 de Figma — "WEB" 1512 × 2888.
// La caja abierta y los objetos (parte superior del frame) ahora están en Intro.jsx;
// .about__canvas sube el resto TRIM px para no dejar ese espacio vacío.
const TRIM = 1040;

export default function About() {
  const sectionRef = useRef(null);
  const { lang, t } = useLanguage();
  const a = t.about;

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
    <section ref={sectionRef} id="about" className="section section--paper about" style={{ '--height': 2888 - TRIM }}>
      <div className="stage">
        <div className="about__canvas" style={{ '--trim': TRIM }}>
          {/* Presentación */}
          <div className="grp grp--presentation">
            <P x={197} y={1212} w={257} r={-6.44} className="about__sticker">
              <img loading="lazy" decoding="async" src={localizedSrc(img, 'sticker-about-me', lang)} alt={a.stickerAlt} />
            </P>
            <P x={394.4} y={1461.19} fs={85.35} r={-2.6} cx cy className="hand about__hello">
              <h2>{a.hello}</h2>
            </P>
            <P x={234.61} y={1484.35} w={328.68} className="about__majo">
              <img loading="lazy" decoding="async" src={img['majo-letters']} alt="MAJO" />
            </P>
            <P x={155.9} y={1596.16} w={384} fs={34.81} className="about__role">
              <p>
                <Rich text={a.role} />
              </p>
            </P>
            <P x={338.8} y={1710.7} r={-0.53} className="about__city">
              <Pill size="lg">{a.from}</Pill>
            </P>
          </div>

          <div className="grp grp--photo">
            <P x={756.16} y={1269} w={352.31} h={626} cx className="about__photo">
              <img loading="lazy" decoding="async" src={img['photo-majo']} alt={a.photoAlt} />
            </P>
            <P x={569} y={1356} w={107.28} className="about__note">
              <img loading="lazy" decoding="async" src={img['note-orange']} alt="" />
            </P>
            <P x={804} y={1651} w={256} h={455.11} className="about__dog">
              <img loading="lazy" decoding="async" src={img['dog']} alt={a.dogAlt} />
            </P>
          </div>

          <P x={967} y={1420} w={435} fs={32} className="about__bio">
            <p>
              <Rich text={a.bio} />
            </p>
          </P>

          {/* Mi enfoque */}
          <div className="grp grp--col">
            <P x={392} y={2006} w={67.82} className="about__reaction">
              <img loading="lazy" decoding="async" src={img['reaction-approach']} alt="" />
            </P>
            <P x={442.7} y={2138.68} fs={81.68} r={-0.97} cx cy className="hand about__subtitle">
              <h3>{a.approach.title}</h3>
            </P>
            <P x={445.5} y={2309} w={461} fs={32} cx cy className="about__text">
              <p>
                <Rich text={a.approach.text} />
              </p>
            </P>
            <P x={453} y={2438.4} w={446} h={127} r={-2.22} fs={32} cx className="selection selection--orange">
              <p>{a.approach.highlight}</p>
              <i className="c c--tl" />
              <i className="c c--tr" />
              <i className="c c--bl" />
              <i className="c c--br" />
            </P>
            <P x={579} y={2589} className="cursor-tag cursor-tag--orange">
              <img loading="lazy" decoding="async" src={img['cursor-orange']} alt="" />
              <span>{a.approach.cursor}</span>
            </P>
          </div>

          {/* Mi toolkit */}
          <div className="grp grp--col">
            <P x={1061} y={1996} w={69.01} className="about__reaction">
              <img loading="lazy" decoding="async" src={img['reaction-toolkit']} alt="" />
            </P>
            <P x={1094.57} y={2138.89} fs={81.68} r={-0.97} cx cy className="hand about__subtitle">
              <h3>{a.toolkit.title}</h3>
            </P>
            <P x={1102} y={2308.5} w={514} fs={32} cx cy className="about__text">
              <p>
                <Rich text={a.toolkit.text} />
              </p>
            </P>
            <P x={1103.76} y={2438.4} w={350.87} h={127} r={2.25} fs={32} cx className="selection selection--blue">
              <p>{a.toolkit.highlight}</p>
              <i className="c c--tl" />
              <i className="c c--tr" />
              <i className="c c--bl" />
              <i className="c c--br" />
            </P>
            <P x={1207} y={2589} className="cursor-tag cursor-tag--blue">
              <img loading="lazy" decoding="async" src={img['cursor-blue']} alt="" />
              <span>{a.toolkit.cursor}</span>
            </P>
          </div>
        </div>
      </div>
    </section>
  );
}
