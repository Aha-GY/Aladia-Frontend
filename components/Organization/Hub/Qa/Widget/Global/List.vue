<template>
  <div class="flex w-full flex-col gap-2 text-base">
    <div
      class="flex cursor-pointer items-center justify-between rounded px-2 py-1 text-[#22B2DA] hover:bg-white/10"
    >
      <div class="flex items-center gap-2">
        <BaseCheckbox :active="false" />
        {{ $t('course.question.status.answeredByT') }}
      </div>
      <div>{{ global.answeredByTeacher }}</div>
    </div>
    <div
      class="flex cursor-pointer items-center justify-between rounded px-2 py-1 text-[#F0D43A] hover:bg-white/10"
    >
      <div class="flex items-center gap-2">
        <BaseCheckbox :active="false" />
        {{ $t('course.question.status.answered') }}
      </div>
      <div>{{ global.answered }}</div>
    </div>
    <div
      class="flex cursor-pointer items-center justify-between rounded px-2 py-1 text-[#61A758] hover:bg-white/10"
    >
      <div class="flex items-center gap-2">
        <BaseCheckbox :active="false" />
        {{ $t('course.question.status.solved') }}
      </div>
      <div>{{ global.solved }}</div>
    </div>
    <div
      class="flex cursor-pointer items-center justify-between rounded px-2 py-1 text-[#F23557] hover:bg-white/10"
    >
      <div class="flex items-center gap-2">
        <BaseCheckbox :active="false" />
        {{ $t('course.question.status.notAnswered') }}
      </div>
      <div>{{ global.notAnswered }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    global: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    const hubQaStore = useHubQaStore();
    return { hubQaStore };
  },
};
</script>
