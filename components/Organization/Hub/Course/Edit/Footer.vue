<template>
  <div class="flex h-12 items-center justify-between bg-white/5 px-4">
    <div />
    <div class="flex items-center gap-2">
      <div
        class="flex items-center gap-2 rounded px-2 py-1 text-sm font-light text-white/50 transition-all duration-300 hover:bg-[#181818] hover:text-white active:scale-95"
        :class="disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'"
        data-cy="course-save-chapter-icon"
        @click="onSave"
      >
        <i v-if="saving" class="fa-light fa-loader animate-spin text-base" />
        <i v-else class="fa-light fa-save text-sm" />
        {{ $t('base.upload.save') }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    return { hubCourse };
  },
  computed: {
    saving() {
      return this.hubCourse.saving;
    },
    disabled() {
      return this.hubCourse.courseSaveDisabled;
    },
  },
  methods: {
    async onSave() {
      if (this.disabled) {
        return;
      }
      await this.hubCourse.saveCourse();
      this.$emit('save');
    },
  },
};
</script>
