import Pill from './Pill.jsx';
import { asset } from './P.jsx';

// Objeto flotante + su etiqueta.
// x, y, w, h: caja del objeto en el lienzo de 1512px
// crop: recorte de la imagen tal como en Figma ({ w, h, left, top } en %)
// label: { text, dx, dy } posición de la etiqueta relativa al objeto (o center: true)
export default function ObjectItem({ src, alt, x, y, w, h, r = 0, crop, flip = false, label, tone = 'cafe' }) {
  const style = { '--x': x, '--y': y, '--w': w, '--h': h, '--r': `${r}deg` };
  const labelStyle = label.center
    ? { '--lx': w / 2, '--ly': label.dy, '--ltx': '-50%' }
    : { '--lx': label.dx, '--ly': label.dy };

  return (
    <figure className="obj" style={style}>
      <div className={`obj__media ${flip ? 'is-flipped' : ''}`}>
        {crop ? (
          <div className="obj__crop">
            <img
              src={asset(src)}
              alt={alt}
              style={{ width: `${crop.w}%`, height: `${crop.h}%`, left: `${crop.left}%`, top: `${crop.top}%` }}
            />
          </div>
        ) : (
          <img src={asset(src)} alt={alt} />
        )}
      </div>
      <figcaption className="obj__label" style={labelStyle}>
        <Pill tone={tone}>{label.text}</Pill>
      </figcaption>
    </figure>
  );
}
