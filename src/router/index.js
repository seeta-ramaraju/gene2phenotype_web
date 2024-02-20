import { createRouter, createWebHistory } from "vue-router";
import HomePageView from "../views/HomePageView.vue";
import PublicationsView from "../views/PublicationsView.vue";
import GeneView from "../views/GeneView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePageView,
    },
    {
      path: "/publications",
      name: "publications",
      component: PublicationsView,
    },
    {
      path: "/gene/:symbol",
      name: "gene symbol",
      component: GeneView,
    },
  ],
});

export default router;
