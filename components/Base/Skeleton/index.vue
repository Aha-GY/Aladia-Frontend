<template>
  <div class="flex flex-col gap-1">
    <div
      v-for="n in length"
      :key="n"
      class="skeleton overflow-hidden rounded"
      :style="{ height }"
    />
  </div>
</template>

<script>
export default {
  props: {
    height: {
      type: String,
      default: '1.75rem',
    },
    length: {
      type: Number,
      default: 10,
    },
  },
};
</script>
