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
npm run assets   # descarga las imágenes desde Figma a public/img/
npm run dev      # abre la web en http://localhost:5173
```

> Necesitas tener instalado [Node.js](https://nodejs.org) 18 o superior.

### Sobre las imágenes (importante)

`npm run assets` descarga las imágenes con enlaces temporales de Figma que **vencen alrededor del 22 de octubre de 2026**. Hazlo cuanto antes; una vez descargadas quedan guardadas en `public/img/` y ya no dependen de Figma.

Las imágenes de la caja (`caja-cerrada`, `caja-abriendo-1`, `caja-abriendo-2`, `caja-abierta`) y `majo-letras`, `nota-naranja`, `nota-verde`, `reaccion-enfoque`, `reaccion-toolkit`, `foto-proyectos`, `foto-contacto` y `titulo-aporto` ya están en `public/img/` a 3x y con fondo transparente. **No las vuelvas a descargar con `npm run assets -- --forzar`**: sus enlaces en `scripts/assets.json` apuntan a la exportación antigua (1x y con fondo blanco).

Si algún enlace venció, el script te dice qué archivos faltan. En ese caso, exporta ese elemento desde Figma (panel derecho → *Export* → PNG o SVG), ponle **exactamente el mismo nombre** que aparece en `scripts/assets.json` y guárdalo en `public/img/`.

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
2. En *Source* elige **GitHub Actions**.
3. Haz un push (o ve a *Actions* → *Publicar en GitHub Pages* → *Run workflow*).
4. En unos minutos la web queda en `https://TU-USUARIO.github.io/portafolio/`.

## Pendientes por completar

- **Enlaces de redes** en `src/sections/Proyectos.jsx` (arreglo `redes`): WhatsApp, LinkedIn y GitHub tienen enlaces de ejemplo. Behance ya apunta a `behance.net/marajrosasc` y el correo a `multimedia.mr16@gmail.com`.
- **Animaciones**: la caja del inicio ya se abre al hacer clic (estados `cerrada → abriendo → abierta` en `Intro.jsx`, con CSS). Faltan otras (objetos que flotan, fotos que salen de la carpeta, etc.).
- **Acción de los objetos**: "Toca los objetos" aún no hace nada al tocarlos; `ObjectItem` acepta un `onClick` para conectarlo más adelante.

## Cómo está construido

- **Escritorio y tablet**: cada sección reproduce el frame de Figma con las mismas coordenadas (lienzo de 1512 px). La variable CSS `--u` equivale a 1 px de Figma y se reduce proporcionalmente en pantallas más pequeñas, así la composición se mantiene igual al diseño.
- **Celular (≤ 768 px)**: los elementos dejan de usar coordenadas y se apilan en una columna; los objetos con etiqueta pasan a una cuadrícula de 2 columnas y el menú se vuelve deslizable.
- El componente `P` (`src/components/P.jsx`) recibe las coordenadas de Figma (`x`, `y`, `w`, `h`, rotación `r`, tamaño de fuente `fs`). Para mover algo, cambia esos números.
- Tipografías de Google Fonts: **Stack Sans Headline**, **Stack Sans Text** y **Reenie Beanie** (cargadas en `index.html`).
- Elementos complejos de Figma (cajas, títulos tipo recorte, post-its, fotos con máscara) se exportaron como imagen completa; los textos, botones, etiquetas, burbujas de chat y la carpeta azul están construidos en código.
