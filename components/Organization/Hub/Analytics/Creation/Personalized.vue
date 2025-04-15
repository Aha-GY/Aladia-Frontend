<template>
  <div class="h-[43rem]">
    <div class="mb-4 flex items-center justify-between text-sm">
      <div
        class="flex flex-1 cursor-pointer items-center justify-center gap-2 border-b py-1 text-center"
        :class="
          type === 1
            ? 'border-[#E4B53D] text-[#E4B53D]'
            : 'border-transparent text-white/50'
        "
        data-cy="e63e21cb0d0eaca8"
        @click="type = 1"
      >
        <i class="fa-light fa-border-top-left" />
        {{ $t('org.dashboard.personalized.widgets') }}
      </div>
      <div
        class="flex flex-1 cursor-pointer items-center justify-center gap-2 border-b py-1 text-center"
        :class="
          type === 2
            ? 'border-[#E4B53D] text-[#E4B53D]'
            : 'border-transparent text-white/50'
        "
        data-cy="e240e4fccfeee9e6"
        @click="type = 2"
      >
        <i class="fa-light fa-plus" />
        {{ $t('org.dashboard.personalized.templates') }}
      </div>
    </div>
    <div v-if="type === 1">
      <div class="mb-6 flex items-center justify-between gap-6">
        <OrganizationHubAnalyticsCreationWidget
          type="users-activity"
          icon="fa-people-group"
        />
        <OrganizationHubAnalyticsCreationWidget
          type="payment-chart"
          icon="fa-money-bill"
        />
        <OrganizationHubAnalyticsCreationWidget
          type="incoming-events"
          icon="fa-calendar"
        />
      </div>
      <div class="mb-6 flex items-center justify-between gap-6">
        <OrganizationHubAnalyticsCreationWidget
          type="space-maintenance"
          icon="fa-box-archive"
        />
        <OrganizationHubAnalyticsCreationWidget
          type="qa-report"
          icon="fa-messages-question"
        />
        <OrganizationHubAnalyticsCreationWidget
          type="reviews-report"
          icon="fa-star-sharp-half-stroke"
        />
      </div>
      <div class="mb-6 flex items-center justify-between gap-6">
        <OrganizationHubAnalyticsCreationWidget
          type="courses-monitoring"
          icon="fa-circle-video"
        />
        <OrganizationHubAnalyticsCreationWidget
          type="monitoring-activity"
          icon="fa-chart-line"
        />
        <OrganizationHubAnalyticsCreationWidget
          type="courses-report"
          icon="fa-chart-pie"
        />
      </div>
      <div v-if="analyticsStore.widgetSelected.length" class="flex justify-end">
        <div
          class="inline-flex cursor-pointer rounded bg-[#dabb4b] px-2 py-1 text-black hover:bg-[#c8a436]"
          data-cy="96bbd6597ac21b75"
          @click="onCreate"
        >
          {{ $t('org.dashboard.create') }}
        </div>
      </div>
    </div>
    <div v-if="type === 2" class="p-3">
      <div
        class="mb-4 flex h-64 cursor-pointer items-center rounded bg-white/10 hover:bg-white/20"
        data-cy="c6fadffa972537db"
        @click="onPreview('General Dashboard')"
      >
        <img
          src="~/assets/images/analytics-general-2.png"
          class="h-48 flex-1 object-contain"
        />
        <div class="w-64">
          <div class="mb-2 font-semibold">
            {{ $t('org.dashboard.general') }}
          </div>
          <div class="text-sm font-light text-white/70">
            {{ $t('org.dashboard.usage') }}
          </div>
        </div>
      </div>
      <div
        class="flex h-64 cursor-pointer items-center rounded bg-white/10 hover:bg-white/20"
        data-cy="6c50d0b871493ec6"
        @click="onPreview('Monitoring Dashboard')"
      >
        <img
          src="~/assets/images/analytics-monitoring-2.png"
          class="h-48 flex-1 object-contain"
        />
        <div class="w-64">
          <div class="mb-2 font-semibold">
            {{ $t('org.dashboard.monitoring.label') }}
          </div>
          <div class="text-sm font-light text-white/70">
            {{ $t('org.dashboard.monitoring.usage') }}
          </div>
        </div>
      </div>
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
      type: 1,
    };
  },
  methods: {
    onCreate() {
      this.analyticsStore.widgetActive = [
        ...this.analyticsStore.widgetSelected,
      ];
      this.analyticsStore.widgetPersonalized = false;
      this.analyticsStore.widgetPreview = '';
      this.analyticsStore.dashboardType = 'personalized';
    },
    onPreview(type) {
      this.analyticsStore.widgetPersonalized = false;
      this.analyticsStore.widgetPreview = type;
    },
  },
};
</script>
