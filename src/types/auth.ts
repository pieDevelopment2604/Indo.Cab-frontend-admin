export interface User {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "ops_admin" | "SUPERADMIN" | "SUPER_ADMIN" | string;
}

export interface AuthResponse {
  user?: User;
  token: string;
  refresh_token: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}
