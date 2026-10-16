# Portafolio · María José Rosas Cuellar

Landing page construida en **React + Vite** a partir de los 4 frames "WEB" del archivo de Figma *Portfolio*:

| Sección | Archivo | Frame de Figma |
|---|---|---|
| Inicio — "¿Abrimos la caja?": la caja se abre y salen los objetos | `src/sections/Intro.jsx` | 121:2271 + parte superior de 130:4479 + "Boxes" 162:2418 |
| Sobre mí, Mi enfoque, Mi toolkit | `src/sections/SobreMi.jsx` | 130:4479 |
| Lo que aporto | `src/sections/Aporto.jsx` | 146:5632 |
| Proyectos y Hablemos | `src/sections/Proyectos.jsx` | 149:424 |

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

Las imágenes viven en `src/assets/`, una carpeta por sección, y se importan desde el código (Vite las incluye en el build con un nombre versionado):

```
src/assets/
  imagenes.js             helper porNombre() para usar import.meta.glob
  shared/                 lo que usan varias secciones: burbujas de chat y el papel del fondo
  sections/inicio/        caja (4 estados) y los 5 objetos
  sections/sobre-mi/      sticker, MAJO, foto, nota, perro, reacciones, cursores
  sections/lo-que-aporto/ título, carpeta, fotos de proyectos, etiquetas
  sections/proyectos/     foto, sticker, corona, objetos, foto de contacto, íconos de redes
```

Para usar una imagen en una sección: `img['nombre.png']` (cada sección define `img` con su carpeta). Si añades una imagen nueva, ponla en la carpeta de su sección (o en `shared/` si la usan varias); no la dupliques.

`npm run assets` descarga las imágenes con enlaces temporales de Figma (**vencen alrededor del 22 de octubre de 2026**) a la ruta indicada en `scripts/assets.json`; si el archivo ya existe, no lo toca.

Las imágenes de la caja (`caja-cerrada`, `caja-abriendo-1`, `caja-abriendo-2`, `caja-abierta`) y `majo-letras`, `nota-naranja`, `nota-verde`, `reaccion-enfoque`, `reaccion-toolkit`, `foto-proyectos`, `foto-contacto` y `titulo-aporto` ya están a 3x y con fondo transparente. **No las vuelvas a descargar con `npm run assets -- --forzar`**: sus enlaces apuntan a la exportación antigua (1x y con fondo blanco). `shared/fondo-papel.png` es el original del que se generó `fondo-papel-continuo.jpg` (el que usa la web).

Si algún enlace venció, exporta ese elemento desde Figma (panel derecho → *Export* → PNG o SVG) con **exactamente el mismo nombre** y guárdalo en la ruta que indica `scripts/assets.json` dentro de `src/assets/`.

### Estilos

`src/styles.css` solo tiene lo compartido (variables, reset, base y el lienzo de las secciones). Cada componente y sección tiene su propio CSS al lado de su `.jsx` (`Header.css`, `Message.css`, `Intro.css`, `SobreMi.css`, etc.) y lo importa él mismo.

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

- **Enlaces de redes** en `src/sections/Proyectos.jsx` (arreglo `redes`): WhatsApp, LinkedIn y GitHub tienen enlaces de ejemplo. Behance ya apunta a `behance.net/marajrosasc` y el correo a `multimedia.mr16@gmail.com`.
- **Animaciones**: la caja del inicio entra, se abre al hacer clic (estados `cerrada → abriendo → abierta` en `Intro.jsx`, con CSS) y los objetos flotan; "Sobre mí" aparece con un fundido al hacer scroll. Faltan otras (fotos que salen de la carpeta, etc.).
- **Acción de los objetos**: "Toca los objetos" aún no hace nada al tocarlos; `ObjectItem` acepta un `onClick` para conectarlo más adelante.

## Cómo está construido

- **Escritorio y tablet**: cada sección reproduce el frame de Figma con las mismas coordenadas (lienzo de 1512 px). La variable CSS `--u` equivale a 1 px de Figma y se reduce proporcionalmente en pantallas más pequeñas, así la composición se mantiene igual al diseño.
- **Celular (≤ 768 px)**: los elementos dejan de usar coordenadas y se apilan en una columna (en el inicio, los objetos se mantienen en arco sobre la caja) y el menú se vuelve deslizable.
- **Encabezado**: retícula de 12 columnas con margen lateral de 110 px en escritorio (proporcional en pantallas menores, 20 px en celular).
- El componente `P` (`src/components/P.jsx`) recibe las coordenadas de Figma (`x`, `y`, `w`, `h`, rotación `r`, tamaño de fuente `fs`). Para mover algo, cambia esos números.
- Tipografías de Google Fonts: **Stack Sans Headline**, **Stack Sans Text** y **Reenie Beanie** (cargadas en `index.html`).
- Elementos complejos de Figma (cajas, títulos tipo recorte, post-its, fotos con máscara) se exportaron como imagen completa; los textos, botones, etiquetas, burbujas de chat y la carpeta azul están construidos en código.
