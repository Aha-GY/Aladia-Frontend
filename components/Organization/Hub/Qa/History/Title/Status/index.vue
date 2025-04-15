<template>
  <div class="group relative flex items-center gap-2">
    {{ $t('category.transaction.status') }}
    <div
      ref="buttonRef"
      class="flex h-4 w-4 cursor-pointer items-center justify-center rounded transition-all active:scale-90"
      :class="open ? 'bg-white/10' : 'hover:!bg-white/10'"
      data-cy="71a5e4c55b56a270"
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
        popper-class="table-popover"
        virtual-triggering
        :persistent="false"
      >
        <div
          class="mb-2 flex cursor-pointer items-center gap-1.5 rounded-md p-1.5 transition-all hover:bg-white/5"
        >
          <div class="h-2.5 w-2.5 rounded-sm bg-[#44AD1F]" />
          <div class="text-xs text-[#B0B0B0]">
            {{ $t('category.complete') }}
          </div>
        </div>
        <div
          class="mb-2 flex cursor-pointer items-center gap-1.5 rounded-md p-1.5 transition-all hover:bg-white/5"
        >
          <div class="h-2.5 w-2.5 rounded-sm bg-[#A20F0F]" />
          <div class="text-xs text-[#B0B0B0]">
            {{ $t('category.inComplete') }}
          </div>
        </div>
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
        this.hubQaStore.popupId = 'title-status';
      } else {
        this.hubQaStore.popupId = '';
      }
    },
    'hubQaStore.popupId'(state) {
      if (state && state !== 'title-status') {
        this.open = false;
      }
    },
  },
};
</script>
