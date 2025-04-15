<template>
  <div class="relative w-1/4 rounded-md bg-black/50 p-4">
    <div class="mb-8 flex items-center justify-between">
      <div>
        {{ $t('filter.answer.rate') }}
      </div>
    </div>
    <div>
      <div class="mb-4 text-2xl font-semibold">{{ solving.solved }}</div>
      <OrganizationHubQaWidgetSolvingChart class="mb-4" />
      <div class="flex items-center gap-1 text-[#88C359]">
        <i class="fa-solid fa-caret-up" />
        {{ solving.increase }}%
      </div>
    </div>
    <div class="bg-gradient-top absolute bottom-0 h-[1px] w-full opacity-50" />
  </div>
</template>

<script>
export default {
  setup() {
    const hubQaStore = useHubQaStore();
    return { hubQaStore };
  },
  computed: {
    solving() {
      return this.hubQaStore.solving;
    },
  },
};
</script>
