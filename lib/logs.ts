export interface Log {
  id: number;
  timestamp: string;
  action: string;
  userId: number;
  username: string;
  userEmail: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  resourceType: string;
  resourceId: number;
  status: 'SUCCESS' | 'FAILURE' | 'WARNING';
  errorMessage: string;
  executionTimeMs: number;
}

export interface LogsResponse {
  content: Log[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface LogsFilters {
  action?: string;
  username?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  size?: number;
  // optional sort array - backend expects a JSON array encoded in url (e.g. %5B%22timestamp,desc%22%5D)
  sort?: string[];
}

export interface CreateLogRequest {
  action: string;
  userId: number;
  username: string;
  userEmail: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  resourceType: string;
  resourceId: number;
  status: string;
}