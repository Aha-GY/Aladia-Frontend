<template>
  <div
    class="flex h-7 cursor-pointer items-center gap-2 rounded-md px-1.5 text-xs text-[#D9D9D9]/70 transition-all hover:bg-white/5 active:scale-95"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    {{ text && text.startsWith('$t:') ? $t(text.slice(3)) : text }}
    <div class="flex h-3 w-3 items-center justify-center">
      <i
        class="fa-solid transition-all"
        :class="hover ? 'fa-arrow-right' : 'fa-chevron-right'"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '$t:index.view.more',
    },
  },
  data() {
    return {
      hover: false,
    };
  },
};
</script>
