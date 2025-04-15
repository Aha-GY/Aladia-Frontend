<template>
  <div
    class="group/switcher relative flex h-4 w-8 shrink-0 items-center rounded-full transition-all duration-300"
    :class="[
      active ? 'bg-[#E4B53D]' : 'bg-[#565656]',
      disabled ? 'cursor-not-allowed opacity-30' : 'cursor-pointer',
    ]"
    :data-cy="`${dataCy}-switch`"
    @click="!disabled && $emit('change', !active)"
  >
    <div
      class="relative h-3 w-3 rounded-full bg-white shadow-[0_4px_4px_rgba(0,0,0,0.1)] transition-all duration-300"
      :class="active ? 'translate-x-5' : 'translate-x-0.5'"
    >
      <div
        class="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-all group-hover/switcher:opacity-100"
        :class="active ? 'bg-[#E4B53D]/30' : 'bg-[#BABABA]/20'"
      />
    </div>
    <div
      v-if="icon"
      class="absolute top-0.5 flex h-3 w-3 items-center justify-center"
      :class="active ? 'left-0.5' : 'left-4'"
    >
      <i
        class="fa-light text-9"
        :class="[icon, active ? 'text-black' : 'text-[#D9D9D9]']"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: '',
    },
    dataCy: {
      type: String,
      default: 'default',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
