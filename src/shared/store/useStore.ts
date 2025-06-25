import { create } from 'zustand';
import { type CryptoCoin } from '../api/cryptoApi';

interface AppState {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  assetList: CryptoCoin[];
  setAssetList: (assets: CryptoCoin[]) => void;
  fullAssetList: CryptoCoin[];
  setFullAssetList: (assets: CryptoCoin[]) => void;
}

export const useStore = create<AppState>((set) => ({
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
  assetList: [],
  setAssetList: (assets) => set({ assetList: assets }),
  fullAssetList: [],
  setFullAssetList: (assets) => set({ fullAssetList: assets }),
})); 