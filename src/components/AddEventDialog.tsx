import { useState, useRef } from 'react';
import { X, Camera, Image as ImageIcon, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/context/AppContext';

interface AddEventDialogProps {
  open: boolean;
  onClose: () => void;
  zoneId: string;
}

interface PhotoPreview {
  id: string;
  dataUrl: string;
}

export function AddEventDialog({ open, onClose, zoneId }: AddEventDialogProps) {
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<PhotoPreview[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addEvent } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      addEvent(zoneId, description.trim(), photos);
      setDescription('');
      setPhotos([]);
      onClose();
    }
  };

  const handlePhotoCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (photos.length >= 2) {
      alert('Máximo 2 fotos por incidencia');
      return;
    }

    // Compress and convert to base64
    const compressedDataUrl = await compressImage(file);
    
    setPhotos(prev => [...prev, {
      id: crypto.randomUUID(),
      dataUrl: compressedDataUrl,
    }]);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  const handleClose = () => {
    setDescription('');
    setPhotos([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Nueva Incidencia
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Textarea
              placeholder="Describe la incidencia..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              autoFocus
            />
          </div>

          {/* Photos */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Fotos ({photos.length}/2)
            </label>
            
            <div className="flex gap-3">
              {photos.map((photo) => (
                <div key={photo.id} className="relative">
                  <img
                    src={photo.dataUrl}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg border-2 border-border"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(photo.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {photos.length < 2 && (
                <label className="w-20 h-20 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                  <Camera className="w-6 h-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground mt-1">Añadir</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoCapture}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={!description.trim()} className="flex-1">
              Añadir
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
