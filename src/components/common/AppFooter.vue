<template>
  <v-footer app padless>
    <v-card flat tile width="100%" class="primary white--text text-center">
      <v-card-text>
        © {{ new Date().getFullYear() }} — {{ $t("app.title") }}
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  name: "AppFooter",
};
</script>
