<template>
  <div class="error-page">
    <div class="error-content">
      <h1>401</h1>
      <h2>Unauthorized</h2>
      <p>{{ $t("errors.unauthorized_message") }}</p>
      <router-link to="/dashboard" class="back-home">{{
        $t("errors.back_home")
      }}</router-link>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
useI18n();
</script>

<style scoped>
.error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #edf2f7;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.error-content {
  text-align: center;
}

.error-content h1 {
  font-size: 100px;
  color: #e53e3e;
  margin-bottom: 0;
}

.error-content h2 {
  font-size: 36px;
  margin: 0;
  color: #2d3748;
}

.error-content p {
  margin-top: 10px;
  font-size: 18px;
  color: #4a5568;
}

.back-home {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #3182ce;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.back-home:hover {
  background-color: #2b6cb0;
}
</style>
