<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import User from './User.vue';
</script>

<template>
  <header class="header">
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/tv-guide">TV Guide</RouterLink>
      <RouterLink to="/my-shows">My Shows</RouterLink>
      <RouterLink to="/categories">Catgegories</RouterLink>
    </nav>

    <User />
  </header>
</template>

<style scoped>
</style>
