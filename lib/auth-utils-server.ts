"use server";

import { cookies } from 'next/headers';

/**
 * Server-side JWT token getter and helper for headers
 * Import this module only from server components or server functions.
 */
export async function getAuthTokenServer(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  return token ?? null;
}

export async function getAuthHeadersServer(): Promise<Record<string, string>> {
  const token = await getAuthTokenServer();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

