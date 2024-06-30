import { createRouter, createWebHistory } from 'vue-router';
// Views
import Mint from '../views/Mint.vue';

const routes = [
  {
    path: '/',
    name: 'mint',
    component: Mint
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;