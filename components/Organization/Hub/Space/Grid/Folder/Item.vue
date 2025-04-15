<template>
  <div class="w-full shrink-0 p-4 md:w-1/2 lg:w-1/2 xl:w-1/3 2xl:w-1/4">
    <div
      ref="folder"
      data-type="folder"
      :data-id="folder.id"
      :data-draging="isDraging ? 'true' : 'false'"
      class="group/folder flex cursor-grab touch-none select-none items-center justify-between gap-3 rounded border border-transparent bg-black px-2 py-3 transition-all hover:bg-[#1c1c1c] active:cursor-grabbing"
      :class="
        isCoursesDraging ? 'hover:border-dashed hover:border-[#eab308]' : ''
      "
      :style="{
        opacity: isDraging ? '0.5' : '1',
        transform: isDraging ? 'scale(0.95)' : 'scale(1)',
        pointerEvents: isDraging ? 'none' : '',
      }"
      :data-cy="`space-folder-list-${folder.id}`"
      @pointerdown="onMouseDown"
      @pointerup="onMouseUp"
    >
      <div class="flex flex-1 items-center">
        <div class="mr-3 flex items-center gap-2">
          <div
            class="folder-handle flex items-center opacity-0 group-hover/folder:opacity-100"
          >
            <i class="fa-regular fa-grip-dots-vertical text-xs" />
          </div>
          <BaseCheckboxStyle
            :state="checked ? 'checked' : 'unchecked'"
            data-cy="c5e4dde9f51908eb"
            @click.stop="onChecked"
            @pointerdown.stop
            @pointerup.stop
          />
          <BaseIconFolder
            :open="true"
            class="hidden h-3 group-hover/folder:flex"
          />
          <BaseIconFolder :open="false" class="h-3 group-hover/folder:hidden" />
        </div>
        <div class="w-0 flex-1 truncate">{{ folder.name }}</div>
      </div>
      <div class="flex items-center gap-1 text-xs text-white/50">
        <i class="fa-light fa-book" />
        {{ folder.courses.length || folder.originalCourses?.length || 0 }}
      </div>
      <el-popover
        ref="more"
        :width="150"
        trigger="click"
        placement="bottom-end"
        @show="open = true"
        @hide="open = false"
      >
        <template #reference>
          <div
            class="flex size-6 cursor-pointer items-center justify-center rounded"
            :class="open ? 'bg-white/10' : 'hover:bg-white/10'"
            @pointerdown.stop
            @pointerup.stop
          >
            <i class="fa-light fa-ellipsis" />
          </div>
        </template>
        <div class="flex flex-col gap-1 p-1 text-sm">
          <div
            class="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 hover:bg-white/10"
            data-cy="e29a44c00d5a052c"
            @click="onEditName"
          >
            <i class="fa-regular fa-pen-to-square" />
            {{ $t('space.edit.name') }}
          </div>
          <div
            class="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 hover:bg-white/10"
            data-cy="d13a86023fa1b8b5"
            @click="onCollapse"
          >
            <i class="fa-light fa-folder-xmark" />
            {{ $t('space.collapse') }}
          </div>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    folder: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const hubSpaces = useHubSpacesStore();
    const hubSidebar = useHubSidebarStore();
    return { hubSpaces, hubSidebar };
  },
  data() {
    return {
      open: false,
      lastUrl: '',
      mouseDownStart: 0,
      isMouseUp: false,
    };
  },
  computed: {
    checked() {
      return this.folder._state === 'checked';
    },
    isDraging() {
      return this.checked && this.hubSpaces.isDraging;
    },
    spaceId() {
      return this.$route.query.space;
    },
    space() {
      return this.hubSpaces.find(this.spaceId);
    },
    // 是否有选中的课程在拖拽
    isCoursesDraging() {
      return (
        this.hubSpaces.checkedsClear.filter((item) => item._type === 'course')
          .length && this.hubSpaces.isDraging
      );
    },
  },
  methods: {
    onEditName() {
      this.$refs.more.hide();
      this.hubSpaces.editFolder = this.folder;
      this.hubSidebar.space.data = this.space;
      this.hubSidebar.children.state = true;
      this.hubSidebar.state = true;
    },
    onCollapse() {
      this.$refs.more.hide();
      this.hubSpaces.deleteFolder = [this.folder];
    },
    onChecked() {
      if (this.checked) {
        this.folder._state = 'unchecked';
      } else {
        this.folder._state = 'checked';
      }
    },
    async onMouseDown(event) {
      if (event.button !== 0) {
        return;
      }
      this.lastUrl = location.href;
      this.mouseDownStart = Date.now();
      this.isMouseUp = false;

      await sleep(300);
      if (location.href !== this.lastUrl) {
        return;
      }
      if (this.isMouseUp) {
        return;
      }

      this.hubSpaces.isDraging = true;
      this.hubSpaces.dragLeft = `${event.x}px`;
      this.hubSpaces.dragTop = `${event.y}px`;
      if (this.hubSpaces.checkeds.length === 0) {
        this.hubSpaces.isTmpCheck = true;
        this.hubSpaces.uncheck();
      }
      this.folder._state = 'checked';
    },
    onMouseUp() {
      this.isMouseUp = true;
      if (Date.now() - this.mouseDownStart < 300) {
        this.$router.push({
          query: {
            ...this.$route.query,
            folder: this.folder.id,
          },
        });
      }
    },
  },
};
</script>
