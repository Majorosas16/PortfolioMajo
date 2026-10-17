// Proyectos del portafolio y categorías del modal de «Proyectos».
// Los textos (descripción, aporte, nombres de etiquetas y de categorías) están en translations.js (projects.*).
//
// Fotos y videos de un proyecto: guárdalos en src/assets/sections/projects/work/<id del proyecto>/ y quedan en su
// carrusel en orden alfabético (p. ej. 01.webp, 02.webp, 03.mp4). Las imágenes van en .webp/.jpg/.png y los videos
// en .mp4/.webm. Para un video puedes añadir su portada con el mismo nombre y .poster.webp (03.poster.webp).
// Enlace a Behance: la dirección en «behance» del proyecto; aparece en su detalle como «Ver proyecto en Behance» con el
// ícono. Sin Behance: Arka, Sistema de diseño AI-ready, Sandunguera, MILL5 Colombia y We Study World.

// Archivos de los carruseles, agrupados por carpeta de proyecto
const files = import.meta.glob('../../assets/sections/projects/work/*/*.{webp,jpg,jpeg,png,mp4,webm}', {
  eager: true,
  import: 'default',
});

const mediaOf = (id) =>
  Object.keys(files)
    .filter((path) => path.includes(`/work/${id}/`) && !path.includes('.poster.'))
    .sort()
    .map((path) => {
      const video = /\.(mp4|webm)$/i.test(path);
      const poster = video ? files[path.replace(/\.(mp4|webm)$/i, '.poster.webp')] : undefined;
      return { type: video ? 'video' : 'image', src: files[path], poster };
    });

// Categorías = los seis objetos de la sección; cada una abre su propio modal. Cada proyecto pertenece a UNA sola
// categoría (su «category»): prism = UX/UI, compass = UX research, shell = Accesibilidad, chess = DS y Marca,
// clip = Diseño gráfico, coffee = Freelance.
export const categories = ['prism', 'compass', 'shell', 'chess', 'clip', 'coffee'];

// Subcategorías de una categoría, en el orden en que se muestran en su modal (su nombre está en translations.js,
// projects.subcategories). Los proyectos de esa categoría indican la suya en «sub».
export const subcategories = { prism: ['mobileApps', 'web', 'prototyping'] };
export const subcategoriesOf = (categoryId) => subcategories[categoryId] ?? null;

