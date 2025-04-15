<template>
  <div class="relative flex flex-1 gap-8 rounded-md bg-black/50 p-4">
    <div class="relative flex size-52 items-center justify-center">
      <OrganizationHubQaWidgetGlobalChart
        :data="data"
        :color="color"
        :highlight="highlight"
      />
      <BaseSvgCircle class="absolute z-10 scale-75" />
      <div class="absolute z-20 text-center">
        <div class="text-2xl font-semibold">{{ moneyFormat(total, 0) }}</div>
        <div class="text-xs">
          {{ $t('course.question.global.qa') }}
        </div>
      </div>
    </div>
    <div class="flex-1">
      <div class="mb-4 border-b border-white/20 pb-1 text-lg">
        {{ $t('course.question.global.qaChart') }}
      </div>
      <OrganizationHubQaWidgetGlobalList :global="global" />
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
  data() {
    return {
      color: ['#E4B53D', '#81D4FA', '#C62828', '#88C359'],
      highlight: null,
    };
  },
  computed: {
    global() {
      return this.hubQaStore.global;
    },
    data() {
      return [
        {
          value: this.global.answered,
          name: 'course.question.status.answered',
        },
        {
          value: this.global.answeredByTeacher,
          name: 'course.question.status.answeredByT',
        },
        {
          value: this.global.notAnswered,
          name: 'course.question.status.notAnswered',
        },
        { value: this.global.solved, name: 'course.question.status.solved' },
      ];
    },
    total() {
      return Object.values(this.global).reduce((a, b) => a + b, 0);
    },
  },
};
</script>
