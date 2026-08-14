import { apiClient } from './apiClient';

export const roleApi = {
  getRoles: (params?: any) => apiClient.get('/roles', params),
  getRoleById: (id: string) => apiClient.get(`/roles/${id}`),
  createRole: (data: any) => apiClient.post('/roles', data),
  updateRole: (id: string, data: any) => apiClient.put(`/roles/${id}`, data),
  deleteRole: (id: string) => apiClient.delete(`/roles/${id}`),
};
