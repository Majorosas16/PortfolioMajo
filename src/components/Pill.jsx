// Etiqueta café redondeada que acompaña a cada objeto ("Diseño visual", "UX research", etc.)
// tone: "cafe" (#432f2e) o "cafe2" (#493531, sección Proyectos)
// size: "md" (17.9px, objetos) o "lg" (20px, "de Cali, Colombia")
export default function Pill({ children, tone = 'cafe', size = 'md', className = '', style }) {
  return (
    <span className={`pill pill--${tone} pill--${size} ${className}`} style={style}>
      {children}
    </span>
  );
}
