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
      name: "recipes",
      component: () => import("./views/destinationList.vue"),
    },
    {
      path: "/travel/:id",
      name: "editRecipe",
      props: true,
      component: () => import("./views/Editdestination.vue"),
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
