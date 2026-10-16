import P, { asset } from '../components/P.jsx';
import Message from '../components/Message.jsx';
import ObjectItem from '../components/ObjectItem.jsx';
import Pill from '../components/Pill.jsx';

// Objetos que salen de la caja abierta (coordenadas del frame 2 de Figma)
const objetos = [
  {
    src: 'llaves.png',
    alt: 'Llaves antiguas',
    x: 115.06, y: 540, w: 284.88, h: 129,
    crop: { w: 100.08, h: 251.4, left: -0.04, top: -90.83 },
    label: { text: 'Diseño de producto', dx: 47.35, dy: 132.4 },
  },
  {
    src: 'planta.png',
    alt: 'Planta en matera de concreto',
    x: 395.18, y: 294, w: 145.74, h: 203,
    crop: { w: 162.5, h: 155.56, left: -28.57, top: -33.76 },
    label: { text: 'Prototipado y código', dx: -24.2, dy: 205 },
  },
  {
    src: 'mariposa.png',
    alt: 'Mariposa azul',
    x: 612.2, y: 259, w: 267.27, h: 178.2,
    label: { text: 'Diseño visual', center: true, dy: 185 },
  },
  {
    src: 'espejo.png',
    alt: 'Espejo de mano antiguo',
    x: 942, y: 307.6, w: 117.6, h: 242.3, r: -1.85,
    label: { text: 'Empatía', dx: 21.7, dy: 190.4 },
  },
  {
    src: 'audifonos.png',
    alt: 'Audífonos',
    x: 1155, y: 459, w: 184, h: 229,
    label: { text: 'Colaboración', dx: 17, dy: 213.4 },
  },
];

// Frame 2 de Figma — "WEB" 1512 × 2888
export default function SobreMi() {
  return (
    <section id="sobre-mi" className="section section--papel sobre" style={{ '--alto': 2888 }}>
      <div className="stage">
        {/* Caja abierta + objetos */}
        <div className="grp grp--caja">
          <P x={409} y={579} w={695} className="sobre__caja">
            <img src={asset('caja-abierta.png')} alt="Caja de cartón abierta" />
          </P>
          <P x={1041.4} y={883} cx className="sobre__toca">
            <Message text="Toca los objetos" emoji="👆🏽" k={25.77 / 37.14} />
          </P>
          <div className="objetos objetos--sobre">
            {objetos.map((o) => (
              <ObjectItem key={o.src} {...o} />
            ))}
          </div>
        </div>

        {/* Presentación */}
        <div className="grp grp--presentacion">
          <P x={197} y={1212} w={257} r={-6.44} className="sobre__sticker">
            <img src={asset('sticker-sobre-mi.png')} alt="Sticker: Sobre mí" />
          </P>
          <P x={394.4} y={1461.19} fs={85.35} r={-2.6} cx cy className="hand sobre__hola">
            <h2>Hola! soy</h2>
          </P>
          <P x={234.61} y={1484.35} w={328.68} className="sobre__majo">
            <img src={asset('majo-letras.png')} alt="MAJO" />
          </P>
          <P x={155.9} y={1596.16} w={384} fs={34.81} className="sobre__rol">
            <p>
              Diseñadora de <br />
              Medios Interactivos
            </p>
          </P>
          <P x={338.8} y={1710.7} r={-0.53} className="sobre__cali">
            <Pill size="lg">de Cali, Colombia</Pill>
          </P>
        </div>

        <div className="grp grp--foto">
          <P x={756.16} y={1269} w={352.31} h={626} cx className="sobre__foto">
            <img src={asset('foto-majo.png')} alt="María José Rosas Cuellar" />
          </P>
          <P x={569} y={1356} w={107.28} className="sobre__nota">
            <img src={asset('nota-naranja.png')} alt="" />
          </P>
          <P x={804} y={1651} w={256} h={455.11} className="sobre__perro">
            <img src={asset('perro.png')} alt="Perro asomándose" />
          </P>
        </div>

        <P x={967} y={1420} w={435} fs={32} className="sobre__bio">
          <p>
            Creativa por naturaleza, <b>curiosa por diseño</b> y tecnología. Siempre explorando <b>nuevas tendencias</b>,
            creando interfaces y <b>coleccionando inspiración.</b>
          </p>
        </P>

        {/* Mi enfoque */}
        <div className="grp grp--col">
          <P x={392} y={2006} w={67.82} className="sobre__reaccion">
            <img src={asset('reaccion-enfoque.png')} alt="" />
          </P>
          <P x={442.7} y={2138.68} fs={81.68} r={-0.97} cx cy className="hand sobre__subtitulo">
            <h3>Mi enfoque</h3>
          </P>
          <P x={445.5} y={2309} w={461} fs={32} cx cy className="sobre__texto">
            <p>
              Crear interfaces intuitivas y consistentes, cuidando cada detalle de la experiencia.{' '}
              <b>Desde los flujos de usuario hasta los componentes visuales.</b>
            </p>
          </P>
          <P x={453} y={2438.4} w={446} h={127} r={-2.22} fs={32} cx className="seleccion seleccion--naranja">
            <p>Busco que cada decisión de diseño tenga sentido.</p>
            <i className="c c--tl" />
            <i className="c c--tr" />
            <i className="c c--bl" />
            <i className="c c--br" />
          </P>
          <P x={579} y={2589} className="cursor-tag cursor-tag--naranja">
            <img src={asset('cursor-naranja.svg')} alt="" />
            <span>al final...</span>
          </P>
        </div>

        {/* Mi toolkit */}
        <div className="grp grp--col">
          <P x={1061} y={1996} w={69.01} className="sobre__reaccion">
            <img src={asset('reaccion-toolkit.png')} alt="" />
          </P>
          <P x={1094.57} y={2138.89} fs={81.68} r={-0.97} cx cy className="hand sobre__subtitulo">
            <h3>Mi toolkit</h3>
          </P>
          <P x={1102} y={2308.5} w={514} fs={32} cx cy className="sobre__texto">
            <p>
              Trabajo con Figma, componentes y Design Tokens para construir <b>sistemas de diseño escalables.</b> También
              exploro el desarrollo front-end con HTML, CSS, JS y React.
            </p>
          </P>
          <P x={1103.76} y={2438.4} w={350.87} h={127} r={2.25} fs={32} cx className="seleccion seleccion--azul">
            <p>Conecto el diseño y la tecnología</p>
            <i className="c c--tl" />
            <i className="c c--tr" />
            <i className="c c--bl" />
            <i className="c c--br" />
          </P>
          <P x={1207} y={2589} className="cursor-tag cursor-tag--azul">
            <img src={asset('cursor-azul.svg')} alt="" />
            <span>y así...</span>
          </P>
        </div>
      </div>
    </section>
  );
}
