<template>
  <div ref="scrollToElement" class="relative mb-5 flex items-end gap-3">
    <div class="flex size-4 items-center justify-center pb-2 text-white/50">
      <i class="fa-light fa-align-left" />
    </div>
    <div class="relative flex-1">
      <BaseSelectMultipleSkills
        ref="skillsRef"
        v-model="course.skills"
        required
        :show-validate-error="showError"
        :title="$t('personal.skills')"
        :placeholder="$t('course.payment.select')"
        @click="openSkills"
      />
      <div
        v-if="showError"
        class="absolute -bottom-5 left-0 text-xs text-[#ED3C28]"
      >
        Skills is required
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
    'course.skills'(skills) {
      if (skills.length >= 3) {
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
    openSkills() {
      this.$refs.skillsRef.$refs.searcInputhRef.$refs.input.focus();
    },
    validate() {
      if (this.course.skills.length < 3) {
        this.showError = true;
        if (this.course.title && this.course.languageId) {
          this.scrollToError();
        }
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
