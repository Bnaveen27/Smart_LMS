import { http } from './api';

export const enrollmentService = {
  getEnrollments: async (tenantId) => {
    return http.get(`/api/enrollments?tenant_id=${tenantId || ''}`);
  },

  enrollStudent: async (enrollmentData) => {
    return http.post('/api/enrollments/manual', enrollmentData);
  },

  processCheckout: async (checkoutPayload) => {
    return http.post('/api/checkout/process', checkoutPayload);
  },

  getTransactions: async (tenantId) => {
    return http.get(`/api/payments/transactions?tenant_id=${tenantId || ''}`);
  },

  getInvoice: async (transactionId) => {
    return http.get(`/api/payments/invoices/${transactionId}`);
  }
};

export default enrollmentService;
