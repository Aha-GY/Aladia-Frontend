<template>
  <div class="flex justify-between gap-6">
    <div class="flex h-64 flex-1 justify-center rounded bg-[#171717] p-6">
      <img
        src="~/assets/images/analytics-general-2.png"
        class="h-full object-contain"
      />
    </div>
    <div
      class="flex w-56 flex-col items-start justify-between text-13 font-light"
    >
      <div>
        <div class="mb-4">
          {{ $t('org.hub.task.manage.description') }}
        </div>
        <div class="mb-2">
          {{ $t('org.hub.task.manage.label', { count: 6 }) }}
        </div>
        <ul class="list-disc pl-4">
          <li>{{ $t('org.hub.task.manage.widgets') }}</li>
          <li>{{ $t('org.hub.task.manage.maintenance') }}</li>
          <li>{{ $t('org.hub.task.manage.payment') }}</li>
          <li>{{ $t('org.hub.task.manage.qa') }}</li>
          <li>{{ $t('org.hub.task.manage.review') }}</li>
          <li>{{ $t('org.hub.task.manage.event') }}</li>
        </ul>
      </div>
      <div
        class="inline-flex cursor-pointer rounded bg-[#dabb4b] px-2 py-1 text-black hover:bg-[#c8a436]"
        data-cy="0c4ae172c935e34e"
        @click="onCreate"
      >
        {{ $t('org.dashboard.create') }}
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
  methods: {
    onCreate() {
      this.analyticsStore.widgetActive = [
        'users-activity',
        'payment-chart',
        'incoming-events',
        'space-maintenance',
        'qa-report',
        'reviews-report',
      ];
      this.analyticsStore.widgetGeneral = false;
      this.analyticsStore.dashboardType = 'general';
      this.analyticsStore.widgetPersonalized = false;
      this.analyticsStore.widgetPreview = '';
      this.analyticsStore.filter = 0;
    },
  },
};
</script>
