<template>
  <div class="absolute inset-0 rounded-full bg-black">
    <div
      class="flex size-full items-center justify-center rounded-full border border-white/10"
    >
      <i
        class="fa-light fa-chevron-down text-white/80"
        :class="{
          'scale-50 text-sm': size === 'sm',
          'text-xs': size === 'md',
          'text-base': size === 'lg',
          'text-3xl': size === 'xl',
        }"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: 'sm',
  },
});
</script>
