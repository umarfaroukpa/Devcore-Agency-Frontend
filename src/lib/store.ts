import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'DEVELOPER' | 'CLIENT';
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

interface SetFn {
    (partial: Partial<AuthState> | ((state: AuthState) => Partial<AuthState>)): void;
}

export const useAuthStore = create<AuthState>()(
    persist<AuthState>(
        (set: SetFn) => ({
            user: null,
            token: null,
            setAuth: (user: User, token: string) => {
                localStorage.setItem('token', token);
                set({ user, token });
            },
            logout: () => {
                localStorage.removeItem('token');
                set({ user: null, token: null });
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);