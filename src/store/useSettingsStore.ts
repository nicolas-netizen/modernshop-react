import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsStore {
  storeEmail: string;
  setStoreEmail: (email: string) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      storeEmail: '',
      setStoreEmail: (email: string) => set({ storeEmail: email }),
    }),
    {
      name: 'settings-storage',
    }
  )
);
