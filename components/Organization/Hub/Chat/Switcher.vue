<template>
  <div
    class="group/switcher flex h-3 w-6 shrink-0 cursor-pointer items-center rounded-full transition-all duration-300"
    :class="active ? 'bg-[#E4B53D]' : 'bg-[#646464]'"
    data-cy="918bedc85aaea4a7"
    @click="$emit('change', !active)"
  >
    <div
      class="relative h-2 w-2 rounded-full shadow-[0_4px_4px_rgba(0,0,0,0.1)] transition-all duration-300"
      :class="
        active
          ? 'translate-x-[0.9375rem] bg-white'
          : 'translate-x-0.5 bg-black/25'
      "
    />
  </div>
</template>

<script>
export default {
  props: {
    active: Boolean,
  },
};
</script>
