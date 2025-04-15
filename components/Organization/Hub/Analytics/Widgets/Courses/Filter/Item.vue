<template>
  <div
    class="mb-4 rounded bg-white/10 p-4"
    :class="isHover ? 'group/course' : ''"
  >
    <div class="mb-4 flex items-center justify-between">
      <div
        class="flex-1 text-center text-sm transition-all group-hover/course:scale-105 group-hover/course:underline"
      >
        {{ $t('org.title') }}
      </div>
    </div>
    <OrganizationHubAnalyticsWidgetsCoursesPoster
      @mouseenter="isHover = true"
      @mouseleave="isHover = false"
    />
    <div class="flex flex-col gap-4">
      <OrganizationHubAnalyticsWidgetsCoursesMenber
        v-for="n in filter"
        :key="n"
      />
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const analyticsStore = useHubAnalyticsStore();
    return { analyticsStore };
  },
  data() {
    return {
      isHover: false,
    };
  },
  computed: {
    filter() {
      return this.analyticsStore.filter;
    },
  },
};
</script>
