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

    log() {
      return this.hubCourse.log;
    },
  },

  beforeUnmount() {
    this.log.restore = {
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
      const { logId, courseId } = this.hubCourse.log.restore.data;

      await this.hubCourse.restoreVersion({
        versionId: logId,
        courseId,
      });

      const restoredLogs = await this.hubCourse.searchLogs({
        courseId,
      });

      this.log.data = restoredLogs;

      await this.hubCourse.searchVersions({
        courseId: this.course.id,
      });

      this.version.preview = null;
      this.version.exit = false;
      this.hubSidebar.version.state = true;
      this.hubSidebar.builder.state = false;
      this.hubCourse.isPreview = false;

      const course = await this.hubCourse.getCourse({
        courseId: this.course.id,
      });

      this.hubSidebar.course.data = course;
      this.saving = false;

      this.log.restore.state = false;
      this.hubSidebar.log.state = true;
    },
  },
};
</script>
