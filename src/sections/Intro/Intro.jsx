import { useEffect, useRef, useState } from 'react';
import P from '../../components/P.jsx';
import { byName } from '../../assets/images.js';
import Message from '../../components/Message.jsx';
import ObjectItem from '../../components/ObjectItem.jsx';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import useDraggableObjects from './useDraggableObjects.js';
import './Intro.css';

// Imágenes de esta sección (src/assets/sections/intro/)
const img = byName(import.meta.glob('../../assets/sections/intro/*', { eager: true, import: 'default' }));

// Inicio — la caja cerrada que se abre y deja salir los objetos.
// Une el frame 1 de Figma (121:2271, caja cerrada) con la parte superior del frame 2 (130:4479, caja abierta).
// Las coordenadas son las del frame 2; Y0 recorta el espacio vacío de arriba.
const Y0 = 90;

// Fotogramas de la apertura (sección "Boxes" de Figma, 162:2418), alineados por el vértice inferior de la caja.
// La caja cerrada queda centrada como en el frame 1 y la abierta en su posición del frame 2.
const BOX = { x: 408, y: 476.7, w: 713.3, h: 581.3 };
const frames = [
  { src: 'box-closed', x: 408, y: 587.7, w: 696 },
  { src: 'box-opening-1', x: 436.3, y: 476.7, w: 685 },
  { src: 'box-opening-2', x: 420.8, y: 494.7, w: 690 },
  { src: 'box-open', x: 409, y: 579, w: 695 },
];
// Punto de la boca de la caja abierta desde donde salen los objetos (fracción de BOX)
const MOUTH = { x: 0.464, y: 0.4 };

// Objetos que salen de la caja (posición final = la del frame 2).
// m: posición en celular, en % del ancho de la escena. El texto y el alt están en translations.js (intro.objects[id]).
const objects = [
  {
    id: 'keys',
    src: 'keys',
    x: 115.06, y: 540, w: 284.88, h: 129,
    crop: { w: 100.08, h: 251.4, left: -0.04, top: -90.83 },
    label: { dx: 47.35, dy: 132.4 },
    m: { x: 4, y: 80, w: 40 },
  },
  {
    id: 'plant',
    src: 'plant',
    x: 395.18, y: 294, w: 145.74, h: 203,
    crop: { w: 162.5, h: 155.56, left: -28.57, top: -33.76 },
    label: { dx: -24.2, dy: 205 },
    m: { x: 8, y: 30, w: 24 },
  },
  {
    id: 'butterfly',
    src: 'butterfly',
    x: 612.2, y: 259, w: 267.27, h: 178.2,
    label: { center: true, dy: 185 },
    m: { x: 30, y: 0, w: 40 },
  },
  {
    id: 'mirror',
    src: 'mirror',
    x: 942, y: 307.6, w: 117.6, h: 242.3, r: -1.85,
    label: { dx: 21.7, dy: 190.4 },
    m: { x: 72.5, y: 32, w: 15 },
  },
  {
    id: 'headphones',
    src: 'headphones',
    x: 1155, y: 459, w: 184, h: 229,
    label: { dx: 17, dy: 213.4 },
    m: { x: 64, y: 74, w: 24 },
  },
];

// Tiempos de la secuencia (ms). Deben coincidir con las animaciones de Intro.css
const T = {
  launch: 420, // los objetos empiezan a salir mientras se abren las solapas (la caja tarda 1150)
  step: 110, // desfase entre objetos
  travel: 950, // duración de la salida de cada objeto
};

const pct = (v) => `${v}%`;

