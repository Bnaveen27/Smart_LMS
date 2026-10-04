
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');
export const API_BASE_URL = API_URL;
export const APP_BASE_URL = (import.meta.env.VITE_APP_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')).replace(/\/+$/, '');

export default {
  API_URL,
  API_BASE_URL,
  APP_BASE_URL
};
