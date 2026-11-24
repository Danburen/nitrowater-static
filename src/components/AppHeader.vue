<script setup lang="ts">
import SvgIcon from './SvgIcon.vue'
import { links } from '../config/links'
import { theme, toggleTheme } from '../composables/theme'

// `base: './'` — keep the nitrowater favicon working on a Pages project subpath too.
const logoUrl = `${import.meta.env.BASE_URL}favicon.svg`

/** Single-page portal: home stays local, the other entries leave to their own origins. */
const nav = [
  { href: './', label: '首页', external: false },
  { href: links.docs, label: '插件文档', external: true },
  { href: links.tools, label: '离线工具箱', external: true },
] as const
</script>

<template>
  <header class="sticky top-0 z-20 h-[var(--app-header-h)] border-b border-line bg-bg/88 backdrop-blur-md">
    <div class="mx-auto flex h-full w-full max-w-[1120px] items-center gap-2.5 px-[18px] sm:gap-6 sm:px-6">
      <a href="./" class="flex shrink-0 items-center gap-2.5 whitespace-nowrap text-ink no-underline" aria-label="NitroWater 静态门户首页">
        <img :src="logoUrl" alt="" class="size-[26px] shrink-0">
        <span class="text-[15px] font-semibold tracking-[-0.2px]">NitroWater</span>
        <span class="hidden rounded border border-line px-1.5 py-0.5 text-[10px] tracking-[0.08em] text-faint sm:inline">STATIC</span>
      </a>

      <nav class="ml-auto flex items-center gap-1" aria-label="主导航">
        <a
          v-for="item in nav"
          :key="item.label"
          :href="item.href"
          class="rounded-lg px-2 py-1.5 text-xs text-dim no-underline transition hover:bg-soft hover:text-ink sm:px-3 sm:text-[13px]"
          :target="item.external ? '_blank' : undefined"
          :rel="item.external ? 'noopener noreferrer' : undefined"
        >
          {{ item.label }}
        </a>
      </nav>

      <div class="flex shrink-0 items-center gap-2 border-l border-line pl-3">
        <button
          type="button"
          class="inline-flex size-9 shrink-0 items-center justify-center rounded-[9px] border border-line bg-soft text-ink transition hover:border-line-strong hover:text-accent"
          :title="theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'"
          :aria-label="theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'"
          :aria-pressed="theme === 'dark'"
          @click="toggleTheme"
        >
          <SvgIcon v-if="theme === 'dark'" name="sun" :size="18" />
          <SvgIcon v-else name="moon" :size="18" />
        </button>
      </div>
    </div>
  </header>
</template>
