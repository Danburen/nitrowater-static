<script setup lang="ts">
/**
 * Reuses nitrowater-web's icon assets: local .svg files imported as raw markup,
 * so there is no extra request and `currentColor` follows the theme tokens.
 */
import { computed } from 'vue'

const files = import.meta.glob('../assets/icons/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const byName = new Map(
  Object.entries(files).map(([file, svg]) => [file.split('/').pop()!.replace(/\.svg$/, ''), svg]),
)

const props = withDefaults(defineProps<{ name: string; size?: number }>(), { size: 16 })
const markup = computed(() => byName.get(props.name) ?? '')
const box = computed(() => ({ width: `${props.size}px`, height: `${props.size}px` }))
</script>

<template>
  <span
    class="inline-flex shrink-0 items-center justify-center align-middle [&>svg]:block [&>svg]:h-full [&>svg]:w-full"
    :style="box"
    aria-hidden="true"
    v-html="markup"
  />
</template>
