<template>
  <div>
    <div
      class="flex size-10 cursor-pointer items-center justify-center rounded bg-[#ddb754] text-black"
      data-cy="59b570c2ae05953f"
      @click="onPersonalizedClick"
    >
      <i class="fa-solid fa-pen-to-square translate-x-[1px]" />
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
      this.analyticsStore.widgetSelected = [
        ...this.analyticsStore.widgetActive,
      ];
    },
  },
};
</script>
