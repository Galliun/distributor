import { createApp } from 'vue';
import VueTelegram from 'vue-tg';
import router from './router';
import store from './store';
import './style.css';
import App from './App.vue';

createApp(App)
.use(VueTelegram)
.use(router)
.use(store)
.mount('#app')
