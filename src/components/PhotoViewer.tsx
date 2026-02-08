import { X } from 'lucide-react';

interface PhotoViewerProps {
  src: string | null;
  onClose: () => void;
}

export function PhotoViewer({ src, onClose }: PhotoViewerProps) {
  if (!src) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        aria-label="Cerrar"
      >
        <X className="w-6 h-6" />
      </button>
      
      <img
        src={src}
        alt="Foto ampliada"
        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
