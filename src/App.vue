<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import HomeView from './views/HomeView.vue'
</script>

<template>
  <div class="flex min-h-[100svh] flex-col">
    <AppHeader />
    <main class="flex-1">
      <HomeView />
    </main>
    <SiteFooter />
  </div>
</template>
