import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import i18n from "./plugins/i18n";
import "./plugins/toast";
import "./assets/styles/tailwind.css";
import pinia from "./stores/index.js";
import { loadFonts } from "./plugins/webfontloader";
import store from "./store";
const app = createApp(App).use(store);

app.use(router);
app.use(pinia);
app.use(vuetify);
app.use(i18n);
app.mount("#app");
loadFonts();
