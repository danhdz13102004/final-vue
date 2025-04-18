<template>
  <div class="admin-dashboard">
    <h1>Welcome to the Admin Dashboard</h1>
    <p>Hello, {{ admin.username }}! Your role is: {{ admin.role }}</p>
  </div>
</template>

<script>
import jwtDecode from "jwt-decode";

export default {
  data() {
    return {
      admin: {},
    };
  },
  created() {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      const decoded = jwtDecode(token);
      if (decoded.role === "admin") {
        this.admin = decoded;
      } else {
        this.$router.push("/login");
      }
    } else {
      this.$router.push("/login");
    }
  },
};
</script>

<style scoped>
.admin-dashboard {
  text-align: center;
  margin-top: 50px;
}
</style>
