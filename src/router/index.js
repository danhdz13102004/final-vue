import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/LoginView.vue";
import AdminDashboard from "../views/AdminDashboard.vue";
import UserDashboard from "../views/UserDashboard.vue";
import { useAuthStore } from "../store/auth";

const routes = [
  {
    path: "/",
    name: "login",
    component: Login,
  },
  {
    path: "/admin-dashboard",
    name: "admin-dashboard",
    component: AdminDashboard,
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/user-dashboard",
    name: "user-dashboard",
    component: UserDashboard,
    meta: { requiresAuth: true, role: "user" },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: "login" });
  } else if (to.meta.role && authStore.userRole !== to.meta.role) {
    next({ name: "home" });
  } else {
    next();
  }
});

export default router;
