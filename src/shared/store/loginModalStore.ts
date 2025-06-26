import { create } from 'zustand';

interface LoginModalState {
  isModalOpen: boolean;
  redirectLocation: string;
  setModalOpen: (isOpen: boolean, redirectLocation?: string) => void;
}

export const useLoginModalStore = create<LoginModalState>((set) => ({
  isModalOpen: false,
  redirectLocation: '',
  setModalOpen: (isModalOpen, redirectLocation = '') =>
    set({ isModalOpen, redirectLocation }),
}));
