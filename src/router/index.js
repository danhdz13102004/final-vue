import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/auth/LoginView.vue";
import Register from "@/views/auth/RegisterView.vue";
import Dashboard from "@/views/DashboardView.vue";
import EmployeeList from "@/views/employee/EmployeeList.vue";
import DepartmentList from "@/views/department/DepartmentList.vue";
import AppLayout from "@/views/AppLayout.vue";
import { useUserStore } from "@/stores/user.js";
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
  const userStore = useUserStore();
  userStore.loadFromLocalStorage(); // Load token and role from local storage
  const role = userStore.role;
  console.log("Role:", role);
  const token = userStore.token;
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
      if (role !== "admin") {
        // Logged in but not Admin: redirect to dashboard
        // localStorage.setItem("authError", t("error.unauthorized"));
        return next("/dashboard");
      }
    } catch (error) {
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
