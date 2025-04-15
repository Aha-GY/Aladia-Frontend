<template>
  <div
    class="relative flex justify-between gap-4 overflow-hidden transition-all"
    :class="hubQaStore.open ? 'mb-4 h-64' : 'mb-0 h-0 opacity-0'"
  >
    <OrganizationHubQaWidgetGlobal />
    <OrganizationHubQaWidgetActivity />
    <OrganizationHubQaWidgetSolving />
  </div>
</template>

<script>
export default {
  setup() {
    const hubQaStore = useHubQaStore();
    return { hubQaStore };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.hubQaStore.widgetLoading = true;
      await Promise.all([
        this.hubQaStore.getQuestionsOverview(),
        this.hubQaStore.getQuestionsActivity(),
        this.hubQaStore.getQuestionsSolvingRate(),
      ]);
      this.hubQaStore.widgetLoading = false;
    },
  },
};
</script>
