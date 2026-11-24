<script setup lang="ts">
import SvgIcon from '../components/SvgIcon.vue'
import { links } from '../config/links'

interface Entry {
  key: string
  href: string
  title: string
  sub: string
  icon: string
}

/** Every entry leaves the portal: the two static sites are deployed on their own origins. */
const entries: Entry[] = [
  {
    key: 'docs',
    href: links.docs,
    title: '插件文档',
    sub: 'VeloChatX · 说明 / 配置 / 指令',
    icon: 'M4 5.5h11l5 5v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-12a1 1 0 0 1 1-1zM15 5.5v5h5M8 13h8M8 16h5',
  },
  {
    key: 'tools',
    href: links.tools,
    title: '离线工具箱',
    sub: '浏览器本地 · 无需登录',
    icon: 'M4 7.5h16M5 7.5l.9 11a2 2 0 0 0 2 1.9h8.2a2 2 0 0 0 2-1.9l.9-11M9.5 7.5V5.5a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v2',
  },
]

const CONTRIBUTE_URL = `${links.github}/issues`
</script>

<template>
  <section class="mx-auto flex w-full max-w-[1120px] flex-col px-[18px] py-14 text-center sm:px-6">
    <div class="my-auto">
      <h1 class="relative my-8 inline-block text-[clamp(34px,6vw,58px)] font-bold leading-[1.2] tracking-[-0.04em]">
        <span class="hero-glow pointer-events-none absolute left-1/2 top-1/2 h-[140%] w-[82%] -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
        <span class="hero-gradient">Minecraft 腐竹的<br>一站式开服工具</span>
      </h1>

      <p class="mx-auto max-w-[640px] text-[15px] leading-[1.8] text-dim sm:text-base">
        查阅 VeloChatX 插件说明、配置与指令，或在浏览器本地完成压缩、转换等常用操作。
      </p>

      <div class="mx-auto mt-10 grid w-full max-w-[720px] grid-cols-1 gap-3 text-left sm:grid-cols-2">
        <a
          v-for="entry in entries"
          :key="entry.key"
          :href="entry.href"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-3 rounded-[14px] border border-line bg-card p-3.5 text-inherit no-underline transition hover:-translate-y-0.5 hover:border-line-strong"
        >
          <span class="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] border border-accent/25 bg-accent/10 text-accent" aria-hidden="true">
            <svg class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path :d="entry.icon" />
            </svg>
          </span>
          <span class="block min-w-0">
            <span class="block text-[13.5px] font-medium text-ink">{{ entry.title }}</span>
            <span class="block truncate text-xs text-faint">{{ entry.sub }}</span>
          </span>
        </a>
      </div>

      <div class="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[12.5px] text-faint">
        <a
          :href="links.github"
          target="_blank"
          rel="noopener noreferrer"
          title="在 GitHub 上查看本项目"
          class="inline-flex items-center gap-1.5 no-underline transition hover:text-ink"
        >
          <SvgIcon name="github" :size="15" />
          GitHub 源码
        </a>
        <a
          :href="CONTRIBUTE_URL"
          target="_blank"
          rel="noopener noreferrer"
          title="提交 issue 或改进建议"
          class="inline-flex items-center gap-1.5 no-underline transition hover:text-ink"
        >
          <SvgIcon name="git-pull-request" :size="15" />
          参与贡献
        </a>
      </div>
    </div>
  </section>
</template>
