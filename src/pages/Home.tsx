import { useState } from 'react';
import { ClipboardList, FolderOpen } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ZoneCard } from '@/components/ZoneCard';
import { AddZoneDialog } from '@/components/AddZoneDialog';
import { FloatingActionButton } from '@/components/FloatingActionButton';

export default function Home() {
  const [showAddZone, setShowAddZone] = useState(false);
  const { zones, isLoaded } = useApp();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background safe-area-inset">
      {/* Header */}
      <header className="app-header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground">Encargado</h1>
            <p className="text-xs text-muted-foreground">Gestión de Incidencias</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-4 pb-24">
        {zones.length === 0 ? (
          <div className="empty-state">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <FolderOpen className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Sin zonas</h2>
            <p className="text-muted-foreground max-w-xs">
              Pulsa el botón + para añadir tu primera zona de trabajo
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide px-1">
              Zonas de trabajo
            </h2>
            {zones.map((zone, index) => (
              <div key={zone.id} style={{ animationDelay: `${index * 50}ms` }}>
                <ZoneCard zone={zone} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FAB */}
      <FloatingActionButton onClick={() => setShowAddZone(true)} ariaLabel="Añadir zona" />

      {/* Add Zone Dialog */}
      <AddZoneDialog open={showAddZone} onClose={() => setShowAddZone(false)} />
    </div>
  );
}
