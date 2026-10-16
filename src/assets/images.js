// Convierte el resultado de import.meta.glob en un objeto { 'nombre': url }, con el nombre del archivo SIN extensión.
// Así el código no depende del formato (webp, png, svg…) que genere `npm run images`.
// Uso: const img = byName(import.meta.glob('../../assets/sections/intro/*', { eager: true, import: 'default' }));
//      <img src={img['box-closed']} />
export const byName = (glob) =>
  Object.fromEntries(Object.entries(glob).map(([path, url]) => [path.split('/').pop().replace(/\.[^.]+$/, ''), url]));
