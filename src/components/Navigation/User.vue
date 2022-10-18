<script setup lang="ts">
  import { useUserStore } from '../../stores/user';
  import { useRouter } from 'vue-router';
</script>

<script lang="ts">
  export default {
    data() {
      const store = useUserStore();
      const router = useRouter();
      return {
        store,
        router,
      };
    },
    methods: {
      login() {
        this.store.login().then(() => {
          this.router.push('/showsguide');
        });
      },
      logout() {
        this.store.logout();
        this.router.push('/')
      },
    },
    beforeMount() {
      this.store.initialize();
    },
  }
</script>

<template>
  <section>
    <button class="button" v-if="!store.isLoggedIn" @click="login">Login</button>
    <button class="button" v-if="store.isLoggedIn" @click="logout">Logout</button>
  </section>
</template>

<style lang="scss" scoped>
</style>
