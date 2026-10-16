import { porNombre } from '../assets/imagenes.js';
import './Message.css';

// Burbujas compartidas por las secciones (src/assets/shared/)
const img = porNombre(import.meta.glob('../assets/shared/burbuja-*.svg', { eager: true, import: 'default' }));

// Burbuja de chat (estilo iMessage) con reacción en emoji.
// variant "oscura": la del inicio ("¿Abrimos la caja?")
// variant "clara": las de "Toca los objetos" / "Toca las imagenes"
// k: escala de la burbuja clara (1 = texto de 37px como en Figma)
export default function Message({ text, emoji, variant = 'clara', k = 1, top, bottom, className = '' }) {
  const oscura = variant === 'oscura';
  const pref = oscura ? 'burbuja-oscura' : 'burbuja-clara';
  return (
    <div className={`msg msg--${variant} ${className}`} style={{ '--k': k }}>
      {top && <p className="msg__meta msg__meta--top">{top}</p>}
      <div className="msg__row">
        <div className="msg__bubble">
          <p>{text}</p>
        </div>
        <div className="msg__reaction" aria-hidden="true">
          <img className="msg__reaction-bg" src={img[`${pref}-reaccion.svg`]} alt="" />
          <img className="msg__reaction-dot" src={img[`${pref}-punto.svg`]} alt="" />
          <span className="msg__emoji">{emoji}</span>
        </div>
      </div>
      <img className="msg__tail" src={img[`${pref}-cola.svg`]} alt="" aria-hidden="true" />
      {bottom && (
        <p className="msg__meta msg__meta--bottom">
          <strong>{bottom[0]}</strong> {bottom[1]}
        </p>
      )}
    </div>
  );
}
