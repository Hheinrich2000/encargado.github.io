import { useState } from 'react';
import { Trash2, Share2, Check, Image as ImageIcon } from 'lucide-react';
import { Event } from '@/types';
import { useApp } from '@/context/AppContext';
import { ShareDialog } from './ShareDialog';
import { PhotoViewer } from './PhotoViewer';
import { cn } from '@/lib/utils';

interface EventItemProps {
  event: Event;
  zoneName: string;
}

export function EventItem({ event, zoneName }: EventItemProps) {
  const { toggleEventComplete, deleteEvent } = useApp();
  const [showShare, setShowShare] = useState(false);
  const [showPhoto, setShowPhoto] = useState<string | null>(null);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('¿Eliminar esta incidencia?')) {
      deleteEvent(event.id);
    }
  };

  return (
    <>
      <div className={cn('event-item animate-slide-up', event.isCompleted && 'completed')}>
        <div className="flex gap-3">
          {/* Checkbox */}
          <button
            onClick={() => toggleEventComplete(event.id)}
            className={cn(
              'w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all mt-0.5',
              event.isCompleted
                ? 'bg-success border-success'
                : 'border-border hover:border-primary'
            )}
            aria-label={event.isCompleted ? 'Marcar como pendiente' : 'Marcar como completado'}
          >
            {event.isCompleted && <Check className="w-4 h-4 text-success-foreground" />}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className={cn(
              'text-foreground',
              event.isCompleted && 'line-through opacity-60'
            )}>
              {event.description}
            </p>
            
            <p className="text-xs text-muted-foreground mt-1">
              Creado: {new Date(event.createdAt).toLocaleString('es-ES')}
            </p>

            {event.completedAt && (
              <p className="text-xs text-success mt-0.5">
                ✓ Completado: {new Date(event.completedAt).toLocaleString('es-ES')}
              </p>
            )}

            {/* Photos */}
            {event.photos.length > 0 && (
              <div className="flex gap-2 mt-3">
                {event.photos.map((photo) => (
                  <button
                    key={photo.id}
                    onClick={() => setShowPhoto(photo.dataUrl)}
                    className="photo-thumbnail"
                  >
                    <img
                      src={photo.dataUrl}
                      alt="Foto de incidencia"
                      className="w-full h-full object-cover rounded-md"
                    />
                  </button>
                ))}
                {event.photos.length === 1 && (
                  <div className="w-16 h-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setShowShare(true)}
              className="action-icon text-muted-foreground hover:text-primary"
              aria-label="Compartir"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleDelete}
              className="action-icon text-muted-foreground hover:text-destructive"
              aria-label="Eliminar"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <ShareDialog
        open={showShare}
        onClose={() => setShowShare(false)}
        event={event}
        zoneName={zoneName}
      />

      <PhotoViewer
        src={showPhoto}
        onClose={() => setShowPhoto(null)}
      />
    </>
  );
}
