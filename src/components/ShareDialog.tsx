import { X, MessageCircle, Mail, Printer } from 'lucide-react';
import { Event } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  event: Event;
  zoneName: string;
}

export function ShareDialog({ open, onClose, event, zoneName }: ShareDialogProps) {
  const formatEventText = () => {
    const status = event.isCompleted ? '✅ Completado' : '⏳ Pendiente';
    const date = new Date(event.createdAt).toLocaleString('es-ES');
    
    return `📋 *Incidencia*\n\n📍 Zona: ${zoneName}\n📝 Descripción: ${event.description}\n📅 Fecha: ${date}\n${status}`;
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(formatEventText());
    window.open(`https://wa.me/?text=${text}`, '_blank');
    onClose();
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Incidencia - ${zoneName}`);
    const body = encodeURIComponent(formatEventText().replace(/\*/g, ''));
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    onClose();
  };

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Incidencia - ${zoneName}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .info { margin: 10px 0; }
            .label { font-weight: bold; }
            .photos { display: flex; gap: 10px; margin-top: 20px; }
            .photos img { max-width: 200px; border-radius: 8px; }
            .status { padding: 5px 10px; border-radius: 4px; display: inline-block; margin-top: 10px; }
            .pending { background: #fef3c7; color: #92400e; }
            .completed { background: #d1fae5; color: #065f46; }
          </style>
        </head>
        <body>
          <h1>📋 Incidencia</h1>
          <div class="info"><span class="label">Zona:</span> ${zoneName}</div>
          <div class="info"><span class="label">Descripción:</span> ${event.description}</div>
          <div class="info"><span class="label">Fecha creación:</span> ${new Date(event.createdAt).toLocaleString('es-ES')}</div>
          <div class="status ${event.isCompleted ? 'completed' : 'pending'}">
            ${event.isCompleted ? '✅ Completado' : '⏳ Pendiente'}
          </div>
          ${event.photos.length > 0 ? `
            <div class="photos">
              ${event.photos.map(p => `<img src="${p.dataUrl}" alt="Foto" />`).join('')}
            </div>
          ` : ''}
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Compartir incidencia
            <button onClick={onClose} className="action-icon">
              <X className="w-5 h-5" />
            </button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2 mt-4">
          <button onClick={handleWhatsApp} className="share-btn">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-green-600" />
            </div>
            <span className="font-medium">Enviar por WhatsApp</span>
          </button>

          <button onClick={handleEmail} className="share-btn">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <span className="font-medium">Enviar por correo</span>
          </button>

          <button onClick={handlePrint} className="share-btn">
            <div className="w-10 h-10 rounded-full bg-gray-500/10 flex items-center justify-center">
              <Printer className="w-5 h-5 text-gray-600" />
            </div>
            <span className="font-medium">Imprimir</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
