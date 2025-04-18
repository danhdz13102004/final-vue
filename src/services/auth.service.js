import axiosInstance from "../axios";

const authService = {
  // Đăng nhập
  login(credentials) {
    return axiosInstance.post("auth/login", credentials);
  },

  // Đăng ký
  register(credentials) {
    return axiosInstance.post("auth/register", credentials);
  },

  // Lấy thông tin người dùng hiện tại (nếu có token)
  getCurrentUser() {
    return axiosInstance.get("auth/me");
  },
};

export default authService;
