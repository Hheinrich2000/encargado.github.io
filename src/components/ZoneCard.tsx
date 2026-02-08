import { ChevronRight, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Zone } from '@/types';
import { useApp } from '@/context/AppContext';

interface ZoneCardProps {
  zone: Zone;
}

export function ZoneCard({ zone }: ZoneCardProps) {
  const navigate = useNavigate();
  const { getPendingCount } = useApp();
  const pendingCount = getPendingCount(zone.id);

  return (
    <div
      className="zone-card animate-slide-up"
      onClick={() => navigate(`/zone/${zone.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/zone/${zone.id}`)}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <MapPin className="w-6 h-6 text-primary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{zone.name}</h3>
          <p className="text-sm text-muted-foreground">
            {new Date(zone.createdAt).toLocaleDateString('es-ES')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <span className="pending-badge">
              {pendingCount}
            </span>
          )}
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
