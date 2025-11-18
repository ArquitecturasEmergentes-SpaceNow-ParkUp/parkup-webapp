'use client';

import { Log } from '@/lib/logs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CheckCircle, AlertCircle, AlertTriangle, User, Mail, Globe, Clock, Info } from 'lucide-react';

interface LogDetailsModalProps {
  log: Log | null;
  open: boolean;
  onClose: () => void;
}

export function LogDetailsModal({ log, open, onClose }: LogDetailsModalProps) {
  if (!log) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'FAILURE':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'WARNING':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status === 'SUCCESS' ? 'default' : status === 'FAILURE' ? 'destructive' : 'secondary';
    return (
      <Badge variant={variant} className="capitalize">
        {status.toLowerCase()}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon(log.status)}
            Detalles del Registro #{log.id}
          </DialogTitle>
          <DialogDescription>
            Información completa del evento registrado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Section */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              {getStatusIcon(log.status)}
              <span className="font-medium">Estado del Evento</span>
            </div>
            {getStatusBadge(log.status)}
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Información Básica</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Fecha y Hora</span>
                </div>
                <p className="font-medium">
                  {format(new Date(log.timestamp), 'PPpp', { locale: es })}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Info className="h-4 w-4" />
                  <span>Acción</span>
                </div>
                <Badge variant="outline">{log.action}</Badge>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Usuario</span>
                </div>
                <p className="font-medium">{log.username}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </div>
                <p className="font-medium text-sm">{log.userEmail}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Resource Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Información del Recurso</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Tipo de Recurso</p>
                <p className="font-medium">{log.resourceType || 'N/A'}</p>
              </div>

              {log.resourceId && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">ID del Recurso</p>
                  <p className="font-medium">{log.resourceId}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Network Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Información de Red</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  <span>Dirección IP</span>
                </div>
                <p className="font-medium font-mono">{log.ipAddress}</p>
              </div>

              {log.executionTimeMs && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Tiempo de Ejecución</p>
                  <p className="font-medium">{log.executionTimeMs}ms</p>
                </div>
              )}
            </div>

            {log.userAgent && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">User Agent</p>
                <p className="font-medium text-sm bg-muted p-2 rounded font-mono">
                  {log.userAgent}
                </p>
              </div>
            )}
          </div>

          {/* Details */}
          {log.details && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Detalles</h3>
                <p className="text-sm bg-muted p-3 rounded-lg whitespace-pre-wrap">
                  {log.details}
                </p>
              </div>
            </>
          )}

          {/* Error Message */}
          {log.errorMessage && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-red-600">Mensaje de Error</h3>
                <p className="text-sm bg-red-50 text-red-700 p-3 rounded-lg border border-red-200">
                  {log.errorMessage}
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}