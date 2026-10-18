import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

// Fotos y videos de un proyecto, dentro de su marco tipo Polaroid (tarjeta de la lista y vista de detalle).
// Carrusel manual: solo cambia con los botones ‹ › o tocando una barra; nunca solo ni por tiempo. Las barras de
// arriba (como las de «Sobre mí») muestran cuántos elementos hay y cuál se ve. Los videos van a 1.5× y se reproducen
// solos (sin sonido, en bucle) mientras se ven en pantalla; tienen sus controles para pausarlos o verlos en grande.
// media: [{ type: 'image' | 'video', src, poster? }] (projects.js) · labels: projects.modal de translations.js ·
// sound: los videos van a velocidad normal y con sonido (los reels de un proyecto de redes)
export default function MediaCarousel({ media, name, labels, sound = false }) {
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

  // Con sonido, el video nuevo se monta dentro del toque (flushSync) y arranca ahí mismo: en iPhone solo así puede
  // sonar sin que la persona tenga que activarlo desde los controles
  const box = useRef(null);
  const go = (i) => {
    if (!sound) return setCurrent((i + n) % n);
    flushSync(() => setCurrent((i + n) % n));
    const video = box.current?.querySelector('video.media__item');
    if (video) playWithSound(video);
  };
  const item = media[current];
  const position = fill(labels.mediaPosition, { n: current + 1, total: n });

  return (
    <div ref={box} className="media" role="group" aria-roledescription="carousel" aria-label={fill(labels.media, { project: name })}>
      {/* Cada foto o video se ve completo (sin recortar), sobre la misma imagen ampliada y desenfocada de fondo; las
          fotos con fill (projects.js) llenan todo el marco, sin ese fondo */}
      {!item.fill && (item.type === 'image' || item.poster) && (
        <img key={`bg-${item.src}`} className="media__backdrop" src={item.type === 'image' ? item.src : item.poster} alt="" aria-hidden="true" />
      )}
      {item.type === 'video' ? (
        <AutoVideo key={item.src} src={item.src} poster={item.poster} sound={sound} label={labels.soundOn} />
      ) : (
        <img key={item.src} className={`media__item${item.fill ? ' media__item--fill' : ''}`} src={item.src} alt="" loading="lazy" decoding="async" draggable="false" />
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
// Con sound va a 1× y con sonido, a volumen bajo (VIDEO_VOLUME) porque arranca solo; se puede subir desde sus
// controles. Si el navegador no deja arrancar con sonido, arranca silenciado y muestra el botón «Activar sonido».
const VIDEO_RATE = 1.5;
const VIDEO_VOLUME = 0.35;

// iPhone no deja cambiar video.volume (siempre vale 1): allí el volumen se baja pasando el audio por Web Audio
// (GainNode). Solo se monta dentro de un toque, que es cuando el navegador deja arrancar el audio, y solo si existe
// navigator.audioSession: con él el sonido se oye aunque el iPhone esté en silencio, como el de un video normal.
let audioCtx = null;
const routed = new WeakSet();
function lowerVolume(video) {
  video.volume = VIDEO_VOLUME;
  if (Math.abs(video.volume - VIDEO_VOLUME) < 0.01 || routed.has(video)) return;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx || !navigator.audioSession) return;
  try {
    navigator.audioSession.type = 'playback';
    audioCtx ??= new Ctx();
    audioCtx.resume();
    const gain = audioCtx.createGain();
    gain.gain.value = VIDEO_VOLUME;
    audioCtx.createMediaElementSource(video).connect(gain).connect(audioCtx.destination);
    routed.add(video);
  } catch {
    // Sin Web Audio el video suena a su volumen normal
  }
}

// Reproduce con sonido; llamarla dentro de un toque (clic en «Reels», en las flechas o en «Activar sonido»)
export function playWithSound(video) {
  video.muted = false;
  lowerVolume(video);
  video.play().catch(() => {});
}

function AutoVideo({ src, poster, sound, label }) {
  const ref = useRef(null);
  const rate = sound ? 1 : VIDEO_RATE;
  const [muted, setMuted] = useState(!sound);
  useEffect(() => {
    const video = ref.current;
    video.defaultPlaybackRate = rate;
    video.playbackRate = rate;
    if (sound) video.volume = VIDEO_VOLUME;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const play = () =>
      video.play().catch(() => {
        if (video.muted) return;
        video.muted = true;
        video.play().catch(() => {});
      });
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play();
        else video.pause();
      },
      { threshold: 0.5 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, [rate, sound]);
  return (
    <>
      <video
        ref={ref}
        className="media__item"
        src={src}
        poster={poster}
        controls
        muted={!sound}
        loop
        playsInline
        preload="metadata"
        // Si se cambia la velocidad desde los controles y vuelve a 1×, se respeta; solo se fija al cargar
        onLoadedMetadata={(e) => (e.currentTarget.playbackRate = rate)}
        onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
      />
      {sound && muted && (
        <button type="button" className="media__sound" onClick={() => playWithSound(ref.current)}>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" />
            <path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.8 7.8 0 0 1 0 11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          {label}
        </button>
      )}
    </>
  );
}
