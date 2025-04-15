<template>
  <div class="absolute -bottom-8 left-0 right-0 z-20 flex justify-center">
    <div
      class="group flex h-6 w-6 cursor-pointer items-center justify-center rounded bg-white transition-all active:scale-90"
      data-cy="4cf00d0611477abb"
      @click="onClose"
    >
      <i
        class="fa-regular fa-xmark text-xs text-black transition-all group-hover:scale-150"
      />
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    return { hubCourse };
  },
  methods: {
    async onClose() {
      const $category = this.$el.closest('[data-category-id]');
      this.$emit('close');
      await sleep(200);
      $category.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    },
  },
};
</script>
