<template>
  <div
    class="absolute bottom-1 left-0 right-0 z-20 flex w-full flex-col items-center justify-center text-sm"
  >
    <div
      class="next-icon flex cursor-pointer flex-col items-center justify-center transition-all hover:underline active:scale-90"
      data-cy="2818afddf05c96b6"
      @click="$emit('open')"
    >
      <div>{{ $t('index.view.more') }}</div>
      <BaseNextWhite class="rotate-90" />
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    return { hubCourse };
  },
};
</script>
