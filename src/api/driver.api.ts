import { apiClient } from './apiClient';

export const driverApi = {
  getDrivers: (params?: any) => apiClient.get('/drivers', params),
  getDriverById: (id: string) => apiClient.get(`/drivers/${id}`),
  createDriver: (data: any) => apiClient.post('/drivers', data),
  updateDriver: (id: string, data: any) => apiClient.put(`/drivers/${id}`, data),
  deleteDriver: (id: string) => apiClient.delete(`/drivers/${id}`),
};
