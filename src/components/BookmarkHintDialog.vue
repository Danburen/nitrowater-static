<script setup lang="ts">
import { ref, watch } from 'vue'
import SvgIcon from './SvgIcon.vue'
import { links } from '../config/links'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const dialog = ref<HTMLDialogElement | null>(null)

watch(
  () => props.open,
  (open) => {
    const el = dialog.value
    if (!el) return
    if (open && !el.open) el.showModal()
    else if (!open && el.open) el.close()
  },
)

function onBackdrop(event: MouseEvent): void {
  if (event.target === dialog.value) emit('close')
}
</script>

<template>
  <dialog
    ref="dialog"
    class="fixed inset-0 m-auto h-fit max-h-[calc(100vh-32px)] w-[min(420px,calc(100vw-32px))] overflow-y-auto rounded-2xl border border-line bg-card p-0 text-ink shadow-2xl backdrop:bg-black/60"
    aria-labelledby="bookmark-dialog-title"
    @close="emit('close')"
    @click="onBackdrop"
  >
    <div class="p-6">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h2 id="bookmark-dialog-title" class="text-[15px] font-semibold">收藏 NitroWater</h2>
          <p class="mt-1 text-[13px] text-dim">加入浏览器收藏夹，下次开服一键直达。</p>
        </div>
        <button
          type="button"
          aria-label="关闭"
          class="-mr-1 -mt-1 grid size-8 shrink-0 place-items-center rounded-lg text-faint transition hover:bg-soft hover:text-ink"
          @click="emit('close')"
        >
          <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </div>

      <div class="mt-5 rounded-xl border border-line bg-soft p-4">
        <p class="text-[13px] text-dim">按下快捷键，然后在确认框里点「完成」：</p>
        <div class="mt-3 flex flex-wrap items-center gap-1.5">
          <kbd class="rounded-md border border-line bg-card px-2 py-1 font-sans text-xs text-ink">Ctrl</kbd>
          <span class="text-faint">+</span>
          <kbd class="rounded-md border border-line bg-card px-2 py-1 font-sans text-xs text-ink">D</kbd>
          <span class="mx-1 text-faint">/</span>
          <kbd class="rounded-md border border-line bg-card px-2 py-1 font-sans text-xs text-ink">⌘</kbd>
          <span class="text-faint">+</span>
          <kbd class="rounded-md border border-line bg-card px-2 py-1 font-sans text-xs text-ink">D</kbd>
        </div>
        <p class="mt-3 text-xs text-faint">Mac 用 ⌘D；也可以点地址栏右侧的星标。</p>
      </div>

      <a
        :href="links.github"
        target="_blank"
        rel="noopener noreferrer"
        class="mt-5 flex items-center gap-2 rounded-xl border border-line bg-soft px-3.5 py-2.5 text-[13px] text-dim no-underline transition hover:border-line-strong hover:text-ink"
      >
        <SvgIcon name="github" :size="15" />
        顺便看看 nitrowater 项目
        <span class="ml-auto text-faint" aria-hidden="true">↗</span>
      </a>
    </div>
  </dialog>
</template>
