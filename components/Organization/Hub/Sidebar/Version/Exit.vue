<template>
  <div>
    <div
      class="flex h-12 items-center justify-between rounded-t-sm bg-white/5 px-4"
    >
      <div class="flex items-center gap-2">
        {{ $t('index.version.exit.confirm') }}
      </div>
      <BaseIconClose data-cy="2b09c4bf2b69c6c3" @click="onClose" />
    </div>
    <div class="flex h-24 items-center px-4">
      {{ $t('index.version.exit.dialog') }}
    </div>
    <div class="flex items-center justify-between bg-white/5 px-4 py-2">
      <div
        class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm font-light text-white/50 transition-all duration-300 hover:bg-[#181818] hover:text-white active:scale-95"
        data-cy="7c3e728dcc26c633"
        @click="onClose"
      >
        <i class="fa-solid fa-xmark text-xs" />
        {{ $t('base.upload.cancel') }}
      </div>
      <div
        class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm font-light text-white/50 transition-all duration-300 hover:bg-[#181818] hover:text-white active:scale-95"
        data-cy="523136881f03a0ba"
        @click="onConfirm"
      >
        <i class="fa-light fa-check text-sm" />
        {{ $t('base.upload.confirm') }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    const hubSidebar = useHubSidebarStore();
    return { hubCourse, hubSidebar };
  },
  computed: {
    course() {
      return this.hubSidebar.course.data;
    },
    version() {
      return this.hubCourse.version;
    },
  },
  methods: {
    onClose() {
      this.version.exit = false;
    },
    async onConfirm() {
      this.version.preview = null;
      this.version.exit = false;
      this.hubSidebar.version.state = true;
      this.hubSidebar.builder.state = false;
      this.hubCourse.isPreview = false;
      const course = await this.hubCourse.getCourse({
        courseId: this.course.id,
      });
      this.hubSidebar.course.data = course;
    },
  },
};
</script>
