import { http } from './api';

export const corporateService = {
  getProfile: async (tenantId) => {
    return http.get(`/api/corporate/${tenantId}/profile`);
  },

  getBusinessUnits: async (tenantId) => {
    return http.get(`/api/corporate/${tenantId}/units`);
  },

  createBusinessUnit: async (tenantId, unitData) => {
    return http.post(`/api/corporate/${tenantId}/units`, unitData);
  },

  getAssignments: async (tenantId) => {
    return http.get(`/api/corporate/${tenantId}/assignments`);
  },

  assignTraining: async (assignmentData) => {
    return http.post('/api/corporate/assignments', assignmentData);
  },

  updateAssignmentProgress: async (assignmentId, progressData) => {
    return http.patch(`/api/corporate/assignments/${assignmentId}`, progressData);
  },

  getComplianceAudit: async (tenantId) => {
    return http.get(`/api/corporate/${tenantId}/compliance-audit`);
  },

  getEmployees: async (tenantId) => {
    return http.get(`/api/corporate/${tenantId}/employees`);
  }
};

export default corporateService;
