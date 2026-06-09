type Props = {
  src: string;
  caption?: string;
  onClose: () => void;
};

/** Visor de imagen ampliada. Cierra al hacer click en cualquier lado. */
export function ImageLightbox({ src, caption, onClose }: Props) {
  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <img className="lightbox-img" src={src} alt={caption ?? ''} />
      {caption && <div className="lightbox-cap">{caption}</div>}
    </div>
  );
}
