import { byName } from '../assets/images.js';

// Íconos de redes (src/assets/sections/projects/icon-*)
const icons = byName(import.meta.glob('../assets/sections/projects/icon-*', { eager: true, import: 'default' }));

// Redes del portafolio: las usan la sección de contacto (Projects.jsx) y el menú del celular (Header.jsx).
// size: tamaño del ícono en el lienzo de 1512px (sección de contacto).
// WhatsApp: enlace por nombre de usuario (@majorosas16)
export const socials = [
  { name: 'WhatsApp', icon: icons['icon-whatsapp'], size: 58.76, href: 'https://wa.me/majorosas16' },
  { name: 'Behance', icon: icons['icon-behance'], size: 61.98, href: 'https://www.behance.net/marajrosasc' },
  { name: 'LinkedIn', icon: icons['icon-linkedin'], size: 57.35, href: 'https://www.linkedin.com/in/majo-rosas-creative' },
  { name: 'GitHub', icon: icons['icon-github'], size: 62.56, href: 'https://github.com/Majorosas16' },
];
