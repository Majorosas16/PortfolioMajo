import { useRef, useState } from 'react';
import P from '../../components/P.jsx';
import { byName } from '../../assets/images.js';
import Message from '../../components/Message.jsx';
import ObjectItem from '../../components/ObjectItem.jsx';
import { socials } from '../../components/socials.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { localizedSrc } from '../../i18n/images.js';
import Rich from '../../i18n/Rich.jsx';
import useDraggableObjects from '../../components/useDraggableObjects.js';
import ProjectsModal from './ProjectsModal.jsx';
import './Projects.css';

// Imágenes de esta sección (src/assets/sections/projects/). Están debajo del inicio: se cargan al acercarse con el scroll (loading="lazy")
const img = byName(import.meta.glob('../../assets/sections/projects/*', { eager: true, import: 'default' }));

// Objetos alrededor de la foto (coordenadas del frame 4 de Figma). Texto y alt en translations.js (projects.objects[id]).
// Cada objeto es una categoría de proyectos: se puede arrastrar por la sección y, al tocarlo, abre el modal con sus
// proyectos (ProjectsModal.jsx; qué proyectos van en cada una, en projects.js).
const objects = [
  {
    id: 'prism', src: 'prism',
    x: 138.15, y: 713.19, w: 154.55, h: 130.93, r: -3.29,
    label: { dx: 33.85, dy: 150.2 },
  },
  {
    id: 'compass', src: 'compass',
    x: 367.1, y: 809.1, w: 151.8, h: 144.9,
    label: { dx: -6.1, dy: 167.3 },
  },
  {
    id: 'shell', src: 'shell',
    x: 539.95, y: 895, w: 195.56, h: 147.29,
    label: { dx: 33.05, dy: 155.4 },
  },
  {
    id: 'chess', src: 'chess',
    x: 751.28, y: 847.4, w: 210.32, h: 210.32, r: -7.12,
    label: { dx: 48.72, dy: 203 },
  },
  {
    id: 'clip', src: 'clip',
    x: 1007.05, y: 809.1, w: 133.42, h: 158.83,
    label: { dx: -5.05, dy: 167.3 },
  },
  {
    id: 'coffee', src: 'coffee',
    x: 1169.96, y: 659.38, w: 277.74, h: 236.4, r: -6.64,
    label: { dx: 67.04, dy: 204 },
  },
];

// Frame 4 de Figma — "WEB" 1512 × 1937
export default function Projects() {
  const { lang, t } = useLanguage();
  const p = t.projects;
  const sectionRef = useRef(null);
  // Categoría abierta en el modal (id del objeto) y objeto que la abrió (recibe el foco al cerrar)
  const [open, setOpen] = useState(null);
  const opener = useRef(null);

  // Los objetos se agarran y se mueven por la sección (como los de la caja del inicio). El clic que sigue a un
  // arrastre no abre el modal (useDraggableObjects lo descarta).
  useDraggableObjects(sectionRef, true, undefined, '.objects--projects .obj');

  const openCategory = (id, e) => {
    opener.current = e.currentTarget;
    setOpen(id);
  };
  const closeModal = () => {
    setOpen(null);
    requestAnimationFrame(() => opener.current?.focus({ preventScroll: true }));
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="section section--paper projects"
      style={{
        '--height': 1937,
        // Círculos a mano que rodean la palabra marcada con [[…]] en translations.js (ver .circled en Projects.css)
        '--ring-blue': `url("${img['circle-blue']}")`,
        '--ring-orange': `url("${img['circle-orange']}")`,
      }}
    >
      <div className="stage">
        <div className="grp grp--box">
          <P x={283} y={199} w={945} className="projects__photo">
            <img loading="lazy" decoding="async" src={img['photo-projects']} alt={p.photoAlt} />
          </P>
          <P x={379.9} y={257.9} w={291} r={-8.26} className="projects__sticker">
            <h2>
              <img loading="lazy" decoding="async" src={localizedSrc(img, 'sticker-projects', lang)} alt={p.stickerAlt} />
            </h2>
          </P>
          <P x={676.4} y={214.4} w={195.73} r={37.55} className="projects__crown">
            <img loading="lazy" decoding="async" src={img['crown']} alt="" />
          </P>
          {/* Del tamaño de Figma (156:894, 254 de ancho) */}
          <P x={978.97} y={385} cx className="projects__tap">
            <Message text={p.tap} emoji="👆🏽" k={0.5} />
          </P>
          <div className="objects objects--projects">
            {objects.map((o) => (
              <ObjectItem
                key={o.id}
                {...o}
                src={img[o.src]}
                alt={p.objects[o.id].alt}
                label={{ ...o.label, text: p.objects[o.id].label }}
                tone="brown2"
                loading="lazy"
                onClick={(e) => openCategory(o.id, e)}
                selected={open === o.id}
                controls="projects-modal"
              />
            ))}
          </div>
        </div>

        {/* Contacto */}
        <span id="contact" className="anchor" style={{ '--y': 1250 }} />
        <div className="grp grp--closing">
          <P x={756} y={1345.5} w={426} fs={35.66} cx cy className="projects__end">
            <p>{p.end}</p>
          </P>
          <P x={755.58} y={1417} w={1053.17} fs={88.16} cx cy className="hand projects__cta">
            <h2>
              <Rich text={p.cta} />
            </h2>
          </P>
        </div>

        <div className="grp grp--contact">
          <P x={197} y={1549} w={317} fs={35} className="projects__invite">
            <p>
              <Rich text={p.invite} />
            </p>
          </P>

          <P x={1021} y={1555} w={373.84} className="contact">
            <a className="contact__email" href="mailto:multimedia.mr16@gmail.com">
              <img loading="lazy" decoding="async" src={img['icon-email']} alt="" />
              <span>multimedia.mr16@gmail.com</span>
            </a>
            <ul className="contact__socials">
              {socials.map((s) => (
                <li key={s.name}>
                  <a href={s.href} target="_blank" rel="noreferrer" aria-label={s.name} style={{ '--s': s.size }}>
                    <img loading="lazy" decoding="async" src={s.icon} alt="" />
                  </a>
                </li>
              ))}
            </ul>
          </P>

          <div className="grp grp--face">
            <P x={448} y={1504} w={618} h={433} className="projects__face">
              <img loading="lazy" decoding="async" src={img['photo-contact']} alt={p.faceAlt} />
            </P>
            <P x={743.21} y={1730} w={100.04} className="projects__note">
              <img loading="lazy" decoding="async" src={img['note-green']} alt="" />
            </P>
          </div>
        </div>
      </div>

      {open && <ProjectsModal category={open} onCategoryChange={setOpen} onClose={closeModal} />}
    </section>
  );
}
