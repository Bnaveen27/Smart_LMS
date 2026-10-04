import { http } from './api';

export const roleService = {
  getAllRoles: async () => {
    return http.get('/api/roles');
  },

  getAllPermissions: async () => {
    return http.get('/api/roles/permissions');
  },

  updateRolePermissions: async (roleCode, permissions) => {
    return http.post('/api/roles/permissions/update', {
      role_code: roleCode,
      permissions
    });
  },

  assignRole: async (userId, roleCode) => {
    return http.post('/api/roles/assign', {
      user_id: userId,
      role_code: roleCode
    });
  },

  getUserRoles: async (userId) => {
    return http.get(`/api/roles/user/${userId}`);
  }
};

export default roleService;
