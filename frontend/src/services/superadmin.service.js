import { http } from './api';

export const superadminService = {
  getPlatformStats: async () => {
    return http.get('/api/superadmin/stats');
  },

  getAllTenants: async () => {
    return http.get('/api/superadmin/tenants');
  },

  createTenant: async (tenantData) => {
    return http.post('/api/superadmin/tenants', tenantData);
  },

  deleteTenant: async (tenantId) => {
    return http.delete(`/api/superadmin/tenants/${tenantId}`);
  },

  getAllUsers: async () => {
    return http.get('/api/superadmin/users');
  },

  getSubscriptions: async () => {
    return http.get('/api/superadmin/subscriptions');
  },

  getSystemHealth: async () => {
    return http.get('/api/superadmin/health');
  }
};

export default superadminService;
