<template>
  <div class="flex items-center gap-1">
    <i
      v-for="(item, index) in activeCount"
      :key="index"
      class="fa-solid fa-star text-xs text-[#FDCC1E]"
    />
    <i
      v-for="(item, index) in unselectCount"
      :key="index"
      class="fa-solid fa-star text-xs"
    />
  </div>
</template>

<script>
export default {
  props: {
    allCount: {
      type: Number,
      default: 5,
    },
    activeCount: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    unselectCount() {
      return this.allCount - this.activeCount;
    },
  },
};
</script>
