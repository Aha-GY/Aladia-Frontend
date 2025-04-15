<template>
  <div
    class="pointer-events-none absolute bottom-0 left-5 top-8 flex flex-col gap-5 overflow-hidden transition-all duration-300"
  >
    <div
      v-for="n in length"
      :key="n"
      class="border-b-0.5 border-l-0.5 h-3.5 w-2 rounded-bl border-[#B0B0B0]"
    />
    <div
      class="border-l-0.5 absolute left-0 top-0 w-1 border-[#B0B0B0]"
      :style="{ height: length * 24 + 'px' }"
    />
  </div>
</template>

<script>
export default {
  props: {
    length: Number,
  },
};
</script>
