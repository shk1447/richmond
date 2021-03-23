// SPA route에 대한 관리 코드
import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);
import MainComponent from "../components/MainComponent.vue";
export default new Router({
  routes: [
    {
      path: "/",
      name: "viewer",
      component: MainComponent,
    }
  ],
});
