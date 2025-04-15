<template>
  <div class="relative flex h-6 items-center justify-center">
    <div
      class="absolute left-0 top-0 flex h-6 cursor-pointer items-center gap-2 p-0.5 text-[#D9D9D9]/50 hover:text-[#D9D9D9]"
      data-cy="367fb4866230e859"
      @click="onBack"
    >
      <i class="fa-light fa-chevron-left text-xs" />
      <div class="text-sm">
        {{ $t('calendar.settings') }}
      </div>
    </div>
    <div class="text-sm font-medium text-[#D9D9D9]/80">{{ title }}</div>
  </div>
</template>

<script>
export default {
  props: {
    store: {
      type: Object,
      default: () => ({}),
    },
    title: {
      type: String,
      default: '',
    },
  },
  methods: {
    onBack() {
      this.store.settingTitle = '';
    },
  },
};
</script>
