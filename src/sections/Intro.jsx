import { useEffect, useRef, useState } from 'react';
import P from '../components/P.jsx';
import { porNombre } from '../assets/imagenes.js';
import Message from '../components/Message.jsx';
import ObjectItem from '../components/ObjectItem.jsx';
import './Intro.css';

// Imágenes de esta sección (src/assets/sections/inicio/)
const img = porNombre(import.meta.glob('../assets/sections/inicio/*', { eager: true, import: 'default' }));

// Inicio — la caja cerrada que se abre y deja salir los objetos.
// Une el frame 1 de Figma (121:2271, caja cerrada) con la parte superior del frame 2 (130:4479, caja abierta).
// Las coordenadas son las del frame 2; Y0 recorta el espacio vacío de arriba.
const Y0 = 90;

// Fotogramas de la apertura (sección "Boxes" de Figma, 162:2418), alineados por el vértice inferior de la caja.
// La caja cerrada queda centrada como en el frame 1 y la abierta en su posición del frame 2.
const CAJA = { x: 408, y: 476.7, w: 713.3, h: 581.3 };
const fotogramas = [
  { src: 'caja-cerrada.png', x: 408, y: 587.7, w: 696 },
  { src: 'caja-abriendo-1.png', x: 436.3, y: 476.7, w: 685 },
  { src: 'caja-abriendo-2.png', x: 420.8, y: 494.7, w: 690 },
  { src: 'caja-abierta.png', x: 409, y: 579, w: 695 },
];
// Punto de la boca de la caja abierta desde donde salen los objetos (fracción de CAJA)
const BOCA = { x: 0.464, y: 0.4 };

// Objetos que salen de la caja (posición final = la del frame 2).
// m: posición en celular, en % del ancho de la escena.
const objetos = [
  {
    src: 'llaves.png',
    alt: 'Llaves antiguas',
    x: 115.06, y: 540, w: 284.88, h: 129,
    crop: { w: 100.08, h: 251.4, left: -0.04, top: -90.83 },
    label: { text: 'Diseño de producto', dx: 47.35, dy: 132.4 },
    m: { x: 4, y: 80, w: 40 },
  },
  {
    src: 'planta.png',
    alt: 'Planta en matera de concreto',
    x: 395.18, y: 294, w: 145.74, h: 203,
    crop: { w: 162.5, h: 155.56, left: -28.57, top: -33.76 },
    label: { text: 'Prototipado y código', dx: -24.2, dy: 205 },
    m: { x: 8, y: 30, w: 24 },
  },
  {
    src: 'mariposa.png',
    alt: 'Mariposa azul',
    x: 612.2, y: 259, w: 267.27, h: 178.2,
    label: { text: 'Diseño visual', center: true, dy: 185 },
    m: { x: 30, y: 0, w: 40 },
  },
  {
    src: 'espejo.png',
    alt: 'Espejo de mano antiguo',
    x: 942, y: 307.6, w: 117.6, h: 242.3, r: -1.85,
    label: { text: 'Empatía', dx: 21.7, dy: 190.4 },
    m: { x: 72.5, y: 32, w: 15 },
  },
  {
    src: 'audifonos.png',
    alt: 'Audífonos',
    x: 1155, y: 459, w: 184, h: 229,
    label: { text: 'Colaboración', dx: 17, dy: 213.4 },
    m: { x: 64, y: 74, w: 24 },
  },
];

// Tiempos de la secuencia (ms). Deben coincidir con las animaciones de styles.css
const T = {
  salida: 420, // los objetos empiezan a salir mientras se abren las solapas (la caja tarda 1150)
  paso: 110, // desfase entre objetos
  viaje: 950, // duración de la salida de cada objeto
};

const pct = (v) => `${v}%`;

// Hora local del visitante en formato de 24 h ("21:39"), según el reloj y la zona horaria del navegador.
// Se actualiza al empezar cada minuto.
const formatoHora = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

function useHoraLocal() {
  const [hora, setHora] = useState(() => formatoHora.format(new Date()));
  useEffect(() => {
    let t;
    const programar = () => {
      const ahora = new Date();
      setHora(formatoHora.format(ahora));
      t = setTimeout(programar, 60000 - (ahora.getSeconds() * 1000 + ahora.getMilliseconds()) + 50);
    };
    programar();
    return () => clearTimeout(t);
  }, []);
  return hora;
}

