import EmployeeService from "../../services/employee.service";

const state = {
  employees: [],
};

const getters = {
  employees: (state) => state.employees,
};

const actions = {
  fetchEmployees({ commit }) {
    return EmployeeService.getAll().then((response) => {
      commit("setEmployees", response.data);
      return response.data;
    });
  },

  createEmployee({ commit }, employee) {
    return EmployeeService.create(employee).then((response) => {
      commit("addEmployee", response.data);
      return response.data;
    });
  },

  updateEmployee({ commit }, employee) {
    return EmployeeService.update(employee.id, employee).then((response) => {
      commit("updateEmployeeState", response.data);
      return response.data;
    });
  },

  removeEmployee({ commit }, id) {
    return EmployeeService.delete(id).then(() => {
      commit("deleteEmployee", id);
      return id;
    });
  },
};

const mutations = {
  setEmployees(state, employees) {
    state.employees = employees;
  },
  addEmployee(state, employee) {
    state.employees.push(employee);
  },
  updateEmployeeState(state, employee) {
    const index = state.employees.findIndex((e) => e.id === employee.id);
    if (index !== -1) {
      state.employees.splice(index, 1, employee);
    }
  },
  deleteEmployee(state, id) {
    state.employees = state.employees.filter((e) => e.id !== id);
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
