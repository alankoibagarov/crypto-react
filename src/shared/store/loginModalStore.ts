import { create } from 'zustand';

interface LoginModalState {
  isModalOpen: boolean;
  setModalOpen: (isOpen: boolean) => void;
}

export const useLoginModalStore = create<LoginModalState>((set) => ({
  isModalOpen: false,
  setModalOpen: (isModalOpen) => set({ isModalOpen }),
}));
