<template>
  <div class="flex flex-col gap-1">
    <div
      v-for="n in length"
      :key="n"
      class="flex items-center gap-2 p-[0.375rem]"
    >
      <div class="skeleton h-12 w-12 shrink-0 rounded-full" />
      <div class="flex w-full flex-col gap-1">
        <div class="skeleton h-3 w-2/3 rounded-5" />
        <div class="skeleton h-3 w-1/4 rounded-5" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    length: {
      type: Number,
      default: 4,
    },
  },
};
</script>
