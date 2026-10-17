import { useEffect, useRef } from 'react';
import Footer from './components/layout/Footer/Footer.jsx';
import Header from './components/layout/Header/Header.jsx';
import { LanguageProvider } from './i18n/LanguageContext.jsx';
import Intro from './sections/Intro/Intro.jsx';
import About from './sections/About/About.jsx';
import WhatIBring from './sections/WhatIBring/WhatIBring.jsx';
import Projects from './sections/Projects/Projects.jsx';
import paper from './assets/shared/paper-background-seamless.jpg';

export default function App() {
  const mainRef = useRef(null);

  // El papel del fondo es una sola hoja para toda la página: cada sección muestra el trozo
  // que le corresponde según su posición (--bg-y), así no se ve un corte entre secciones.
  useEffect(() => {
    const main = mainRef.current;
    const alignBackground = () => {
      main.querySelectorAll('.section').forEach((section) => {
        section.style.setProperty('--bg-y', `${section.offsetTop}px`);
      });
    };
    alignBackground();
    const ro = new ResizeObserver(alignBackground);
    ro.observe(main);
    document.fonts?.ready.then(alignBackground);
    return () => ro.disconnect();
  }, []);

  return (
    <LanguageProvider>
      <Header />
      <main ref={mainRef} style={{ '--paper': `url("${paper}")` }}>
        <Intro />
        <About />
        <WhatIBring />
        <Projects />
        <Footer />
      </main>
    </LanguageProvider>
  );
}
