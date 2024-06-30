import { createRouter, createWebHistory } from 'vue-router';
// Views
import Home from '../views/Home.vue';
import Mint from '../views/Mint.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/mint',
    name: 'mint',
    component: Mint
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;