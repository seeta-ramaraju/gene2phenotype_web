import { createRouter, createWebHistory } from "vue-router";
import HomePageView from "../views/HomePageView.vue";
import PublicationsView from "../views/PublicationsView.vue";
import AboutProjectView from "../views/AboutProjectView.vue";
import GeneView from "../views/GeneView.vue";
import PanelView from "../views/PanelView.vue";
import LocusGeneDiseaseView from "../views/LocusGeneDiseaseView.vue";
import SearchPageView from "../views/SearchPageView.vue";
import DiseaseView from "../views/DiseaseView.vue";
import ListCurationView from "../views/ListCurationView.vue";
import AddLocusGeneDiseaseView from "../views/AddLocusGeneDiseaseView.vue";

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
      path: "/gene/:symbol",
      name: "gene",
      component: GeneView,
    },
    {
      path: "/panel/:panel",
      name: "panel",
      component: PanelView,
    },
    {
      path: "/lgd/:stableId",
      name: "locus gene disease",
      component: LocusGeneDiseaseView,
    },
    {
      path: "/search",
      name: "search",
      component: SearchPageView,
    },
    {
      path: "/disease/:id", // to access the capture value in the component
      name: "diseaseid",
      component: DiseaseView,
    },
    {
      path: "/curation/entries",
      name: "curation-entries",
      component: ListCurationView,
    },
    {
      path: "/lgd/add",
      name: "add locus gene disease",
      component: AddLocusGeneDiseaseView,
    },
  ],
});

export default router;
