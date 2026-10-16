// Convierte el resultado de import.meta.glob en un objeto { 'nombre.png': url }.
// Uso: const img = porNombre(import.meta.glob('../assets/sections/inicio/*', { eager: true, import: 'default' }));
//      <img src={img['caja-cerrada.png']} />
export const porNombre = (glob) =>
  Object.fromEntries(Object.entries(glob).map(([ruta, url]) => [ruta.split('/').pop(), url]));
