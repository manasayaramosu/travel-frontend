import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: () => import("./views/Login.vue"),
    },
    {
      path: "/travel",
      name: "itineraries",
      component: () => import("./views/itinerariesList.vue"),
    },
    {
      path: "/travel/:id",
      name: "editRecipe",
      props: true,
      component: () => import("./views/Edititineraries.vue"),
    },
    {
      path: "/destinations",
      name: "destinations",
      component: () => import("./views/destinationList.vue"),
    },
    {
      path: "/destinations/:id",
      name: "editdestinations",
      props: true,
      component: () => import("./views/Edititineraries.vue"),
    },
    {
      path: "/hotels",
      name: "hotels",
      component: () => import("./views/hotelList.vue"),
    },
    {
      path: "/hotels/:id",
      name: "edithotels",
      props: true,
      component: () => import("./views/Edititineraries.vue"),
    },
    {
      path: "/Locations",
      name: "ingredients",
      props: true,
      component: () => import("./views/locationtList.vue"),
    },
  ],
});

export default router;
