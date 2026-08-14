import { apiClient } from './apiClient';

export const vehicleApi = {
  getVehicles: (params?: any) => apiClient.get('/vehicles', params),
  getVehicleById: (id: string) => apiClient.get(`/vehicles/${id}`),
  createVehicle: (data: any) => apiClient.post('/vehicles', data),
  updateVehicle: (id: string, data: any) => apiClient.put(`/vehicles/${id}`, data),
  deleteVehicle: (id: string) => apiClient.delete(`/vehicles/${id}`),
};
