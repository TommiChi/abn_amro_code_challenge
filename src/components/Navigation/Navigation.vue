<script setup lang="ts">
  import { RouterLink } from 'vue-router';
  import User from './User.vue';
  import { useUserStore } from '../../stores/user';
</script>

<script lang="ts">
  export default {
    data() {
      const store = useUserStore();
      return {
        store
      };
    },
    computed: {
      hasLoggedIn () {
        return this.store.isLoggedIn ? '' : ' root-home';
      }
    }
  }
</script>

<template>
  <header :class="`header${hasLoggedIn}`">
    <span class="greeting" v-if="store.isLoggedIn">
      Welcome back, {{ store.name }}!
    </span>

    <User class="user-controls" />
  </header>
</template>

<style lang="scss" scoped>
  .header {
    position: fixed;
    height: 50px;
    width: 100vw;
    box-shadow: 0 -5px 10px 1px;
    top: 0;
    left: 0;
    z-index: 10000;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(243, 192, 0, 0.1);

    &.root-home {
      box-shadow: none;
    }
  }

  .user-controls {
    flex-grow: 1;
  }

  .greeting {
    color: #009286;
    flex-grow: 1;
    text-align: center;
    transform: translate(50%);
    font-size: 20px;
    // color: #f3c000;
  }
</style>
