import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import "./styles/preset.scss";
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import i18n from "./i18n";

fetch(import.meta.env.BASE_URL + "config.json")
  .then((resp) => resp.json())
  .then((config) => {
    const app = createApp(App);
    app.config.globalProperties.$config = config;
    app.use(createPinia());
    app.use(vuetify);
    app.use(i18n);
    app.mount("#app");
  });
