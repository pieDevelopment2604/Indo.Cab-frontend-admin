import { apiClient } from './apiClient';

export const driverApi = {
  getDrivers: (params?: any) => apiClient.get('/admin/drivers', params).catch(() => apiClient.get('/drivers', params)),
  getDriverById: (id: string | number) => apiClient.get(`/admin/drivers/${id}`).catch(() => apiClient.get(`/drivers/${id}`)),
  createDriver: (data: any) => apiClient.post('/admin/drivers', data).catch(() => apiClient.post('/drivers', data)),
  updateDriver: (id: string | number, data: any) => apiClient.put(`/admin/drivers/${id}`, data).catch(() => apiClient.put(`/drivers/${id}`, data)),
  deleteDriver: (id: string | number) => apiClient.delete(`/admin/drivers/${id}`).catch(() => apiClient.delete(`/drivers/${id}`)),
  toggleStatus: (id: string | number, status: string) => apiClient.patch(`/admin/drivers/${id}/status`, { status }).catch(() => apiClient.patch(`/drivers/${id}/status`, { status })),
  approveKyc: (id: string | number, data?: any) => apiClient.post(`/admin/drivers/${id}/approve`, data).catch(() => apiClient.put(`/drivers/${id}`, { kyc_status: 'approved' })),
  rejectKyc: (id: string | number, reason?: string) => apiClient.post(`/admin/drivers/${id}/reject`, { reason }).catch(() => apiClient.put(`/drivers/${id}`, { kyc_status: 'rejected' })),
};

