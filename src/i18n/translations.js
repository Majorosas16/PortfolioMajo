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
    footer: {
      credit: 'Portafolio de María José Rosas Cuellar',
      backToTop: 'Volver al inicio',
    },
    intro: {
      greeting: 'Hola!',
      message: '¿Abrimos la caja?',
      read: 'Leído',
      openBox: 'Abrir la caja',
      tap: 'Toca y mueve los objetos',
      objects: {
        keys: {
          label: 'Diseño de producto',
          alt: 'Llaves antiguas',
          message: 'Conecto necesidades, interacción, tecnología e IA para crear productos digitales útiles.',
        },
        plant: {
          label: 'Prototipado y código',
          alt: 'Planta en matera de concreto',
          message: 'No me quedo en cómo se ve. Exploro cómo puede funcionar.',
        },
        butterfly: { label: 'Diseño visual', alt: 'Mariposa azul', message: 'Doy forma, color, coherencia y carácter a las ideas.' },
        mirror: { label: 'Empatía', alt: 'Espejo de mano antiguo', message: 'Antes de diseñar para alguien, intento entender su mundo.' },
        headphones: { label: 'Colaboración', alt: 'Audífonos', message: 'Las mejores ideas también saben construirse en equipo.' },
      },
    },
    about: {
      stickerAlt: 'Sticker: Sobre mí',
      hello: 'Hola! soy',
      role: 'Diseñadora de \nMedios Interactivos',
      roleNote: '(practicante)',
      from: 'de Cali, Colombia',
      photos: {
        label: 'Fotos de María José',
        next: 'Ver la siguiente foto',
        position: 'Foto {n} de {total}',
        alts: {
          'photo-majo': 'María José Rosas Cuellar con gorro de lana en un mirador de montaña',
          'img-2467': 'María José con un portátil, sobre un fondo blanco con estrellas de colores',
          'img-1112': 'María José tomando una bebida en un restaurante rodeado de plantas, de noche',
          'img-1704': 'María José volando en parapente sobre montañas verdes',
          'img-4897': 'María José caminando por un sendero de madera entre pastizales',
          'img-6987': 'María José mostrando una casita de jengibre en una mesa navideña',
          'img-8454': 'María José con la camiseta de la selección Colombia',
        },
      },
      dogAlt: 'Perro asomándose',
      dogMsg: 'Lola, la\ninspiración\nde Majo',
      stickerMsg: 'Mango, mi\nfruta favorita',
      graduation: 'Próxima a graduarme como **Diseñadora de Medios Interactivos de la Universidad Icesi**, con reconocimientos académicos y mucha emoción por lo que viene.',
      bio: 'Creativa por naturaleza, **curiosa por diseño** y tecnología. Siempre explorando **nuevas tendencias**, creando interfaces y **coleccionando inspiración.**',
      approach: {
        title: 'Mi enfoque',
        text: 'Crear interfaces intuitivas y consistentes, cuidando cada detalle de la experiencia. **Desde los flujos de usuario hasta los componentes visuales.**',
        highlight: 'Busco que cada decisión de diseño tenga sentido.',
        cursor: 'al final...',
      },
      toolkit: {
        title: 'Mi toolkit',
        text: 'Trabajo con Figma, componentes y Design Tokens para construir **sistemas de diseño escalables.** Exploro herramientas de IA para potenciar el proceso creativo y optimizar flujos de trabajo.',
        highlight: 'y conectar diseño con desarrollo front-end mediante HTML, CSS, JavaScript y React.',
        cursor: 'y así...',
      },
    },
    whatIBring: {
      lead: 'Lo que',
      titleAlt: 'Aporto',
      tap: 'Toca las imágenes',
      // w: ancho del fondo de la etiqueta (px de Figma). Si cambias un texto, ajústalo: ancho del texto + ~57.
      tags: {
        frontend: { text: 'Front-End', w: 207.46 },
        uxui: { text: 'UX / UI', w: 164.57 },
        ds: { text: 'Sistemas de diseño', w: 339 },
      },
      tapFolder: 'Toca la carpeta',
      openFolder: 'Abrir la carpeta',
      // Lo que aporto: una foto por aporte, en el orden de la nota de la carpeta (01–04).
      // title: el de la nota y el detalle · text: el mensaje azul al tocar la foto · alt: qué muestra la foto
      aportes: {
        listening: {
          title: 'Escucha y comprensión',
          text: 'Entiendo las necesidades y el diseño, pensando en las personas.',
          alt: 'Videollamada de equipo en un portátil',
        },
        curiosity: {
          title: 'Curiosidad constante',
          text: 'Pregunto, exploro y aprendo algo nuevo en cada proyecto.',
          alt: 'Interfaz de ShotPlay proyectada en un salón de clases',
        },
        teamwork: {
          title: 'Trabajo en equipo',
          text: 'Escucho, propongo y construyo junto a otras personas.',
          alt: 'Collage del proyecto Ecocampus con el equipo y sus carteles',
        },
        detail: {
          title: 'Atención al detalle',
          text: 'Cuido cada pantalla, componente y espacio hasta que todo encaja.',
          alt: 'Pantallas de una app de finanzas en modo oscuro',
        },
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
    footer: {
      credit: 'María José Rosas Cuellar’s portfolio',
      backToTop: 'Back to top',
    },
    intro: {
      greeting: 'Hey!',
      message: 'Shall we open?',
      read: 'Read',
      openBox: 'Open the box',
      tap: 'Tap and drag the objects',
      objects: {
        keys: {
          label: 'Product design',
          alt: 'Antique keys',
          message: 'I connect needs, interaction, technology and AI to build useful digital products.',
        },
        plant: { label: 'Prototyping & code', alt: 'Plant in a concrete pot', message: "I don't stop at how it looks. I explore how it can work." },
        butterfly: { label: 'Visual design', alt: 'Blue butterfly', message: 'I give shape, color, coherence and character to ideas.' },
        mirror: { label: 'Empathy', alt: 'Antique hand mirror', message: 'Before designing for someone, I try to understand their world.' },
        headphones: { label: 'Collaboration', alt: 'Headphones', message: 'The best ideas are also built as a team.' },
      },
    },
    about: {
      stickerAlt: 'Sticker: About me',
      hello: "Hi! I'm",
      role: 'Interactive Media \nDesigner',
      roleNote: '(intern)',
      from: 'from Cali, Colombia',
      photos: {
        label: 'Photos of María José',
        next: 'Show the next photo',
        position: 'Photo {n} of {total}',
        alts: {
          'photo-majo': 'María José Rosas Cuellar in a knit hat at a mountain viewpoint',
          'img-2467': 'María José holding a laptop against a white backdrop with colorful stars',
          'img-1112': 'María José having a drink at a restaurant surrounded by plants, at night',
          'img-1704': 'María José paragliding over green mountains',
          'img-4897': 'María José walking along a wooden boardwalk through grassland',
          'img-6987': 'María José showing a gingerbread house at a Christmas table',
          'img-8454': 'María José wearing the Colombia national team jersey',
        },
      },
      dogAlt: 'Dog peeking out',
      dogMsg: 'Lola, Majo’s\ninspiration',
      stickerMsg: 'Mango, my\nfavorite fruit',
      graduation: 'About to graduate as an **Interactive Media Designer from Universidad Icesi**, with academic honors and lots of excitement for what comes next.',
      bio: 'Creative by nature, **curious about design** and technology. Always exploring **new trends**, building interfaces and **collecting inspiration.**',
      approach: {
        title: 'My approach',
        text: 'Creating intuitive, consistent interfaces, caring for every detail of the experience. **From user flows to visual components.**',
        highlight: 'I want every design decision to make sense.',
        cursor: 'in the end...',
      },
      toolkit: {
        title: 'My toolkit',
        text: 'I work with Figma, components, and Design Tokens to build **scalable design systems.** I explore AI tools to enhance the creative process and optimize workflows.',
        highlight: 'and connect design with front-end development using HTML, CSS, JavaScript, and React.',
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
      tapFolder: 'Tap the folder',
      openFolder: 'Open the folder',
      aportes: {
        listening: {
          title: 'Listening & understanding',
          text: 'I understand needs and design with people in mind.',
          alt: 'Team video call on a laptop',
        },
        curiosity: {
          title: 'Constant curiosity',
          text: 'I ask, explore and learn something new in every project.',
          alt: 'ShotPlay interface projected in a classroom',
        },
        teamwork: {
          title: 'Teamwork',
          text: 'I listen, propose and build alongside others.',
          alt: 'Collage of the Ecocampus project with the team and its posters',
        },
        detail: {
          title: 'Attention to detail',
          text: 'I care for every screen, component and spacing until everything fits.',
          alt: 'Screens of a finance app in dark mode',
        },
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
