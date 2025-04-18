import axiosInstance from "../axios";

const employeeService = {
  // Lấy danh sách nhân viên
  getEmployees() {
    return axiosInstance.get("employees");
  },

  // Thêm nhân viên mới
  addEmployee(employeeData) {
    return axiosInstance.post("employees", employeeData);
  },

  // Cập nhật thông tin nhân viên
  updateEmployee(id, employeeData) {
    return axiosInstance.put(`employees/${id}`, employeeData);
  },

  // Xóa nhân viên
  deleteEmployee(id) {
    return axiosInstance.delete(`employees/${id}`);
  },
};

export default employeeService;
