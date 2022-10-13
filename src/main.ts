import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { initialize } from './services/user';

import App from './App.vue';
import router from './router';

import './assets/main.scss';

/* Wait for Firebase authentication to be initialised before rendering app */
initialize().then(() => {
  const app = createApp(App);

  app.use(createPinia());
  app.use(router);
  
  app.mount('#app');
  
});
