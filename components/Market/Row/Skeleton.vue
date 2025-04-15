<template>
  <div class="relative mb-12 px-6">
    <div v-if="!disabledTitle" class="mb-4 flex h-10 items-center gap-4 pl-2">
      <div class="skeleton size-8 overflow-hidden rounded" />
      <div class="skeleton h-6 w-48 overflow-hidden rounded" />
    </div>
    <div class="flex overflow-hidden">
      <MarketSkeletonCourse v-for="item in 10" :key="item" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    disabledTitle: Boolean,
  },
};
</script>
