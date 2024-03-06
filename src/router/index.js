import { createRouter, createWebHistory } from "vue-router";
import HomePageView from "../views/HomePageView.vue";
import PublicationsView from "../views/PublicationsView.vue";
import AboutProjectView from "../views/AboutProjectView.vue";
import AboutTerminologyView from "../views/AboutTerminologyView.vue";
import AboutVariantFilteringView from "../views/AboutVariantFilteringView.vue"

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
      path: "/about/project",
      name: "aboutproject",
      component: AboutProjectView,
    },
    {
      path: "/about/terminology",
      name: "aboutterminology",
      component: AboutTerminologyView,
    },
    {
      path: "/about/variant-filtering",
      name: "aboutvariantfiltering",
      component: AboutVariantFilteringView,
    },
  ],
});

export default router;
