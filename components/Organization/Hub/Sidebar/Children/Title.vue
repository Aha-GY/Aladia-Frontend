<template>
  <div
    ref="titleRef"
    class="mb-2 flex h-10 items-center justify-between rounded bg-white/5 px-2 py-1.5"
  >
    <div class="flex items-center gap-2 pl-7 text-xs md:text-sm">
      {{ $t('space.add.title') }}
    </div>
    <div ref="buttonRef" class="flex items-center gap-2 text-xs">
      <div
        :data-new-course-folder-id="space.rootFolder.id"
        class="cursor-pointer rounded border border-white/50 px-2 py-1 transition-all hover:border-transparent hover:bg-white/5"
        data-cy="new-course-button"
        @click="courseOpen = !courseOpen"
      >
        <i class="fa-light fa-video-plus" />
        {{ $device.isMobile ? $t('space.course') : $t('space.add.course') }}
      </div>
      <div
        id="sidebar-new-folder"
        ref="folderRef"
        class="cursor-pointer rounded border border-white/50 px-2 py-1 transition-all hover:border-transparent hover:bg-white/5"
        data-cy="sidebar-create-new-folder"
        @click="onCreateFolder"
      >
        <i class="fa-light fa-folder-plus" />
        {{ $device.isMobile ? $t('space.folder') : $t('space.add.folder') }}
      </div>
    </div>
    <el-popover
      :visible="courseOpen"
      :virtual-ref="buttonRef"
      placement="bottom-end"
      :width="width"
    >
      <div ref="coursePopup">
        <OrganizationHubSidebarChildrenCreate
          :folder="space.rootFolder"
          :width="width"
          data-cy="sidebar-new-course-folder-1"
          @open="courseOpen = false"
        />
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  setup() {
    const buttonRef = ref(null);
    const courseOpen = ref(false);
    const coursePopup = ref(null);
    const titleRef = ref(null);
    const { width } = useElementSize(titleRef);

    const hubCourse = useHubCoursesStore();
    const hubSpaces = useHubSpacesStore();
    const hubSidebar = useHubSidebarStore();

    onClickOutside(
      coursePopup,
      () => {
        courseOpen.value = false;
      },
      {
        ignore: ['.daterange'],
      },
    );

    return {
      hubCourse,
      hubSpaces,
      hubSidebar,
      courseOpen,
      coursePopup,
      titleRef,
      buttonRef,
      width,
    };
  },
  computed: {
    children() {
      return this.hubSidebar.children;
    },
    space() {
      const { data } = this.hubSidebar.space;
      return this.hubSpaces.find(data.id) || data;
    },
  },
  methods: {
    onCreateFolder() {
      this.children.folderCreating = true;
    },
  },
};
</script>
