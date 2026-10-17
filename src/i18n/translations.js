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
      // title: el de la nota y el detalle · caption: qué muestra la foto (bajo el título) · text: el mensaje azul ·
      // alt: descripción de la foto para lectores de pantalla
      aportes: {
        listening: {
          title: 'Escucha y empatía',
          text: 'Entiendo necesidades y diseño pensando en las personas.',
          caption: 'Fui moderadora en unas sesiones de validación con una empresa mediana.',
          alt: 'Videollamada de equipo en un portátil',
        },
        curiosity: {
          title: 'Curiosidad',
          text: 'Investigo y exploro distintas posibilidades antes de elegir una solución.',
          caption:
            'Trabajé en un proyecto con un equipo integral y aprendí a usar herramientas de programación, gestión de proyectos e inteligencia artificial.',
          alt: 'Interfaz de ShotPlay proyectada en un salón de clases',
        },
        teamwork: {
          title: 'Colaboración',
          text: 'Aporto ideas y construyo sobre las de otras personas.',
          caption: 'Muestra de un proyecto en las instalaciones de la universidad, después de semanas de trabajo en equipo.',
          alt: 'Collage del proyecto Ecocampus con el equipo y sus carteles',
        },
        detail: {
          title: 'Atención al detalle',
          text: 'Cuido la coherencia entre concepto, interacción y resultado visual.',
          caption: 'Prototipo de la simulación de una app para presentar ante el jurado de un concurso.',
          alt: 'Pantallas de una app de finanzas en modo oscuro',
        },
      },
    },
    projects: {
      photoAlt: 'María José con los brazos abiertos',
      stickerAlt: 'Proyectos',
      tap: 'Toca y mueve los objetos',
      // Al acercar la taza de café a la cara (Figma 190:2801)
      coffeeMsg: 'Uf, a mí el café con leche no me puede faltar en mi vida',
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
      // Modal de proyectos (ProjectsModal.jsx). Las categorías son los objetos (projects.js define sus etiquetas)
      modal: {
        title: '{category}',
        count: '{n} proyectos',
        countOne: '1 proyecto',
        close: 'Cerrar',
        contribution: 'Mi aporte:',
        tools: 'Herramientas:',
        tagsLabel: 'Etiquetas',
        behance: 'Ver proyecto en Behance',
        mediaSoon: 'Imágenes y videos próximamente',
        media: 'Imágenes y videos de {project}',
        mediaPosition: '{n} de {total}',
        next: 'Siguiente',
        prev: 'Anterior',
        open: 'Ver detalles de {project}',
        back: 'Volver a {category}',
        newProject: 'Proyecto nuevo',
        goTo: 'Ver {n} de {total}',
      },
      tags: {
        mobile: 'App móvil',
        ui: 'UI Design',
        prototyping: 'Prototipado',
        ai: 'Hecho con IA',
        game: 'Juego',
        development: 'Desarrollo',
        client: 'Cliente real',
        research: 'Investigación UX',
        fintech: 'Fintech',
        web: 'Web',
        individual: 'Proyecto individual',
        accessibility: 'Accesibilidad',
        designSystem: 'Sistema de diseño',
        branding: 'Branding',
        editorial: 'Editorial / impreso',
        social: 'Redes sociales',
        internalComms: 'Comunicación interna',
      },
      // Subcategorías de UX/UI (projects.js), escritas a mano sobre la hoja del modal
      subcategories: { mobileApps: 'Apps móviles', web: 'Web', prototyping: 'Prototipado' },
      items: {
        arka: {
          description:
            'App fintech para freelancers con ingresos variables en Colombia. Su diferencial es un simulador que muestra cómo una compra afectará el presupuesto de la semana antes de hacerla. Se construyó a partir de 14 entrevistas con usuarios.',
          contribution:
            'Diseñé las pantallas de la app (onboarding, home, simulador, registro de gastos, chatbot y planeación semanal con IA) y construí el prototipo interactivo de alta fidelidad con el que validamos el concepto con usuarios del segmento objetivo.',
        },
        shotplay: {
          description:
            'App móvil de juegos multijugador para fiestas, donde los jugadores se conectan en tiempo real desde sus celulares.',
          contribution:
            'Me enfoqué en el diseño de la app y en los entregables de presentación de cada etapa. Trabajé junto al equipo de ingeniería, aprendí Flutter y luego apliqué esos conocimientos en otros proyectos.',
        },
        solarapp: {
          description:
            'App para hogares con paneles solares que ayuda a entender y gestionar su energía después de la compra. Incluye un indicador tipo semáforo del estado del sistema, estadísticas de consumo, un simulador y un canal de soporte.',
          contribution:
            'Fui Product Owner y desarrollé la app. Apliqué lo aprendido en Flutter en ShotPlay para adelantar el despliegue y ponerla a funcionar en iPhone mediante el simulador de iOS. Integré herramientas de IA para acelerar el diseño y la programación.',
        },
        zaveo: {
          description:
            'App de finanzas personales que ayuda a organizar el dinero y entender los gastos con una experiencia sencilla y cercana para quienes no tienen hábitos financieros formales.',
          contribution:
            'Participé en la investigación de usuarios para entender sus hábitos y frustraciones con el manejo del dinero. Con esos hallazgos diseñé la interfaz y las pantallas de la app.',
        },
        platepath: {
          description:
            'Producto web y móvil desarrollado, programado y publicado en línea por un equipo de cinco personas. Combinó investigación, diseño de interfaz y desarrollo, y se validó con pruebas reales de uso durante varios días.',
          contribution:
            'Realicé encuestas y pruebas de varios días en las que los usuarios usaron el producto en su rutina. Esto permitió identificar problemas que no aparecen en una sola sesión; con esos aprendizajes diseñé la interfaz.',
        },
        kingwash: {
          description:
            'Sitio web y ecosistema de aplicaciones para gestionar y hacer seguimiento a servicios de lavado, con información en tiempo real entre el negocio y sus clientes, además de notificaciones por correo.',
          contribution:
            'Propuse la línea visual de las pantallas y participé en la programación del sistema, conectando el diseño con su implementación técnica.',
        },
        fellow: {
          description:
            'Aplicación web que funciona como carnet digital de vacunas y seguimiento de salud para mascotas, principalmente perros y gatos. Reúne el historial de vacunación y controles para que sus dueños no dependan de un carnet físico.',
          contribution:
            'Participé en el diseño visual de las pantallas y en la programación de la aplicación, cuidando que el producto final se mantuviera fiel al diseño.',
        },
        wikihunger: {
          description:
            'Wiki web dedicada al universo de Los Juegos del Hambre, con información de personajes y de la saga organizada para que los fans encuentren contenido de forma rápida y visual.',
          contribution:
            'Diseñé la interfaz, construí el prototipo navegable y programé desde cero la landing principal en HTML y CSS.',
        },
        cassy: {
          description:
            'Proyecto individual de diseño web para una marca de cuidado de la piel. La propuesta buscó transmitir una estética limpia y cuidada y facilitar la exploración de productos.',
          contribution:
            'Desarrollé el proyecto completo, desde la propuesta visual hasta el diseño de las pantallas. Fue mi primer acercamiento a Figma y el inicio de mi trabajo en diseño de interfaces.',
        },
        pixelpioneers: {
          description:
            'Juego interactivo que cuenta la historia de la Interacción Humano-Computador (HCI) y convierte un recorrido histórico en una experiencia de aprendizaje entretenida.',
          contribution:
            'Me encargué del prototipado y conecté las interacciones entre pantallas, definiendo transiciones y comportamientos para que el juego se sintiera fluido y natural.',
        },
        remoteworkers: {
          description:
            'Investigación UX para mejorar la productividad de quienes trabajan de forma remota, a partir de encuestas y entrevistas sobre la organización del tiempo, la comunicación con los equipos y los obstáculos del día a día.',
          contribution:
            'Participé en la investigación con usuarios y analicé la información recolectada, organizando hallazgos en insights que orientaron oportunidades de diseño.',
        },
        websitetrust: {
          description:
            'Evaluamos la confianza que generaba un sitio web existente, lo rediseñamos a partir de pruebas y entrevistas, y comparamos con usuarios la experiencia antes y después.',
          contribution:
            'Rediseñé la interfaz con apoyo de herramientas de IA para iterar más rápido y participé en pruebas y entrevistas antes y después del rediseño.',
        },
        smartwatch: {
          description:
            'Proyecto individual de interfaz para smartwatch que acompaña a personas con Alzheimer, priorizando claridad, simplicidad y baja carga cognitiva en una pantalla pequeña.',
          contribution:
            'Desarrollé el proyecto completo, desde la investigación del usuario hasta la interfaz, tomando decisiones de accesibilidad en tamaños, contraste y jerarquía de la información.',
        },
        aiready: {
          description:
            'Proyecto de grado desarrollado en UXLab Icesi para ACH Colombia: un sistema de diseño para sus portales web, estructurado para que las herramientas de IA puedan interpretarlo y facilitar la traducción del diseño a código de forma consistente. Está en desarrollo.',
          contribution:
            'Hago parte del equipo UX/UI que construye el sistema, trabajando en sus componentes y en su preparación para flujos asistidos por IA.',
        },
        pastafactory: {
          description:
            'Propuesta de sistema de diseño para una cocina oculta existente, con reglas visuales y componentes que permiten aplicar su identidad de forma coherente en sus puntos de contacto digitales.',
          contribution:
            'Participé en la construcción del sistema de diseño y en el prototipado, mostrando cómo funcionan los componentes en pantallas reales.',
        },
        nike: {
          description:
            'Proyecto individual de reconceptualización de Nike como marca de cuidado íntimo femenino. Desarrollé una nueva identidad visual y un manual de marca, trasladando la esencia de Nike a un territorio distinto.',
          contribution: 'Realicé el proyecto completo: concepto, propuesta visual y diseño del brandbook.',
        },
        throwback: {
          description:
            'Revista diseñada en equipo con tres ediciones, cada una dedicada a un país y sus eventos, con identidad visual propia dentro de una misma línea editorial.',
          contribution:
            'Junto con una colega, diseñé la edición dedicada a México, desde la diagramación hasta el tratamiento gráfico de las páginas.',
        },
        whiterhino: {
          description:
            'Serie individual de estampillas postales con enfoque ambiental y cultural, creada para generar conciencia sobre las especies en peligro de extinción, con el rinoceronte blanco como protagonista.',
          contribution: 'Interpreté el concepto y lo traduje en un diseño gráfico completo, adaptado al formato pequeño de una estampilla.',
        },
        sandunguera: {
          description: 'Comunicación visual para Sandunguera, una academia de salsa caleña, sus clases, grupos y servicios.',
          contribution:
            'Propuse el concepto visual de sus publicaciones, que el cliente adoptó como línea de comunicación. Diseño posts, un PDF de servicios y piezas para WhatsApp Business a partir de su estética y manual de marca.',
        },
        mill5: {
          description:
            'Piezas de comunicación interna para MILL5 Colombia: anuncios de recursos humanos y del equipo de desarrollo, eventos y celebraciones como el Día del Ingeniero y el Día del Diseñador.',
          contribution:
            'Partí de la estética del diseñador anterior y propuse una línea gráfica renovada, que la empresa adoptó y mantuvo en el tiempo.',
        },
        westudy: {
          description:
            'Contenido para redes sociales de una agencia de viajes y estudios en el exterior, realizado de forma remota con un equipo ubicado en Canadá.',
          contribution:
            'Diseñé posts, carruseles y reels respetando su línea gráfica y proponiendo mejoras. En los reels agregué recursos de accesibilidad, como subtítulos y elementos visuales que acompañan la música y el sonido. También diseñé piezas internas, como saludos de cumpleaños y PDF informativos.',
        },
      },
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
          title: 'Listening & empathy',
          text: 'I understand needs and design with people in mind.',
          // Espacios duros: «with a mid-sized» no se separa (así «with a» no queda al final de la primera línea)
          caption: 'I moderated validation sessions with\u00a0a\u00a0mid\u2011sized company.',
          alt: 'Team video call on a laptop',
        },
        curiosity: {
          title: 'Curiosity',
          text: 'I research and explore different possibilities before choosing a solution.',
          // cross\u2011functional: guion que no corta la palabra
          caption: 'I worked on a project with a cross\u2011functional team and learned to use programming, project management and AI tools.',
          alt: 'ShotPlay interface projected in a classroom',
        },
        teamwork: {
          title: 'Collaboration',
          text: 'I share ideas and build on those of others.',
          caption: 'A project showcase on the university campus, after weeks of teamwork.',
          alt: 'Collage of the Ecocampus project with the team and its posters',
        },
        detail: {
          title: 'Attention to detail',
          text: 'I care for the coherence between concept, interaction and visual result.',
          caption: 'Prototype of an app simulation presented to a competition jury.',
          alt: 'Screens of a finance app in dark mode',
        },
      },
    },
    projects: {
      photoAlt: 'María José with her arms open',
      stickerAlt: 'Projects',
      tap: 'Tap and drag the objects',
      coffeeMsg: 'Oh, I can’t live without my café con leche',
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
      modal: {
        title: '{category} Projects',
        count: '{n} projects',
        countOne: '1 project',
        close: 'Close',
        contribution: 'My contribution:',
        tools: 'Tools:',
        tagsLabel: 'Tags',
        behance: 'View project on Behance',
        mediaSoon: 'Images and videos coming soon',
        media: 'Images and videos of {project}',
        mediaPosition: '{n} of {total}',
        next: 'Next',
        prev: 'Previous',
        open: 'View details of {project}',
        back: 'Back to {category}',
        newProject: 'New project',
        goTo: 'View {n} of {total}',
      },
      tags: {
        mobile: 'Mobile app',
        ui: 'UI Design',
        prototyping: 'Prototyping',
        ai: 'Made with AI',
        game: 'Game',
        development: 'Development',
        client: 'Real client',
        research: 'UX Research',
        fintech: 'Fintech',
        web: 'Web',
        individual: 'Solo project',
        accessibility: 'Accessibility',
        designSystem: 'Design system',
        branding: 'Branding',
        editorial: 'Editorial / print',
        social: 'Social media',
        internalComms: 'Internal communications',
      },
      // Subcategorías de UX/UI (projects.js), escritas a mano sobre la hoja del modal
      subcategories: { mobileApps: 'Mobile apps', web: 'Web', prototyping: 'Prototyping' },
      items: {
        arka: {
          description:
            'Fintech app for freelancers with variable income in Colombia. What sets it apart is a simulator that shows how a purchase will affect the week’s budget before making it. It was built from 14 user interviews.',
          contribution:
            'I designed the app screens (onboarding, home, simulator, expense log, chatbot and AI weekly planning) and built the high-fidelity interactive prototype we used to validate the concept with users from the target segment.',
        },
        shotplay: {
          description: 'Mobile app of multiplayer party games, where players connect in real time from their phones.',
          contribution:
            'I focused on the app design and the presentation deliverables for each stage. I worked alongside the engineering team, learned Flutter and later applied that knowledge to other projects.',
        },
        solarapp: {
          description:
            'App for homes with solar panels that helps people understand and manage their energy after the purchase. It includes a traffic-light indicator of the system status, consumption statistics, a simulator and a support channel.',
          contribution:
            'I was the Product Owner and developed the app. I applied what I learned about Flutter in ShotPlay to speed up deployment and get it running on iPhone through the iOS simulator. I integrated AI tools to accelerate design and coding.',
        },
        zaveo: {
          description:
            'Personal finance app that helps people organize their money and understand their spending with a simple, friendly experience for those without formal financial habits.',
          contribution:
            'I took part in user research to understand people’s habits and frustrations with managing money. With those findings I designed the interface and the app screens.',
        },
        platepath: {
          description:
            'Web and mobile product designed, coded and published online by a team of five. It combined research, interface design and development, and was validated with real usage tests over several days.',
          contribution:
            'I ran surveys and multi-day tests in which users used the product in their routine. This revealed problems that don’t show up in a single session; with those learnings I designed the interface.',
        },
        kingwash: {
          description:
            'Website and app ecosystem to manage and track car wash services, with real-time information between the business and its customers, plus email notifications.',
          contribution:
            'I proposed the visual direction of the screens and helped code the system, connecting the design with its technical implementation.',
        },
        fellow: {
          description:
            'Web app that works as a digital vaccination card and health tracker for pets, mainly dogs and cats. It gathers vaccination history and check-ups so owners don’t depend on a paper card.',
          contribution:
            'I took part in the visual design of the screens and in coding the app, making sure the final product stayed true to the design.',
        },
        wikihunger: {
          description:
            'Web wiki dedicated to The Hunger Games universe, with information about the characters and the saga organized so fans can find content quickly and visually.',
          contribution: 'I designed the interface, built the clickable prototype and coded the main landing page from scratch in HTML and CSS.',
        },
        cassy: {
          description:
            'Solo web design project for a skincare brand. The proposal aimed to convey a clean, caring aesthetic and make it easy to explore products.',
          contribution:
            'I developed the whole project, from the visual proposal to the screen design. It was my first approach to Figma and the start of my work in interface design.',
        },
        pixelpioneers: {
          description:
            'Interactive game that tells the history of Human-Computer Interaction (HCI) and turns a historical journey into a fun learning experience.',
          contribution:
            'I was in charge of prototyping and connected the interactions between screens, defining transitions and behaviors so the game felt smooth and natural.',
        },
        remoteworkers: {
          description:
            'UX research to improve the productivity of people who work remotely, based on surveys and interviews about time management, team communication and everyday obstacles.',
          contribution:
            'I took part in the user research and analyzed the data collected, organizing findings into insights that guided design opportunities.',
        },
        websitetrust: {
          description:
            'We assessed the trust an existing website inspired, redesigned it based on tests and interviews, and compared the before and after experience with users.',
          contribution:
            'I redesigned the interface with the help of AI tools to iterate faster and took part in tests and interviews before and after the redesign.',
        },
        smartwatch: {
          description:
            'Solo smartwatch interface project that supports people with Alzheimer’s, prioritizing clarity, simplicity and low cognitive load on a small screen.',
          contribution:
            'I developed the whole project, from user research to the interface, making accessibility decisions about sizes, contrast and information hierarchy.',
        },
        aiready: {
          description:
            'Thesis project developed at UXLab Icesi for ACH Colombia: a design system for their web portals, structured so AI tools can interpret it and make translating design into code consistent. It is in progress.',
          contribution:
            'I’m part of the UX/UI team building the system, working on its components and on preparing it for AI-assisted workflows.',
        },
        pastafactory: {
          description:
            'Design system proposal for an existing ghost kitchen, with visual rules and components that let it apply its identity consistently across its digital touchpoints.',
          contribution: 'I helped build the design system and the prototype, showing how the components work on real screens.',
        },
        nike: {
          description:
            'Solo project reimagining Nike as a women’s intimate care brand. I created a new visual identity and a brand manual, taking Nike’s essence into a different territory.',
          contribution: 'I did the whole project: concept, visual proposal and brandbook design.',
        },
        throwback: {
          description:
            'Magazine designed as a team with three issues, each dedicated to a country and its events, with its own visual identity within one editorial line.',
          contribution: 'Together with a colleague, I designed the issue dedicated to Mexico, from the layout to the graphic treatment of the pages.',
        },
        whiterhino: {
          description:
            'Solo series of postage stamps with an environmental and cultural focus, created to raise awareness about endangered species, with the white rhino as the protagonist.',
          contribution: 'I interpreted the concept and turned it into a complete graphic design, adapted to the small format of a stamp.',
        },
        sandunguera: {
          description: 'Visual communication for Sandunguera, a salsa academy in Cali, its classes, groups and services.',
          contribution:
            'I proposed the visual concept for its posts, which the client adopted as its communication line. I design posts, a services PDF and pieces for WhatsApp Business based on its aesthetic and brand manual.',
        },
        mill5: {
          description:
            'Internal communication pieces for MILL5 Colombia: HR and development team announcements, events and celebrations such as Engineer’s Day and Designer’s Day.',
          contribution:
            'I started from the previous designer’s aesthetic and proposed a refreshed graphic line, which the company adopted and kept over time.',
        },
        westudy: {
          description:
            'Social media content for a travel and study-abroad agency, done remotely with a team based in Canada.',
          contribution:
            'I designed posts, carousels and reels following their graphic line and proposing improvements. In the reels I added accessibility features such as subtitles and visuals that accompany the music and sound. I also designed internal pieces such as birthday greetings and informative PDFs.',
        },
      },
    },
  },
};

export const languages = [
  { code: 'es', short: 'ES', name: 'Español' },
  { code: 'en', short: 'EN', name: 'English' },
];
