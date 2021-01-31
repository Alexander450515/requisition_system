import Vue from "vue";
import VueRouter from "vue-router";
import RequisitionSystem from "../views/RequisitionSystem.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "RequisitionSystem",
    component: RequisitionSystem,
  },
  {
    path: "/report",
    name: "Report",
    component: () => import("../views/Report.vue"),
  },
  {
    path: "/info",
    name: "Info",
    component: () => import("../views/Info.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
