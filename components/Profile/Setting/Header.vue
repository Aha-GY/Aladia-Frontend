<template>
  <div class="flex items-center gap-1.5">
    <div class="flex h-7 w-7 items-center justify-center">
      <i class="fa-light fa-gear text-lg text-[#D9D9D9]/80" />
    </div>
    <div class="w-0 flex-1 text-xl font-semibold text-[#D9D9D9]/80">
      {{ $t('calendar.settings') }}
    </div>
    <div
      class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-[#707070] transition-all hover:bg-white/5 hover:text-[#D9D9D9] active:scale-95"
      data-cy="c9dc7f3f1482ecde"
      @click="onClose"
    >
      <i class="fa-light fa-xmark text-xl" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    store: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    onClose() {
      this.store.isEdit = false;
    },
  },
};
</script>
