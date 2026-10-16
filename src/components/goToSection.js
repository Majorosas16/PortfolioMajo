// Lleva a una sección sin escribir el #ancla en la URL (así, al recargar, la página abre en el inicio).
// Se usa en los enlaces del header, del menú del celular y del footer.
export const goToSection = (e) => {
  const target = document.querySelector(e.currentTarget.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
};
