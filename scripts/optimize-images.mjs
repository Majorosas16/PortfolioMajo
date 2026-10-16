// Genera las imágenes de la web (src/assets/**/*.webp) a partir de los originales en alta resolución (design-originals/).
// - Reduce cada imagen al ancho indicado en scripts/image-sizes.json (6× su tamaño máximo en pantalla),
//   así se ve igual de nítida en pantallas de alta densidad sin descargar píxeles que nadie puede ver.
// - Guarda en WebP casi sin pérdida (nearLossless): ningún píxel cambia más de unos pocos niveles; a la vista es idéntica.
// - Si el WebP no pesa menos que el original, se usa el original tal cual (mismo nombre y extensión).
// Uso: npm run images            (solo las que faltan o cuyo original cambió)
//      npm run images -- --forzar (todas)
import sharp from 'sharp';
import { readFile, readdir, mkdir, stat, copyFile, rm, mkdtemp } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { basename, dirname, extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const origen = join(raiz, 'design-originals');
const destino = join(raiz, 'src', 'assets');
const anchos = JSON.parse(await readFile(join(raiz, 'scripts', 'image-sizes.json'), 'utf8'));
const omitir = new Set(anchos._omitir ?? []);
const forzar = process.argv.includes('--forzar');

// Fotos del carrusel de «Sobre mí» (fotos de iPhone: HEIC, JPG, PNG). Se tratan aparte (ver el final del archivo).
const galeria = {
  origen: 'sections/about/Photos Majo',
  // Otras fotos que también entran en el carrusel (la foto original del diseño)
  extra: ['sections/about/photo-majo.png'],
  destino: 'sections/about/photos',
  // Se muestran a 352 px de ancho como máximo (escritorio; 330 px en celular). Se generan a 2× y 3× de ese tamaño
  // y el navegador elige con srcset la que corresponde a su pantalla. Nunca se amplía: si el original es más
  // pequeño, el ancho mayor es el del original.
  anchos: [720, 1080],
  // Recorte vertical 9:16, el de la foto del diseño (352 × 626)
  proporcion: 16 / 9,
};

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
    const rel = relative(origen, p).split('\\').join('/');
    if (rel === galeria.origen || galeria.extra.includes(rel)) return [];
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

// Fotos del carrusel: cada original se recorta a 9:16 y se guarda en WebP de alta calidad en los anchos de galeria.anchos,
// como <nombre>-<ancho>.webp (p. ej. img-1112-1056.webp). Se conserva su perfil de color (Display P3 en las del iPhone)
// para que los colores no se apaguen. sharp no lee HEIC: en macOS se pasa antes a TIFF (sin pérdida) con `sips`.
const dirGaleria = join(origen, galeria.origen);
let fotos = 0;
const tmp = await mkdtemp(join(tmpdir(), 'fotos-'));
const archivosGaleria = [
  ...(existsSync(dirGaleria) ? await readdir(dirGaleria) : []).map((n) => join(dirGaleria, n)),
  ...galeria.extra.map((f) => join(origen, f)),
];
for (const archivo of archivosGaleria) {
  const nombre = basename(archivo);
  if (!/\.(heic|heif|png|jpe?g)$/i.test(nombre)) continue;
  const base = basename(nombre, extname(nombre)).replace(/\.\w+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const fecha = (await stat(archivo)).mtimeMs;
  const hecha = join(destino, galeria.destino, `${base}-${galeria.anchos[0]}.webp`);
  if (!forzar && existsSync(hecha) && (await stat(hecha)).mtimeMs >= fecha) continue;

  let entrada = archivo;
  if (/\.hei[cf]$/i.test(nombre)) {
    entrada = join(tmp, `${base}.tiff`);
    try {
      execFileSync('sips', ['-s', 'format', 'tiff', archivo, '--out', entrada], { stdio: 'ignore' });
    } catch {
      console.log(`!  ${relative(origen, archivo)}: para convertir HEIC hace falta macOS (sips). Se omite.`);
      continue;
    }
  }
  await mkdir(join(destino, galeria.destino), { recursive: true });
  for (const viejo of (await readdir(join(destino, galeria.destino))).filter((f) => f.startsWith(`${base}-`))) {
    await rm(join(destino, galeria.destino, viejo));
  }
  const { width: anchoOriginal, height: altoOriginal } = await sharp(entrada).rotate().metadata();
  const anchos = [...new Set(galeria.anchos.map((w) => Math.min(w, anchoOriginal)))];
  const pesoAntes = (await stat(archivo)).size;
  const pesos = [];
  for (const w of anchos) {
    const info = await sharp(entrada)
      .rotate()
      .resize({ width: w, height: Math.min(Math.round(w * galeria.proporcion), Math.round((w * altoOriginal) / anchoOriginal)), fit: 'cover', position: 'centre', kernel: 'lanczos3' })
      .keepIccProfile()
      .webp({ quality: 90, smartSubsample: true, effort: 6 })
      .toFile(join(destino, galeria.destino, `${base}-${w}.webp`));
    pesos.push(`${w}px ${(info.size / 1024).toFixed(0)} KB`);
  }
  fotos++;
  console.log(`✓  ${relative(origen, archivo)}  (${(pesoAntes / 1024).toFixed(0)} KB) → ${pesos.join(' · ')}`);
}
await rm(tmp, { recursive: true, force: true });

if (hechas) console.log(`\n${hechas} imágenes generadas en src/assets/: ${(antes / 1048576).toFixed(1)} MB → ${(despues / 1048576).toFixed(1)} MB`);
if (fotos) console.log(`${fotos} fotos del carrusel generadas en src/assets/${galeria.destino}/`);
if (!hechas && !fotos) console.log('Todas las imágenes ya estaban al día (usa --forzar para regenerarlas).');
