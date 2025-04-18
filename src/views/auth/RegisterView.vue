<template>
  <div class="form-container">
    <h1 class="title">Register</h1>
    <form @submit.prevent="register">
      <div class="form-group">
        <label>Name:</label>
        <input type="text" v-model="name" required />
      </div>

      <div class="form-group">
        <label>Email:</label>
        <input type="email" v-model="email" required />
      </div>

      <div class="form-group">
        <label>Password:</label>
        <input type="password" v-model="password" required />
      </div>

      <div class="form-group">
        <label>Confirm:</label>
        <input type="password" v-model="confirmPassword" required />
      </div>

      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import authService from "@/services/auth.service";
import router from "@/router";
const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const register = () => {
  if (password.value !== confirmPassword.value) {
    alert("Passwords do not match!");
    return;
  }

  console.log("Register info:", name.value, email.value, password.value);

  const credentials = {
    username: name.value,
    email: email.value,
    password: password.value,
    role: "staff",
  };

  console.log("Registering with credentials:", credentials);

  authService
    .register(credentials)
    .then((response) => {
      console.log("Registration successful:", response);
      alert("Registration successful!");
      router.push("/login");
    })
    .catch((error) => {
      console.error("Registration error:", error);
      // Handle registration error
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
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #27ae60;
}
</style>
