// Genera las imágenes de la web (src/assets/**/*.webp) a partir de los originales en alta resolución (design-originals/).
// - Reduce cada imagen al ancho indicado en scripts/image-sizes.json (6× su tamaño máximo en pantalla),
//   así se ve igual de nítida en pantallas de alta densidad sin descargar píxeles que nadie puede ver.
// - Guarda en WebP casi sin pérdida (nearLossless): ningún píxel cambia más de unos pocos niveles; a la vista es idéntica.
// - Si el WebP no pesa menos que el original, se usa el original tal cual (mismo nombre y extensión).
// Uso: npm run images            (solo las que faltan o cuyo original cambió)
//      npm run images -- --forzar (todas)
import sharp from 'sharp';
import { readFile, readdir, mkdir, stat, copyFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const origen = join(raiz, 'design-originals');
const destino = join(raiz, 'src', 'assets');
const anchos = JSON.parse(await readFile(join(raiz, 'scripts', 'image-sizes.json'), 'utf8'));
const omitir = new Set(anchos._omitir ?? []);
const forzar = process.argv.includes('--forzar');

// Al reducir, el alto se redondea y la proporción puede cambiar en la 4.ª cifra decimal; en móvil (alto automático)
// eso movería unas centésimas de píxel todo lo que va debajo. Se busca, desde el ancho pedido hacia arriba,
// el ancho cuyo alto sea casi entero, para que la proporción quede igual que la del original.
const anchoExacto = (pedido, w, h) => {
  if (pedido >= w) return { width: w, height: h };
  let mejor = { width: pedido, error: Infinity };
  for (let a = pedido; a <= Math.min(w, Math.ceil(pedido * 1.15)); a++) {
    const alto = (a * h) / w;
    const error = Math.abs(alto - Math.round(alto)) / alto;
    if (error < mejor.error) mejor = { width: a, error };
    if (error < 1e-6) break;
  }
  return { width: mejor.width, height: Math.round((mejor.width * h) / w) };
};

const recorrer = async (dir) =>
  (await Promise.all((await readdir(dir, { withFileTypes: true })).map((e) => {
    const p = join(dir, e.name);
    return e.isDirectory() ? recorrer(p) : /\.(png|jpe?g)$/i.test(e.name) ? [p] : [];
  }))).flat();

let hechas = 0;
let antes = 0;
let despues = 0;
for (const archivo of await recorrer(origen)) {
  const rel = relative(origen, archivo).split('\\').join('/');
  if (omitir.has(rel)) continue;
  const salida = join(destino, rel.replace(/\.(png|jpe?g)$/i, '.webp'));
  const copia = join(destino, rel);
  const hecha = [salida, copia].find((f) => existsSync(f));
  if (!forzar && hecha && (await stat(hecha)).mtimeMs >= (await stat(archivo)).mtimeMs) continue;

  const { width, height } = await sharp(archivo).metadata();
  // Una versión por idioma (p. ej. sticker-about-me.en.png) usa el mismo ancho que la original
  let ancho = anchos[rel] ?? anchos[rel.replace(/\.[a-z]{2}(\.\w+)$/, '$1')];
  if (!ancho) {
    console.log(`!  ${rel}: no tiene ancho en scripts/image-sizes.json; se convierte a su tamaño original (${width}px)`);
    ancho = width;
  }
  await mkdir(dirname(salida), { recursive: true });
  const info = await sharp(archivo)
    .resize({ ...anchoExacto(ancho, width, height), fit: 'fill', kernel: 'lanczos3' })
    .webp({ nearLossless: true, quality: 60, effort: 6 })
    .toFile(salida);
  const pesoAntes = (await stat(archivo)).size;
  antes += pesoAntes;
  hechas++;
  if (info.size >= pesoAntes) {
    await rm(salida);
    await copyFile(archivo, copia);
    despues += pesoAntes;
    console.log(`=  ${rel}  el original ya es más ligero (${(pesoAntes / 1024).toFixed(0)} KB): se usa tal cual`);
    continue;
  }
  await rm(copia, { force: true });
  despues += info.size;
  console.log(`✓  ${rel}  ${width}px → ${info.width}px   ${(pesoAntes / 1024).toFixed(0)} KB → ${(info.size / 1024).toFixed(0)} KB`);
}

console.log(hechas
  ? `\n${hechas} imágenes generadas en src/assets/: ${(antes / 1048576).toFixed(1)} MB → ${(despues / 1048576).toFixed(1)} MB`
  : 'Todas las imágenes ya estaban al día (usa --forzar para regenerarlas).');
