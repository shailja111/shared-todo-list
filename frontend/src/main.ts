import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./style.css";
import { useAuthStore } from "./stores/auth";

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);

useAuthStore().initialize();
app.mount("#app");