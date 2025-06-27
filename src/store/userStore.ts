import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import CryptoJS from 'crypto-js';

export interface User {
  email: string;
  avatarUrl?: string;
}

interface UserState {
  user: null | User;
  setUser: (user: null | User) => void;
}

const key = import.meta.env.VITE_ENCRYPTION_KEY;

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
            const decoded = CryptoJS.AES.decrypt(encoded, key);
            const decrypted = decoded.toString(CryptoJS.enc.Utf8);
            return JSON.parse(decrypted);
          } catch (e) {
            console.error('Failed to decode state:', e);
            return null;
          }
        },
        setItem: (name, value) => {
          const json = JSON.stringify(value);
          const encoded = CryptoJS.AES.encrypt(json, key).toString();
          localStorage.setItem(name, encoded);
        },
        removeItem: (name) => localStorage.removeItem(name),
      })),
    }
  )
);
