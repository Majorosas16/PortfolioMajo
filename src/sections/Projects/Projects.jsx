import { useEffect, useRef, useState } from 'react';
import P from '../../components/ui/P/P.jsx';
import { byName } from '../../assets/images.js';
import Message from '../../components/ui/Message/Message.jsx';
import ObjectItem from '../../components/ui/ObjectItem/ObjectItem.jsx';
import { socials } from '../../components/utils/socials.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { localizedSrc } from '../../i18n/images.js';
import Rich from '../../i18n/Rich.jsx';
import useDraggableObjects from '../../components/hooks/useDraggableObjects.js';
import ProjectsModal from './ProjectsModal.jsx';
import './Projects.css';

// Imágenes de esta sección (src/assets/sections/projects/). Están debajo del inicio: se cargan al acercarse con el scroll (loading="lazy")
const img = byName(import.meta.glob('../../assets/sections/projects/*', { eager: true, import: 'default' }));

// Objetos alrededor de la foto (coordenadas del frame 4 de Figma). Texto y alt en translations.js (projects.objects[id]).
// Cada objeto es una categoría de proyectos: se puede arrastrar por la sección y, al tocarlo, abre el modal con sus
// proyectos (ProjectsModal.jsx; qué proyectos van en cada una, en projects.js).
// La etiqueta va centrada bajo su objeto, así sigue alineada en los dos idiomas (en inglés algunas son más largas).
const objects = [
  {
    id: 'prism', src: 'prism',
    x: 138.15, y: 713.19, w: 154.55, h: 130.93, r: -3.29,
    label: { center: true, dy: 150.2 },
  },
  {
    id: 'compass', src: 'compass',
    x: 367.1, y: 809.1, w: 151.8, h: 144.9,
    // Centrada bajo la esfera de la brújula (la argolla de arriba a la derecha alarga la imagen hacia ese lado)
    label: { center: true, cx: 65.6, dy: 167.3 },
  },
  {
    id: 'shell', src: 'shell',
    x: 539.95, y: 895, w: 195.56, h: 147.29,
    label: { center: true, dy: 155.4 },
  },
  {
    id: 'chess', src: 'chess',
    x: 751.28, y: 847.4, w: 210.32, h: 210.32, r: -7.12,
    // Centrada bajo la base del peón (con el giro, la base queda a la derecha del centro de la imagen) y más cerca de ella
    label: { center: true, cx: 113, dy: 192 },
  },
  {
    id: 'clip', src: 'clip',
    x: 1007.05, y: 809.1, w: 133.42, h: 158.83,
    label: { center: true, dy: 167.3 },
  },
  {
    id: 'coffee', src: 'coffee',
    x: 1169.96, y: 659.38, w: 277.74, h: 236.4, r: -6.64,
    label: { center: true, dy: 204 },
  },
];

// Taza de café (índice en objects) y punto de la cara en la foto (fracción de su ancho/alto; boca ≈ 750, 400 en
// Figma) con el radio de «cerca» (fracción del ancho de la foto). El mensaje se ve COFFEE_MS.
const COFFEE = 5;
const FACE = { x: 0.49, y: 0.23, r: 0.16 };
const COFFEE_MS = 3500;

