<template>
  <div
    class="group/switcher relative flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-all duration-300"
    :class="active ? 'bg-[#E4B53D]' : 'bg-[#565656]'"
    data-cy="520e9a30555b9fb2"
    @click="$emit('change', !active)"
  >
    <div
      class="relative h-5 w-5 rounded-full bg-white shadow-[0_4px_4px_rgba(0,0,0,0.1)] transition-all duration-300"
      :class="active ? 'translate-x-6' : 'translate-x-0.5'"
    >
      <div
        class="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-all group-hover/switcher:opacity-100"
        :class="active ? 'bg-[#E4B53D]/30' : 'bg-[#BABABA]/20'"
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
