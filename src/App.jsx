import Header from './components/Header.jsx';
import Intro from './sections/Intro.jsx';
import SobreMi from './sections/SobreMi.jsx';
import Aporto from './sections/Aporto.jsx';
import Proyectos from './sections/Proyectos.jsx';
import { asset } from './components/P.jsx';

export default function App() {
  return (
    <>
      <Header />
      <main style={{ '--papel': `url(${asset('fondo-papel.png')})` }}>
        <Intro />
        <SobreMi />
        <Aporto />
        <Proyectos />
      </main>
    </>
  );
}