export default function Intro() {
  // cerrada → abriendo → abierta
  const [estado, setEstado] = useState('cerrada');
  const [salida, setSalida] = useState(false);
  const hora = useHoraLocal();
  const fase = useRef('cerrada');
  const timers = useRef([]);
  const stageRef = useRef(null);
  const cajaRef = useRef(null);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // El header lee el estado de la caja (con la caja cerrada oculta la navegación)
  useEffect(() => {
    document.documentElement.dataset.caja = estado;
  }, [estado]);

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  const terminar = () => {
    if (fase.current !== 'abriendo') return;
    fase.current = 'abierta';
    setEstado('abierta');
  };

  // Cada objeto empieza en la boca de la caja: se mide la distancia hasta su posición final (técnica FLIP)
  const prepararSalida = () => {
    const caja = cajaRef.current.getBoundingClientRect();
    const bx = caja.left + caja.width * BOCA.x;
    const by = caja.top + caja.height * BOCA.y;
    stageRef.current.querySelectorAll('.obj').forEach((el) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--fx', `${bx - (r.left + r.width / 2)}px`);
      el.style.setProperty('--fy', `${by - (r.top + r.height / 2)}px`);
    });
    // Dos cuadros para que el navegador pinte la posición inicial antes de animar
    requestAnimationFrame(() => requestAnimationFrame(() => setSalida(true)));
  };

  const abrir = () => {
    if (fase.current !== 'cerrada') return;
    fase.current = 'abriendo';

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      fase.current = 'abierta';
      setSalida(true);
      setEstado('abierta');
      return;
    }

    // La apertura de la caja es una sola animación CSS (caja-abrir + caja-f0…f3)
    setEstado('abriendo');
    later(prepararSalida, T.salida);
    // Respaldo por si no llega el animationend del último objeto
    later(terminar, T.salida + (objetos.length - 1) * T.paso + T.viaje + 400);
  };

  const alTerminarAnimacion = (e) => {
    const ultimo = e.target.style.getPropertyValue('--i') === String(objetos.length - 1);
    if (e.animationName === 'obj-salir' && ultimo) terminar();
  };

  return (
    <section
      id="inicio"
      className="section section--papel intro"
      data-estado={estado}
      data-salida={salida}
      style={{ '--alto': 980 }}
    >
      <div className="stage" ref={stageRef} onAnimationEnd={alTerminarAnimacion}>
        <P
          as="button"
          type="button"
          x={CAJA.x}
          y={CAJA.y - Y0}
          w={CAJA.w}
          h={CAJA.h}
          className="caja intro__boton"
          style={{ '--mx': 10, '--my': 112, '--mw': 80 }}
          onClick={abrir}
          disabled={estado !== 'cerrada'}
          aria-label="Abrir la caja"
          aria-expanded={estado !== 'cerrada'}
          ref={cajaRef}
        >
          <span className="caja__frames">
            {fotogramas.map((f, i) => (
              <img
                key={f.src}
                className={`caja__frame caja__frame--${i}`}
                src={img[f.src]}
                alt=""
                style={{
                  left: pct(((f.x - CAJA.x) / CAJA.w) * 100),
                  top: pct(((f.y - CAJA.y) / CAJA.h) * 100),
                  width: pct((f.w / CAJA.w) * 100),
                }}
              />
            ))}
          </span>
        </P>

        <P
          as="button"
          type="button"
          x={756}
          y={431.7 - 50 - Y0}
          cx
          className="intro__msg intro__boton"
          style={{ '--mx': 50, '--my': 88.3 }}
          onClick={abrir}
          disabled={estado !== 'cerrada'}
          aria-hidden={estado !== 'cerrada'}
          tabIndex={-1}
        >
          <Message variant="oscura" text="¿Abrimos la caja?" emoji="📦" top="Hey!" bottom={['Read', hora]} />
        </P>

        <div className="objetos objetos--caja">
          {objetos.map((o, i) => (
            <ObjectItem key={o.src} {...o} src={img[o.src]} y={o.y - Y0} index={i} />
          ))}
        </div>

        <P x={1041.4} y={883 - Y0} cx className="caja__toca" style={{ '--mx': 50, '--my': 179 }} aria-hidden={estado !== 'abierta'}>
          <Message text="Toca los objetos" emoji="👆🏽" k={0.86} />
        </P>
      </div>
    </section>
  );
}
