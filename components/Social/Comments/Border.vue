<template>
  <div
    class="pointer-events-none absolute left-0 top-0 z-20 h-20 w-36 rounded-tl border-l border-t"
    :style="{ borderColor: color }"
  >
    <div
      class="absolute -top-[1px] right-0 h-[1px] w-2/3 bg-gradient-to-r from-transparent to-black"
    />
    <div
      class="absolute -left-[1px] bottom-0 h-2/3 w-[1px] bg-gradient-to-b from-transparent to-black"
    />
  </div>
  <div
    class="pointer-events-none absolute right-0 top-0 z-20 h-3/4 w-3/5 rounded-tr border-r border-t"
    :style="{ borderColor: color }"
  >
    <div
      class="absolute -top-[1px] left-0 h-[1px] w-2/3 bg-gradient-to-r from-black to-transparent"
    />
    <div
      class="absolute -right-[1px] bottom-0 h-2/3 w-[1px] bg-gradient-to-b from-transparent to-black"
    />
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
  },
  computed: {
    color() {
      // Solved
      if (this.item.status === 'solved') {
        return 'rgba(34,249,0,0.2)';
      } else {
        return 'rgba(249,0,0,0.2)';
      }
    },
  },
};
</script>
