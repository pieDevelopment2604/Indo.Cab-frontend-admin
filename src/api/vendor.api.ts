import { apiClient } from './apiClient'

export const vendorApi = {
  getVendors: (params?: any) => apiClient.get('/admin/vendors', params),
  getVendorById: (id: string | number) => apiClient.get(`/admin/vendors/${id}`),
  createVendor: (data: any) => apiClient.post('/admin/vendors', data),
  updateVendor: (id: string | number, data: any) => apiClient.put(`/admin/vendors/${id}`, data),
  deleteVendor: (id: string | number) => apiClient.delete(`/admin/vendors/${id}`),
  toggleStatus: (id: string | number, status: string) => apiClient.patch(`/admin/vendors/${id}/status`, { status }),
}
