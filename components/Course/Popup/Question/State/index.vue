<template>
  <div class="flex w-80 flex-col items-center overflow-hidden">
    <div class="relative mb-2 flex size-52 items-center justify-center">
      <OrganizationHubQaWidgetGlobalChart
        :data="data"
        :color="color"
        :highlight="highlight"
      />
      <BaseSvgCircle class="absolute z-10 scale-75" />
      <div class="absolute z-20 text-center">
        <div class="text-2xl font-semibold">{{ moneyFormat(total, 0) }}</div>
        <div class="text-xs">{{ $t('course.question.global.qa') }}</div>
      </div>
    </div>
    <OrganizationHubQaWidgetGlobalList class="px-3" :global="question" />
  </div>
</template>

<script>
export default {
  setup() {
    const courseStore = useCourseStore();
    return { courseStore };
  },
  data() {
    return {
      color: ['#E4B53D', '#81D4FA', '#C62828', '#88C359'],
      highlight: null,
    };
  },
  computed: {
    course() {
      return this.courseStore.course;
    },
    question() {
      return this.course.question;
    },
    data() {
      return [
        {
          value: this.question.answered,
          name: 'course.question.status.answered',
        },
        {
          value: this.question.answeredByTeacher,
          name: 'course.question.status.answeredByT',
        },
        {
          value: this.question.notAnswered,
          name: 'course.question.status.notAnswered',
        },
        {
          value: this.question.solved,
          name: 'course.question.status.solved',
        },
      ];
    },
    total() {
      return Object.values(this.question).reduce((a, b) => a + b, 0);
    },
  },
};
</script>
