import src from '../../../assets/stickers/sticker-peeling.mp3';

// Sonido de despegar un sticker (design-originals/stickers/sticker peeling.MP3, copiado por `npm run images`).
// Va con Web Audio: una vez desbloqueado en un toque o clic, puede sonar en cualquier momento del gesto (también al
// arrastrar con el dedo, que en iPhone no cuenta como toque para un <audio>) y varias veces a la vez sin cortarse.
const VOLUME = 0.6;

let ctx = null;
let buffer = null;
let loading = null;

// Llamar dentro de un toque, clic o tecla (abrir el panel, tocar un sticker…): crea el audio y lo deja cargado
export function unlockPeelSound() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return;
  try {
    ctx ??= new Ctx();
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    loading ??= fetch(src)
      .then((r) => r.arrayBuffer())
      .then((data) => new Promise((resolve, reject) => ctx.decodeAudioData(data, resolve, reject)))
      .then((decoded) => {
        buffer = decoded;
      })
      .catch(() => {
        loading = null;
      });
  } catch {
    // Sin Web Audio: los stickers funcionan igual, sin sonido
  }
}

// Suena con una velocidad un poco distinta cada vez, para que no se repita idéntico. Si aún está cargando, suena al
// terminar de cargar, siempre que no haya pasado tanto que ya no coincida con el gesto.
export function playPeelSound() {
  if (!ctx) return;
  if (!buffer) {
    const asked = performance.now();
    loading?.then(() => buffer && performance.now() - asked < 400 && playPeelSound());
    return;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.playbackRate.value = 0.94 + Math.random() * 0.12;
  const gain = ctx.createGain();
  gain.gain.value = VOLUME;
  source.connect(gain).connect(ctx.destination);
  source.start();
}
