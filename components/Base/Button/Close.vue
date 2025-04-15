<!--
Purpose: Universal close button
用途：全局公用的关闭按钮，用于关闭弹窗、页面等（但目前还没有广泛使用）

Props:
- size: 按钮大小 ('sm' | 'md' | 'lg')，默认值 'md'
- label: 按钮文字，默认值 ''  // TODO: 暂未实现
-->

<template>
  <div
    class="__base-button-close group/close cursor-pointer overflow-hidden rounded-full bg-white/10 hover:bg-white/20 active:scale-95"
    :class="`__base-button-close--${size} ${$sizeClass}`"
    @click="close"
  >
    <div
      class="__base-button-close__circle pointer-events-none flex size-full items-center justify-center rounded-full"
    >
      <i
        class="fa-light fa-close transition-all group-hover/close:rotate-180 group-hover/close:scale-125"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  size: {
    type: String,
    default: 'md',
  },
});

const $sizeClass = computed(
  () =>
    ({
      sm: 'size-6 text-[16px]',
      md: 'size-8 text-[16px]',
      lg: 'size-10 text-[20px]',
      xl: 'size-12 text-[24px]',
    })[props.size],
);
</script>
