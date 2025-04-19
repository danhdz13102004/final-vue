<script setup>
import { ref, watch } from "vue";
import authService from "@/services/auth.service";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { useRoute } from "vue-router";

const route = useRoute();
console.log("Route query:", route.query);
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const successMessage = ref(route.query?.successMessage || "");
// console.log("Success message from route:", route.query);

const login = () => {
  errorMessage.value = ""; // Clear previous errors
  successMessage.value = ""; // Clear success when trying to login

  const credentials = {
    email: email.value,
    password: password.value,
  };

  authService
    .login(credentials)
    .then((response) => {
      localStorage.setItem("token", response.data.token);
      const userStore = useUserStore();
      userStore.setToken(response.data.token, response.data.user.role);
      router.push("/dashboard");
    })
    .catch((error) => {
      console.error("Login failed:", error);
      errorMessage.value = "Login failed! Please check your email or password.";
    });
};

const goToRegister = () => {
  router.push("/register");
};

watch([email, password], () => {
  errorMessage.value = "";
  successMessage.value = "";
});
</script>

<template>
  <div class="form-container">
    <h1 class="title">Login</h1>
    <form @submit.prevent="login">
      <div class="form-group">
        <label>Email:</label>
        <input type="email" v-model="email" required />
      </div>

      <div class="form-group">
        <label>Password:</label>
        <input type="password" v-model="password" required />
      </div>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

      <button type="submit">Login</button>

      <div class="redirect-register">
        Don't have an account?
        <a @click="goToRegister" class="register-link">Register here</a>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-container {
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.title {
  font-size: 40px;
  text-align: center;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
}

.form-group {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

label {
  width: 120px;
  font-weight: bold;
}

input {
  flex: 1;
  padding: 8px;
  margin-left: 10px;
  border: 1px solid #aaa;
  border-radius: 4px;
}

button {
  margin-top: 20px;
  padding: 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #2980b9;
}

.redirect-register {
  margin-top: 15px;
  text-align: center;
}

.register-link {
  color: #3498db;
  text-decoration: underline;
  cursor: pointer;
}

.register-link:hover {
  color: #2980b9;
}

.error-message {
  color: red;
  margin-top: 10px;
  text-align: center;
}

.success-message {
  color: green;
  margin-top: 10px;
  text-align: center;
}
</style>
