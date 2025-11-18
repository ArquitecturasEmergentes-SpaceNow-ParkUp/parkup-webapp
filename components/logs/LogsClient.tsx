'use client';

import { useState, useEffect, useRef } from 'react';
import type { LogsResponse, LogsFilters, Log } from '@/lib/logs';
import { getLogs } from '@/lib/logs-api';
import { DataTable } from '@/components/logs/DataTable';
import { Filters } from '@/components/logs/Filters';
import { Pagination } from '@/components/logs/Pagination';
import { LogDetailsModal } from '@/components/logs/LogDetailsModal';
import { ExportButton } from '@/components/logs/ExportButton';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface LogsClientProps {
  initialLogs: LogsResponse | null;
  initialFilters: LogsFilters;
}

export function LogsClient({ initialLogs, initialFilters }: LogsClientProps) {
  const [logs, setLogs] = useState<LogsResponse | null>(initialLogs);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<LogsFilters>(initialFilters);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [showModal, setShowModal] = useState(false);
  const isMountedRef = useRef(false);

  // Update URL search params when filters change
  const updateSearchParams = (newFilters: LogsFilters) => {
    const searchParams = new URLSearchParams();
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        // support arrays (e.g. sort) encoding as JSON, otherwise simple toString()
        if (Array.isArray(value)) {
          searchParams.set(key, JSON.stringify(value));
        } else {
          searchParams.set(key, value.toString());
        }
      }
    });
    
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.replaceState({}, '', newUrl);
  };

  const handleFilterChange = (newFilters: LogsFilters) => {
    setFilters({ ...newFilters, page: 0 });
    updateSearchParams({ ...newFilters, page: 0 });
  };

  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    updateSearchParams(newFilters);
  };

  const handlePageSizeChange = (size: number) => {
    const newFilters = { ...filters, size, page: 0 };
    setFilters(newFilters);
    updateSearchParams(newFilters);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const toggleSortTimestamp = () => {
    const current = filters.sort || [];
    const currentFirst = current[0] || '';

    let newSort: string[] | undefined;
    if (!currentFirst.includes('timestamp')) {
      newSort = ['timestamp,desc'];
    } else if (currentFirst.endsWith(',desc')) {
      newSort = ['timestamp,asc'];
    } else {
      // remove sort
      newSort = undefined;
    }

    const newFilters = { ...filters, sort: newSort, page: 0 };
    setFilters(newFilters);
    updateSearchParams(newFilters);
  };

  useEffect(() => {
    let active = true;
    const isInitialMount = isMountedRef.current === false;

    async function fetch() {
      setLoading(true);
      try {
        const data = await getLogs(filters);
        if (active) setLogs(data);
      } catch (err) {
        console.error('Error fetching logs client-side', err);
        toast.error('Error al cargar los logs');
      } finally {
        if (active) setLoading(false);
      }
    }

    // If we already received `initialLogs` from the server, skip the first client-side fetch.
    // This avoids an unnecessary re-fetch and potential 401 when the cookie token isn't present
    // for direct backend calls from the browser (we forward via /api logs route instead).
    if (isInitialMount && initialLogs) {
      isMountedRef.current = true;
      return;
    }

    fetch();

    isMountedRef.current = true;
    return () => { active = false; };
  }, [filters, initialLogs]);

  const handleExport = (format: 'csv' | 'json') => {
    if (!logs || !logs.content) return;

    const data = logs.content;
    const filename = `admin-logs-${new Date().toISOString().split('T')[0]}`;

    if (format === 'csv') {
      const csv = convertToCSV(data);
      downloadFile(csv, `${filename}.csv`, 'text/csv');
    } else {
      const json = JSON.stringify(data, null, 2);
      downloadFile(json, `${filename}.json`, 'application/json');
    }

    toast.success(`Logs exportados como ${format.toUpperCase()}`);
  };

  const convertToCSV = (data: Log[]): string => {
    const headers = ['ID', 'Fecha', 'Acción', 'Usuario', 'Email', 'Estado', 'IP', 'Tiempo (ms)'];
    const csvContent = [
      headers.join(','),
      ...data.map(log => [
        log.id,
        new Date(log.timestamp).toLocaleString('es-PE'),
        log.action,
        log.username,
        log.userEmail,
        log.status,
        log.ipAddress,
        log.executionTimeMs
      ].join(','))
    ].join('\n');
    
    return csvContent;
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleViewDetails = (log: Log) => {
    setSelectedLog(log);
    setShowModal(true);
  };

  if (!logs) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No hay logs disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button onClick={toggleSortTimestamp} variant="outline" size="sm">
            Ordenar por Fecha
          </Button>
          <ExportButton onExport={handleExport} />
        </div>
        <div className="text-sm text-muted-foreground">
          Total: {logs.totalElements} logs
        </div>
      </div>

      {/* Filters */}
      <Filters 
        filters={filters} 
        onFilterChange={handleFilterChange} 
      />

      {/* Data Table */}
      <DataTable 
        logs={logs.content} 
        loading={loading}
        onLogClick={handleViewDetails}
        sort={filters.sort}
      />

      {/* Pagination */}
      {logs.totalPages > 1 && (
        <Pagination 
          currentPage={logs.number}
          totalPages={logs.totalPages}
          pageSize={logs.size}
          totalElements={logs.totalElements}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      {/* Log Details Modal */}
      {selectedLog && (
        <LogDetailsModal 
          log={selectedLog}
          open={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}