import { useState } from 'react';
import { X, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/context/AppContext';

interface AddZoneDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AddZoneDialog({ open, onClose }: AddZoneDialogProps) {
  const [name, setName] = useState('');
  const { addZone } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addZone(name.trim());
      setName('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Nueva Zona
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Input
              placeholder="Nombre de la zona..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="text-lg"
            />
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={!name.trim()} className="flex-1">
              Añadir
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
