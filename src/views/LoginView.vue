<template>
  <div class="login-view">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="username">Username:</label>
        <input id="username" v-model="username" type="text" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input id="password" v-model="password" type="password" required />
      </div>
      <button type="submit">Login</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import jwtDecode from "jwt-decode";

export default {
  data() {
    return {
      username: "",
      password: "",
      error: null,
    };
  },
  methods: {
    handleLogin() {
      const users = {
        admin: { password: "admin123", role: "admin" },
        user: { password: "user123", role: "user" },
      };

      if (
        users[this.username] &&
        users[this.username].password === this.password
      ) {
        const token = this.generateToken(
          this.username,
          users[this.username].role
        );
        localStorage.setItem("jwt_token", token);
        const decoded = jwtDecode(token);
        this.$router.push(
          decoded.role === "admin" ? "/admin-dashboard" : "/user-dashboard"
        );
      } else {
        this.error = "Invalid username or password.";
      }
    },
    generateToken(username, role) {
      // Simulate a JWT token (in a real app, this would come from the server)
      const payload = {
        username,
        role,
        exp: Math.floor(Date.now() / 1000) + 3600,
      };
      return btoa(JSON.stringify(payload));
    },
  },
};
</script>

<style scoped>
.login-view {
  max-width: 400px;
  margin: 50px auto;
  text-align: center;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
