<template>
  <div class="group relative flex items-center gap-2">
    {{ $t('course.select.from') }}
    <div
      ref="buttonRef"
      class="flex h-4 w-4 cursor-pointer items-center justify-center rounded transition-all active:scale-90"
      :class="open ? 'bg-white/10' : 'hover:!bg-white/10'"
      data-cy="413d303018993c2e"
      @click="open = !open"
    >
      <i class="fa-solid fa-filter" />
    </div>
    <client-only>
      <el-popover
        :virtual-ref="buttonRef"
        :visible="open"
        placement="bottom-start"
        :width="324"
        :show-arrow="false"
        virtual-triggering
        :persistent="false"
      >
        <BasePopupBottom @close="open = false" />
      </el-popover>
    </client-only>
  </div>
</template>

<script>
export default {
  setup() {
    const open = ref(false);
    const buttonRef = ref(null);
    const hubQaStore = useHubQaStore();
    return { hubQaStore, open, buttonRef };
  },
  data() {
    return {
      value: [0, 100],
    };
  },
  watch: {
    async open(state) {
      if (state) {
        this.hubQaStore.popupId = 'title-from';
      } else {
        this.hubQaStore.popupId = '';
      }
    },
    'hubQaStore.popupId'(state) {
      if (state && state !== 'title-from') {
        this.open = false;
      }
    },
  },
};
</script>
