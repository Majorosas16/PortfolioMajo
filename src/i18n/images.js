// Imágenes que contienen texto y pueden tener una versión por idioma.
// Para añadir la versión inglesa:
//   1. Exporta la imagen en alta resolución como PNG con el nombre de `en` + .png, en design-originals/ y en la
//      misma carpeta que la original, p. ej. design-originals/sections/about/sticker-about-me.en.png
//   2. Ejecuta `npm run images`: genera la versión para la web en src/assets/ al mismo tamaño que la española.
// No hay que tocar el código: mientras el archivo no exista se muestra la versión en español.
export const localizedImages = {
  'sticker-about-me': { es: 'sticker-about-me', en: 'sticker-about-me.en' }, // src/assets/sections/about/ — pendiente
  'title-what-i-bring': { es: 'title-what-i-bring', en: 'title-what-i-bring.en' }, // src/assets/sections/what-i-bring/ — pendiente
  'sticker-projects': { es: 'sticker-projects', en: 'sticker-projects.en' }, // src/assets/sections/projects/ — pendiente
};

// img: objeto de la sección (byName); name: nombre de la imagen original.
export const localizedSrc = (img, name, lang) => img[localizedImages[name]?.[lang]] ?? img[name];
