import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, AlertCircle, Share2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { EventItem } from '@/components/EventItem';
import { AddEventDialog } from '@/components/AddEventDialog';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { ShareAllDialog } from '@/components/ShareAllDialog';

export default function ZoneDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { zones, getZoneEvents, deleteZone, isLoaded } = useApp();
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showShareAll, setShowShareAll] = useState(false);

  const zone = zones.find(z => z.id === id);
  const events = id ? getZoneEvents(id) : [];
  
  const pendingEvents = events.filter(e => !e.isCompleted);
  const completedEvents = events.filter(e => e.isCompleted);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!zone) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Zona no encontrada</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-primary hover:underline"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const handleDeleteZone = () => {
    if (confirm(`¿Eliminar la zona "${zone.name}" y todas sus incidencias?`)) {
      deleteZone(zone.id);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background safe-area-inset">
      {/* Header */}
      <header className="app-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="action-icon"
              aria-label="Volver"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-bold text-lg text-foreground">{zone.name}</h1>
              <p className="text-xs text-muted-foreground">
                {pendingEvents.length} pendiente{pendingEvents.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {events.length > 0 && (
              <button
                onClick={() => setShowShareAll(true)}
                className="action-icon text-muted-foreground hover:text-primary"
                aria-label="Compartir todo"
              >
                <Share2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={handleDeleteZone}
              className="action-icon text-muted-foreground hover:text-destructive"
              aria-label="Eliminar zona"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-4 pb-24">
        {events.length === 0 ? (
          <div className="empty-state">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <AlertCircle className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Sin incidencias</h2>
            <p className="text-muted-foreground max-w-xs">
              Pulsa el botón + para añadir una incidencia
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Pending Events */}
            {pendingEvents.length > 0 && (
              <section>
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide px-1 mb-3">
                  Pendientes ({pendingEvents.length})
                </h2>
                <div className="space-y-3">
                  {pendingEvents.map((event, index) => (
                    <div key={event.id} style={{ animationDelay: `${index * 50}ms` }}>
                      <EventItem event={event} zoneName={zone.name} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Completed Events */}
            {completedEvents.length > 0 && (
              <section>
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide px-1 mb-3">
                  Completados ({completedEvents.length})
                </h2>
                <div className="space-y-3">
                  {completedEvents.map((event, index) => (
                    <div key={event.id} style={{ animationDelay: `${index * 50}ms` }}>
                      <EventItem event={event} zoneName={zone.name} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* FAB */}
      <FloatingActionButton onClick={() => setShowAddEvent(true)} ariaLabel="Añadir incidencia" />

      {/* Add Event Dialog */}
      {id && <AddEventDialog open={showAddEvent} onClose={() => setShowAddEvent(false)} zoneId={id} />}

      {/* Share All Dialog */}
      <ShareAllDialog
        open={showShareAll}
        onClose={() => setShowShareAll(false)}
        events={events}
        zoneName={zone.name}
      />
    </div>
  );
}
