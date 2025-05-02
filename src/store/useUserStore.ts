import { create } from 'zustand';

interface Balance {
  USDT?: number;
  BTC?: number;
}

interface User {
  id: string;
  username: string;
  balance: Balance;
}

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  updateBalance: (balance: Balance) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateBalance: (balance) =>
    set((state) => ({
      user: state.user ? { ...state.user, balance } : null,
    })),
}));