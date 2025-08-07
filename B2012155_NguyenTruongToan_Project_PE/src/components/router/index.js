import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import SearchView from "@/views/SearchView.vue";
import BooksView from "@/views/BooksView.vue";
import StatisticView from "@/views/StatisticView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import LoginView from "@/views/LoginView.vue";
import ReaderView from "@/views/ReaderView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/search",
      name: "search",
      component: SearchView,
    },
    {
      path: "/books",
      name: "books",
      component: BooksView,
    },
    {
      path: "/readers",
      name: "readers",
      component: ReaderView,
    },
    {
      path: "/statistic",
      name: "statistic",
      component: StatisticView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "notfound",
      component: NotFoundView,
    },
  ],
});

export default router;
