import { useState, useEffect, useCallback } from 'react';
import { Zone, Event, AdminLog, AppData } from '@/types';

const STORAGE_KEY = 'encargado_app_data';

const defaultData: AppData = {
  zones: [],
  events: [],
  adminLogs: [],
  adminPassword: '12345',
};

export function useAppData() {
  const [data, setData] = useState<AppData>(defaultData);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setData({ ...defaultData, ...parsed });
      } catch {
        setData(defaultData);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, isLoaded]);

  const addZone = useCallback((name: string) => {
    const newZone: Zone = {
      id: crypto.randomUUID(),
      name,
      createdAt: Date.now(),
    };

    const log: AdminLog = {
      id: crypto.randomUUID(),
      type: 'zone_created',
      zoneId: newZone.id,
      zoneName: name,
      timestamp: Date.now(),
    };

    setData(prev => ({
      ...prev,
      zones: [...prev.zones, newZone],
      adminLogs: [log, ...prev.adminLogs],
    }));

    return newZone;
  }, []);

  const deleteZone = useCallback((zoneId: string) => {
    setData(prev => {
      const zone = prev.zones.find(z => z.id === zoneId);
      const log: AdminLog = {
        id: crypto.randomUUID(),
        type: 'zone_deleted',
        zoneId,
        zoneName: zone?.name,
        timestamp: Date.now(),
      };

      return {
        ...prev,
        zones: prev.zones.filter(z => z.id !== zoneId),
        events: prev.events.filter(e => e.zoneId !== zoneId),
        adminLogs: [log, ...prev.adminLogs],
      };
    });
  }, []);

  const addEvent = useCallback((zoneId: string, description: string, photos: { id: string; dataUrl: string }[]) => {
    const newEvent: Event = {
      id: crypto.randomUUID(),
      zoneId,
      description,
      createdAt: Date.now(),
      isCompleted: false,
      photos: photos.map(p => ({ ...p, timestamp: Date.now() })),
    };

    setData(prev => {
      const zone = prev.zones.find(z => z.id === zoneId);
      const log: AdminLog = {
        id: crypto.randomUUID(),
        type: 'event_created',
        zoneId,
        zoneName: zone?.name,
        eventId: newEvent.id,
        eventDescription: description,
        timestamp: Date.now(),
      };

      return {
        ...prev,
        events: [...prev.events, newEvent],
        adminLogs: [log, ...prev.adminLogs],
      };
    });

    return newEvent;
  }, []);

  const toggleEventComplete = useCallback((eventId: string) => {
    setData(prev => {
      const event = prev.events.find(e => e.id === eventId);
      if (!event) return prev;

      const zone = prev.zones.find(z => z.id === event.zoneId);
      const isNowCompleted = !event.isCompleted;

      const log: AdminLog = {
        id: crypto.randomUUID(),
        type: 'event_completed',
        zoneId: event.zoneId,
        zoneName: zone?.name,
        eventId,
        eventDescription: event.description,
        timestamp: Date.now(),
      };

      return {
        ...prev,
        events: prev.events.map(e =>
          e.id === eventId
            ? { ...e, isCompleted: isNowCompleted, completedAt: isNowCompleted ? Date.now() : undefined }
            : e
        ),
        adminLogs: isNowCompleted ? [log, ...prev.adminLogs] : prev.adminLogs,
      };
    });
  }, []);

  const deleteEvent = useCallback((eventId: string) => {
    setData(prev => {
      const event = prev.events.find(e => e.id === eventId);
      if (!event) return prev;

      const zone = prev.zones.find(z => z.id === event.zoneId);
      const log: AdminLog = {
        id: crypto.randomUUID(),
        type: 'event_deleted',
        zoneId: event.zoneId,
        zoneName: zone?.name,
        eventId,
        eventDescription: event.description,
        timestamp: Date.now(),
      };

      return {
        ...prev,
        events: prev.events.filter(e => e.id !== eventId),
        adminLogs: [log, ...prev.adminLogs],
      };
    });
  }, []);

  const getZoneEvents = useCallback((zoneId: string) => {
    return data.events.filter(e => e.zoneId === zoneId);
  }, [data.events]);

  const getPendingCount = useCallback((zoneId: string) => {
    return data.events.filter(e => e.zoneId === zoneId && !e.isCompleted).length;
  }, [data.events]);

  const updateAdminPassword = useCallback((newPassword: string) => {
    setData(prev => ({ ...prev, adminPassword: newPassword }));
  }, []);

  const verifyAdminPassword = useCallback((password: string) => {
    return password === data.adminPassword;
  }, [data.adminPassword]);

  return {
    zones: data.zones,
    events: data.events,
    adminLogs: data.adminLogs,
    isLoaded,
    addZone,
    deleteZone,
    addEvent,
    toggleEventComplete,
    deleteEvent,
    getZoneEvents,
    getPendingCount,
    updateAdminPassword,
    verifyAdminPassword,
  };
}
