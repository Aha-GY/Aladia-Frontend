<template>
  <div class="group relative flex items-center gap-2">
    Rate

    <div
      ref="buttonRef"
      class="flex h-4 w-4 cursor-pointer items-center justify-center rounded transition-all active:scale-90"
      :class="open ? 'bg-white/10' : 'hover:!bg-white/10'"
      data-cy="7e53ce3286cd0690"
      @click="open = !open"
    >
      <i class="fa-solid fa-filter" />
    </div>
    <client-only>
      <el-popover
        :virtual-ref="buttonRef"
        trigger="click"
        :visible="open"
        placement="bottom-start"
        :width="176"
        :show-arrow="false"
        virtual-triggering
        :persistent="false"
      >
        <div class="mb-1 flex flex-col gap-1">
          <div
            v-for="item in 5"
            :key="item"
            class="flex cursor-pointer items-center justify-between rounded-md p-1.5 transition-all hover:bg-white/5 active:scale-95"
            data-cy="e881795ab87aa030"
            @click="onChange(6 - item)"
          >
            <BaseStars :value="6 - item" />
            <BaseCheckboxStyle
              :state="rates.includes(6 - item) ? 'checked' : 'unchecked'"
            />
          </div>
        </div>
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
    const hubReviewStore = useHubReviewStore();
    return { hubReviewStore, open, buttonRef };
  },
  computed: {
    params() {
      return this.hubReviewStore.params;
    },
    rates() {
      return this.params.rates;
    },
  },
  watch: {
    async open(state) {
      if (state) {
        this.hubReviewStore.popupId = 'title-rate';
      } else {
        this.hubReviewStore.popupId = '';
      }
    },
    'hubReviewStore.popupId'(state) {
      if (state && state !== 'title-rate') {
        this.open = false;
      }
    },
    'hubReviewStore.params.pageNumber'() {
      this.open = false;
    },
  },
  methods: {
    onChange(value) {
      if (this.rates.includes(value)) {
        this.params.rates = this.rates.filter((rate) => rate !== value);
      } else {
        this.params.rates = [...this.rates, value];
      }
    },
  },
};
</script>
