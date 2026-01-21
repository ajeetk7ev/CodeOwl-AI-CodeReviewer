import { create } from "zustand";
import api from "@/services/api";
import type { User } from "@/types/api";

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  initialized: false,

  fetchUser: async () => {
    try {
      const res = await api.get<User>("/auth/me");
      console.log(res);
      set({ user: res.data, loading: false, initialized: true });
    } catch {
      set({ user: null, loading: false, initialized: true });
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      set({ user: null });
      // Optional: Redirect
      window.location.href = "/login";
    }
  },
}));
