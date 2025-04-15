<template>
  <div class="flex flex-wrap justify-start gap-x-[1.8rem]">
    <MarketCardUser
      v-for="(item, index) in data"
      :key="index"
      class="mb-4 !w-[13.4375rem]"
      :user="item"
    />
    <template v-if="loading">
      <MarketSkeletonUser
        v-for="n in 10"
        :key="n"
        class="mb-4 !w-[13.4375rem]"
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
