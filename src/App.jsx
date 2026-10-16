import { useEffect, useRef } from 'react';
import Header from './components/Header.jsx';
import Intro from './sections/Intro.jsx';
import SobreMi from './sections/SobreMi.jsx';
import Aporto from './sections/Aporto.jsx';
import Proyectos from './sections/Proyectos.jsx';
import papel from './assets/shared/fondo-papel-continuo.jpg';

export default function App() {
  const mainRef = useRef(null);

  // El papel del fondo es una sola hoja para toda la página: cada sección muestra el trozo
  // que le corresponde según su posición (--fondo-y), así no se ve un corte entre secciones.
  useEffect(() => {
    const main = mainRef.current;
    const alinear = () => {
      main.querySelectorAll('.section').forEach((sec) => {
        sec.style.setProperty('--fondo-y', `${sec.offsetTop}px`);
      });
    };
    alinear();
    const ro = new ResizeObserver(alinear);
    ro.observe(main);
    document.fonts?.ready.then(alinear);
    return () => ro.disconnect();
  }, []);

  return (
    <>
      <Header />
      <main ref={mainRef} style={{ '--papel': `url(${papel})` }}>
        <Intro />
        <SobreMi />
        <Aporto />
        <Proyectos />
      </main>
    </>
  );
}
