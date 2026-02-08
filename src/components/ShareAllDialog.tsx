import { MessageCircle, Mail, Printer } from 'lucide-react';
import { Event } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ShareAllDialogProps {
  open: boolean;
  onClose: () => void;
  events: Event[];
  zoneName: string;
}

export function ShareAllDialog({ open, onClose, events, zoneName }: ShareAllDialogProps) {
  const formatAllEventsText = () => {
    const pending = events.filter(e => !e.isCompleted);
    const completed = events.filter(e => e.isCompleted);

    let text = `📋 *Resumen de Incidencias*\n\n📍 Zona: ${zoneName}\n`;
    text += `📊 Total: ${events.length} | ⏳ Pendientes: ${pending.length} | ✅ Completados: ${completed.length}\n\n`;

    if (pending.length > 0) {
      text += `*Pendientes:*\n`;
      pending.forEach((e, i) => {
        text += `${i + 1}. ${e.description} (${new Date(e.createdAt).toLocaleDateString('es-ES')})\n`;
      });
      text += '\n';
    }

    if (completed.length > 0) {
      text += `*Completados:*\n`;
      completed.forEach((e, i) => {
        text += `${i + 1}. ${e.description}\n`;
      });
    }

    return text;
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(formatAllEventsText());
    window.open(`https://wa.me/?text=${text}`, '_blank');
    onClose();
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Resumen Incidencias - ${zoneName}`);
    const body = encodeURIComponent(formatAllEventsText().replace(/\*/g, ''));
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    onClose();
  };

  const handlePrint = () => {
    const pending = events.filter(e => !e.isCompleted);
    const completed = events.filter(e => e.isCompleted);

    const printContent = `
      <html>
        <head>
          <title>Incidencias - ${zoneName}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
            h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
            h2 { color: #666; margin-top: 20px; }
            .summary { background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
            .event { padding: 10px; border-left: 3px solid #ddd; margin: 10px 0; }
            .event.pending { border-color: #f59e0b; }
            .event.completed { border-color: #10b981; }
            .date { color: #888; font-size: 12px; }
          </style>
        </head>
        <body>
          <h1>📋 Incidencias - ${zoneName}</h1>
          <div class="summary">
            <strong>Resumen:</strong> ${events.length} total | ${pending.length} pendientes | ${completed.length} completados
          </div>
          
          ${pending.length > 0 ? `
            <h2>⏳ Pendientes</h2>
            ${pending.map(e => `
              <div class="event pending">
                <div>${e.description}</div>
                <div class="date">Creado: ${new Date(e.createdAt).toLocaleString('es-ES')}</div>
              </div>
            `).join('')}
          ` : ''}
          
          ${completed.length > 0 ? `
            <h2>✅ Completados</h2>
            ${completed.map(e => `
              <div class="event completed">
                <div>${e.description}</div>
                <div class="date">Completado: ${e.completedAt ? new Date(e.completedAt).toLocaleString('es-ES') : ''}</div>
              </div>
            `).join('')}
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
          <DialogTitle>Compartir todas las incidencias</DialogTitle>
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
