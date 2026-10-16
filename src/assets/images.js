// Convierte el resultado de import.meta.glob en un objeto { 'nombre.png': url }.
// Uso: const img = byName(import.meta.glob('../../assets/sections/intro/*', { eager: true, import: 'default' }));
//      <img src={img['box-closed.png']} />
export const byName = (glob) =>
  Object.fromEntries(Object.entries(glob).map(([path, url]) => [path.split('/').pop(), url]));
