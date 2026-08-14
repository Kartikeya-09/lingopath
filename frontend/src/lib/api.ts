export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    let errorDetail = 'Network error';
    try {
      const errorData = await response.json();
      if (errorData.detail) errorDetail = errorData.detail;
    } catch (e) {
      // Ignored
    }
    throw new ApiError(response.status, errorDetail);
  }
  
  return response.json();
}
