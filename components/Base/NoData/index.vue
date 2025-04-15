<template>
  <div class="flex w-full flex-col items-center justify-center">
    <div
      class="flex items-center justify-center rounded-full bg-[#D9D9D90D]"
      :class="iconWrapperClass"
    >
      <i :class="[iconClass, iconSize]" />
    </div>
    <div v-if="description" class="mt-4" :class="textColor">
      {{ $t(description) }}
    </div>
    <slot />
  </div>
</template>
<script setup>
defineProps({
  description: {
    type: String,
    default: 'base.data.noData',
  },
  textColor: {
    type: String,
    default: 'text-[#555555]',
  },
  iconWrapperClass: {
    type: String,
    default: 'h-[6.25rem] w-[6.25rem]',
  },
  iconClass: {
    type: String,
    default: 'fa-light fa-file text-[#D9D9D94D]',
  },
  iconSize: {
    type: String,
    default: 'text-[2.8125rem]',
  },
});
</script>
