<template>
  <div
    class="pointer-events-none absolute left-0 top-0 h-32 w-full rounded-tl border-l border-t opacity-60"
    :style="{ 'border-color': color }"
  >
    <div
      class="absolute -top-[1px] right-0 h-[1px] w-2/3 bg-gradient-to-r from-transparent to-black"
    />
    <div
      class="absolute -left-[1px] bottom-0 h-2/3 w-[1px] bg-gradient-to-b from-transparent to-black"
    />
  </div>
</template>
<script>
export default {
  props: {
    color: {
      type: String,
      default: '#f1f1f1',
    },
  },
};
</script>
