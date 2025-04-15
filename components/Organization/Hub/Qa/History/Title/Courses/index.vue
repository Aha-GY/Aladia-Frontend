<template>
  <div class="group relative flex items-center gap-2">
    {{ $t('nav.header.search.menu.courses') }}
    <div
      ref="buttonRef"
      class="flex h-4 w-4 cursor-pointer items-center justify-center rounded transition-all active:scale-90"
      :class="open ? 'bg-white/10' : 'hover:!bg-white/10'"
      data-cy="a8bbe643068642d6"
      @click="open = !open"
    >
      <i class="fa-solid fa-filter" />
    </div>
    <client-only>
      <el-popover
        :virtual-ref="buttonRef"
        :visible="open"
        placement="bottom-start"
        :width="140"
        :show-arrow="false"
        virtual-triggering
        :persistent="false"
      >
        <BasePopupBottom class="!border-0 !p-0" @close="open = false" />
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
      status: '',
    };
  },
  watch: {
    async open(state) {
      if (state) {
        this.hubQaStore.popupId = 'title-courses';
      } else {
        this.hubQaStore.popupId = '';
      }
    },
    'hubQaStore.popupId'(state) {
      if (state && state !== 'title-courses') {
        this.open = false;
      }
    },
  },
  methods: {
    onSearch() {
      this.open = false;
    },
    onClose() {
      this.open = false;
    },
  },
};
</script>
