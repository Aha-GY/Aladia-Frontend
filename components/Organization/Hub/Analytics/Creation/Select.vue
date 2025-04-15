<template>
  <Teleport to="body">
    <div
      v-if="analyticsStore.widgetGeneral"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div class="w-[50rem] rounded bg-black p-6">
        <div class="mb-4 flex items-center justify-between">
          <div class="font-bold">
            {{ $t('org.dashboard.preview') }}
          </div>
          <div
            class="flex size-6 cursor-pointer items-center justify-center rounded hover:bg-white/10"
            data-cy="bb7118381b75a12c"
            @click="analyticsStore.widgetGeneral = false"
          >
            <i class="fa-light fa-xmark" />
          </div>
        </div>
        <OrganizationHubAnalyticsCreationGeneral />
      </div>
    </div>
    <div
      v-if="analyticsStore.widgetMonitoring"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div class="w-[50rem] rounded bg-black p-6">
        <div class="mb-4 flex items-center justify-between">
          <div class="font-bold">
            {{ $t('org.dashboard.monitoring.preview') }}
          </div>
          <div
            class="flex size-6 cursor-pointer items-center justify-center rounded hover:bg-white/10"
            data-cy="4d775ab09b853d54"
            @click="analyticsStore.widgetMonitoring = false"
          >
            <i class="fa-light fa-xmark" />
          </div>
        </div>
        <OrganizationHubAnalyticsCreationMonitoring />
      </div>
    </div>
    <div
      v-if="analyticsStore.widgetPersonalized"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div class="w-[50rem] rounded bg-black p-6">
        <div class="mb-4 flex items-center justify-between">
          <div class="font-bold">
            {{ $t('org.dashboard.personalized.composed') }}
          </div>
          <div
            class="flex size-6 cursor-pointer items-center justify-center rounded hover:bg-white/10"
            data-cy="429402bd279feb82"
            @click="analyticsStore.widgetPersonalized = false"
          >
            <i class="fa-light fa-xmark" />
          </div>
        </div>
        <OrganizationHubAnalyticsCreationPersonalized />
      </div>
    </div>
    <div
      v-if="!!analyticsStore.widgetPreview"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div class="w-[50rem] rounded bg-black p-6">
        <OrganizationHubAnalyticsCreationPreview />
      </div>
    </div>
  </Teleport>
</template>

<script>
export default {
  setup() {
    const analyticsStore = useHubAnalyticsStore();
    return { analyticsStore };
  },
};
</script>
