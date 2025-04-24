import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import OrderView from "@/views/OrderView.vue";
import ProductView from "@/views/ProductView.vue";

const routes: Array<RouteRecordRaw> = [

   {
       path: "/",
       redirect: '/orders'
    },
    {
        path: "/orders",
        name: "orders",
        component: OrderView,
    },
    {
        path: "/products",
        name: "products",
        component: ProductView,
    }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
