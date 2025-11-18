// Client-side helpers only - server cookie utilities live in `auth-utils-server.ts`

/**
 * Get JWT token from document cookies (client-side)
 */
export function getAuthTokenClient(): string | null {
  if (typeof document === 'undefined') {
    return null;
  }
  
  const cookiesArr = document.cookie.split(';');
  for (const cookie of cookiesArr) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'session') {
      return value;
    }
  }
  return null;
}

/**
 * Get Authorization headers with JWT token
 */
export function getAuthHeaders(): Record<string, string> {
  const token = getAuthTokenClient();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}