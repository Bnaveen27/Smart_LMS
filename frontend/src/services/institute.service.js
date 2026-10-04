import { http } from './api';

export const instituteService = {
  getProfile: async (tenantId) => {
    return http.get(`/api/institute/${tenantId}/profile`);
  },

  updateBranding: async (tenantId, brandingData) => {
    return http.put(`/api/institute/${tenantId}/branding`, brandingData);
  },

  getDepartments: async (tenantId) => {
    return http.get(`/api/institute/${tenantId}/departments`);
  },

  createDepartment: async (tenantId, deptData) => {
    return http.post(`/api/institute/${tenantId}/departments`, deptData);
  },

  deleteDepartment: async (tenantId, deptId) => {
    return http.delete(`/api/institute/${tenantId}/departments/${deptId}`);
  },

  getFacultyMembers: async (tenantId) => {
    return http.get(`/api/institute/${tenantId}/faculty`);
  },

  inviteFaculty: async (tenantId, facultyData) => {
    return http.post(`/api/institute/${tenantId}/faculty/invite`, facultyData);
  },

  getAcademicAnalytics: async (tenantId) => {
    return http.get(`/api/institute/${tenantId}/analytics`);
  }
};

export default instituteService;
