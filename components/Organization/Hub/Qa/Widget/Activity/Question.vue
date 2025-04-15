<template>
  <div class="flex items-center justify-between">
    <div class="relative flex size-40 items-center justify-center">
      <OrganizationHubQaWidgetGlobalChart
        :data="data"
        :color="color"
        :highlight="highlight"
      />
      <div class="absolute z-20 text-center">
        <div class="text-2xl font-semibold">{{ activity.questions }}</div>
        <div class="text-xs">
          {{ $t('filter.question.label') }}
        </div>
      </div>
    </div>
    <div class="flex-1 px-1">
      <div
        class="mb-2 flex cursor-pointer items-center justify-between rounded px-2 py-1 hover:bg-white/10"
      >
        <div class="flex items-center gap-2">
          <div class="size-2 rounded-full bg-[#72a561]" />
          <div>
            {{ $t('course.question.status.solved') }}
          </div>
        </div>
        <div class="text-[#72a561]">{{ activity.solvedQuestions }}</div>
      </div>
      <div
        class="flex cursor-pointer items-center justify-between rounded px-2 py-1 hover:bg-white/10"
      >
        <div class="flex items-center gap-2">
          <div class="size-2 rounded-full bg-[#df485b]" />
          <div>
            {{ $t('filter.answer.unsolved') }}
          </div>
        </div>
        <div class="text-[#df485b]">{{ unsolved }}</div>
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
      color: ['#72a561', '#df485b'],
      highlight: null,
    };
  },
  computed: {
    activity() {
      return this.hubQaStore.activity;
    },
    unsolved() {
      return this.activity.questions - this.activity.solvedQuestions;
    },
    data() {
      return [
        { value: this.activity.solvedQuestions, name: 'filter.answer.solved' },
        { value: this.unsolved, name: 'filter.answer.unsolved' },
      ];
    },
  },
};
</script>
