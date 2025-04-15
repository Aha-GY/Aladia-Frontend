<template>
  <div
    v-if="active"
    :data-step="step"
    :class="hubCourse.versionViewing ? 'pointer-events-none' : ''"
  >
    <div
      v-if="title"
      class="sticky top-0 z-[90] mb-4 flex h-7 items-center justify-between gap-2 bg-[#060606] py-3 pt-5"
      :class="{ 'pb-6': step === 1 }"
    >
      <div class="flex flex-1 items-center gap-2">
        <i v-if="icon" :class="icon" />
        {{ title }}
      </div>
      <OrganizationHubCourseEditInfoCyclesSelect
        v-if="step === 4 && course.type === 'live'"
      />
      <OrganizationHubCourseEditContentViewMode v-if="step === 4" />
      <OrganizationHubCourseAiButton
        v-if="step === 4"
        data-cy="6d04a5b6da0e5872"
        @click="onAiOpen"
      >
        <i class="fa-solid fa-sparkles" />
        <span v-if="course.type !== 'live'">
          {{ $t('course.ai.create') }}
        </span>
      </OrganizationHubCourseAiButton>
      <OrganizationHubCourseAiButton
        v-if="step === 2"
        @click="assignCategories"
      >
        <i class="fa-solid fa-sparkles" />
        Categorize with AI
      </OrganizationHubCourseAiButton>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    step: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
  },
  setup() {
    const hubCourse = useHubCoursesStore();
    const hubSpaces = useHubSpacesStore();
    const paymentStore = usePaymentStore();
    return { hubCourse, hubSpaces, paymentStore };
  },
  computed: {
    course() {
      return this.hubCourse.detail;
    },
    cycles() {
      return this.course.cycles || [];
    },
    active() {
      return this.hubCourse.step === this.step;
    },
  },
  methods: {
    onAiOpen() {
      this.hubCourse.isPreview = true;
      this.hubCourse.step = 4;
      this.hubCourse.ai.open = true;
      this.hubCourse.ai.backgroundAILoad = false;
      this.hubCourse.calendarView = this.course.type === 'live';
    },
    async assignCategories() {
      if (this.hubCourse.ai.assigning) {
        return;
      }

      const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
      const token = this.hubSpaces.statistics.billings.find(
        (bill) => bill.type === 'tokens',
      );
      const aiFreeTierFinished = token?.freeTierPercentage === 100;
      const hasPaymentMethod = this.paymentStore.paymentMethods.length > 0;

      if (
        (!hasPaymentMethod && aiFreeTierFinished) ||
        isoDateRegex.test(this.course.title)
      ) {
        this.hubCourse.ai.suggestSubCategoriesDialog = true;
        return;
      }

      try {
        this.hubCourse.ai.assigning = true;
        this.hubCourse.courseSaveDisabled = true;
        await this.hubCourse.suggestSubCategories({
          assignCategories: true,
        });
        await this.hubCourse.getCourse({
          courseId: this.course.id,
        });
        this.hubCourse.ai.assigning = false;
        this.hubCourse.courseSaveDisabled = false;
      } catch (error) {
        this.hubCourse.ai.assigning = false;
        this.hubCourse.courseSaveDisabled = false;
      }
    },
  },
};
</script>
