import type { LogsResponse, LogsFilters, CreateLogRequest, Log } from './logs';
import { getAuthHeaders } from './auth-utils';
import { endpoints } from './config';

export async function getLogs(filters: LogsFilters = {}): Promise<LogsResponse> {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      // If the value is an array (for sort), encode as JSON to match backend's expected format
      if (Array.isArray(value)) {
        params.append(key, JSON.stringify(value));
      } else {
        params.append(key, value.toString());
      }
    }
  });
  
  // If running in the browser, call the internal Next proxy which will include
  // the Next cookie and avoid CORS/401 issues. Server-side continues to call
  // the backend directly (server has access to cookies via next/headers).
  const apiUrl = typeof window !== 'undefined' ? `/api/logs?${params.toString()}` : `${endpoints.logs.getAll}?${params.toString()}`;

  const response = await fetch(apiUrl, {
    method: 'GET',
    // For client-side we rely on cookie-based proxy; for server-side we add Authorization
    // header from helper (server-only functions use getAuthHeadersServer()) — keep current client helper
    headers: typeof window !== 'undefined' ? getAuthHeaders() : getAuthHeaders(),
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch logs: ${response.statusText}`);
  }
  
  return response.json();
}

export async function getLogById(id: number): Promise<Log> {
  const response = await fetch(endpoints.logs.getById(id), {
    method: 'GET',
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch log: ${response.statusText}`);
  }
  
  return response.json();
}

export async function createLog(logData: CreateLogRequest): Promise<Log> {
  const response = await fetch(endpoints.logs.create, {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(logData),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to create log: ${response.statusText}`);
  }
  
  return response.json();
}