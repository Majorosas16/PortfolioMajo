import { useState } from 'react';

// Fotos y videos de un proyecto, dentro de su marco tipo Polaroid (tarjeta de la lista y vista de detalle).
// Carrusel manual: solo cambia con los botones ‹ › o tocando una barra; nunca solo ni por tiempo. Las barras de
// arriba (como las de «Sobre mí») muestran cuántos elementos hay y cuál se ve. Los videos tienen sus controles y solo
// se reproducen al darles play.
// media: [{ type: 'image' | 'video', src, poster? }] (projects.js) · labels: projects.modal de translations.js
export default function MediaCarousel({ media, name, labels }) {
  const [current, setCurrent] = useState(0);
  const n = media.length;
  const fill = (text, vars) => Object.entries(vars).reduce((t, [k, v]) => t.replace(`{${k}}`, v), text);

  if (!n) {
    return (
      <div className="media media--empty" role="img" aria-label={labels.mediaSoon}>
        <svg className="media__empty-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <rect x="2.5" y="4" width="19" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="8.5" cy="9.5" r="1.8" fill="currentColor" />
          <path d="M3.5 18l5.6-5.4 3.4 3.2 2.6-2.4 5 4.6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
        <span>{labels.mediaSoon}</span>
      </div>
    );
  }

  const go = (i) => setCurrent((i + n) % n);
  const item = media[current];
  const position = fill(labels.mediaPosition, { n: current + 1, total: n });

  return (
    <div className="media" role="group" aria-roledescription="carousel" aria-label={fill(labels.media, { project: name })}>
      {item.type === 'video' ? (
        <video key={item.src} className="media__item" src={item.src} poster={item.poster} controls playsInline preload="metadata" />
      ) : (
        <img key={item.src} className="media__item" src={item.src} alt="" loading="lazy" decoding="async" draggable="false" />
      )}

      {n > 1 && (
        <>
          <div className="media__bars">
            {media.map((m, i) => (
              <button
                key={m.src}
                type="button"
                className={`media__bar${i === current ? ' is-current' : ''}`}
                onClick={() => go(i)}
                aria-label={fill(labels.goTo, { n: i + 1, total: n })}
                aria-current={i === current ? 'true' : undefined}
              />
            ))}
          </div>
          <button type="button" className="media__arrow media__arrow--prev" onClick={() => go(current - 1)} aria-label={labels.prev}>
            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" className="media__arrow media__arrow--next" onClick={() => go(current + 1)} aria-label={labels.next}>
            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="media__counter" aria-hidden="true">
            {current + 1}/{n}
          </span>
        </>
      )}

      <p className="visually-hidden" aria-live="polite">
        {n > 1 ? position : ''}
      </p>
    </div>
  );
}
