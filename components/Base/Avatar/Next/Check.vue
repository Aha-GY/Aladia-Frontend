<template>
  <div
    class="absolute inset-0 rounded-full bg-black"
    :class="{
      'p-[0.5px]': size === 'sm',
      'p-[1px]': size === 'md',
      'p-0.5': size === 'lg' || size === 'xl',
      'border border-[#b9a248]': checked,
    }"
  >
    <div
      class="flex size-full items-center justify-center rounded-full border"
      :class="{
        'border-[#b9a248] bg-[#b9a248]': checked,
        'border-white/50': !checked,
      }"
    >
      <i
        v-if="checked"
        class="fa-solid fa-check text-black"
        :class="{
          'scale-[0.3] text-xs': size === 'sm',
          'scale-75 text-xs': size === 'md',
          'scale-90 text-sm': size === 'lg',
          'text-2xl': size === 'xl',
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
  checked: {
    type: Boolean,
    default: false,
  },
});
</script>
