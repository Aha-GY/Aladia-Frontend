<template>
  <div class="w-full">
    <ProfileAluminiGridItem
      v-for="(item, index) in data"
      :key="index"
      :item="item"
    />

    <template v-if="loading">
      <div
        v-for="n in 2"
        :key="n"
        class="skeleton mb-4 flex h-[17.125rem] w-full flex-col overflow-hidden rounded-[0.625rem] bg-[#1e1e1e]"
      />
    </template>
  </div>
</template>
<script setup>
defineProps({
  data: {
    type: Array,
    required: true,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
</script>
