// Imágenes que contienen texto y pueden tener una versión por idioma.
// Para añadir la versión inglesa: guarda el archivo con el nombre de `en` en la MISMA carpeta
// que la original (indicada en cada línea). No hay que tocar el código: mientras el archivo
// no exista se muestra la versión en español.
export const localizedImages = {
  'sticker-about-me.png': { es: 'sticker-about-me.png', en: 'sticker-about-me.en.png' }, // src/assets/sections/about/ — pendiente
  'title-what-i-bring.png': { es: 'title-what-i-bring.png', en: 'title-what-i-bring.en.png' }, // src/assets/sections/what-i-bring/ — pendiente
  'sticker-projects.png': { es: 'sticker-projects.png', en: 'sticker-projects.en.png' }, // src/assets/sections/projects/ — pendiente
};

// img: objeto de la sección (byName); name: nombre de la imagen original.
export const localizedSrc = (img, name, lang) => img[localizedImages[name]?.[lang]] ?? img[name];
