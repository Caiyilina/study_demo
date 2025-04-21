import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { Graph } from "@antv/x6";
import Vue2OrgTree from "vue2-org-tree";
import "vue2-org-tree/dist/style.css";

Vue.use(Vue2OrgTree);
Vue.config.productionTip = false;
// init window hook
window.__x6_instances__ = [];

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