// category: su categoría (una de las seis) · sub: su subcategoría, si la categoría tiene · isNew: lleva el sticker
// «Nuevo proyecto» en su tarjeta y su detalle · wip: sigue en desarrollo, lleva el sticker «Trabajando en ello» ·
// tags: sus etiquetas (texto en translations.js, projects.tags), en el orden en que se muestran · tools: herramientas
// (nombres propios, iguales en los dos idiomas)
export const projects = [
  { id: 'arka', category: 'prism', sub: 'mobileApps', name: 'Arka', tags: ['mobile', 'ui', 'prototyping', 'ai'], tools: ['Figma', 'Figma Make', 'Lovable'] },
  {
    id: 'shotplay', category: 'prism', sub: 'mobileApps', isNew: true, behance: 'https://www.behance.net/gallery/253500831/ShotPlay-Mobile-Party-Game-App-UXUI-Case-Study', name: 'ShotPlay', tags: ['mobile', 'game', 'ui', 'ai'],
    tools: ['Figma', 'Flutter', 'Supabase', 'Jira', 'Stitch', 'Claude', 'ChatGPT'],
  },
  {
    id: 'solarapp', category: 'prism', sub: 'mobileApps', isNew: true, behance: 'https://www.behance.net/gallery/250429999/SolarApp-GDO', name: 'SolarApp GDO', tags: ['mobile', 'development', 'ai', 'client'],
    tools: ['Flutter', 'Figma', 'Figma Make', 'Codex', 'Lovable', 'Claude'],
  },
  { id: 'zaveo', category: 'prism', sub: 'mobileApps', behance: 'https://www.behance.net/gallery/213642007/Personal-Finance-Mobile-UX-UI-DESIGN', name: 'Zaveo', tags: ['mobile', 'research', 'ui', 'fintech'], tools: ['Figma'] },
  { id: 'platepath', category: 'prism', sub: 'mobileApps', behance: 'https://www.behance.net/gallery/239413411/Case-Study-Plate-Path', name: 'Plate Path', tags: ['mobile', 'research', 'ui', 'ai'], tools: ['Figma', 'Stitch', 'Supabase', 'Claude'] },
  {
    id: 'kingwash', category: 'prism', sub: 'web', behance: 'https://www.behance.net/gallery/222625815/King-Wash-Track-Website-Applications-Ecosystems', name: 'King Wash-Track', tags: ['web', 'ui', 'development'],
    tools: ['Figma', 'Supabase', 'API REST', 'WebSockets', 'Brevo'],
  },
  { id: 'fellow', category: 'prism', sub: 'web', behance: 'https://www.behance.net/gallery/233280741/Fellow-App-Web-Project', name: 'Fellow App', tags: ['web', 'ui', 'development'], tools: ['Figma', 'React + Vite', 'Firebase'] },
  { id: 'wikihunger', category: 'prism', sub: 'web', behance: 'https://www.behance.net/gallery/211203637/WikiHunger-Web-Page', name: 'WikiHunger', tags: ['web', 'ui', 'prototyping', 'development'], tools: ['Figma', 'HTML', 'CSS'] },
  { id: 'cassy', category: 'prism', sub: 'web', behance: 'https://www.behance.net/gallery/196604717/CASSY-SkinCare-UI-Web-Desing-mr', name: 'CASSY SkinCare', tags: ['web', 'ui', 'individual'], tools: ['Figma'] },
  { id: 'pixelpioneers', category: 'prism', sub: 'prototyping', behance: 'https://www.behance.net/gallery/234815883/Pixel-Pioners', name: 'Pixel Pioneers', tags: ['game', 'prototyping'], tools: ['Figma'] },
  { id: 'remoteworkers', category: 'compass', behance: 'https://www.behance.net/gallery/207311861/UX-CASE-STUDY-REMOTE-WORKERS', name: 'Remote Workers', tags: ['research'], tools: ['Figma'] },
  {
    id: 'websitetrust', category: 'compass', isNew: true, behance: 'https://www.behance.net/gallery/248903883/Website-trust-measurement', name: 'Website Trust Measurement', tags: ['web', 'research', 'ai'],
    tools: ['Figma', 'Lovable', 'Claude', 'ChatGPT'],
  },
  { id: 'smartwatch', category: 'shell', behance: 'https://www.behance.net/gallery/194752851/UX-UI-Smartwatch-for-Alzheimers-Desing', name: 'Smartwatch para Alzheimer', nameEn: 'Smartwatch for Alzheimer’s', tags: ['research', 'accessibility', 'individual'], tools: ['Figma'] },
  {
    id: 'aiready', category: 'chess', isNew: true, wip: true, name: 'Sistema de diseño AI-ready', nameEn: 'AI-ready design system', tags: ['designSystem', 'ai', 'client'],
    tools: ['Figma', 'Claude', 'Codex'],
  },
  { id: 'pastafactory', category: 'chess', behance: 'https://www.behance.net/gallery/197714415/SIstema-de-Diseno-The-Pasta-Factory', name: 'The Pasta Factory', tags: ['designSystem', 'branding', 'prototyping'], tools: ['Figma'] },
  { id: 'nike', category: 'chess', behance: 'https://www.behance.net/gallery/192653087/Nikes-Redisign-BrandBook', name: 'Nike Redesign · BrandBook', tags: ['branding', 'individual'], tools: ['Illustrator', 'InDesign', 'Photoshop'] },
  { id: 'throwback', category: 'clip', behance: 'https://www.behance.net/gallery/200454855/THROWBACK-Magazine', name: 'THROWBACK Magazine', tags: ['editorial'], tools: ['InDesign', 'Illustrator', 'Photoshop'] },
  { id: 'whiterhino', category: 'clip', behance: 'https://www.behance.net/gallery/178615015/White-Rhino-Postage-Stamps', name: 'White Rhino Postage Stamps', tags: ['editorial', 'individual'], tools: ['Illustrator'] },
  {
    id: 'sandunguera', category: 'coffee', isNew: true, wip: true, name: 'Sandunguera · Academia de salsa (Cali)', nameEn: 'Sandunguera · Salsa academy (Cali)',
    tags: ['branding', 'social', 'client'], tools: ['Figma', 'Canva'],
  },
  { id: 'mill5', category: 'coffee', name: 'MILL5 Colombia', tags: ['internalComms', 'client'], tools: ['Figma', 'Illustrator'] },
  {
    id: 'westudy', category: 'coffee', isNew: true, name: 'We Study World', tags: ['social', 'internalComms', 'accessibility', 'client'],
    tools: ['Illustrator', 'Photoshop', 'CapCut'],
  },
].map((p) => ({ behance: null, isNew: false, wip: false, ...p, media: mediaOf(p.id) }));

// Proyectos de una categoría, en el orden de la lista
export const projectsIn = (categoryId) => projects.filter((p) => p.category === categoryId);
