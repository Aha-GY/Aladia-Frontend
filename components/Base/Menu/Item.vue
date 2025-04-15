<script setup>
defineProps({
  /**
   * Font Awesome 图标类名
   * @example 'fa-regular fa-trash'
   */
  iconClass: {
    type: String,
    required: false,
  },
});
</script>

<template>
  <li
    class="__base-menu-item flex h-[1.875rem] cursor-pointer select-none items-center gap-2 rounded-[0.3125rem] px-2 text-sm font-medium leading-none opacity-70 hover:bg-white/5 hover:opacity-100 active:scale-95 max-sm:px-1.5 max-sm:text-xs"
  >
    <span v-if="iconClass" class="w-4 shrink-0 text-center text-13">
      <i :class="iconClass" />
    </span>
    <span>
      <slot />
    </span>
  </li>
</template>

<style scoped lang="scss">
.__base-menu-item {
  // 菜单项的间距
  & + & {
    @apply mt-[0.375rem];
  }
}
</style>
