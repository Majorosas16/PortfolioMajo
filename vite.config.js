import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Política de seguridad del contenido (CSP) de la web publicada. GitHub Pages no deja enviar cabeceras HTTP, así que
// va como <meta> en el HTML. Solo en el build: el servidor de desarrollo de Vite usa scripts en línea y la rompería.
// - Scripts: solo los de la propia web. Estilos: los propios, los de Google Fonts y 'unsafe-inline' (React usa style={…}).
// - Fuentes de Google Fonts; imágenes propias y data: (texturas SVG en CSS); videos y sonidos propios; fetch solo propio.
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:",
  "media-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = {
  name: 'security-meta',
  apply: 'build',
  transformIndexHtml: () => [
    { tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP }, injectTo: 'head-prepend' },
    // Al abrir Behance, LinkedIn… solo se envía el dominio de la web, no la URL completa
    { tag: 'meta', attrs: { name: 'referrer', content: 'strict-origin-when-cross-origin' }, injectTo: 'head-prepend' },
  ],
};

// base './' permite publicar en GitHub Pages sin importar el nombre del repositorio
export default defineConfig({
  plugins: [react(), securityHeaders],
  base: './',
});
