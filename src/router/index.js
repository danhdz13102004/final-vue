import { createRouter, createWebHistory } from "vue-router";
import jwtDecode from "jwt-decode";
import Login from "@/views/auth/LoginView.vue";
import Register from "@/views/auth/RegisterView.vue";
import Dashboard from "@/views/DashboardView.vue";
import EmployeeList from "@/views/employee/EmployeeList.vue";
import DepartmentList from "@/views/department/DepartmentList.vue";
import AppLayout from "@/views/AppLayout.vue";
const routes = [
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  {
    path: "/",
    component: AppLayout,
    children: [
      { path: "dashboard", component: Dashboard, meta: { requireLogin: true } },
      {
        path: "employees",
        component: EmployeeList,
        meta: { requiresAdmin: true },
      },
      {
        path: "departments",
        component: DepartmentList,
        meta: { requiresAdmin: true },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  ``;
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  if (to.meta.requireLogin && !isLoggedIn) {
    // Not logged in: redirect to login
    // localStorage.setItem("authError", t("error.unauthorized"));
    return next("/login");
  }

  if (to.meta.requiresAdmin) {
    if (!isLoggedIn) {
      // Not logged in: redirect to login
      // localStorage.setItem("authError", t("error.unauthorized"));
      return next("/login");
    }
    try {
      const decoded = jwtDecode(token);
      // const decoded = {
      //   role: "Admin", // Mocked role for demonstration
      // };
      console.log("Decoded JWT:", decoded);
      if (decoded.role !== "Admin") {
        // Logged in but not Admin: redirect to dashboard
        // localStorage.setItem("authError", t("error.unauthorized"));
        return next("/dashboard");
      }
    } catch (error) {
      // Invalid token: redirect to login
      console.error("Invalid JWT token:", error);
      // localStorage.setItem("authError", t("error.unauthorized"));
      return next("/login");
    }
  }

  // Clear any previous auth error if accessing a non-restricted route
  if (!to.meta.requiresAdmin) {
    localStorage.removeItem("authError");
  }

  next(); // Proceed to the route
});

export default router;
