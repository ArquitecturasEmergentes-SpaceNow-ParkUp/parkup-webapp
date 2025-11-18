import { Suspense } from 'react';
import { getLogsServer } from '@/lib/logs-api-server';
import type { LogsResponse, LogsFilters } from '@/lib/logs';
import { LogsClient } from '@/components/logs/LogsClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminLogsPageProps {
  searchParams?: {
    page?: string;
    size?: string;
    sort?: string | string[];
    action?: string;
    status?: string;
    username?: string;
    startDate?: string;
    endDate?: string;
       search?: string;
  };
}

export default async function AdminLogsPage({ searchParams = {} }: AdminLogsPageProps) {
  // searchParams can be a Promise in newer Next versions so await it to access properties
  const resolvedSearchParams = (await searchParams) || searchParams || {};
  // Parse filters from search params
  const filters: LogsFilters = {
    page: resolvedSearchParams.page ? parseInt(resolvedSearchParams.page, 10) : 0,
    size: resolvedSearchParams.size ? parseInt(resolvedSearchParams.size, 10) : 20,
    // sort can be provided as a JSON encoded array string like '["timestamp,desc"]'
    sort: resolvedSearchParams.sort ? (Array.isArray(resolvedSearchParams.sort) ? resolvedSearchParams.sort : (() => {
      try {
        return JSON.parse(resolvedSearchParams.sort as string);
      } catch (_) {
        return [resolvedSearchParams.sort as string];
      }
    })()) : ['timestamp,desc'],
    action: resolvedSearchParams.action,
    status: resolvedSearchParams.status,
    username: resolvedSearchParams.username,
    startDate: resolvedSearchParams.startDate,
    endDate: resolvedSearchParams.endDate,
    search: resolvedSearchParams.search,
    // default to most recent first if not specified (handled above)
  };

  let logs: LogsResponse | null = null;
  let error: string | null = null;

  try {
    logs = await getLogsServer(filters);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Error al cargar los logs';
    console.error('Error fetching logs:', err);
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Panel de Logs de Administrador</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-red-500">{error}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Panel de Logs de Administrador</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Cargando logs...</div>}>
            <LogsClient initialLogs={logs} initialFilters={filters} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}