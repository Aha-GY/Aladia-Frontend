<template>
  <div
    class="absolute bottom-1 right-0.5 flex size-4 cursor-pointer items-center justify-center rounded-full bg-black ring-1 ring-[#bea134]"
  >
    <div
      class="flex size-[12px] items-center justify-center rounded-full"
      :class="checked ? 'bg-[#bea134]' : ''"
    >
      <i
        v-if="checked"
        class="fa-solid fa-check -translate-x-[0.5px] scale-75 text-xs text-black"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    checked: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
