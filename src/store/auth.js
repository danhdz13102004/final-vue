import { defineStore } from "pinia";
import { saveToken, getToken, parseToken } from "../utils/auth";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: getToken(),
    userRole: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    login(token, role) {
      this.token = token;
      this.role = role;
      saveToken(token);
      this.userRole = parseToken(token).role;
    },
    logout() {
      this.token = null;
      this.userRole = null;
      saveToken(null);
    },
  },
});
