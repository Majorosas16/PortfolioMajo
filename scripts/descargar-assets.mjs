// Descarga las imágenes exportadas desde Figma a public/img/
// Uso: npm run assets
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const destino = join(raiz, 'public', 'img');
const lista = JSON.parse(await readFile(join(raiz, 'scripts', 'assets.json'), 'utf8'));

await mkdir(destino, { recursive: true });

const forzar = process.argv.includes('--forzar');
let ok = 0;
let fallos = [];

for (const [nombre, url] of Object.entries(lista)) {
  if (nombre.startsWith('_')) continue;
  const archivo = join(destino, nombre);
  if (existsSync(archivo) && !forzar) {
    console.log(`•  ya existe  ${nombre}`);
    ok++;
    continue;
  }
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length === 0) throw new Error('archivo vacío');
    await writeFile(archivo, buffer);
    console.log(`✓  ${nombre}  (${(buffer.length / 1024).toFixed(0)} KB)`);
    ok++;
  } catch (err) {
    console.log(`✗  ${nombre}  → ${err.message}`);
    fallos.push(nombre);
  }
}

console.log(`\n${ok} de ${Object.keys(lista).filter((k) => !k.startsWith('_')).length} imágenes listas en public/img/`);
if (fallos.length) {
  console.log('\nNo se pudieron descargar (probablemente vencieron los enlaces de Figma):');
  fallos.forEach((f) => console.log('  - ' + f));
  console.log('Expórtalas manualmente desde Figma con ese mismo nombre y guárdalas en public/img/.');
  process.exitCode = 1;
}
