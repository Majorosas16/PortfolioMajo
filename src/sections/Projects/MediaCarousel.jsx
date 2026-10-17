import { useEffect, useRef, useState } from 'react';

// Fotos y videos de un proyecto, dentro de su marco tipo Polaroid (tarjeta de la lista y vista de detalle).
// Carrusel manual: solo cambia con los botones ‹ › o tocando una barra; nunca solo ni por tiempo. Las barras de
// arriba (como las de «Sobre mí») muestran cuántos elementos hay y cuál se ve. Los videos van a 1.5× y se reproducen
// solos (sin sonido, en bucle) mientras se ven en pantalla; tienen sus controles para pausarlos o verlos en grande.
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
      {/* Cada foto o video se ve completo (sin recortar), sobre la misma imagen ampliada y desenfocada de fondo */}
      {(item.type === 'image' || item.poster) && (
        <img key={`bg-${item.src}`} className="media__backdrop" src={item.type === 'image' ? item.src : item.poster} alt="" aria-hidden="true" />
      )}
      {item.type === 'video' ? (
        <AutoVideo key={item.src} src={item.src} poster={item.poster} />
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

// Video del carrusel: a 1.5× (VIDEO_RATE) y en reproducción solo mientras al menos la mitad está a la vista (al llegar
// a él en el carrusel o al desplazarse hasta él); se pausa al salir. Con «reducir movimiento» no arranca solo.
const VIDEO_RATE = 1.5;

function AutoVideo({ src, poster }) {
  const ref = useRef(null);
  useEffect(() => {
    const video = ref.current;
    video.defaultPlaybackRate = VIDEO_RATE;
    video.playbackRate = VIDEO_RATE;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.5 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      className="media__item"
      src={src}
      poster={poster}
      controls
      muted
      loop
      playsInline
      preload="metadata"
      // Si se cambia la velocidad desde los controles y vuelve a 1×, se respeta; solo se fija al cargar
      onLoadedMetadata={(e) => (e.currentTarget.playbackRate = VIDEO_RATE)}
    />
  );
}
