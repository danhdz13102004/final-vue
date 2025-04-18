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

      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import authService from "@/services/auth.service";
import router from "@/router";

const email = ref("");
const password = ref("");

const login = () => {
  console.log("Login info:", email.value, password.value);
  const credentials = {
    email: email.value,
    password: password.value,
  };
  console.log("Logging in with credentials:", credentials);
  // Gửi request API tại đây nếu cần
  authService
    .login(credentials)
    .then((response) => {
      console.log("Login successful:", response);
      // alert("Login successful!");
      // Lưu token vào localStorage
      console.log("Token:", response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      // Chuyển hướng đến trang chính
      router.push("/");
    })
    .catch((error) => {
      console.error("Login failed:", error);
      alert("Login failed! Please check your credentials.");
    });
};
</script>

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
</style>
