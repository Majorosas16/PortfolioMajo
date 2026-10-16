import { forwardRef } from 'react';
import './P.css';

// P = "Posicionado". Ubica un elemento con las coordenadas del frame de Figma (en px de un lienzo de 1512 de ancho).
// En escritorio/tablet las coordenadas se escalan con la variable CSS --u.
// En celular (≤ 768px) se ignoran y el elemento fluye en columna (ver styles.css).
//
// x, y   → posición (esquina superior izquierda, o centro si cx / cy)
// w, h   → ancho / alto
// r      → rotación en grados
// fs     → tamaño de fuente
const P = forwardRef(function P({
  x,
  y,
  w,
  h,
  r,
  fs,
  cx = false,
  cy = false,
  as: Tag = 'div',
  className = '',
  style,
  children,
  ...rest
}, ref) {
  const vars = {
    ...(x != null && { '--x': x }),
    ...(y != null && { '--y': y }),
    ...(w != null && { '--w': w }),
    ...(h != null && { '--h': h }),
    ...(r != null && { '--r': `${r}deg` }),
    ...(fs != null && { '--fs': fs }),
    ...style,
  };
  const classes = ['abs', cx && 'cx', cy && 'cy', fs != null && 'fs', className].filter(Boolean).join(' ');
  return (
    <Tag ref={ref} className={classes} style={vars} {...rest}>
      {children}
    </Tag>
  );
});

export default P;
