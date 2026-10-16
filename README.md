# Portafolio · María José Rosas Cuellar

Landing page construida en **React + Vite** a partir de los 4 frames "WEB" del archivo de Figma *Portfolio*:

| Sección | Archivo | Frame de Figma |
|---|---|---|
| Inicio — "¿Abrimos la caja?": la caja se abre y salen los objetos | `src/sections/Intro/Intro.jsx` | 121:2271 + parte superior de 130:4479 + "Boxes" 162:2418 |
| Sobre mí, Mi enfoque, Mi toolkit | `src/sections/About/About.jsx` | 130:4479 |
| Lo que aporto | `src/sections/WhatIBring/WhatIBring.jsx` | 146:5632 |
| Proyectos y Hablemos | `src/sections/Projects/Projects.jsx` | 149:424 |

## 1. Abrir en Visual Studio Code

1. Descomprime la carpeta `portafolio-majo` y ábrela en VS Code (*File → Open Folder*).
2. Abre la terminal de VS Code (*Terminal → New Terminal*) y ejecuta:

```bash
npm install      # instala React y Vite (solo la primera vez)
npm run assets   # comprueba/descarga las imágenes de Figma en src/assets/
npm run dev      # abre la web en http://localhost:5173
```

> Necesitas tener instalado [Node.js](https://nodejs.org) 18 o superior.

### Sobre las imágenes (importante)

Hay dos carpetas de imágenes, con la misma estructura (una carpeta por sección y `shared/` para lo que usan varias):

```
design-originals/          ORIGINALES en alta resolución (PNG exportados de Figma). No se publican.
src/assets/                lo que usa la web: versiones optimizadas (WebP) + los SVG
  images.js                helper byName(): img['box-closed'] (nombre sin extensión)
  shared/                  burbujas de chat y el papel del fondo
  sections/intro/          caja (4 estados) y los 5 objetos
  sections/about/          sticker, MAJO, foto, nota, perro, reacciones, cursores
  sections/what-i-bring/   título, carpeta, fotos de proyectos, etiquetas
  sections/projects/       foto, sticker, corona, objetos, foto de contacto, íconos de redes
```

**Para añadir o cambiar una imagen:**

1. Guarda el PNG en alta resolución en `design-originals/`, en la carpeta de su sección, por ejemplo `design-originals/sections/intro/keys.png`.
2. Si es nueva, añade su ancho en `scripts/image-sizes.json`: 6 × el ancho máximo al que se ve en la web, sin superar el original.
3. Ejecuta `npm run images`. Se genera la versión para la web en `src/assets/`. En el código se usa sin extensión: `img['keys']`.

**Por qué:** los PNG originales pesaban casi 70 MB y la web tardaba casi un minuto en cargar con una conexión 4G.
- `npm run images` reduce cada imagen a 6 veces el tamaño máximo al que se muestra. Eso es el doble de los píxeles de una pantalla 3x, así que se ve igual de nítida que el original.
- La guarda en WebP casi sin pérdida: ningún píxel cambia más de 3 niveles de 255.
- Si el original ya pesa menos que el WebP, se usa el original tal cual.
- Las imágenes de las secciones de abajo se cargan al acercarse con el scroll (`loading="lazy"`), y la caja cerrada se pide primero (`fetchpriority="high"`).

`npm run assets` descarga las imágenes con enlaces temporales de Figma (**vencen alrededor del 22 de octubre de 2026**): los PNG van a `design-originals/` y los SVG a `src/assets/`. Si el archivo ya existe, no lo toca.

Las imágenes de la caja (`box-closed`, `box-opening-1`, `box-opening-2`, `box-open`) y `majo-letters`, `note-orange`, `note-green`, `reaction-approach`, `reaction-toolkit`, `photo-projects`, `photo-contact` y `title-what-i-bring` de `design-originals/` ya están a 3x y con fondo transparente. **No las vuelvas a descargar con `npm run assets -- --forzar`**: sus enlaces apuntan a la exportación antigua (1x y con fondo blanco). `design-originals/shared/paper-background-original.png` es el original del que se generó `src/assets/shared/paper-background-seamless.jpg` (el que usa la web).

Si algún enlace venció, exporta ese elemento desde Figma (panel derecho → *Export* → PNG o SVG) con **exactamente el mismo nombre** y guárdalo en la ruta que indica `scripts/assets.json` (PNG en `design-originals/`, SVG en `src/assets/`).

### Estilos

`src/styles.css` solo tiene lo compartido (variables, reset, base y el lienzo de las secciones). Cada componente y sección tiene su propio CSS al lado de su `.jsx` y lo importa él mismo. Cada sección vive en su carpeta: `src/sections/Intro/`, `About/`, `WhatIBring/` y `Projects/` (cada una con su `.jsx` y su `.css`); los componentes compartidos están en `src/components/`.

### Idiomas (Español / English)

El selector **ES | EN** del header cambia todos los textos. Empieza en español y recuerda la elección del visitante.

- **Textos:** todos están en `src/i18n/translations.js`, en dos ramas (`es` y `en`) con las mismas claves. Para cambiar un texto, edítalo ahí; no hace falta tocar los componentes. Marcas de formato: `**negrita**`, `[[palabra]]` (palabra rodeada por el círculo dibujado a mano; `[[blue:palabra]]` para el azul) y `\n` (salto de línea).
- **Imágenes con texto:** están registradas en `src/i18n/images.js`. Para añadir la versión inglesa, guarda el PNG en alta resolución con el nombre indicado y ejecuta `npm run images`. Mientras no exista, se muestra la versión en español:

  | Imagen original | Versión inglesa (pendiente) |
  |---|---|
  | `design-originals/sections/about/sticker-about-me.png` | `design-originals/sections/about/sticker-about-me.en.png` |
  | `design-originals/sections/what-i-bring/title-what-i-bring.png` | `design-originals/sections/what-i-bring/title-what-i-bring.en.png` |
  | `design-originals/sections/projects/sticker-projects.png` | `design-originals/sections/projects/sticker-projects.en.png` |

- El selector y el contexto de idioma están en `src/components/LanguageSwitch.jsx` y `src/i18n/LanguageContext.jsx` (`useLanguage()` devuelve `{ lang, setLang, t }`).

## 2. Subir a GitHub

```bash
git init
git add .
git commit -m "Primera versión del portafolio"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/portafolio.git
git push -u origin main
```

(Crea antes el repositorio vacío en github.com → *New repository*.)

## 3. Publicarlo con GitHub Pages

El proyecto ya incluye `.github/workflows/deploy.yml`, que publica la web automáticamente cada vez que subes cambios a `main`.

1. En el repositorio de GitHub ve a **Settings → Pages**.
2. En *Build and deployment → Source* elige **GitHub Actions**. **Sin este paso el despliegue falla** con `Failed to create deployment (status: 404) … Ensure GitHub Pages has been enabled`.
3. Haz un push (o ve a *Actions* → *Publicar en GitHub Pages* → *Re-run* / *Run workflow*).
4. En unos minutos la web queda en `https://majorosas16.github.io/PortfolioMajo/`.

## Pendientes por completar

- **Enlaces de redes** en `src/sections/Projects/Projects.jsx` (arreglo `socials`): WhatsApp, LinkedIn y GitHub tienen enlaces de ejemplo. Behance ya apunta a `behance.net/marajrosasc` y el correo a `multimedia.mr16@gmail.com`.
- **Animaciones**: la caja del inicio entra, se abre al hacer clic (estados `cerrada → abriendo → abierta` en `Intro/Intro.jsx`, con CSS) y los objetos flotan; "Sobre mí" aparece con un fundido al hacer scroll. Faltan otras (fotos que salen de la carpeta, etc.).
- **Acción de los objetos**: "Toca los objetos" aún no hace nada al tocarlos; `ObjectItem` acepta un `onClick` para conectarlo más adelante.

## Cómo está construido

- **Escritorio y tablet**: cada sección reproduce el frame de Figma con las mismas coordenadas (lienzo de 1512 px). La variable CSS `--u` equivale a 1 px de Figma y se reduce proporcionalmente en pantallas más pequeñas, así la composición se mantiene igual al diseño.
- **Celular (≤ 768 px)**: los elementos dejan de usar coordenadas y se apilan en una columna (en el inicio, los objetos se mantienen en arco sobre la caja) y el menú se vuelve deslizable.
- **Encabezado**: retícula de 12 columnas con margen lateral de 110 px en escritorio (proporcional en pantallas menores, 20 px en celular).
- El componente `P` (`src/components/P.jsx`) recibe las coordenadas de Figma (`x`, `y`, `w`, `h`, rotación `r`, tamaño de fuente `fs`). Para mover algo, cambia esos números.
- Tipografías de Google Fonts: **Stack Sans Headline**, **Stack Sans Text** y **Reenie Beanie** (cargadas en `index.html`).
- Elementos complejos de Figma (cajas, títulos tipo recorte, post-its, fotos con máscara) se exportaron como imagen completa; los textos, botones, etiquetas, burbujas de chat y la carpeta azul están construidos en código.
