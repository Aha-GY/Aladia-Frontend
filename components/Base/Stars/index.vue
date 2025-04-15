<template>
  <div class="flex items-center gap-0.5 overflow-hidden">
    <i
      v-for="m in 5"
      :key="m"
      class="fa-solid fa-star"
      :class="value >= m ? `text-[${color}]` : 'text-white/50'"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: [Number, String],
    color: {
      type: String,
      default: '#FDCC1E',
    },
  },
};
</script>
