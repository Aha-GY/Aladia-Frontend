<template>
  <div class="group relative flex items-center gap-2">
    <OrganizationHubShareFilter
      ref="buttonRef"
      :placeholder="$t('base.search.from')"
      :open="open"
      :active="active"
      :value="params.fromName"
      :name="$t('course.select.from')"
      @open="open = true"
      @close="onClose"
    />
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
        <OrganizationHubShareSearch
          v-model="input"
          :placeholder="$t('base.search.label')"
          @search="onSearch"
        />
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
    const hubReviewStore = useHubReviewStore();
    return { hubReviewStore, open, buttonRef };
  },
  data() {
    return {
      input: '',
    };
  },
  computed: {
    params() {
      return this.hubReviewStore.params;
    },
    active() {
      return !!this.params.fromName.length && !this.open;
    },
  },
  watch: {
    async open(state) {
      if (state) {
        this.hubReviewStore.popupId = 'title-from';
      } else {
        this.hubReviewStore.popupId = '';
      }
    },
    'hubReviewStore.popupId'(state) {
      if (state && state !== 'title-from') {
        this.open = false;
      }
    },
    'hubReviewStore.params.pageNumber'() {
      this.open = false;
    },
  },
  methods: {
    onSearch() {
      this.params.fromName = this.input;
      this.open = false;
    },
    onClose() {
      this.params.fromName = '';
      this.open = false;
    },
  },
};
</script>
