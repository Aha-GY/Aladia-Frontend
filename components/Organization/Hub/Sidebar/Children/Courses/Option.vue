<template>
  <el-popover
    ref="more"
    :width="150"
    trigger="click"
    placement="bottom-end"
    @show="show = true"
    @hide="show = false"
  >
    <template #reference>
      <div
        class="flex size-6 flex-shrink-0 cursor-pointer items-center justify-center rounded hover:bg-white/10"
        :class="
          show
            ? 'bg-white/10'
            : 'opacity-100 group-hover/course:opacity-100 md:opacity-0'
        "
        @pointerdown.stop
        @pointerup.stop
      >
        <i class="fa-regular fa-ellipsis" />
      </div>
    </template>
    <div class="flex flex-col gap-1 p-1 text-sm">
      <div
        class="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 hover:bg-white/10"
        @click="onOpen"
      >
        <i class="fa-regular fa-arrow-up-right-from-square" />
        Open
      </div>
      <div
        class="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 hover:bg-white/10"
        @click="onRename"
      >
        <i class="fa-sharp fa-regular fa-text" />
        Rename
      </div>
      <div
        class="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 hover:bg-white/10"
        @click="onEdit"
      >
        <i class="fa-regular fa-pen-to-square" />
        Edit
      </div>
      <div
        class="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 hover:bg-white/10"
        @click="onDuplicate"
      >
        <i class="fa-solid fa-clone" />
        Duplicate
      </div>
      <div
        class="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-red-600 hover:bg-red-600/15"
        @click="onDelete"
      >
        <i class="fa-solid fa-trash" />
        {{ $t('base.editor.delete') }}
      </div>
      <div
        class="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-red-600 hover:bg-red-600/15"
        @click="onCancel"
      >
        <i class="fa-regular fa-arrow-turn-left" />
        Cancel
      </div>
    </div>
  </el-popover>
</template>

<script>
export default {
  props: {
    course: {
      type: Object,
    },
    space: {
      type: Object,
    },
    folder: {
      type: Object,
    },
  },
  setup() {
    const authStore = useAuthStore();
    const hubSpaces = useHubSpacesStore();
    const hubSidebar = useHubSidebarStore();
    return { authStore, hubSpaces, hubSidebar };
  },
  data() {
    return {
      show: false,
    };
  },
  computed: {
    spaceId() {
      return this.space?.id;
    },
    folderId() {
      return this.folder?.id;
    },
    isShopping() {
      return this.space?.mode === 'shopping';
    },
    editable() {
      if (this.isShopping) {
        return false;
      }
      return this.hubSpaces.checkCourseEditable(this.course);
    },
  },
  methods: {
    onOpen() {
      this.$refs.more.hide();
      this.$router.push({
        path: `/courses/${this.course.id}`,
        query: {
          space: this.spaceId,
          folder: this.folderId,
          from: 'space',
          version: this.editable ? 'latest' : undefined,
        },
      });
    },
    onRename() {
      this.$refs.more.hide();
      this.$emit('on-rename');
    },
    onEdit() {
      this.$refs.more.hide();
      this.hubSidebar.edieCourse({
        course: this.course,
      });
    },
    onDelete() {
      this.$refs.more.hide();
      this.hubSpaces.deleteCourse = this.course;
    },
    onCancel() {
      this.$refs.more.hide();
    },
    onDuplicate() {
      this.$refs.more.hide();
      this.hubSpaces.currentFolder = this.folder.id;
      this.hubSpaces.duplicateCourse = this.course;
    },
  },
};
</script>
