<template>
  <div
    class="hide-scrollbar h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4"
  >
    <OrganizationHubCourseEditInfo />
    <OrganizationHubCourseEditCategories />
    <OrganizationHubCourseEditBilling />
    <OrganizationHubCourseEditContent />
    <OrganizationHubCourseEditCertificate />
  </div>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    const hubSubject = useHubSubjectStore();
    const hubSidebar = useHubSidebarStore();
    return { hubCourse, hubSubject, hubSidebar };
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    course() {
      return this.hubSidebar.course.data;
    },
  },
  watch: {
    'course.id'(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.init();
      }
    },
  },
  mounted() {
    this.init();
  },
  beforeUnmount() {
    this.hubCourse.cycleId = '';
  },
  methods: {
    async init() {
      if (!this.course.id) {
        return;
      }

      this.loading = true;
      this.hubCourse.cycleId = '';

      const course = await this.hubCourse.getCourse({
        courseId: this.course.id,
      });

      // If the returned data is not the data of the current course, it will be returned directly
      if (this.course.id && course.id !== this.course.id) {
        return;
      }

      this.hubCourse.cycleId = course.cycles[0]?.id;

      // The builder may have been closed prematurely.
      if (!this.course.id) {
        return;
      }

      await Promise.all([
        this.hubCourse.getChapters(),
        this.hubCourse.getSpaces(),
        this.hubSubject.getSubjects({
          courseId: this.course.id,
        }),
      ]);

      const { data } = await this.hubCourse.getMembers({
        roles: 'course-teacher,course-observer',
        type: 'profile',
        courseId: this.course.id,
        limit: 0,
      });

      this.hubSubject.courseMembers = [...data]; // better to store course members and use them for subject view

      this.hubSidebar.course.data = cloneDeep(course);
      this.loading = false;
    },
  },
};
</script>
