export interface Photo {
  id: string;
  dataUrl: string;
  timestamp: number;
}

export interface Event {
  id: string;
  zoneId: string;
  description: string;
  createdAt: number;
  completedAt?: number;
  isCompleted: boolean;
  photos: Photo[];
}

export interface Zone {
  id: string;
  name: string;
  createdAt: number;
}

export interface AdminLog {
  id: string;
  type: 'event_created' | 'event_deleted' | 'event_completed' | 'zone_created' | 'zone_deleted';
  zoneId?: string;
  zoneName?: string;
  eventId?: string;
  eventDescription?: string;
  timestamp: number;
}

export interface AppData {
  zones: Zone[];
  events: Event[];
  adminLogs: AdminLog[];
  adminPassword: string;
}
