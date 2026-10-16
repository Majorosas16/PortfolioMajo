import { Fragment } from 'react';

// Convierte las marcas de translations.js en JSX: **negrita**, [[encerrado]] / [[blue:encerrado]] y \n.
const TOKEN = /(\*\*[^*]+\*\*|\[\[[^\]]+\]\]|\n)/;

export default function Rich({ text }) {
  return text.split(TOKEN).map((part, i) => {
    if (part === '\n') return <br key={i} />;
    if (part.startsWith('**')) return <b key={i}>{part.slice(2, -2)}</b>;
    if (part.startsWith('[[')) {
      const inner = part.slice(2, -2);
      const [mod, word] = inner.includes(':') ? inner.split(':') : [null, inner];
      return (
        <span key={i} className={`circled${mod ? ` circled--${mod}` : ''}`}>
          {word}
        </span>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}
