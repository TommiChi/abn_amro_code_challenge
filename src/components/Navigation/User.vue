<script lang="ts">
import { defineComponent } from 'vue';
import { useUserStore } from '../../stores/user';

export default defineComponent({
  setup() {
    const store = useUserStore();
    return {
      store
    };
  },
  methods: {
    login() {
      // this.store.fetchLoginState().then((data) => {
      //   console.warn('!!!!!!!\n', false);
      // })
      this.store.setLoginState(true);
      // setTimeout(function() {
      // }, 5000);
    }
  },
})
</script>


<template>
  <section>
    <button v-if="!store.isLoggedIn" @click="login">Login</button>
    <div v-if="store.isLoggedIn">I am Logged In!</div>
  </section>
</template>

<style scoped>
</style>
