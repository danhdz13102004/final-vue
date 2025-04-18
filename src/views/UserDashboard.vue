<template>
  <div class="user-dashboard">
    <h1>Welcome to the User Dashboard</h1>
    <p>Hello, {{ user.username }}! Your role is: {{ user.role }}</p>
  </div>
</template>

<script>
import jwtDecode from "jwt-decode";

export default {
  data() {
    return {
      user: {},
    };
  },
  created() {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      this.user = jwtDecode(token);
    } else {
      this.$router.push("/login");
    }
  },
};
</script>

<style scoped>
.user-dashboard {
  text-align: center;
  margin-top: 50px;
}
</style>
