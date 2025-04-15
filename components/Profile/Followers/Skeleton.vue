<template>
  <div class="flex flex-col gap-3">
    <template v-if="search">
      <div
        v-for="(item, index) in 6"
        :key="index"
        class="skeleton mb-5 h-12 rounded"
      />
    </template>
    <template v-else>
      <div class="flex justify-between gap-5 p-4">
        <div class="flex items-center gap-5">
          <div class="skeleton h-6 w-6 rounded" />
          <div class="skeleton ml-5 h-6 w-24 rounded" />
        </div>
        <div class="skeleton h-6 w-6 rounded" />
      </div>
      <div class="px-4">
        <div class="skeleton mb-5 h-8" />
        <div
          v-for="(item, index) in 8"
          :key="index"
          class="skeleton mb-5 h-12 rounded"
        />
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    search: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
