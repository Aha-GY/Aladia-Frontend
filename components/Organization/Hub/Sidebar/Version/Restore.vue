<template>
  <BaseModalRestore
    :loading="saving"
    :title="$t('index.version.restore.confirm')"
    :content="$t('index.version.restore.dialog')"
    :cancel-text="$t('base.editor.delete')"
    :confirm-text="$t('base.upload.confirm')"
    @close="onClose"
    @confirm="onConfirm"
  />
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    const hubSidebar = useHubSidebarStore();
    return { hubCourse, hubSidebar };
  },
  data() {
    return {
      saving: false,
    };
  },
  computed: {
    course() {
      return this.hubSidebar.course.data;
    },
    version() {
      return this.hubCourse.version;
    },
  },
  beforeUnmount() {
    this.version.restore = {
      state: false,
      data: {},
    };
  },
  methods: {
    onClose() {
      this.version.restore.state = false;
    },
    async onConfirm() {
      this.saving = true;
      await this.hubCourse.restoreVersion({
        versionId: this.version.restore.data.id,
        courseId: this.version.restore.data.course.id,
      });
      const version = await this.hubCourse.searchVersions({
        courseId: this.course.id,
      });
      this.version.preview = null;
      this.version.exit = false;
      this.hubSidebar.version.state = true;
      this.hubSidebar.builder.state = false;
      this.hubCourse.isPreview = false;
      const course = await this.hubCourse.getCourse({
        courseId: this.version.restore.data.course.id,
      });
      this.hubSidebar.course.data = course;
      this.hubCourse.version.restore.data = version;
      this.saving = false;
      this.version.restore.state = false;
    },
  },
};
</script>
