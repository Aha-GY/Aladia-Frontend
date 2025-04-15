<template>
  <div class="mb-6 grid auto-rows-max grid-cols-9 bg-[#0c0c0c] p-2 pl-0">
    <div
      v-if="subTitle"
      class="col-span-8 col-start-2 mb-2 text-xs text-[#565656]"
    >
      {{ subTitle }}
    </div>

    <div class="flex items-center justify-center text-center">
      <i class="text-base text-[#707070]" :class="iconClass" />
    </div>

    <div class="col-span-8">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  iconClass: {
    type: String,
    required: true,
  },
  subTitle: {
    type: String,
  },
});
</script>
