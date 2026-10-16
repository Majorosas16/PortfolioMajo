import P from '../../components/P.jsx';
import { byName } from '../../assets/images.js';
import Message from '../../components/Message.jsx';
import ObjectItem from '../../components/ObjectItem.jsx';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { localizedSrc } from '../../i18n/images.js';
import Rich from '../../i18n/Rich.jsx';
import './Projects.css';

// Imágenes de esta sección (src/assets/sections/projects/)
const img = byName(import.meta.glob('../../assets/sections/projects/*', { eager: true, import: 'default' }));

// Objetos alrededor de la foto (coordenadas del frame 4 de Figma). Texto y alt en translations.js (projects.objects[id]).
const objects = [
  {
    id: 'prism', src: 'prism.png',
    x: 138.15, y: 713.19, w: 154.55, h: 130.93, r: -3.29,
    label: { dx: 33.85, dy: 150.2 },
  },
  {
    id: 'compass', src: 'compass.png',
    x: 367.1, y: 809.1, w: 151.8, h: 144.9,
    label: { dx: -6.1, dy: 167.3 },
  },
  {
    id: 'shell', src: 'shell.png',
    x: 539.95, y: 895, w: 195.56, h: 147.29,
    label: { dx: 33.05, dy: 155.4 },
  },
  {
    id: 'chess', src: 'chess.png',
    x: 751.28, y: 847.4, w: 210.32, h: 210.32, r: -7.12,
    label: { dx: 48.72, dy: 203 },
  },
  {
    id: 'clip', src: 'clip.png',
    x: 1007.05, y: 809.1, w: 133.42, h: 158.83,
    label: { dx: -5.05, dy: 167.3 },
  },
  {
    id: 'coffee', src: 'coffee.png',
    x: 1169.96, y: 659.38, w: 277.74, h: 236.4, r: -6.64,
    label: { dx: 67.04, dy: 204 },
  },
];

// Redes: completa los enlaces que faltan (WhatsApp, LinkedIn, GitHub)
const socials = [
  { name: 'WhatsApp', icon: 'icon-whatsapp.svg', size: 58.76, href: 'https://wa.me/57XXXXXXXXXX' },
  { name: 'Behance', icon: 'icon-behance.svg', size: 61.98, href: 'https://www.behance.net/marajrosasc' },
  { name: 'LinkedIn', icon: 'icon-linkedin.svg', size: 57.35, href: 'https://www.linkedin.com/in/TU-USUARIO' },
  { name: 'GitHub', icon: 'icon-github.svg', size: 62.56, href: 'https://github.com/TU-USUARIO' },
];

// Frame 4 de Figma — "WEB" 1512 × 1937
export default function Projects() {
  const { lang, t } = useLanguage();
  const p = t.projects;
  return (
    <section
      id="projects"
      className="section section--paper projects"
      style={{
        '--height': 1937,
        // Círculos a mano que rodean la palabra marcada con [[…]] en translations.js (ver .circled en Projects.css)
        '--ring-blue': `url(${img['circle-blue.svg']})`,
        '--ring-orange': `url(${img['circle-orange.svg']})`,
      }}
    >
      <div className="stage">
        <div className="grp grp--box">
          <P x={283} y={199} w={945} className="projects__photo">
            <img src={img['photo-projects.png']} alt={p.photoAlt} />
          </P>
          <P x={379.9} y={257.9} w={291} r={-8.26} className="projects__sticker">
            <h2>
              <img src={localizedSrc(img, 'sticker-projects.png', lang)} alt={p.stickerAlt} />
            </h2>
          </P>
          <P x={676.4} y={214.4} w={195.73} r={37.55} className="projects__crown">
            <img src={img['crown.png']} alt="" />
          </P>
          <P x={978.97} y={385} cx className="projects__tap">
            <Message text={p.tap} emoji="👆🏽" />
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
              <img src={img['icon-email.svg']} alt="" />
              <span>multimedia.mr16@gmail.com</span>
            </a>
            <ul className="contact__socials">
              {socials.map((s) => (
                <li key={s.name}>
                  <a href={s.href} target="_blank" rel="noreferrer" aria-label={s.name} style={{ '--s': s.size }}>
                    <img src={img[s.icon]} alt="" />
                  </a>
                </li>
              ))}
            </ul>
          </P>

          <div className="grp grp--face">
            <P x={448} y={1504} w={618} h={433} className="projects__face">
              <img src={img['photo-contact.png']} alt={p.faceAlt} />
            </P>
            <P x={743.21} y={1730} w={100.04} className="projects__note">
              <img src={img['note-green.png']} alt="" />
            </P>
          </div>
        </div>
      </div>
    </section>
  );
}
