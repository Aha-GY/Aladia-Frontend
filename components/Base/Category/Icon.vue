<template>
  <div
    class="group/category relative flex size-10 items-center justify-center transition-all hover:scale-110 active:scale-95"
  >
    <img
      src="~/assets/icons/category-frame.svg"
      class="absolute inset-0 object-cover"
    />
    <img
      v-if="image"
      :src="image"
      class="relative z-10 h-[85%] w-[85%] object-cover"
      :class="{
        'rounded-2xl': size === '2xl',
        'rounded-xl': size === 'xl',
      }"
    />
    <div
      v-if="showClose"
      class="absolute -right-1.5 -top-1.5 z-20 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-red-600 opacity-0 transition-all hover:rotate-180 hover:scale-125 group-hover/category:opacity-100"
    >
      <i class="fa-regular fa-xmark text-xs text-white" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    image: {
      type: String,
      default: '',
    },
    showClose: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: '2xl',
    },
  },
};
</script>
