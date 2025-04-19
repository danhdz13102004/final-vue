import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/auth/LoginView.vue";
import Register from "@/views/auth/RegisterView.vue";
import Dashboard from "@/views/DashboardView.vue";
import EmployeeList from "@/views/employee/EmployeeList.vue";
import DepartmentList from "@/views/department/DepartmentList.vue";
import AppLayout from "@/views/AppLayout.vue";
import UnauthorizeView from "@/views/auth/UnauthorizeView.vue";
import { useUserStore } from "@/stores/user.js";
import HelloWorld from "@/components/HelloWorld.vue";
// import { meta } from "@babel/eslint-parser";
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
    meta: {
      requireLogin: true,
    },
  },
  {
    path: "/unauthorized",
    component: UnauthorizeView,
  },
  {
    path: "/test",
    component: HelloWorld,
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
  // const token = userStore.token;
  const isLoggedIn = !!role;
  console.log("isLoggedIn:", isLoggedIn);
  console.log("Required Login:", to.meta.requireLogin);

  if (to.meta.requireLogin && !isLoggedIn) {
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
        return next("/unauthorized");
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
