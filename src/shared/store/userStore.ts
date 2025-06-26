import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface User {
  email: string;
  password: string;
  avatarUrl?: string;
}

interface UserState {
  user: null | User;
  setUser: (user: null | User) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user: user }),
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const encoded = localStorage.getItem(name);
          if (!encoded) return null;
          try {
            const decoded = atob(encoded);
            return JSON.parse(decoded);
          } catch (e) {
            console.error('Failed to decode state:', e);
            return null;
          }
        },
        setItem: (name, value) => {
          const json = JSON.stringify(value);
          const encoded = btoa(json);
          localStorage.setItem(name, encoded);
        },
        removeItem: (name) => localStorage.removeItem(name),
      })),
    }
  )
);
