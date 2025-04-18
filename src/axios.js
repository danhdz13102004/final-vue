import axios from "axios";

// Tạo instance axios với cấu hình mặc định
const axiosInstance = axios.create({
  baseURL: "https://nodejs-1-hywy.onrender.com/api/",
  timeout: 5000, // Thời gian timeout
});

// Thêm token vào header nếu có
const token = localStorage.getItem("token");
if (token) {
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default axiosInstance;
