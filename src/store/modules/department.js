import DepartmentService from "../../services/department.service";

const state = {
  departments: [],
};

const getters = {
  departments: (state) => state.departments,
};

const actions = {
  fetchDepartments({ commit }) {
    return DepartmentService.getAll().then((response) => {
      commit("setDepartments", response.data);
      return response.data;
    });
  },

  createDepartment({ commit }, department) {
    return DepartmentService.create(department).then((response) => {
      commit("addDepartment", response.data);
      return response.data;
    });
  },

  updateDepartment({ commit }, department) {
    return DepartmentService.update(department.id, department).then(
      (response) => {
        commit("updateDepartmentState", response.data);
        return response.data;
      }
    );
  },

  removeDepartment({ commit }, id) {
    return DepartmentService.delete(id).then(() => {
      commit("deleteDepartment", id);
      return id;
    });
  },
};

const mutations = {
  setDepartments(state, departments) {
    state.departments = departments;
  },
  addDepartment(state, department) {
    state.departments.push(department);
  },
  updateDepartmentState(state, department) {
    const index = state.departments.findIndex((d) => d.id === department.id);
    if (index !== -1) {
      state.departments.splice(index, 1, department);
    }
  },
  deleteDepartment(state, id) {
    state.departments = state.departments.filter((d) => d.id !== id);
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
