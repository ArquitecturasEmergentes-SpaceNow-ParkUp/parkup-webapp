'use client';

import { Log } from '@/lib/logs';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ExportButtonProps {
  logs: Log[];
}

export function ExportButton({ logs }: ExportButtonProps) {
  const exportToCSV = () => {
    const headers = [
      'ID',
      'Fecha y Hora',
      'Usuario',
      'Email',
      'Acción',
      'Recurso',
      'ID Recurso',
      'Estado',
      'IP',
      'Detalles',
      'Mensaje Error',
      'Tiempo Ejecución (ms)'
    ];

    const csvContent = [
      headers.join(','),
      ...logs.map(log => [
        log.id,
        `"${format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')}"`,
        `"${log.username}"`,
        `"${log.userEmail}"`,
        `"${log.action}"`,
        `"${log.resourceType || ''}"`,
        log.resourceId || '',
        `"${log.status}"`,
        `"${log.ipAddress}"`,
        `"${(log.details || '').replace(/"/g, '""')}"`,
        `"${(log.errorMessage || '').replace(/"/g, '""')}"`,
        log.executionTimeMs || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `logs_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(logs, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `logs_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToCSV}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Exportar CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJSON}>
          <FileText className="h-4 w-4 mr-2" />
          Exportar JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}