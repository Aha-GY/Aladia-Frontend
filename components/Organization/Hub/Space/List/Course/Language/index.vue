<template>
  <div
    class="flex h-8 cursor-pointer items-center rounded"
    data-cy="5a59d9a6db005822"
    @click="onEdit"
  >
    <div class="flex items-center gap-2">
      <i class="fa-light fa-comment" />
      {{ language || '---' }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    course: Object,
  },
  setup() {
    const hubSpaces = useHubSpacesStore();
    const hubCourse = useHubCoursesStore();
    const hubSidebar = useHubSidebarStore();
    const globalStore = useGlobalStore();
    return { globalStore, hubSpaces, hubCourse, hubSidebar };
  },
  computed: {
    editable() {
      return this.hubSpaces.checkCourseEditable(this.course);
    },
    languageId() {
      return this.course.languageId;
    },
    language() {
      return this.globalStore.languages.find(
        (language) => language.id === this.course.languageId,
      )?.name;
    },
  },
  methods: {
    onEdit() {
      if (!this.editable) {
        return;
      }
      this.hubCourse.focusField = 'languageId';
      this.hubSidebar.edieCourse({
        course: this.course,
        isBuilder: true,
      });
      this.hubCourse.step = 1;
    },
  },
};
</script>
