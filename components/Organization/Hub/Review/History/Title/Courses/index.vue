<template>
  <div class="group relative flex items-center gap-2">
    <div class="pl-2 pr-4">
      <OrganizationHubReviewHistoryTitleCoursesCheck />
    </div>
    <OrganizationHubShareFilter
      ref="buttonRef"
      :placeholder="$t('base.search.course')"
      :open="open"
      :active="active"
      :value="params.name"
      :name="$t('nav.header.search.menu.courses')"
      @open="open = true"
      @close="onClose"
    />
    <!-- <div
      ref="buttonRef"
      class="w-4 h-4 cursor-pointer rounded flex items-center justify-center transition-all active:scale-90"
      :class="open ? 'bg-white/10' : 'hover:!bg-white/10'"
    >
      <i class="fa-solid fa-filter"></i>
    </div> -->
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
          ref="search"
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
      return !!this.params.name.length && !this.open;
    },
  },
  watch: {
    async open(state) {
      if (state) {
        this.hubReviewStore.popupId = 'title-courses';
      } else {
        this.hubReviewStore.popupId = '';
      }
    },
    'hubReviewStore.popupId'(state) {
      if (state && state !== 'title-courses') {
        this.open = false;
      }
    },
    'hubReviewStore.params.pageNumber'() {
      this.open = false;
    },
  },
  methods: {
    onSearch() {
      this.params.name = this.input;
      this.open = false;
    },
    onClose() {
      this.params.name = '';
      this.open = false;
    },
  },
};
</script>
