<template>
  <div class="mb-1 flex items-center gap-1 bg-black">
    <div class="column-handle cursor-move">
      <i class="fa-regular fa-grip-dots-vertical text-xs" />
    </div>
    <div
      class="flex flex-1 items-center justify-between rounded px-1.5 py-1 hover:bg-white/10"
    >
      <div class="text-13 text-white/60">{{ $t(item.name) }}</div>
      <BaseSwitcherBig
        :active="active"
        class="scale-90"
        @change="onActiveChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
  },
  setup() {
    const hubSpaces = useHubSpacesStore();
    return { hubSpaces };
  },
  data() {
    return {
      active: true,
    };
  },
  methods: {
    onActiveChange() {
      this.active = !this.active;
    },
  },
};
</script>
