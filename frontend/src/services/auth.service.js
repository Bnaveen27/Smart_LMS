import { http } from './api';

export const authService = {
  login: async (credentials) => {
    return http.post('/api/auth/login', credentials);
  },

  register: async (userData) => {
    return http.post('/api/auth/register', userData);
  },

  registerInstitute: async (instituteData) => {
    return http.post('/api/public/register/institute', instituteData);
  },

  registerCorporate: async (corporateData) => {
    return http.post('/api/public/register/corporate', corporateData);
  },

  activateAccount: async (token, password) => {
    return http.post('/api/auth/activate', { token, password });
  },

  requestPasswordReset: async (email) => {
    return http.post('/api/auth/forgot-password', { email });
  },

  resetPassword: async (token, newPassword) => {
    return http.post('/api/auth/reset-password', { token, newPassword });
  },

  setupPlatform: async (setupPayload) => {
    return http.post('/api/setup/initialize', setupPayload);
  },

  getCurrentUser: async () => {
    return http.get('/api/auth/me');
  },

  logout: () => {
    localStorage.removeItem('lms_token');
    localStorage.removeItem('token');
    localStorage.removeItem('lms_active_user');
    localStorage.removeItem('lms_tenant_id');
  }
};

export default authService;
