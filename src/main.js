import { createApp } from 'vue';
import router from './router';
import store from './store';
import './style.css';
import App from './App.vue';
import {
  EthosConfiguration,
  EthosConnectPlugin
} from "ethos-connect-vue";

// const config: EthosConfiguration = {
//     apiKey: "vue-example-app",
// };

createApp(App)
    .use(router)
    .use(store)
    .use(EthosConnectPlugin)
    .mount('#app')
