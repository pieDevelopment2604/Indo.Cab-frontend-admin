import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// added
import type { User } from "@/types/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  refresh_token: string | null;
}

const loadInitialState = (): AuthState => {
  try {
    const serialized = localStorage.getItem("indocab-auth-storage");
    if (serialized) {
      const parsed = JSON.parse(serialized);
      // Standardize reading both raw state object and legacy Zustand structure
      if (parsed.state) {
        return {
          user: parsed.state.user || null,
          token: parsed.state.token || null,
          refresh_token: parsed.state.refresh_token || null,
        };
      }
      return {
        user: parsed.user || null,
        token: parsed.token || null,
        refresh_token: parsed.refresh_token || null,
      };
    }
  } catch (e) {
    console.error("Failed to load auth state from localStorage", e);
  }
  return { token: null, refresh_token: null };
};

const initialState: AuthState = loadInitialState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{
        user?: User;
        token: string;
        refresh_token: string;
      }>,
    ) => {
      if (action.payload.user !== undefined) {
        state.user = action.payload.user;
      }
      state.token = action.payload.token;
      state.refresh_token = action.payload.refresh_token;
      localStorage.setItem("indocab-auth-storage", JSON.stringify(state));
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.refresh_token = null;
      localStorage.removeItem("indocab-auth-storage");
      localStorage.removeItem("_grecaptcha");
    },
    updateToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      localStorage.setItem("indocab-auth-storage", JSON.stringify(state));
    },
  },
});

export const { setAuth, clearAuth, updateToken } = authSlice.actions;
export default authSlice.reducer;
