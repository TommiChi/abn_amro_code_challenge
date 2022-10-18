import { createRouter, createWebHistory, useRoute } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import { isLoggedIn } from '../services/user';
import { useShowsStore } from '../stores/shows';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/showsguide',
      name: 'showsguide',
      component: () => {
        const store = useShowsStore();
        store.initUserHome();
        return import('../views/ShowsHomeView.vue');
      },
    },
    {
      path: '/shows/:id',
      name: 'showdetails',
      component: () => {
        const store = useShowsStore();
        const episodeId = store.detailsPath.split('/').pop() || '';
        store.selectEpisode(episodeId);
        return import('../views/ShowDetailsView.vue');
      },
      props: true,
    },
  ]
})

router.beforeEach(route => {
  const store = useShowsStore();
  store.setDetailsPath(route.fullPath);

  if (route.fullPath !== '/' && !isLoggedIn()) {
    router.replace('/');
  } else if (route.fullPath === '/' && isLoggedIn()) {
    router.replace('/showsguide');
  }
});

export default router;
