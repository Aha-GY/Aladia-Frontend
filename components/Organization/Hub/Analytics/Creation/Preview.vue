<template>
  <div class="w-full">
    <div class="mb-4 flex items-center justify-between">
      <div
        class="flex size-6 cursor-pointer items-center justify-center rounded hover:bg-white/10"
        data-cy="07161cbcf3792319"
        @click="onBack"
      >
        <i class="fa-light fa-chevron-left" />
      </div>
      <div v-if="isDashboard" class="flex-1 text-center text-xl font-bold">
        {{
          $t('org.hub.analytics.preview.multiple', {
            store: $t(analyticsStore.widgetPreview),
          })
        }}
      </div>
      <div v-else class="flex-1 text-center text-xl font-bold">
        {{ $t('org.hub.analytics.preview.single', { name: $t(widgetName) }) }}
      </div>
      <div
        class="flex size-6 cursor-pointer items-center justify-center rounded hover:bg-white/10"
        data-cy="3f47ba31fbca9eb2"
        @click="analyticsStore.widgetPreview = ''"
      >
        <i class="fa-light fa-xmark" />
      </div>
    </div>
    <OrganizationHubAnalyticsCreationGeneral v-if="isGeneral" />
    <OrganizationHubAnalyticsCreationMonitoring v-else-if="isMonitoring" />
    <div v-else class="flex justify-between gap-6">
      <div class="flex h-96 flex-1 justify-center rounded bg-[#171717] p-8">
        <img
          :src="`/widgets/${analyticsStore.widgetPreview}.png`"
          class="object-contain"
        />
      </div>
      <div
        class="flex w-64 flex-col items-start justify-end text-13 font-light"
      >
        <div class="mb-8">
          {{ $t('org.hub.analytics.usage') }}
        </div>
        <div
          class="inline-flex cursor-pointer rounded bg-[#dabb4b] px-2 py-1 text-black hover:bg-[#c8a436]"
          data-cy="31ceca4ec80e8fea"
          @click="onAdd"
        >
          {{ $t('org.hub.task.widget.add') }}
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
  computed: {
    isDashboard() {
      return this.analyticsStore.widgetPreview.includes('Dashboard');
    },
    isGeneral() {
      return this.analyticsStore.widgetPreview.includes('General');
    },
    isMonitoring() {
      return this.analyticsStore.widgetPreview.includes('Monitoring');
    },
    widgetName() {
      return this.analyticsStore.widgets[this.analyticsStore.widgetPreview];
    },
  },
  methods: {
    onBack() {
      this.analyticsStore.widgetPersonalized = true;
      this.analyticsStore.widgetPreview = '';
    },
    onAdd() {
      this.analyticsStore.widgetSelected.push(
        this.analyticsStore.widgetPreview,
      );
      this.onBack();
    },
  },
};
</script>
