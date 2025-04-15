<template>
  <div ref="checkbox" class="relative flex h-4 w-4 items-center justify-center">
    <div
      class="flex h-full w-full cursor-pointer items-center justify-center rounded-full border transition-all duration-300"
      :class="
        active ? 'border-[#f2b54a]' : 'border-[#f2b54a] hover:border-[#f2b54a]'
      "
      data-cy="all-day-event-checkbox"
      @click="onClick"
    >
      <div
        class="h-3 w-3 rounded-full bg-[#f2b54a] transition-all duration-300"
        :class="active ? 'scale-100 opacity-100' : 'scale-0 opacity-0'"
      />
    </div>
    <div
      class="border-1 pointer-events-none absolute inset-0 h-full w-full rounded-full border-[#f2b54a]/20 transition-all duration-300"
      :class="focus ? 'scale-150 opacity-100' : 'scale-0 opacity-0'"
    />
  </div>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const checkbox = ref(null);
    const focus = ref(false);

    onClickOutside(checkbox, () => {
      focus.value = false;
    });

    return { checkbox, focus };
  },
  methods: {
    onClick() {
      this.focus = true;
      this.$emit('change');
    },
  },
};
</script>
