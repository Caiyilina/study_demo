import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { Graph } from "@antv/x6";

Vue.config.productionTip = false;
// init window hook
window.__x6_instances__ = [];

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
