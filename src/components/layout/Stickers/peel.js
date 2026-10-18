// Geometría del sticker que se despega (Peelable.jsx). Todo en px dentro de la caja del sticker (w × h, sin girar).
// C: punto del borde que se levanta (una esquina) · P: dónde está ahora ese punto (sigue al dedo o al cursor).
// El doblez es la mediatriz entre C y P: lo que queda del lado de C se levanta y, reflejado sobre el doblez, se ve
// encima como el reverso blanco del sticker; lo del otro lado sigue pegado.

// Recorta un polígono al semiplano f ≥ 0 (Sutherland–Hodgman)
const clip = (pts, f) => {
  const out = [];
  pts.forEach((a, i) => {
    const b = pts[(i + 1) % pts.length];
    const fa = f(a);
    const fb = f(b);
    if (fa >= 0) out.push(a);
    if (fa >= 0 !== fb >= 0) {
      const t = fa / (fa - fb);
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
  });
  return out;
};

const area = (p) => Math.abs(p.reduce((s, a, i) => s + a[0] * p[(i + 1) % p.length][1] - p[(i + 1) % p.length][0] * a[1], 0)) / 2;

const polygon = (p) => (p.length < 3 ? 'polygon(0 0, 0 0, 0 0)' : `polygon(${p.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(', ')})`);

// Esquina de la caja más cercana a un punto
export const nearestCorner = (w, h, x, y) => [x < w / 2 ? 0 : w, y < h / 2 ? 0 : h];

// stuck / lifted: clip-path de la parte pegada y de la levantada · matrix: reflejo sobre el doblez (transform-origin
// 0 0) · shade: degradado del reverso, más oscuro junto al doblez · stuckRatio: fracción de la caja aún pegada
export function peelGeometry(w, h, C, P) {
  const vx = C[0] - P[0];
  const vy = C[1] - P[1];
  const len = Math.hypot(vx, vy);
  if (len < 0.5) return null;
  const nx = vx / len;
  const ny = vy / len;
  const mx = (C[0] + P[0]) / 2;
  const my = (C[1] + P[1]) / 2;
  const f = ([x, y]) => (x - mx) * nx + (y - my) * ny;
  const box = [[0, 0], [w, 0], [w, h], [0, h]];
  const lifted = clip(box, f);
  const stuck = clip(box, (p) => -f(p));

  // Reflejo X' = X − 2((X − M)·n) n
  const k = 2 * (mx * nx + my * ny);
  const a = 1 - 2 * nx * nx;
  const b = -2 * nx * ny;
  const d = 1 - 2 * ny * ny;

  // Degradado a lo largo de n (ángulo CSS: 0deg apunta arriba), con el doblez en t0
  const angle = Math.atan2(nx, -ny);
  const L = Math.abs(w * Math.sin(angle)) + Math.abs(h * Math.cos(angle));
  const t0 = 50 + (((mx - w / 2) * nx + (my - h / 2) * ny) / L) * 100;

  return {
    stuck: polygon(stuck),
    lifted: lifted.length >= 3 ? polygon(lifted) : null,
    matrix: `matrix(${a}, ${b}, ${b}, ${d}, ${k * nx}, ${k * ny})`,
    shade: `linear-gradient(${angle}rad, #d4d0cb ${t0}%, #f3f1ee ${t0 + 10}%, #fff ${t0 + 38}%, #f7f6f4 100%)`,
    stuckRatio: stuck.length >= 3 ? area(stuck) / (w * h) : 0,
  };
}
