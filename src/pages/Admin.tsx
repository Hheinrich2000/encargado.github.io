import { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, Key, LogOut, Clock, AlertCircle, CheckCircle2, Trash2, FolderPlus, FolderMinus } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AdminLog } from '@/types';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const { verifyAdminPassword, updateAdminPassword, adminLogs, zones, events } = useApp();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPassword(password)) {
      setIsAuthenticated(true);
      setPassword('');
      setError('');
    } else {
      setError('Contraseña incorrecta');
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (newPassword.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres');
      return;
    }
    updateAdminPassword(newPassword);
    setNewPassword('');
    setConfirmPassword('');
    setShowChangePassword(false);
    setError('');
  };

  const getLogIcon = (type: AdminLog['type']) => {
    switch (type) {
      case 'event_created':
        return <AlertCircle className="w-4 h-4 text-primary" />;
      case 'event_deleted':
        return <Trash2 className="w-4 h-4 text-destructive" />;
      case 'event_completed':
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'zone_created':
        return <FolderPlus className="w-4 h-4 text-accent" />;
      case 'zone_deleted':
        return <FolderMinus className="w-4 h-4 text-destructive" />;
    }
  };

  const getLogText = (log: AdminLog) => {
    switch (log.type) {
      case 'event_created':
        return `Nueva incidencia en "${log.zoneName}": ${log.eventDescription}`;
      case 'event_deleted':
        return `Incidencia eliminada de "${log.zoneName}": ${log.eventDescription}`;
      case 'event_completed':
        return `Incidencia completada en "${log.zoneName}": ${log.eventDescription}`;
      case 'zone_created':
        return `Nueva zona creada: ${log.zoneName}`;
      case 'zone_deleted':
        return `Zona eliminada: ${log.zoneName}`;
    }
  };

  const pendingEventsCount = events.filter(e => !e.isCompleted).length;
  const completedEventsCount = events.filter(e => e.isCompleted).length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="admin-card animate-slide-up">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
            </div>
            
            <h1 className="text-xl font-bold text-center text-foreground mb-2">
              Panel de Administrador
            </h1>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Ingresa tu contraseña para acceder
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}

              <Button type="submit" className="w-full">
                Acceder
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background safe-area-inset">
      {/* Header */}
      <header className="app-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">Dashboard Admin</h1>
              <p className="text-xs text-muted-foreground">Panel de control</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowChangePassword(!showChangePassword)}
              className="action-icon text-muted-foreground hover:text-primary"
              aria-label="Cambiar contraseña"
            >
              <Key className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="action-icon text-muted-foreground hover:text-destructive"
              aria-label="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="admin-card text-center">
            <p className="text-2xl font-bold text-foreground">{zones.length}</p>
            <p className="text-xs text-muted-foreground">Zonas</p>
          </div>
          <div className="admin-card text-center">
            <p className="text-2xl font-bold text-warning">{pendingEventsCount}</p>
            <p className="text-xs text-muted-foreground">Pendientes</p>
          </div>
          <div className="admin-card text-center">
            <p className="text-2xl font-bold text-success">{completedEventsCount}</p>
            <p className="text-xs text-muted-foreground">Completados</p>
          </div>
        </div>

        {/* Change Password */}
        {showChangePassword && (
          <div className="admin-card mb-6 animate-slide-up">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              Cambiar Contraseña
            </h2>
            <form onSubmit={handleChangePassword} className="space-y-3">
              <Input
                type="password"
                placeholder="Nueva contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setShowChangePassword(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  Guardar
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Activity Log */}
        <div className="admin-card">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Registro de Actividad
          </h2>

          {adminLogs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No hay actividad registrada
            </p>
          ) : (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {adminLogs.map((log) => (
                <div key={log.id} className="flex gap-3 p-3 rounded-lg bg-muted/50 animate-fade-in">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-background flex items-center justify-center">
                    {getLogIcon(log.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{getLogText(log)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(log.timestamp).toLocaleString('es-ES')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
