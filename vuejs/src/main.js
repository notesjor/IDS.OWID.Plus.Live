import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import store from "./store";
import VueMeta from 'vue-meta'
import i18n from './i18n'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

Vue.config.productionTip = false;
Vue.use(VueMeta);

fetch(process.env.BASE_URL + "config.json")
.then((resp)=>{
  return resp.json();
})
.then((config)=>{
  Vue.prototype.$config = config;
  new Vue({
    vuetify,
    store,
    i18n,
    render: (h) => h(App)
  }).$mount("#app");
});
