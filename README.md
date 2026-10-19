# Portfolio · María José Rosas Cuellar

[English](#english) · [Español](#español)

## English

Product designer (UX/UI) from Cali, Colombia. This is my portfolio: a place to get to know me, see what I bring to a team and explore my projects.

**Visit it at [majorosas16.github.io](https://majorosas16.github.io)**

### What you'll find

- **Home:** a box that opens when you tap it. The objects that come out can be dragged around, and each one tells something about how I work.
- **About me:** who I am, my approach and the tools I work with, with photos, stickers and a few hidden messages.
- **What I bring:** a folder that opens to show four strengths: listening and empathy, curiosity, collaboration and attention to detail.
- **Projects:** six categories (UX/UI, UX Research, Accessibility, DS & Branding, Graphic design and Freelance). Each one opens its ring binder with the projects, which you can filter by tag and view in detail, with a link to Behance when available. There's a surprise if you bring the coffee closer 😉
- **Let's talk:** how to get in touch.
- **Stickers:** a floating tab on the side holds a sticker sheet. Peel one off (with sound), stick it anywhere on the page, move it around or peel it off again. They stay where you left them while you browse.

It's available in **English and Spanish**, adapts to phone, tablet and desktop, can be navigated with a keyboard and screen reader, and respects the reduced motion preference.

### How it's made

Designed in **Figma** and built with **React** and **Vite**, without UI libraries: each section follows the Figma frame (a 1512px canvas) and adapts to a single column on phones. Animations use CSS and the browser's Web Animations API.

Images, videos, stickers and sounds go through a script (`npm run images`) that takes the originals from `design-originals/` and generates light versions for the web in `src/assets/` (WebP and MP4, without metadata; stickers get their die-cut white border). It's published automatically with **GitHub Actions** and **GitHub Pages** every time `main` changes.

### Local development

```bash
npm install
npm run dev        # local server (only on your computer; don't use --host)
npm run images     # regenerate images, videos, stickers and sounds (add -- --forzar to redo all)
npm run build      # build the site into dist/
npm run preview    # preview the build
```

- `src/sections/`: the page sections (Intro, About, WhatIBring, Projects).
- `src/components/`: header, footer, stickers and shared pieces.
- `src/i18n/`: texts in Spanish and English.
- `design-originals/`: high-resolution originals (not served on the site).
- `scripts/`: image and video optimization.

### Privacy and security

- No cookies, analytics or trackers. The browser only remembers the chosen language and the stickers you placed (during the visit).
- The published site has a Content Security Policy: it only runs its own code and only loads its own files plus Google Fonts.
- Published images and videos carry no metadata (no location). Before adding new photos to `design-originals/`, remove their location: `exiftool -gps:all= -overwrite_original photo.heic`.

### Contact

- Email: [multimedia.mr16@gmail.com](mailto:multimedia.mr16@gmail.com)
- [Behance](https://www.behance.net/marajrosasc)
- [LinkedIn](https://www.linkedin.com/in/majo-rosas-creative)
- [GitHub](https://github.com/Majorosas16)

---

## Español

Diseñadora de producto (UX/UI) de Cali, Colombia. Este es mi portafolio: un espacio para conocerme, ver lo que aporto a un equipo y recorrer mis proyectos.

**Visítalo en [majorosas16.github.io](https://majorosas16.github.io)**

### Qué vas a encontrar

- **Inicio:** una caja que se abre al tocarla. Los objetos que salen se pueden mover y cada uno cuenta algo de cómo trabajo.
- **Sobre mí:** quién soy, mi enfoque y las herramientas con las que trabajo, con fotos, stickers y algunos mensajes escondidos.
- **Lo que aporto:** una carpeta que se abre para mostrar cuatro aportes: escucha y empatía, curiosidad, colaboración y atención al detalle.
- **Proyectos:** seis categorías (UX/UI, UX Research, Accesibilidad, DS y Marca, Diseño gráfico y Freelance). Cada una abre su carpeta de anillos con los proyectos, que se pueden filtrar por etiqueta y ver en detalle, con enlace a Behance cuando lo tienen. Hay una sorpresa si acercas el café 😉
- **Hablemos:** cómo contactarme.
- **Stickers:** una pestaña flotante al costado guarda una hoja de stickers. Despega uno (con sonido), pégalo en cualquier parte de la página, muévelo o vuelve a despegarlo. Se quedan donde los dejas mientras recorres la web.

Está en **español e inglés**, se adapta a celular, tablet y escritorio, se puede recorrer con teclado y lector de pantalla, y respeta la preferencia de reducir el movimiento.

### Cómo está hecho

Diseñado en **Figma** y desarrollado con **React** y **Vite**, sin librerías de interfaz: cada sección sigue el frame de Figma (un lienzo de 1512px) y en celular se adapta a una sola columna. Las animaciones usan CSS y la Web Animations API del navegador.

Las imágenes, videos, stickers y sonidos pasan por un script (`npm run images`) que toma los originales de `design-originals/` y genera versiones livianas para la web en `src/assets/` (WebP y MP4, sin metadatos; a los stickers les añade su borde blanco troquelado). Se publica sola con **GitHub Actions** y **GitHub Pages** cada vez que cambia `main`.

### Desarrollo local

```bash
npm install
npm run dev        # servidor local (solo en tu computador; no uses --host)
npm run images     # regenera imágenes, videos, stickers y sonidos (añade -- --forzar para rehacer todo)
npm run build      # genera la web en dist/
npm run preview    # previsualiza el build
```

- `src/sections/`: las secciones de la página (Intro, About, WhatIBring, Projects).
- `src/components/`: header, footer, stickers y piezas compartidas.
- `src/i18n/`: textos en español e inglés.
- `design-originals/`: originales en alta resolución (no se publican en la web).
- `scripts/`: optimización de imágenes y videos.

### Privacidad y seguridad

- Sin cookies, analítica ni rastreadores. El navegador solo recuerda el idioma elegido y los stickers que pegaste (durante la visita).
- La web publicada tiene una política de seguridad de contenido (CSP): solo ejecuta su propio código y solo carga sus propios archivos y las fuentes de Google Fonts.
- Las imágenes y videos publicados no llevan metadatos (ni ubicación). Antes de añadir fotos nuevas a `design-originals/`, quítales la ubicación: `exiftool -gps:all= -overwrite_original foto.heic`.

### Contacto

- Correo: [multimedia.mr16@gmail.com](mailto:multimedia.mr16@gmail.com)
- [Behance](https://www.behance.net/marajrosasc)
- [LinkedIn](https://www.linkedin.com/in/majo-rosas-creative)
- [GitHub](https://github.com/Majorosas16)
