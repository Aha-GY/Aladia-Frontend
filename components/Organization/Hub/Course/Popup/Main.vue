<template>
  <div class="flex h-full w-full flex-col">
    <OrganizationHubCoursePopupHeader />
    <BaseIconClose
      class="absolute right-3 top-3"
      data-cy="close-course-detail-icon"
      @click="onClose"
    />
    <div
      v-if="lecture"
      class="hide-scrollbar mb-2 h-0 flex-1 overflow-y-auto p-3 pt-0"
    >
      <div class="mb-2" />
      <OrganizationHubEventTitle :disabled="lecture.type !== 'live'">
        <OrganizationHubCoursePopupTitle
          :course="course"
          :chapter="chapter"
          :lecture="lecture"
        />
      </OrganizationHubEventTitle>

      <OrganizationHubCoursePopupDemandSubjectAssign
        :lecture="lecture"
        :chapter="chapter"
      />
      <OrganizationHubEvent
        v-if="lecture.type === 'live'"
        type="lecture"
        :course="course"
        :chapter="chapter"
        :lecture="lecture"
        :event="lecture.event"
      />

      <OrganizationHubCoursePopupDemand
        v-if="lecture.type === 'on-demand'"
        :lecture="lecture"
      />
    </div>
    <OrganizationHubCoursePopupFooter />
  </div>
</template>

<script>
export default {
  setup() {
    const hubEvent = useHubEventStore();
    const hubCourse = useHubCoursesStore();
    const hubCalendarStore = useHubCalendarStore();
    return { hubCalendarStore, hubCourse, hubEvent };
  },
  computed: {
    course() {
      return this.hubCourse.detail;
    },
    chapter() {
      return this.hubCourse.chapterPopup;
    },
    lecture() {
      return this.hubCourse.lecturePopup;
    },
  },
  watch: {
    'hubCourse.open'(state) {
      if (!state) {
        this.onClose();
      }
    },
    'hubCourse.step'() {
      this.onClose();
    },
    'lecture.subjectId'(subjectId) {
      if (subjectId) {
        this.lecture.subjectId = subjectId;
      }
    },
  },
  beforeUnmount() {
    this.onClose();
  },
  methods: {
    onClose() {
      // this.hubEvent.$reset(); // 空间跟可用日历需要缓存
      this.hubCourse.popupOpen = false;
      this.hubCourse.chapterPopup = null;
      this.hubCourse.lecturePopup = null;
      this.hubCalendarStore.createOpen = false;
    },
  },
};
</script>
