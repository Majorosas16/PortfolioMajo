import P, { asset } from '../components/P.jsx';
import Message from '../components/Message.jsx';

// Frame 1 de Figma — "WEB" 1512 × 982
export default function Intro() {
  return (
    <section id="inicio" className="section section--papel intro" style={{ '--alto': 982 }}>
      <div className="stage">
        <P x={756} y={260} cx className="intro__msg">
          <Message variant="oscura" text="¿Abrimos la caja?" emoji="📦" top="Hey!" bottom={['Read', '9:39']} />
        </P>

        <P x={408} y={416} w={696} className="intro__caja">
          <a href="#sobre-mi" aria-label="Abrir la caja e ir a Sobre mí">
            <img src={asset('caja-cerrada.png')} alt="Caja de cartón con la etiqueta Majo's Portfolio" />
          </a>
        </P>
      </div>
    </section>
  );
}
