import AuthService from "../../services/auth.service";

const state = {
  status: "",
  token: localStorage.getItem("token") || "",
  user: JSON.parse(localStorage.getItem("user")) || null,
};

const getters = {
  isLoggedIn: (state) => !!state.token,
  authStatus: (state) => state.status,
  currentUser: (state) => state.user,
  userRole: (state) => (state.user ? state.user.role : ""),
};

const actions = {
  loginUser({ commit }, user) {
    return new Promise((resolve, reject) => {
      commit("auth_request");
      AuthService.login(user)
        .then((response) => {
          const { token, user } = response.data;
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          commit("auth_success", { token, user });
          resolve(response);
        })
        .catch((err) => {
          commit("auth_error");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          reject(err);
        });
    });
  },

  logoutUser({ commit }) {
    return new Promise((resolve) => {
      commit("logout");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      resolve();
    });
  },
};

const mutations = {
  auth_request(state) {
    state.status = "loading";
  },
  auth_success(state, { token, user }) {
    state.status = "success";
    state.token = token;
    state.user = user;
  },
  auth_error(state) {
    state.status = "error";
    state.token = "";
    state.user = null;
  },
  logout(state) {
    state.status = "";
    state.token = "";
    state.user = null;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