// Hora local del visitante en formato de 24 h ("21:39"), según el reloj y la zona horaria del navegador.
// Se actualiza al empezar cada minuto.
const timeFormat = (lang) => new Intl.DateTimeFormat(lang, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

function useLocalTime(lang) {
  const [time, setTime] = useState(() => timeFormat(lang).format(new Date()));
  useEffect(() => {
    const format = timeFormat(lang);
    let t;
    const tick = () => {
      const now = new Date();
      setTime(format.format(now));
      t = setTimeout(tick, 60000 - (now.getSeconds() * 1000 + now.getMilliseconds()) + 50);
    };
    tick();
    return () => clearTimeout(t);
  }, [lang]);
  return time;
}

export default function Intro() {
  // closed → opening → open
  const [boxState, setBoxState] = useState('closed');
  const [launched, setLaunched] = useState(false);
  const { lang, t } = useLanguage();
  const time = useLocalTime(lang);
  const phase = useRef('closed');
  const timers = useRef([]);
  const stageRef = useRef(null);
  const boxRef = useRef(null);
  const sectionRef = useRef(null);

  // Con la caja abierta los objetos se pueden agarrar y mover por la sección
  useDraggableObjects(sectionRef, boxState === 'open');

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // El header lee el estado de la caja (con la caja cerrada oculta la navegación)
  useEffect(() => {
    document.documentElement.dataset.box = boxState;
  }, [boxState]);

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  const finish = () => {
    if (phase.current !== 'opening') return;
    phase.current = 'open';
    setBoxState('open');
  };

  // Cada objeto empieza en la boca de la caja: se mide la distancia hasta su posición final (técnica FLIP)
  const prepareLaunch = () => {
    const box = boxRef.current.getBoundingClientRect();
    const bx = box.left + box.width * MOUTH.x;
    const by = box.top + box.height * MOUTH.y;
    stageRef.current.querySelectorAll('.obj').forEach((el) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--fx', `${bx - (r.left + r.width / 2)}px`);
      el.style.setProperty('--fy', `${by - (r.top + r.height / 2)}px`);
    });
    // Dos cuadros para que el navegador pinte la posición inicial antes de animar
    requestAnimationFrame(() => requestAnimationFrame(() => setLaunched(true)));
  };

  const openBox = () => {
    if (phase.current !== 'closed') return;
    phase.current = 'opening';

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      phase.current = 'open';
      setLaunched(true);
      setBoxState('open');
      return;
    }

    // La apertura de la caja es una sola animación CSS (box-open + box-f0…f3)
    setBoxState('opening');
    later(prepareLaunch, T.launch);
    // Respaldo por si no llega el animationend del último objeto
    later(finish, T.launch + (objects.length - 1) * T.step + T.travel + 400);
  };

  const handleAnimationEnd = (e) => {
    const isLast = e.target.style.getPropertyValue('--i') === String(objects.length - 1);
    if (e.animationName === 'obj-exit' && isLast) finish();
  };

  return (
    <section
      ref={sectionRef}
      id="intro"
      className="section section--paper intro"
      data-state={boxState}
      data-launch={launched}
      style={{ '--height': 980 }}
    >
      <div className="stage" ref={stageRef} onAnimationEnd={handleAnimationEnd}>
        <P
          as="button"
          type="button"
          x={BOX.x}
          y={BOX.y - Y0}
          w={BOX.w}
          h={BOX.h}
          className="box intro__button"
          style={{ '--mx': 10, '--my': 112, '--mw': 80 }}
          onClick={openBox}
          disabled={boxState !== 'closed'}
          aria-label={t.intro.openBox}
          aria-expanded={boxState !== 'closed'}
          ref={boxRef}
        >
          <span className="box__frames">
            {frames.map((f, i) => (
              <img
                key={f.src}
                className={`box__frame box__frame--${i}`}
                src={img[f.src]}
                alt=""
                // La caja cerrada es lo primero que se ve: se pide antes que el resto de imágenes
                fetchpriority={i === 0 ? 'high' : undefined}
                style={{
                  left: pct(((f.x - BOX.x) / BOX.w) * 100),
                  top: pct(((f.y - BOX.y) / BOX.h) * 100),
                  width: pct((f.w / BOX.w) * 100),
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
          className="intro__msg intro__button"
          style={{ '--mx': 50, '--my': 88.3 }}
          onClick={openBox}
          disabled={boxState !== 'closed'}
          aria-hidden={boxState !== 'closed'}
          tabIndex={-1}
        >
          <Message variant="dark" text={t.intro.message} emoji="📦" top={t.intro.greeting} bottom={[t.intro.read, time]} />
        </P>

        <div className="objects objects--box">
          {objects.map((o, i) => (
            <ObjectItem
              key={o.id}
              {...o}
              src={img[o.src]}
              alt={t.intro.objects[o.id].alt}
              label={{ ...o.label, text: t.intro.objects[o.id].label }}
              y={o.y - Y0}
              index={i}
            />
          ))}
        </div>

        <P x={1041.4} y={883 - Y0} cx className="box__tap" style={{ '--mx': 50, '--my': 179 }} aria-hidden={boxState !== 'open'}>
          <Message text={t.intro.tap} emoji="👆🏽" k={0.86} />
        </P>
      </div>
    </section>
  );
}
