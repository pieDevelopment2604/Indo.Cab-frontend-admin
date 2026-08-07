import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface User {
  id: string
  name: string
  email: string
  role: 'super_admin' | 'ops_admin'
}

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
}

const loadInitialState = (): AuthState => {
  try {
    const serialized = localStorage.getItem('indocab-auth-storage')
    if (serialized) {
      const parsed = JSON.parse(serialized)
      // Standardize reading both raw state object and legacy Zustand structure
      if (parsed.state) {
        return {
          user: parsed.state.user || null,
          token: parsed.state.token || null,
          refreshToken: parsed.state.refreshToken || null,
        }
      }
      return {
        user: parsed.user || null,
        token: parsed.token || null,
        refreshToken: parsed.refreshToken || null,
      }
    }
  } catch (e) {
    console.error('Failed to load auth state from localStorage', e)
  }
  return { user: null, token: null, refreshToken: null }
}

const initialState: AuthState = loadInitialState()

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ user: User; token: string; refreshToken: string }>
    ) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.refreshToken = action.payload.refreshToken
      localStorage.setItem('indocab-auth-storage', JSON.stringify(state))
    },
    clearAuth: (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
      localStorage.removeItem('indocab-auth-storage')
    },
    updateToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      localStorage.setItem('indocab-auth-storage', JSON.stringify(state))
    },
  },
})

export const { setAuth, clearAuth, updateToken } = authSlice.actions
export default authSlice.reducer
