import { byName } from '../assets/images.js';
import './Message.css';

// Burbujas compartidas por las secciones (src/assets/shared/)
const img = byName(import.meta.glob('../assets/shared/bubble-*.svg', { eager: true, import: 'default' }));

// Burbuja de chat (estilo iMessage) con reacción en emoji.
// variant "dark": la del inicio ("¿Abrimos la caja?")
// variant "light": las de "Toca los objetos" / "Toca las imagenes"
// k: escala de la burbuja clara (1 = texto de 37px como en Figma)
export default function Message({ text, emoji, variant = 'light', k = 1, top, bottom, className = '' }) {
  const prefix = variant === 'dark' ? 'bubble-dark' : 'bubble-light';
  return (
    <div className={`msg msg--${variant} ${className}`} style={{ '--k': k }}>
      {top && <p className="msg__meta msg__meta--top">{top}</p>}
      <div className="msg__row">
        <div className="msg__bubble">
          <p>{text}</p>
        </div>
        <div className="msg__reaction" aria-hidden="true">
          <img className="msg__reaction-bg" src={img[`${prefix}-reaction`]} alt="" />
          <img className="msg__reaction-dot" src={img[`${prefix}-dot`]} alt="" />
          <span className="msg__emoji">{emoji}</span>
        </div>
      </div>
      <img className="msg__tail" src={img[`${prefix}-tail`]} alt="" aria-hidden="true" />
      {bottom && (
        <p className="msg__meta msg__meta--bottom">
          <strong>{bottom[0]}</strong> {bottom[1]}
        </p>
      )}
    </div>
  );
}
