<template>
  <div class="form-container">
    <h1 class="title">Register</h1>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

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

      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? "Registering..." : "Register" }}
      </button>

      <div class="redirect-login">
        Already have an account?
        <a @click="goToLogin" class="login-link">Login here</a>
      </div>
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
const errorMessage = ref("");
const isSubmitting = ref(false);

const register = async () => {
  // Reset error message
  errorMessage.value = "";

  // Validate passwords match
  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Mật khẩu không khớp!";
    return;
  }

  const credentials = {
    username: name.value,
    email: email.value,
    password: password.value,
    role: "staff",
  };

  console.log("Registering with credentials:", credentials);

  try {
    isSubmitting.value = true;
    const response = await authService.register(credentials);
    console.log("Registration successful:", response);

    router.push({
      path: "/login",
      query: { successMessage: "Đăng kí thành công! Vui lòng đăng nhập." },
    });
  } catch (error) {
    console.error("Registration error:", error);
    errorMessage.value = "Đăng kí thất bại! Vui lòng thử lại.";

    // Check for specific error messages from API if available
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage.value = error.response.data.message;
    }
  } finally {
    isSubmitting.value = false;
  }
};

// Add function to redirect to login page
const goToLogin = () => {
  router.push("/login");
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

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
  text-align: center;
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

button:disabled {
  background-color: #95e9af;
  cursor: not-allowed;
}

.redirect-login {
  margin-top: 15px;
  text-align: center;
}

.login-link {
  color: #3498db;
  text-decoration: underline;
  cursor: pointer;
}

.login-link:hover {
  color: #2980b9;
}
</style>
