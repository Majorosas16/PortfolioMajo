// Textos del portafolio por idioma. Las dos ramas (es / en) deben tener las mismas claves.
// Marcas de formato (las interpreta <Rich>):
//   **texto**          → negrita
//   [[texto]]          → palabra encerrada en un círculo (celular); [[blue:texto]] para la variante azul
//   \n                 → salto de línea
// Lo que no aparece aquí no se traduce: nombres propios (María José Rosas Cuellar, MAJO, Cali),
// términos que se usan en inglés en ambos idiomas (Front-End, UX / UI, UX research, Freelance), el correo y los enlaces.

export const translations = {
  es: {
    header: {
      role: 'Diseñadora de producto',
      nav: 'Secciones',
      menuOpen: 'Abrir menú',
      menuClose: 'Cerrar menú',
      menu: 'Menú',
      socials: 'Redes sociales',
      links: { about: 'Sobre mí', whatIBring: 'Lo que aporto', projects: 'Proyectos', contact: 'Hablemos' },
      language: 'Idioma',
    },
    intro: {
      greeting: 'Hola!',
      message: '¿Abrimos la caja?',
      read: 'Leído',
      openBox: 'Abrir la caja',
      tap: 'Toca y mueve los objetos',
      objects: {
        keys: { label: 'Diseño de producto', alt: 'Llaves antiguas' },
        plant: { label: 'Prototipado y código', alt: 'Planta en matera de concreto' },
        butterfly: { label: 'Diseño visual', alt: 'Mariposa azul' },
        mirror: { label: 'Empatía', alt: 'Espejo de mano antiguo' },
        headphones: { label: 'Colaboración', alt: 'Audífonos' },
      },
    },
    about: {
      stickerAlt: 'Sticker: Sobre mí',
      hello: 'Hola! soy',
      role: 'Diseñadora de \nMedios Interactivos',
      from: 'de Cali, Colombia',
      photoAlt: 'María José Rosas Cuellar',
      dogAlt: 'Perro asomándose',
      bio: 'Creativa por naturaleza, **curiosa por diseño** y tecnología. Siempre explorando **nuevas tendencias**, creando interfaces y **coleccionando inspiración.**',
      approach: {
        title: 'Mi enfoque',
        text: 'Crear interfaces intuitivas y consistentes, cuidando cada detalle de la experiencia. **Desde los flujos de usuario hasta los componentes visuales.**',
        highlight: 'Busco que cada decisión de diseño tenga sentido.',
        cursor: 'al final...',
      },
      toolkit: {
        title: 'Mi toolkit',
        text: 'Trabajo con Figma, componentes y Design Tokens para construir **sistemas de diseño escalables.** También exploro el desarrollo front-end con HTML, CSS, JS y React.',
        highlight: 'Conecto el diseño y la tecnología',
        cursor: 'y así...',
      },
    },
    whatIBring: {
      lead: 'Lo que',
      titleAlt: 'Aporto',
      tap: 'Toca las imagenes',
      // w: ancho del fondo de la etiqueta (px de Figma). Si cambias un texto, ajústalo: ancho del texto + ~57.
      tags: {
        frontend: { text: 'Front-End', w: 207.46 },
        uxui: { text: 'UX / UI', w: 164.57 },
        ds: { text: 'Sistemas de diseño', w: 339 },
      },
      photos: {
        'project-1': 'Proyecto: pantalla de app',
        'project-2': 'Proyecto: collage',
        'project-3': 'Proyecto: interfaz en pantalla',
        'project-4': 'Proyecto: pantallas oscuras',
      },
    },
    projects: {
      photoAlt: 'María José con los brazos abiertos',
      stickerAlt: 'Proyectos',
      tap: 'Toca y mueve los objetos',
      objects: {
        prism: { label: 'UX/UI', alt: 'Prisma de cristal' },
        compass: { label: 'UX research', alt: 'Brújula' },
        shell: { label: 'Accesibilidad', alt: 'Concha en espiral' },
        chess: { label: 'DS y Marca', alt: 'Pieza de ajedrez' },
        clip: { label: 'Diseño gráfico', alt: 'Clip negro' },
        coffee: { label: 'Freelance', alt: 'Taza de café' },
      },
      end: '¡Esto no termina aquí!',
      cta: '¿Creamos algo [[blue:increíble?]]',
      invite: 'Me [[encantaría]], compartir ideas y **crear experiencias digitales juntos.**',
      faceAlt: 'María José sonriendo con un post-it en la frente',
    },
  },

  en: {
    header: {
      role: 'Product Designer',
      nav: 'Sections',
      menuOpen: 'Open menu',
      menuClose: 'Close menu',
      menu: 'Menu',
      socials: 'Social media',
      links: { about: 'About me', whatIBring: 'What I bring', projects: 'Projects', contact: "Let's talk" },
      language: 'Language',
    },
    intro: {
      greeting: 'Hey!',
      message: 'Shall we open?',
      read: 'Read',
      openBox: 'Open the box',
      tap: 'Tap and drag the objects',
      objects: {
        keys: { label: 'Product design', alt: 'Antique keys' },
        plant: { label: 'Prototyping & code', alt: 'Plant in a concrete pot' },
        butterfly: { label: 'Visual design', alt: 'Blue butterfly' },
        mirror: { label: 'Empathy', alt: 'Antique hand mirror' },
        headphones: { label: 'Collaboration', alt: 'Headphones' },
      },
    },
    about: {
      stickerAlt: 'Sticker: About me',
      hello: "Hi! I'm",
      role: 'Interactive Media \nDesigner',
      from: 'from Cali, Colombia',
      photoAlt: 'María José Rosas Cuellar',
      dogAlt: 'Dog peeking out',
      bio: 'Creative by nature, **curious about design** and technology. Always exploring **new trends**, building interfaces and **collecting inspiration.**',
      approach: {
        title: 'My approach',
        text: 'Creating intuitive, consistent interfaces, caring for every detail of the experience. **From user flows to visual components.**',
        highlight: 'I want every design decision to make sense.',
        cursor: 'in the end...',
      },
      toolkit: {
        title: 'My toolkit',
        text: 'I work with Figma, components and Design Tokens to build **scalable design systems.** I also explore front-end development with HTML, CSS, JS and React.',
        highlight: 'I connect design and technology',
        cursor: 'and so...',
      },
    },
    whatIBring: {
      lead: 'What I',
      titleAlt: 'bring',
      tap: 'Tap the images',
      tags: {
        frontend: { text: 'Front-End', w: 207.46 },
        uxui: { text: 'UX / UI', w: 164.57 },
        ds: { text: 'Design Systems', w: 288.87 },
      },
      photos: {
        'project-1': 'Project: app screen',
        'project-2': 'Project: collage',
        'project-3': 'Project: on-screen interface',
        'project-4': 'Project: dark screens',
      },
    },
    projects: {
      photoAlt: 'María José with her arms open',
      stickerAlt: 'Projects',
      tap: 'Tap and drag the objects',
      objects: {
        prism: { label: 'UX/UI', alt: 'Crystal prism' },
        compass: { label: 'UX research', alt: 'Compass' },
        shell: { label: 'Accessibility', alt: 'Spiral shell' },
        chess: { label: 'DS & Branding', alt: 'Chess piece' },
        clip: { label: 'Graphic design', alt: 'Black binder clip' },
        coffee: { label: 'Freelance', alt: 'Coffee cup' },
      },
      end: "This doesn't end here!",
      cta: 'Shall we build something [[blue:amazing?]]',
      invite: "I'd [[love]] to share ideas and **create digital experiences together.**",
      faceAlt: 'María José smiling with a sticky note on her forehead',
    },
  },
};

export const languages = [
  { code: 'es', short: 'ES', name: 'Español' },
  { code: 'en', short: 'EN', name: 'English' },
];
