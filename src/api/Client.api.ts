import { apiClient } from './apiClient';

export const clientApi = {
  getClients: (params?: any) => apiClient.get('/admin/clients', params),
  getClientById: (id: string | number) => apiClient.get(`/admin/clients/${id}`),
  createClient: (data: any) => apiClient.post('/admin/clients', data),
  updateClient: (id: string | number, data: any) => apiClient.put(`/admin/clients/${id}`, data),
  deleteClient: (id: string | number) => apiClient.delete(`/admin/clients/${id}`),
  toggleStatus: (id: string | number, status: string) => apiClient.patch(`/admin/clients/${id}/status`, { status }),
};
