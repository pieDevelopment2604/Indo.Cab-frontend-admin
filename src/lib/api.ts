import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { store } from '@/store'
import { setAuth, clearAuth } from '@/store/authSlice'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: string | PromiseLike<string>) => void
  reject: (reason?: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token!)
    }
  })
  failedQueue = []
}

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = store.getState().auth.token
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (!error.response || error.response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`
          }
          return api(originalRequest)
        })
        .catch((err) => Promise.reject(err))
    }

    originalRequest._retry = true
    isRefreshing = true

    const refreshToken = store.getState().auth.refreshToken

    if (!refreshToken) {
      store.dispatch(clearAuth())
      return Promise.reject(error)
    }

    try {
      const response = await axios.post<{ token: string; refreshToken: string }>(
        `${API_BASE_URL}/auth/refresh`,
        { refreshToken }
      )

      const { token: newAccessToken, refreshToken: newRefreshToken } = response.data

      store.dispatch(
        setAuth({
          user: store.getState().auth.user!,
          token: newAccessToken,
          refreshToken: newRefreshToken,
        })
      )

      processQueue(null, newAccessToken)
      isRefreshing = false

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
      }
      return api(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)
      isRefreshing = false
      store.dispatch(clearAuth())
      return Promise.reject(refreshError)
    }
  }
)

export const apiClient = {
  get: <T>(url: string, params?: any) => api.get<T>(url, { params }).then((res) => res.data),
  post: <T>(url: string, data?: any) => api.post<T>(url, data).then((res) => res.data),
  put: <T>(url: string, data?: any) => api.put<T>(url, data).then((res) => res.data),
  patch: <T>(url: string, data?: any) => api.patch<T>(url, data).then((res) => res.data),
  delete: <T>(url: string) => api.delete<T>(url).then((res) => res.data),
}
