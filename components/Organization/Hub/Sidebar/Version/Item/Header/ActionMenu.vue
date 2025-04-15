<template>
  <el-popover ref="more" :width="200" trigger="click" placement="bottom-end">
    <template #reference>
      <div
        class="flex size-6 cursor-pointer items-center justify-center rounded text-xs hover:bg-white/10"
        data-cy="version-menu-icon"
        @click.stop
      >
        <i class="fa-solid fa-ellipsis" />
      </div>
    </template>
    <div class="flex flex-col gap-1 p-1 text-13 text-white">
      <div
        v-if="viewing"
        class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-white/10"
        data-cy="9197983ec9330a5e"
        @click="onViewExit"
      >
        <div class="flex size-4 items-center justify-center">
          <i class="fa-solid fa-eye" />
        </div>
        {{ $t('index.version.exit.label') }}
      </div>
      <div
        v-else-if="!viewing && !current"
        class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-white/10"
        data-cy="view-version-button"
        @click="onViewOpen"
      >
        <div class="flex size-4 items-center justify-center">
          <i class="fa-solid fa-eye" />
        </div>
        {{ $t('index.version.view') }}
      </div>
      <div
        v-if="!current"
        class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-white/10"
        data-cy="fa9edc780bced607"
        @click="onRestore"
      >
        <div class="flex size-4 items-center justify-center">
          <i class="fa-solid fa-clock-rotate-left" />
        </div>
        {{ $t('index.version.restore.label') }}
      </div>
      <div
        v-if="!current"
        class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-white/10"
      >
        <div class="flex size-4 items-center justify-center">
          <i class="fa-solid fa-code-compare" />
        </div>
        {{ $t('index.version.compare') }}
      </div>
      <div
        class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-white/10"
        data-cy="74063777eb5ff2e3"
        @click="onEdit"
      >
        <div class="flex size-4 items-center justify-center">
          <i class="fa-solid fa-edit" />
        </div>
        {{ $t('index.version.edit') }}
      </div>
      <div
        v-if="!published"
        class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-white/10"
        @click="onPublish"
      >
        <div class="flex size-4 items-center justify-center">
          <i class="fa-light fa-check" />
        </div>
        {{ $t('course.version.publish') }}
      </div>
    </div>
  </el-popover>
</template>

<script>
export default {
  props: {
    current: Boolean,
    viewing: Boolean,
    restored: Boolean,
    published: Boolean,
  },
  emits: ['view-open', 'view-exit', 'edit', 'restore'],
  setup() {
    const hubCourse = useHubCoursesStore();
    const hubSidebar = useHubSidebarStore();
    const hubSpace = useHubSpacesStore();
    return { hubCourse, hubSidebar, hubSpace };
  },
  data() {
    return {
      publishing: false,
    };
  },
  computed: {
    course() {
      return this.hubSidebar.course.data;
    },
    version() {
      return this.hubCourse.version;
    },
    folder() {
      return this.hubSidebar.course.folder;
    },
  },
  methods: {
    onViewOpen() {
      this.$refs.more.hide();
      this.$emit('view-open');
    },
    onViewExit() {
      this.$refs.more.hide();
      this.$emit('view-exit');
    },
    onEdit() {
      this.$refs.more.hide();
      this.$emit('edit');
    },
    onRestore() {
      this.$refs.more.hide();
      this.$emit('restore');
    },
    async onPublish() {
      this.$refs.more.hide();
      await this.hubCourse.publishCourse({
        courseId: this.course.id,
        version: this.hubCourse.versionViewing
          ? this.version.preview.id
          : undefined,
      });
      await this.hubCourse.searchVersions({
        courseId: this.course.id,
      });

      const course = await this.hubCourse.getCourse({
        courseId: this.course.id,
      });

      this.hubSidebar.course.data = course;
      this.hubSidebar.course.data.status = course.status;

      await this.hubSpace.getCourses({
        spaceId: this.course.spaceId,
        folderId: this.folder.id,
      });

      this.hubSidebar.course.state = true;
      this.$toast.success(this.$t('course.success.publish'));
    },
  },
};
</script>
