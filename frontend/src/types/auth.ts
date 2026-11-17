export type UserRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
// add: RegisterPayload type
