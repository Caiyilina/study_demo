import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: {
      name: "antvX6",
    },
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/antvX6",
    name: "antvX6",
    component: () =>
      import(/* webpackChunkName: "AntvX6" */ "@/views/AntvX6/index.vue"),
  },
  {
    path: "/OrgTree",
    name: "OrgTree",
    component: () =>
      import(/* webpackChunkName: "AntvX6" */ "@/views/orgTree/index.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
