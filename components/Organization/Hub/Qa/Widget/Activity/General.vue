<template>
  <div class="flex items-center justify-between">
    <div class="relative flex size-40 items-center justify-center">
      <OrganizationHubQaWidgetGlobalChart
        :data="data"
        :color="color"
        :highlight="highlight"
      />
      <div class="absolute z-20 text-center">
        <div class="text-2xl font-semibold">{{ total }}</div>
        <div class="text-xs">
          {{ $t('filter.activity.mine') }}
        </div>
      </div>
    </div>
    <div class="flex-1 px-1">
      <div
        class="mb-2 flex cursor-pointer items-center justify-between rounded px-2 py-1 hover:bg-white/10"
        data-cy="0d1e8ef38160369f"
        @click="hubQaStore.activityType = 'questions'"
      >
        <div class="flex items-center gap-2">
          <div class="size-2 rounded-full bg-[#56afd6]" />
          <div>
            {{ $t('filter.question.label') }}
          </div>
        </div>
        <div class="text-[#56afd6]">{{ activity.questions }}</div>
      </div>
      <div
        class="flex cursor-pointer items-center justify-between rounded px-2 py-1 hover:bg-white/10"
        data-cy="7bd661427bc3834f"
        @click="hubQaStore.activityType = 'answers'"
      >
        <div class="flex items-center gap-2">
          <div class="size-2 rounded-full bg-[#ebd55a]" />
          <div>
            {{ $t('filter.answer.title') }}
          </div>
        </div>
        <div class="text-[#ebd55a]">{{ activity.answers }}</div>
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
      color: ['#56afd6', '#ebd55a'],
      highlight: null,
    };
  },
  computed: {
    activity() {
      return this.hubQaStore.activity;
    },
    data() {
      return [
        { value: this.activity.questions, name: 'filter.question.label' },
        { value: this.activity.answers, name: 'filter.answer.title' },
      ];
    },
    total() {
      return this.activity.questions + this.activity.answers;
    },
  },
};
</script>
