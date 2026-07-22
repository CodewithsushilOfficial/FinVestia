const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  statusCode?: number;
}

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const getAuthUser = (): any | null => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
};

export const setAuthUser = (user: any): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

export async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (response.status === 401) {
      removeAuthToken();
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return { error: 'Unauthorized', statusCode: 401 };
    }

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage = typeof data === 'object' && data.message 
        ? Array.isArray(data.message) 
          ? data.message.join(', ') 
          : data.message
        : response.statusText || 'An error occurred';
      return { error: errorMessage, statusCode: response.status };
    }

    return { data, statusCode: response.status };
  } catch (error: any) {
    console.error('API Request error:', error);
    return { error: error.message || 'Network error connection failed' };
  }
}
