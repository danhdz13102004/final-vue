<template>
  <aside class="sidebar">
    <nav class="nav">
      <router-link to="/dashboard" class="nav-link" active-class="active">
        🏠 {{ $t("nav.dashboard") }}
      </router-link>
      <router-link to="/departments" class="nav-link" active-class="active">
        🏢 {{ $t("nav.departments") }}
      </router-link>
      <router-link to="/employees" class="nav-link" active-class="active">
        👨‍💼 {{ $t("nav.employees") }}
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
import { useI18n } from "vue-i18n";

// Initialize i18n to access translations
useI18n();
</script>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  background-color: #2d3748; /* bg-gray-800 */
  color: white;
}

.nav {
  padding: 1rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: #facc15; /* text-yellow-400 */
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  color: #facc15; /* text-yellow-400 */
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: bold;
}
</style>
