<template>
  <div
    class="flex items-center justify-between gap-6 px-12 pt-24 text-center *:cursor-pointer *:rounded *:bg-[#232323] *:p-10 *:shadow-xl"
  >
    <div
      class="flex flex-1 flex-col items-center hover:bg-[#343434]"
      data-cy="5b873f104ea1bcbf"
      @click="analyticsStore.widgetGeneral = true"
    >
      <img
        src="~/assets/images/analytics-general-1.png"
        class="mb-4 aspect-video rounded object-cover"
      />
      <div class="mb-2 font-semibold">
        {{ $t('org.dashboard.general') }}
      </div>
      <div class="w-60 text-sm font-light text-white/70">
        {{ $t('org.dashboard.usage') }}
      </div>
    </div>
    <div
      class="flex flex-1 flex-col items-center hover:bg-[#343434]"
      data-cy="8f767410557a80cf"
      @click="analyticsStore.widgetMonitoring = true"
    >
      <img
        src="~/assets/images/analytics-monitoring-1.png"
        class="mb-4 aspect-video rounded object-cover"
      />
      <div class="mb-2 font-semibold">
        {{ $t('org.dashboard.monitoring.label') }}
      </div>
      <div class="w-60 text-sm font-light text-white/70">
        {{ $t('org.dashboard.monitoring.usage') }}
      </div>
    </div>
    <div
      class="flex flex-1 flex-col items-center hover:bg-[#343434]"
      data-cy="eb306d043fadcaad"
      @click="onPersonalizedClick"
    >
      <div
        class="mb-4 flex aspect-video w-full items-center justify-center rounded bg-white/10"
      >
        <i class="fa-light fa-circle-plus scale-[2.5] text-2xl text-white/50" />
      </div>
      <div class="mb-2 font-semibold">
        {{ $t('org.dashboard.personalized.label') }}
      </div>
      <div class="w-60 text-sm font-light text-white/70">
        {{ $t('org.dashboard.personalized.usage') }}
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
    onPersonalizedClick() {
      this.analyticsStore.widgetPersonalized = true;
      this.analyticsStore.widgetPreview = '';
    },
  },
};
</script>
