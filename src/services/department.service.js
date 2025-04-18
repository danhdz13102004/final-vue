import axiosInstance from "../axios";

const departmentService = {
  // Lấy danh sách phòng ban
  getDepartments() {
    return axiosInstance.get("departments");
  },

  // Thêm phòng ban mới
  addDepartment(departmentData) {
    return axiosInstance.post("departments", departmentData);
  },

  // Cập nhật phòng ban
  updateDepartment(id, departmentData) {
    return axiosInstance.put(`departments/${id}`, departmentData);
  },

  // Xóa phòng ban
  deleteDepartment(id) {
    return axiosInstance.delete(`departments/${id}`);
  },
};

export default departmentService;
