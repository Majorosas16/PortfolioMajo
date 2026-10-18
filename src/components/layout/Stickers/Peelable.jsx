import StickerArt, { artSize, stickerImg } from './StickerArt.jsx';
import { peelGeometry } from './peel.js';

// Sticker que se puede despegar (como en una hoja de stickers): peel = { C, P } (ver peel.js) dobla su esquina y
// muestra el reverso blanco encima; sin peel se ve entero. slot: deja ver debajo la silueta gris del papel donde estaba
// pegado (en el panel). emptied: el sticker ya se despegó del todo y solo queda esa silueta.
export default function Peelable({ id, side, max, peel, slot = false, emptied = false }) {
  const { w, h } = artSize(id, side, max);
  const g = peel && peelGeometry(w, h, peel.C, peel.P);
  const src = `url("${stickerImg[id]}")`;
  return (
    <span className={`peel${emptied ? ' is-emptied' : ''}`} style={{ width: w, height: h, '--src': src }}>
      {slot && <span className="peel__slot" />}
      <StickerArt id={id} side={side} max={max} style={g ? { clipPath: g.stuck } : undefined} />
      {g?.lifted && (
        <span className="peel__flap" style={{ transform: g.matrix }}>
          <span className="peel__back" style={{ clipPath: g.lifted, backgroundImage: g.shade }} />
        </span>
      )}
    </span>
  );
}
