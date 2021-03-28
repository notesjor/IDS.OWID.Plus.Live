import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import store from "./store";
import VueMeta from 'vue-meta'

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
   render: (h) => h(App),
 }).$mount("#app");
});
