import { create } from 'zustand';
type UiState = { drawerOpen: boolean; setDrawerOpen: (open: boolean) => void };
export const useUiStore = create<UiState>((set) => ({ drawerOpen: false, setDrawerOpen: (drawerOpen) => set({ drawerOpen }) }));
