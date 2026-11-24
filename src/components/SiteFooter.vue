<script setup lang="ts">
import { links } from '../config/links'
</script>

<template>
  <footer class="border-t border-line">
    <div class="mx-auto flex w-full max-w-[1120px] flex-wrap items-center justify-between gap-x-5 gap-y-3 px-[18px] py-6 text-[12.5px] text-faint sm:px-6">
      <span>© 2026 NitroWater All Rights Reserved.</span>
      <a
        v-if="links.beianNo"
        :href="links.beianUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="text-dim no-underline transition hover:text-accent"
      >{{ links.beianNo }}</a>
    </div>
  </footer>
</template>
