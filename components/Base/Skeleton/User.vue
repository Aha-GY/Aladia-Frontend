<template>
  <div
    class="flex w-[18.35rem] cursor-pointer items-center gap-3 overflow-hidden rounded-md p-2.5 transition-all"
  >
    <div class="skeleton h-14 w-14 shrink-0 rounded-full" />
    <div class="flex h-full flex-col justify-between">
      <div class="skeleton h-3 rounded-5" :class="[width]" />
      <div class="skeleton h-3 w-2/4 rounded-5" />
      <div class="skeleton h-3 w-full rounded-5" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: 'w-[12rem]',
    },
  },
};
</script>
