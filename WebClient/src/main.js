import '@mdi/font/css/materialdesignicons.css'
import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import store from "./store";
import VueMeta from 'vue-meta'
import i18n from './i18n'

Vue.config.productionTip = false;
Vue.config.performance = false;
var VueCookie = require('vue-cookie');
Vue.use(VueCookie);
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
