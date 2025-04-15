<template>
  <div
    class="flex w-full cursor-pointer items-center justify-between gap-0 overflow-hidden rounded-md p-2.5 transition-all"
  >
    <div class="flex w-full gap-2">
      <div class="skeleton h-14 w-14 shrink-0 rounded-full" />

      <div class="flex h-full w-full flex-col gap-2 py-3">
        <div class="flex w-full items-center justify-between">
          <div class="skeleton h-3 rounded-5" :class="[width]" />
          <div class="skeleton h-3 w-5 rounded-5" />
        </div>
        <div class="skeleton h-3 w-1/4 rounded-5" />
      </div>
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
