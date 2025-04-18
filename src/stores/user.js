import { defineStore } from "pinia";
import { decodeToken } from "@/utils/jwt";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    role: null,
    token: null,
  }),

  actions: {
    setToken(token) {
      this.token = token;
      localStorage.setItem("token", token);
      console.log("Token set:", token);

      const decoded = decodeToken(token);
      if (decoded) {
        this.user = decoded;
        this.role = decoded.role || "guest";
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      this.role = null;
      localStorage.removeItem("token");
    },

    loadFromLocalStorage() {
      const token = localStorage.getItem("token");
      if (token) this.setToken(token);
    },

    persist: true,
  },
});
