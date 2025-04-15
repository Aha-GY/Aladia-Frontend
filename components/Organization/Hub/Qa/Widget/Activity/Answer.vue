<template>
  <div class="flex items-center justify-between">
    <div class="relative flex size-40 items-center justify-center">
      <OrganizationHubQaWidgetGlobalChart
        :data="data"
        :color="color"
        :highlight="highlight"
      />
      <div class="absolute z-20 text-center">
        <div class="text-2xl font-semibold">{{ activity.answers }}</div>
        <div class="text-xs">
          {{ $t('filter.answer.label') }}
        </div>
      </div>
    </div>
    <div class="flex-1 px-1">
      <div
        class="mb-2 flex cursor-pointer items-center justify-between rounded px-2 py-1 hover:bg-white/10"
      >
        <div class="flex items-center gap-2">
          <div class="size-2 rounded-full bg-[#ab78e9]" />
          <div>
            {{ $t('filter.answer.solved') }}
          </div>
        </div>
        <div class="text-[#ab78e9]">{{ activity.bestAnswers }}</div>
      </div>
      <div
        class="flex cursor-pointer items-center justify-between rounded px-2 py-1 hover:bg-white/10"
      >
        <div class="flex items-center gap-2">
          <div class="size-2 rounded-full bg-[#ebd55a]" />
          <div>
            {{ $t('filter.answer.unsolved') }}
          </div>
        </div>
        <div class="text-[#ebd55a]">{{ unsolved }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hubQaStore = useHubQaStore();
    return { hubQaStore };
  },
  data() {
    return {
      color: ['#ab78e9', '#ebd55a'],
      highlight: null,
    };
  },
  computed: {
    activity() {
      return this.hubQaStore.activity;
    },
    unsolved() {
      return this.activity.answers - this.activity.bestAnswers;
    },
    data() {
      return [
        { value: this.activity.bestAnswers, name: 'filter.answer.solved' },
        { value: this.unsolved, name: 'filter.answer.unsolved' },
      ];
    },
  },
};
</script>