// Aire extra (px de Figma) antes del cierre «¡Esto no termina aquí!» y el contacto: todo lo que va debajo baja lo mismo
const CLOSE_DY = 110;

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
  // Taza de café hasta la cara (como si la estuviera tomando): aparece el mensaje azul de Figma (190:2801) unos
  // segundos. Solo vuelve a salir si la taza se aleja y se acerca otra vez.
  const [coffeeMsg, setCoffeeMsg] = useState(false);
  const coffeeNear = useRef(false);
  const coffeeTimer = useRef(null);
  useEffect(() => () => clearTimeout(coffeeTimer.current), []);
  const onDrag = (el) => {
    if (el !== sectionRef.current.querySelectorAll('.objects--projects .obj')[COFFEE]) return;
    const photo = sectionRef.current.querySelector('.projects__photo').getBoundingClientRect();
    const cup = el.querySelector('.obj__media').getBoundingClientRect();
    const dx = cup.left + cup.width / 2 - (photo.left + photo.width * FACE.x);
    const dy = cup.top + cup.height / 2 - (photo.top + photo.height * FACE.y);
    const d = Math.hypot(dx, dy);
    const r = photo.width * FACE.r;
    if (!coffeeNear.current && d < r) {
      coffeeNear.current = true;
      setCoffeeMsg(true);
      clearTimeout(coffeeTimer.current);
      coffeeTimer.current = setTimeout(() => setCoffeeMsg(false), COFFEE_MS);
    } else if (coffeeNear.current && d > r * 1.5) {
      coffeeNear.current = false;
    }
  };

  useDraggableObjects(sectionRef, true, onDrag, '.objects--projects .obj');

  // Al aparecer la sección (una sola vez): la foto aparece con un fundido, el sticker «Proyectos» se pega, llega la
  // corona y al final la burbuja «Toca y mueve los objetos»
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      setSeen(true);
      io.disconnect();
    }, { threshold: 0.3 });
    // La carpeta del modal (binder.webp, a resolución completa) se descarga y se decodifica cuando la sección se
    // acerca a la pantalla, no al abrir el modal: así aparece al instante, sin bajar su calidad
    const preload = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      const im = new Image();
      im.src = img.binder;
      im.decode?.().catch(() => {});
      preload.disconnect();
    }, { rootMargin: '600px 0px' });
    preload.observe(sectionRef.current);
    io.observe(sectionRef.current.querySelector('.projects__sticker'));
    return () => {
      io.disconnect();
      preload.disconnect();
    };
  }, []);

  // Cierre y contacto: al llegar a «¿Creamos algo increíble?» se dibuja su círculo (is-cta); al llegar a «Me encantaría…»
  // se dibuja el suyo, la foto sube desde abajo y se pega el post-it (is-contact). Una sola vez cada uno.
  const [reveal, setReveal] = useState({});
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          setReveal((r) => ({ ...r, [e.target.dataset.reveal]: true }));
          io.unobserve(e.target);
        });
      },
      { threshold: 0.6 }
    );
    sectionRef.current.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

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
      className={`section section--paper projects${seen ? ' is-seen' : ''}${reveal.cta ? ' is-cta' : ''}${reveal.contact ? ' is-contact' : ''}`}
      style={{
        '--height': 1937 + CLOSE_DY,
        // Círculos a mano que rodean la palabra marcada con [[…]] en translations.js (ver .circled en Projects.css)
        '--ring-blue': `url("${img['circle-blue']}")`,
        '--ring-orange': `url("${img['circle-orange']}")`,
      }}
    >
      <div className="stage">
        <div className="grp grp--box">
          <P x={283} y={199} w={945} className="projects__photo">
            <img loading="lazy" decoding="async" src={img['photo-projects']} alt={p.photoAlt} />
            {/* Mensaje del café (Figma 190:2801), junto a la cara */}
            <div className={`projects__coffee${coffeeMsg ? ' is-on' : ''}`} aria-hidden="true">
              <Message variant="blue" text={p.coffeeMsg} emoji="☕️" k={0.86} />
            </div>
          </P>
          <p className="visually-hidden" aria-live="polite">
            {coffeeMsg ? p.coffeeMsg : ''}
          </p>
          {/* Algo más grande que en Figma (291 de ancho en 379.9, 257.9), con el mismo centro */}
          <P x={363} y={246.4} w={325} r={-8.26} className="projects__sticker">
            <h2>
              <img loading="lazy" decoding="async" src={localizedSrc(img, 'sticker-projects', lang)} alt={p.stickerAlt} />
            </h2>
          </P>
          <P x={676.4} y={214.4} w={195.73} r={37.55} className="projects__crown">
            <img loading="lazy" decoding="async" src={img['crown']} alt="" />
          </P>
          {/* Debajo del brazo derecho (el borde del antebrazo va de y 600 a 490), algo más pequeña que en Figma;
              aparece al final de la entrada de la sección (Projects.css) */}
          <P x={1080} y={598} cx className="projects__tap">
            <Message text={p.tap} emoji="👆🏽" k={0.42} />
          </P>
          <div className="objects objects--projects">
            {objects.map((o, i) => (
              <ObjectItem
                key={o.id}
                {...o}
                index={i}
                src={img[o.src]}
                alt={p.objects[o.id].alt}
                label={{ ...o.label, text: p.objects[o.id].label }}
                tone="brown2"
                loading="lazy"
                onClick={(e) => openCategory(o.id, e)}
                selected={open === o.id}
                controls={`projects-modal-${o.id}`}
              />
            ))}
          </div>
        </div>

        {/* Contacto */}
        <span id="contact" className="anchor" style={{ '--y': 1250 + CLOSE_DY }} />
        <div className="grp grp--closing">
          {/* Textos al mismo tamaño que los de «Sobre mí» (la bio y «Mi enfoque» se ven a 32 y 81.68 × 0.9, About.css) */}
          <P x={756} y={1345.5 + CLOSE_DY} w={426} fs={28.8} cx cy className="projects__end">
            <p>{p.end}</p>
          </P>
          <P x={755.58} y={1417 + CLOSE_DY} w={1053.17} fs={73.5} cx cy className="hand projects__cta" data-reveal="cta">
            <h2>
              <Rich text={p.cta} />
            </h2>
          </P>
        </div>

        <div className="grp grp--contact">
          <P x={197} y={1549 + CLOSE_DY} w={317} fs={28.8} className="projects__invite" data-reveal="contact">
            <p>
              <Rich text={p.invite} />
            </p>
          </P>

          <P x={1021} y={1555 + CLOSE_DY} w={373.84} className="contact">
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
            <P x={448} y={1504 + CLOSE_DY} w={618} h={433} className="projects__face">
              <img loading="lazy" decoding="async" src={img['photo-contact']} alt={p.faceAlt} />
            </P>
            <P x={743.21} y={1730 + CLOSE_DY} w={100.04} className="projects__note">
              <img loading="lazy" decoding="async" src={img['note-green']} alt="" />
            </P>
          </div>
        </div>
      </div>

      {/* Un modal por categoría (key): cada uno con sus proyectos y sus filtros, que empiezan vacíos */}
      {open && <ProjectsModal key={open} category={open} onClose={closeModal} />}
    </section>
  );
}
