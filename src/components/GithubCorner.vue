<script setup lang="ts">
import SvgIcon from './SvgIcon.vue'
import { links } from '../config/links'
</script>

<template>
  <!-- Standalone corner-badge SVG loaded via SvgIcon's ?raw glob (no extra request). -->
  <a
    :href="links.staticRepo"
    target="_blank"
    rel="noopener noreferrer"
    class="github-corner absolute right-0 top-0 block"
    aria-label="在 GitHub 查看 nitrowater-static"
    title="View nitrowater-static on GitHub"
  >
    <SvgIcon name="github-corner" :size="80" />
  </a>
</template>
