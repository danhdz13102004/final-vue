import { defineStore } from "pinia";

// Hàm giả lập decode JWT (bạn có thể thay bằng thư viện như jwt-decode)
function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch (error) {
    console.error("Invalid token format", error);
    return null;
  }
}

export const useUserStore = defineStore("user", {
  state: () => ({
    role: null,
    token: null,
  }),

  actions: {
    setToken(token, role) {
      console.log("Setting token:", token);
      console.log("Setting role:", role);
      this.token = token;
      this.role = role;
      localStorage.setItem("token", token);
      if (role) {
        const roleToken = btoa(JSON.stringify({ role }));
        localStorage.setItem("role_token", roleToken);
      }
    },

    logout() {
      this.token = null;
      this.role = null;
      localStorage.removeItem("token");
      localStorage.removeItem("role_token");
    },

    loadFromLocalStorage() {
      const token = localStorage.getItem("token");
      const roleToken = localStorage.getItem("role_token");

      if (token) {
        this.token = token;
      }

      if (roleToken) {
        try {
          const decoded = decodeToken(token);
          this.role = decoded.role;
        } catch (error) {
          console.error("Failed to decode role token", error);
        }
      }
    },
  },
});
