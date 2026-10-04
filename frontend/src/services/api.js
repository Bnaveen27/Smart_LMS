import { API_URL } from '../config/api';

export const apiClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem('lms_token') || localStorage.getItem('token');
  const tenantId = localStorage.getItem('lms_tenant_id') || localStorage.getItem('tenant_id');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(tenantId ? { 'X-Tenant-Id': tenantId } : {}),
    ...options.headers,
  };

  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || `API Error: ${response.status} ${response.statusText}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`[API Client Error] ${endpoint}:`, error);
    throw error;
  }
};

export const http = {
  get: (url, headers = {}) => apiClient(url, { method: 'GET', headers }),
  post: (url, body, headers = {}) => apiClient(url, { method: 'POST', body: JSON.stringify(body), headers }),
  put: (url, body, headers = {}) => apiClient(url, { method: 'PUT', body: JSON.stringify(body), headers }),
  patch: (url, body, headers = {}) => apiClient(url, { method: 'PATCH', body: JSON.stringify(body), headers }),
  delete: (url, headers = {}) => apiClient(url, { method: 'DELETE', headers }),
};

export default http;
