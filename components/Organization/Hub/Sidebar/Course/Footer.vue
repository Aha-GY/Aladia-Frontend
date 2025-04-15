<template>
  <div
    v-if="!hubCourse.inReview"
    class="flex h-12 items-center justify-between bg-white/5 px-4"
  >
    <div
      v-if="status === 'verifying'"
      class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm font-light text-white/50 transition-all duration-300 hover:bg-[#181818] hover:text-white active:scale-95"
      @click="confirmPopup = true"
    >
      <i class="fa-regular fa-clock" />
      <span class="text-sm">Verifying</span>
    </div>
    <div
      v-else
      class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm font-light text-white/50 transition-all duration-300 hover:bg-[#181818] hover:text-white active:scale-95"
      data-cy="publish-button"
      @click="confirmPopup = true"
    >
      <i v-if="publishing" class="fa-solid fa-spinner animate-spin text-xs" />
      <i v-else class="fa-light fa-check text-sm" />
      <span class="text-sm">
        {{ $t('course.version.publish') }}
      </span>
    </div>
    <div
      v-if="hubCourse.versionViewing"
      class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm font-light text-white/50 transition-all duration-300 hover:bg-[#181818] hover:text-white active:scale-95"
      data-cy="57ad58708d32bc89"
      @click="onRestore"
    >
      <i class="fa-light fa-clock-rotate-left text-sm" />
      <span class="text-sm">
        {{ $t('index.version.restore.label') }}
      </span>
    </div>

    <OrganizationHubSidebarCourseConfirmPopup
      v-if="confirmPopup"
      :publishing="publishing"
      @close="confirmPopup = false"
      @publish="onPublish"
    />
  </div>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    const hubSpaces = useHubSpacesStore();
    const hubSidebar = useHubSidebarStore();
    return { hubCourse, hubSpaces, hubSidebar };
  },
  data() {
    return {
      confirmPopup: false,
      publishing: false,
      reviewing: false,
    };
  },
  computed: {
    course() {
      return this.hubSidebar.course.data;
    },
    folder() {
      return this.hubSidebar.course.folder;
    },
    version() {
      return this.hubCourse.version;
    },
    status() {
      return this.course?.version?.status;
    },
  },
  methods: {
    async onPublish() {
      if (this.publishing) {
        return;
      }
      try {
        this.publishing = true;
        await this.hubCourse.publishCourse({
          courseId: this.course.id,
          version: this.hubCourse.versionViewing
            ? this.version.preview.id
            : undefined,
        });
        this.publishing = false;
        this.confirmPopup = false;
        this.$toast.success(this.$t('course.success.publish'));

        this.hubSidebar.course.data = await this.hubCourse.getCourse({
          courseId: this.course.id,
        });

        if (this.folder.id) {
          this.hubSpaces.getCourses({
            spaceId: this.course.spaceId,
            folderId: this.folder.id,
          });
        }
      } catch (error) {
        this.publishing = false;
        this.confirmPopup = false;
        throw error;
      }
    },
    async onRestore() {
      this.version.restore.state = true;
      this.version.restore.data = this.version.preview;
    },
  },
};
</script>
