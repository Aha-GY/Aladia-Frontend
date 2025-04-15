<template>
  <div
    class="group/switcher flex h-3 w-8 cursor-pointer items-center rounded-full border transition-all duration-300"
    :class="active ? 'border-[#b8a43f] bg-[#b8a43f]' : 'border-white/20'"
    data-cy="8e3a86ceb36d8e46"
    @click="$emit('change', !active)"
  >
    <div
      class="h-3 w-3 rounded-full bg-white transition-all duration-300"
      :class="
        active
          ? 'translate-x-[1.2rem] scale-90'
          : 'translate-x-[0.1rem] scale-125'
      "
    >
      <div
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-all group-hover/switcher:opacity-100"
        :class="active ? 'h-8 w-8 bg-[#E4B53D]/30' : 'h-7 w-7 bg-[#BABABA]/20'"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    active: Boolean,
  },
};
</script>
