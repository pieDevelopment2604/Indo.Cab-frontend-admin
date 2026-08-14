import { apiClient } from './apiClient';

export const userApi = {
  getUsers: (params?: any) => apiClient.get('/users', params),
  getUserById: (id: string) => apiClient.get(`/users/${id}`),
  createUser: (data: any) => apiClient.post('/users', data),
  updateUser: (id: string, data: any) => apiClient.put(`/users/${id}`, data),
  deleteUser: (id: string) => apiClient.delete(`/users/${id}`),
};
