<template>
  <div class="flex items-center text-13 text-white/50">
    <div
      v-if="isDetail"
      class="w-6 cursor-pointer text-center text-white"
      data-cy="0895f83aab04fec3"
      @click="onBack"
    >
      <i class="fa-light fa-chevron-left" />
    </div>
    <div
      class="vue-draggable-handle w-0 cursor-move overflow-hidden transition-all group-hover/widget:mr-2 group-hover/widget:w-2"
    >
      <i class="fa-regular fa-grip-dots-vertical text-xs" />
    </div>
    {{ $t(name) }}
  </div>
</template>

<script>
export default {
  props: {
    name: String,
  },
  setup() {
    const analyticsStore = useHubAnalyticsStore();
    return { analyticsStore };
  },
  computed: {
    isDetail() {
      return this.analyticsStore.coursesReportDetail;
    },
  },
  methods: {
    onBack() {
      this.analyticsStore.coursesReportDetail = null;
    },
  },
};
</script>
