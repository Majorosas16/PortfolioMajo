import P from '../components/P.jsx';
import { porNombre } from '../assets/imagenes.js';
import Message from '../components/Message.jsx';
import ObjectItem from '../components/ObjectItem.jsx';
import './Proyectos.css';

// Imágenes de esta sección (src/assets/sections/proyectos/)
const img = porNombre(import.meta.glob('../assets/sections/proyectos/*', { eager: true, import: 'default' }));

// Objetos alrededor de la foto (coordenadas del frame 4 de Figma)
const objetos = [
  {
    src: 'prisma.png', alt: 'Prisma de cristal',
    x: 138.15, y: 713.19, w: 154.55, h: 130.93, r: -3.29,
    label: { text: 'UX/UI', dx: 33.85, dy: 150.2 },
  },
  {
    src: 'brujula.png', alt: 'Brújula',
    x: 367.1, y: 809.1, w: 151.8, h: 144.9,
    label: { text: 'UX research', dx: -6.1, dy: 167.3 },
  },
  {
    src: 'concha.png', alt: 'Concha en espiral',
    x: 539.95, y: 895, w: 195.56, h: 147.29,
    label: { text: 'Accesibilidad', dx: 33.05, dy: 155.4 },
  },
  {
    src: 'ajedrez.png', alt: 'Pieza de ajedrez',
    x: 751.28, y: 847.4, w: 210.32, h: 210.32, r: -7.12,
    label: { text: 'DS y Marca', dx: 48.72, dy: 203 },
  },
  {
    src: 'clip.png', alt: 'Clip negro',
    x: 1007.05, y: 809.1, w: 133.42, h: 158.83,
    label: { text: 'Diseño gráfico', dx: -5.05, dy: 167.3 },
  },
  {
    src: 'cafe.png', alt: 'Taza de café',
    x: 1169.96, y: 659.38, w: 277.74, h: 236.4, r: -6.64,
    label: { text: 'Freelance', dx: 67.04, dy: 204 },
  },
];

// Redes: completa los enlaces que faltan (WhatsApp, LinkedIn, GitHub)
const redes = [
  { nombre: 'WhatsApp', icono: 'icono-whatsapp.svg', size: 58.76, href: 'https://wa.me/57XXXXXXXXXX' },
  { nombre: 'Behance', icono: 'icono-behance.svg', size: 61.98, href: 'https://www.behance.net/marajrosasc' },
  { nombre: 'LinkedIn', icono: 'icono-linkedin.svg', size: 57.35, href: 'https://www.linkedin.com/in/TU-USUARIO' },
  { nombre: 'GitHub', icono: 'icono-github.svg', size: 62.56, href: 'https://github.com/TU-USUARIO' },
];

// Frame 4 de Figma — "WEB" 1512 × 1937
export default function Proyectos() {
  return (
    <section id="proyectos" className="section section--papel proyectos" style={{ '--alto': 1937 }}>
      <div className="stage">
        <div className="grp grp--caja">
          <P x={283} y={199} w={945} className="proyectos__foto">
            <img src={img['foto-proyectos.png']} alt="María José con los brazos abiertos" />
          </P>
          <P x={379.9} y={257.9} w={291} r={-8.26} className="proyectos__sticker">
            <h2>
              <img src={img['sticker-proyectos.png']} alt="Proyectos" />
            </h2>
          </P>
          <P x={676.4} y={214.4} w={195.73} r={37.55} className="proyectos__corona">
            <img src={img['corona.png']} alt="" />
          </P>
          <P x={978.97} y={385} cx className="proyectos__toca">
            <Message text="Toca los objetos" emoji="👆🏽" />
          </P>
          <div className="objetos objetos--proyectos">
            {objetos.map((o) => (
              <ObjectItem key={o.src} {...o} src={img[o.src]} tone="cafe2" />
            ))}
          </div>
        </div>

        {/* Contacto */}
        <span id="hablemos" className="ancla" style={{ '--y': 1250 }} />
        <div className="grp grp--cierre">
          <P x={756} y={1345.5} w={426} fs={35.66} cx cy className="proyectos__fin">
            <p>¡Esto no termina aquí!</p>
          </P>
          <P x={755.58} y={1417} w={1053.17} fs={88.16} cx cy className="hand proyectos__cta">
            <h2>
              ¿Creamos algo <span className="encerrado encerrado--azul">increíble?</span>
            </h2>
          </P>
          <P x={839.4} y={1375.2} w={309.11} h={79.4} r={-4.85} className="circulo circulo--azul">
            <img src={img['circulo-azul.svg']} alt="" />
          </P>
        </div>

        <div className="grp grp--contacto">
          <P x={197} y={1549} w={317} fs={35} className="proyectos__invita">
            <p>
              Me <span className="encerrado">encantaría</span>, compartir ideas y{' '}
              <b>crear experiencias digitales juntos.</b>
            </p>
          </P>
          <P x={238.98} y={1539.98} w={197} h={65} r={2.98} className="circulo circulo--naranja">
            <img src={img['circulo-naranja.svg']} alt="" />
          </P>

          <P x={1021} y={1555} w={373.84} className="contacto">
            <a className="contacto__email" href="mailto:multimedia.mr16@gmail.com">
              <img src={img['icono-email.svg']} alt="" />
              <span>multimedia.mr16@gmail.com</span>
            </a>
            <ul className="contacto__redes">
              {redes.map((r) => (
                <li key={r.nombre}>
                  <a href={r.href} target="_blank" rel="noreferrer" aria-label={r.nombre} style={{ '--s': r.size }}>
                    <img src={img[r.icono]} alt="" />
                  </a>
                </li>
              ))}
            </ul>
          </P>

          <div className="grp grp--cara">
            <P x={448} y={1504} w={618} h={433} className="proyectos__cara">
              <img src={img['foto-contacto.png']} alt="María José sonriendo con un post-it en la frente" />
            </P>
            <P x={743.21} y={1730} w={100.04} className="proyectos__nota">
              <img src={img['nota-verde.png']} alt="" />
            </P>
          </div>
        </div>
      </div>
    </section>
  );
}
