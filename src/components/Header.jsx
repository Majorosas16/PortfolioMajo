import { useEffect, useState } from 'react';

const links = [
  { href: '#sobre-mi', text: 'Sobre mí' },
  { href: '#lo-que-aporto', text: 'Lo que aporto' },
  { href: '#proyectos', text: 'Proyectos' },
  { href: '#hablemos', text: 'Hablemos' },
];

// Lleva a una sección sin escribir el #ancla en la URL (así, al recargar, la página abre en el inicio)
const irA = (e) => {
  const destino = document.querySelector(e.currentTarget.getAttribute('href'));
  if (!destino) return;
  e.preventDefault();
  const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  destino.scrollIntoView({ behavior: reducido ? 'auto' : 'smooth' });
};

// Encabezado fijo. Cambia a texto claro cuando pasa sobre la sección oscura ("Lo que aporto").
export default function Header() {
  const [oscuro, setOscuro] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const header = document.querySelector('.header');
      const alto = header ? header.offsetHeight / 2 : 40;
      const oscuras = document.querySelectorAll('[data-tema="oscuro"]');
      let sobreOscuro = false;
      oscuras.forEach((sec) => {
        const r = sec.getBoundingClientRect();
        if (r.top <= alto && r.bottom >= alto) sobreOscuro = true;
      });
      setOscuro(sobreOscuro);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <header className={`header ${oscuro ? 'header--oscuro' : ''} ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__inner">
        <a href="#inicio" className="header__brand" onClick={irA}>
          <span className="header__role">Product Designer</span>
          <span className="header__name">María José Rosas Cuellar</span>
        </a>
        <nav className="header__nav" aria-label="Secciones">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="header__link" onClick={irA}>
              {l.text}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
