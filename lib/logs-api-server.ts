"use server";

import type { LogsResponse, LogsFilters, CreateLogRequest, Log } from './logs';
import { getAuthHeadersServer } from './auth-utils-server';
import { endpoints } from './config';

/**
 * Server-side logs API functions with proper JWT authentication
 */

export async function getLogsServer(filters: LogsFilters = {}): Promise<LogsResponse> {
  // The server helper will pull the token from cookies and produce Authorization headers
  
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      // If it's an array (eg. sort), encode as JSON to match how we query the backend
      if (Array.isArray(value)) {
        params.append(key, JSON.stringify(value));
      } else {
        params.append(key, value.toString());
      }
    }
  });
  
  const response = await fetch(`${endpoints.logs.getAll}?${params.toString()}`, {
    method: 'GET',
    headers: await getAuthHeadersServer(),
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch logs: ${response.statusText}`);
  }
  
  return response.json();
}

export async function getLogByIdServer(id: number): Promise<Log> {
  // Reuse server-side auth helper
  
  const response = await fetch(endpoints.logs.getById(id), {
    method: 'GET',
    headers: await getAuthHeadersServer(),
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch log: ${response.statusText}`);
  }
  
  return response.json();
}

export async function createLogServer(logData: CreateLogRequest): Promise<Log> {
  // Reuse server-side auth helper
  
  const response = await fetch(endpoints.logs.create, {
    method: 'POST',
    headers: await getAuthHeadersServer(),
    body: JSON.stringify(logData),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to create log: ${response.statusText}`);
  }
  
  return response.json();
}