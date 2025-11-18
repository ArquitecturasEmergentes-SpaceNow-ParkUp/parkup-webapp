'use client';

import type { Log } from '@/lib/logs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Eye, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DataTableProps {
  logs: Log[];
  loading: boolean;
  onLogClick: (log: Log) => void;
  sort?: string[];
}

export function DataTable({ logs, loading, onLogClick, sort }: DataTableProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        {['s1','s2','s3','s4','s5'].map((key) => (
          <div key={key} className="flex gap-4 p-4 border rounded-lg">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No se encontraron registros de actividad
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'FAILURE':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'WARNING':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>
              Fecha y Hora
              {sort?.[0]?.includes('timestamp') && (
                <span className="ml-2 text-xs text-muted-foreground">
                  {sort[0].endsWith(',desc') ? '↓' : '↑'}
                </span>
              )}
            </TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead>Acción</TableHead>
            <TableHead>Recurso</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>IP</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">#{log.id}</TableCell>
              <TableCell>
                {format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm:ss', { locale: es })}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{log.username}</span>
                  <span className="text-sm text-muted-foreground">{log.userEmail}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{log.action}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm">{log.resourceType}</span>
                  {log.resourceId && (
                    <span className="text-xs text-muted-foreground">ID: {log.resourceId}</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getStatusIcon(log.status)}
                  {getStatusBadge(log.status)}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm font-mono">{log.ipAddress}</span>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onLogClick(log)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}