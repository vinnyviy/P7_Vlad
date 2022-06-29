import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView";
import Login from "../components/Login";
import SignupPage from "../components/SignupPage";

const routes = [
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/signup",
    component: SignupPage,
  },
  {
    path: "/",
    component: HomeView,
  },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});



export default router;
