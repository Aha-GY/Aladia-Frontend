<template>
  <div ref="scrollToElement" class="relative mb-5 flex items-end gap-3">
    <div class="flex size-4 items-center justify-center pb-2 text-white/50">
      <i class="fa-light fa-bookmark" />
    </div>
    <div class="relative flex-1">
      <BaseInput
        v-model="course.title"
        :title="$t('index.title')"
        :show-validate-error="showError"
        :max-length="60"
        data-cy="edit-course-title"
        required
        show-limit
      />
      <div
        v-if="showError"
        class="absolute -bottom-4 left-0 text-xs text-[#ED3C28]"
      >
        Title is required
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    const { $eventBus: eventBus } = useNuxtApp();
    return { hubCourse, eventBus };
  },
  data() {
    return {
      showError: false,
    };
  },
  computed: {
    course() {
      return this.hubCourse.detail;
    },
  },
  watch: {
    'course.title'(title) {
      if (title) {
        this.showError = false;
      }
    },
  },
  mounted() {
    this.eventBus.on('SAVE-INFO', this.validate);
  },
  beforeUnmount() {
    this.eventBus.off('SAVE-INFO', this.validate);
  },
  methods: {
    validate() {
      if (!this.course.title) {
        this.showError = true;
        this.scrollToError();
      }
    },
    scrollToError() {
      const element = this.$refs.scrollToElement;
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    },
  },
};
</script>
