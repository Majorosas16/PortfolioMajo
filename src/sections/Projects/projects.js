// Proyectos del portafolio y categorías del modal de «Proyectos».
// Los textos (descripción, aporte, nombres de etiquetas y de categorías) están en translations.js (projects.*).
//
// Fotos y videos de un proyecto: guárdalos en src/assets/sections/projects/work/<id del proyecto>/ y quedan en su
// carrusel en orden alfabético (p. ej. 01.webp, 02.webp, 03.mp4). Las imágenes van en .webp/.jpg/.png y los videos
// en .mp4/.webm. Para un video puedes añadir su portada con el mismo nombre y .poster.webp (03.poster.webp).
// Enlace a Behance: pon la dirección en «behance» del proyecto (si no hay, el enlace no aparece).

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

// Categorías = los seis objetos de la sección; cada una abre su propio modal. Un proyecto pertenece a una categoría
// si tiene alguna de sus etiquetas (puede estar en varias).
export const categories = [
  { id: 'prism', tags: ['ui', 'prototyping'] },
  { id: 'compass', tags: ['research'] },
  { id: 'shell', tags: ['accessibility'] },
  { id: 'chess', tags: ['designSystem', 'branding'] },
  { id: 'clip', tags: ['editorial', 'social', 'internalComms'] },
  { id: 'coffee', tags: ['client'] },
];

// Etiquetas de los proyectos, en el orden de los filtros del modal, con su color (App móvil, Prototipado y Fintech
// son los del diseño de Figma 157:2338; el resto, de la misma familia). El texto de cada una está en translations.js.
export const tagColors = {
  mobile: '#065c8a',
  web: '#2f6fb3',
  ui: '#0f7f86',
  prototyping: '#611283',
  research: '#8a3ea8',
  accessibility: '#358f11',
  designSystem: '#c25a1c',
  branding: '#b8402d',
  development: '#4b5b6e',
  game: '#7a5c00',
  fintech: '#358f11',
  ai: '#a3306b',
  client: '#9a6f0c',
  individual: '#5c4a46',
  editorial: '#8b4a1f',
  social: '#c2368a',
  internalComms: '#3f6f4a',
};

// tags: en el orden en que se muestran · tools: herramientas (nombres propios, iguales en los dos idiomas)
export const projects = [
  { id: 'arka', name: 'Arka', tags: ['mobile', 'ui', 'prototyping', 'ai'], tools: ['Figma', 'Figma Make', 'Lovable'] },
  {
    id: 'shotplay', name: 'ShotPlay', tags: ['mobile', 'game', 'ui', 'ai'],
    tools: ['Figma', 'Flutter', 'Supabase', 'Jira', 'Stitch', 'Claude', 'ChatGPT'],
  },
  {
    id: 'solarapp', name: 'SolarApp GDO', tags: ['mobile', 'development', 'ai', 'client'],
    tools: ['Flutter', 'Figma', 'Figma Make', 'Codex', 'Lovable', 'Claude'],
  },
  { id: 'zapeo', name: 'Zapeo', tags: ['mobile', 'research', 'ui', 'fintech'], tools: ['Figma'] },
  { id: 'platepath', name: 'Plate Path', tags: ['mobile', 'research', 'ui', 'ai'], tools: ['Figma', 'Stitch', 'Supabase', 'Claude'] },
  {
    id: 'kingwash', name: 'King Wash-Track', tags: ['web', 'ui', 'development'],
    tools: ['Figma', 'Supabase', 'API REST', 'WebSockets', 'Brevo'],
  },
  { id: 'fellow', name: 'Fellow App', tags: ['web', 'ui', 'development'], tools: ['Figma', 'React + Vite', 'Firebase'] },
  { id: 'wikihunger', name: 'WikiHunger', tags: ['web', 'ui', 'prototyping', 'development'], tools: ['Figma', 'HTML', 'CSS'] },
  { id: 'cassy', name: 'CASSY SkinCare', tags: ['web', 'ui', 'individual'], tools: ['Figma'] },
  { id: 'pixelpioneers', name: 'Pixel Pioneers', tags: ['game', 'prototyping'], tools: ['Figma'] },
  { id: 'remoteworkers', name: 'Remote Workers', tags: ['research'], tools: ['Figma'] },
  {
    id: 'websitetrust', name: 'Website Trust Measurement', tags: ['web', 'research', 'ai'],
    tools: ['Figma', 'Lovable', 'Claude', 'ChatGPT'],
  },
  { id: 'smartwatch', name: 'Smartwatch para Alzheimer', nameEn: 'Smartwatch for Alzheimer’s', tags: ['research', 'accessibility', 'individual'], tools: ['Figma'] },
  {
    id: 'aiready', name: 'Sistema de diseño AI-ready', nameEn: 'AI-ready design system', tags: ['designSystem', 'ai', 'client'],
    tools: ['Figma', 'Claude', 'Codex'],
  },
  { id: 'pastafactory', name: 'The Pasta Factory', tags: ['designSystem', 'branding', 'prototyping'], tools: ['Figma'] },
  { id: 'nike', name: 'Nike Redesign · BrandBook', tags: ['branding', 'individual'], tools: ['Illustrator', 'InDesign', 'Photoshop'] },
  { id: 'throwback', name: 'THROWBACK Magazine', tags: ['editorial'], tools: ['InDesign', 'Illustrator', 'Photoshop'] },
  { id: 'whiterhino', name: 'White Rhino Postage Stamps', tags: ['editorial', 'individual'], tools: ['Illustrator'] },
  {
    id: 'sandunguera', name: 'Sandunguera · Academia de salsa (Cali)', nameEn: 'Sandunguera · Salsa academy (Cali)',
    tags: ['branding', 'social', 'client'], tools: ['Figma', 'Canva'],
  },
  { id: 'mill5', name: 'MILL5 Colombia', tags: ['internalComms', 'client'], tools: ['Figma', 'Illustrator'] },
  {
    id: 'westudy', name: 'We Study World', tags: ['social', 'internalComms', 'accessibility', 'client'],
    tools: ['Illustrator', 'Photoshop', 'CapCut'],
  },
].map((p) => ({ behance: null, ...p, media: mediaOf(p.id) }));

// Proyectos de una categoría, en el orden de la lista
export const projectsIn = (categoryId) => {
  const tags = categories.find((c) => c.id === categoryId)?.tags ?? [];
  return projects.filter((p) => p.tags.some((tag) => tags.includes(tag)));
};

// Etiquetas que tienen los proyectos de una categoría (los filtros de su modal), en el orden de tagColors
export const tagsIn = (categoryId) => {
  const present = new Set(projectsIn(categoryId).flatMap((p) => p.tags));
  return Object.keys(tagColors).filter((tag) => present.has(tag));
};
