<template>
  <div>
    <OrganizationHubSidebarChildrenFoldersEdit
      v-if="isEdit"
      :folder="folder"
      @close="isEdit = false"
    />
    <div
      v-else
      ref="folderRef"
      data-type="folder"
      :data-id="folder.id"
      class="rounded p-2 pr-4"
      :class="open ? 'bg-white/10' : 'hover:bg-white/10'"
      :data-cy="`space-folder-list-${folder.id}`"
    >
      <div
        :data-draging="isDraging ? 'true' : 'false'"
        class="group/folder flex cursor-pointer touch-none select-none items-center justify-between"
        :style="{
          opacity: isDraging ? '0.5' : '1',
          transform: isDraging ? 'scale(0.95)' : 'scale(1)',
          pointerEvents: isDraging ? 'none' : '',
        }"
        :data-cy="`space-folder-${folder.id}`"
        @click="open = !open"
        @pointerenter="hover = true"
        @pointerleave="hover = false"
      >
        <div class="flex items-center gap-2">
          <div
            class="flex size-5 cursor-grab items-center justify-center rounded-sm hover:bg-white/5 active:cursor-grabbing"
            :class="
              checked || halfChecked || $device.isMobile
                ? ''
                : 'opacity-0 group-hover/folder:opacity-100'
            "
            @pointerdown="onMouseDown"
            @pointerup="onMouseUp"
          >
            <i class="fa-solid fa-grip-dots-vertical text-10" />
          </div>
          <div class="relative">
            <BaseIconFolder
              class="size-10"
              :open="hover || open || checked || halfChecked"
            />
            <OrganizationHubSidebarChildrenCheck
              :item="folder"
              :folder="folder"
              :space="space"
              class="!bottom-0"
              :class="
                checked || halfChecked || $device.isMobile
                  ? ''
                  : 'opacity-0 group-hover/folder:opacity-100'
              "
            />
          </div>
          <div class="max-w-64 truncate text-sm">{{ folder.name }}</div>
        </div>
        <el-popover
          ref="more"
          :width="150"
          trigger="click"
          placement="bottom-end"
          @show="more = true"
          @hide="more = false"
        >
          <template #reference>
            <div
              class="flex size-6 cursor-pointer items-center justify-center rounded hover:bg-white/5"
              :class="
                checked || halfChecked || more || $device.isMobile
                  ? ''
                  : 'opacity-0 group-hover/folder:opacity-100'
              "
              data-cy="8462f292619e3a98"
              @click.stop
            >
              <i class="fa-solid fa-ellipsis text-10" />
            </div>
          </template>
          <div class="flex flex-col gap-1 p-1">
            <div
              class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-white/10"
              data-cy="fbdf3b9e0cf0dd3e"
              @click="onRename"
            >
              <div class="flex size-4 items-center justify-center text-xs">
                <i class="fa-solid fa-edit" />
              </div>
              {{ $t('space.edit.name') }}
            </div>
            <div
              class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-white/10"
              data-cy="3a4004cc876d5034"
              @click="onDelete"
            >
              <div class="flex size-4 items-center justify-center text-xs">
                <i class="fa-solid fa-trash" />
              </div>
              {{ $t('base.editor.delete') }}
            </div>
          </div>
        </el-popover>
      </div>
      <div v-if="open" class="pb-2 pt-2">
        <OrganizationHubSidebarChildrenCourses
          :courses="folder.courses"
          :folder="folder"
          :level="1"
        />
        <el-popover
          :visible="courseOpen"
          placement="bottom"
          :width="width + 20"
          :popper-options="{
            modifiers: modifiers,
          }"
        >
          <template #reference>
            <div
              :data-new-course-folder-id="folder.id"
              class="ml-7 mt-2 flex cursor-pointer items-center justify-center gap-1 rounded border border-white/30 py-1 text-xs transition-all hover:border-transparent hover:bg-white/5"
              data-cy="11b7856e54488f2f"
              @click="courseOpen = !courseOpen"
            >
              <i class="fa-light fa-video-plus" />
              {{ $t('space.add.course') }}
            </div>
          </template>
          <div ref="coursePopup">
            <OrganizationHubSidebarChildrenCreate
              :folder="folder"
              :width="width + 20"
              data-cy="sidebar-new-course-folder-2"
              @open="courseOpen = false"
            />
          </div>
        </el-popover>
      </div>
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
    const courseOpen = ref(false);
    const coursePopup = ref(null);
    const hubSpaces = useHubSpacesStore();
    const hubSidebar = useHubSidebarStore();
    const folderRef = ref(null);
    const { width } = useElementSize(folderRef);

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
      hubSpaces,
      hubSidebar,
      courseOpen,
      coursePopup,
      folderRef,
      width,
    };
  },
  data() {
    return {
      lastUrl: '',
      mouseDownStart: 0,
      isMouseUp: false,
      hover: false,
      open: false,
      more: false,
      isEdit: false,
    };
  },
  computed: {
    checked() {
      return this.folder._state === 'checked';
    },
    halfChecked() {
      return this.folder._state === 'halfChecked';
    },
    isDraging() {
      return this.checked && this.hubSpaces.isDraging;
    },
    space() {
      const { data } = this.hubSidebar.space;
      return this.hubSpaces.find(data.id) || data;
    },
    folderId() {
      return this.$route.query.folder;
    },
    modifiers() {
      return [
        {
          name: 'offset',
          options: {
            offset: [-10, 10],
          },
        },
      ];
    },
  },
  watch: {
    open: {
      handler(value) {
        if (value) {
          this.getCourses();
        }
      },
      immediate: true,
    },
    'hubSpaces.editFolder': {
      handler() {
        this.init();
      },
      immediate: true,
    },
  },
  mounted() {
    this.open = this.folderId === this.folder.id;
  },
  methods: {
    async init() {
      if (
        this.hubSpaces.editFolder &&
        this.hubSpaces.editFolder.id === this.folder.id
      ) {
        await sleep(500);
        this.isEdit = true;
        this.hubSpaces.editFolder = false;
      }
    },
    async getCourses() {
      if (this.space.id) {
        await this.hubSpaces.getCourses({
          spaceId: this.space.id,
          folderId: this.folder.id,
        });
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
    },
    onRename() {
      this.$refs.more.hide();
      this.isEdit = true;
    },
    onDelete() {
      this.$refs.more.hide();
      this.hubSpaces.deleteFolder = [this.folder];
    },
  },
};
</script>
