<template>
  <Header />
  <div class="layout">
    <SidebarView />
    <div class="main-content">
      <main class="main">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import SidebarView from "@/components/common/SidebarView.vue";
import Header from "@/components/common/AppHeader.vue";
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.main {
  padding: 1.5rem; /* tương đương p-6 */
  overflow: auto;
  flex: 1;
}
</style>
