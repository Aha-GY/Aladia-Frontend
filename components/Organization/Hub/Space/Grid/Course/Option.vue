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
        class="flex size-6 cursor-pointer items-center justify-center rounded hover:bg-white/10"
        :class="
          show
            ? 'bg-white/10'
            : 'opacity-100 group-hover/course:opacity-100 md:opacity-0'
        "
        :data-cy="`course-card-icon-${course.id}`"
        @pointerdown.stop
        @pointerup.stop
      >
        <i class="fa-regular fa-ellipsis" />
      </div>
    </template>
    <div class="flex flex-col gap-1 p-1 text-sm">
      <div
        class="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 hover:bg-white/10"
        :data-cy="`open-builder-button-${course.id}`"
        @click="onEdit"
      >
        <i class="fa-regular fa-pen-to-square" />
        {{ $t('space.open.builder') }}
      </div>
      <div
        class="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 hover:bg-white/10"
        :data-cy="`open-course-button-${course.id}`"
        @click="onOpen"
      >
        <i class="fa-regular fa-arrow-up-right-from-square" />
        {{ $t('space.open.course') }}
      </div>
      <div
        class="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 hover:bg-white/10"
        :data-cy="`leave-course-button-${course.id}`"
        @click="onLeave"
      >
        <i class="fa-regular fa-arrow-right-from-bracket" />
        {{ $t('space.leave.label') }}
      </div>
      <div
        class="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 hover:bg-white/10"
        :data-cy="`delete-course-button-${course.id}`"
        @click="onDelete"
      >
        <i class="fa-regular fa-trash" />
        {{ $t('base.editor.delete') }}
      </div>
      <div
        class="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 hover:bg-white/10"
        :data-cy="`remove-course-button-${course.id}`"
        @click="onRemove"
      >
        <i class="fa-regular fa-circle-minus" />
        {{ $t('base.member.invite.remove') }}
      </div>
      <div
        class="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 hover:bg-white/10"
        @click="onDuplicate"
      >
        <i class="fa-solid fa-clone" />
        Duplicate
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
    onLeave() {
      this.$refs.more.hide();
      this.hubSpaces.leaveCourse = this.course;
    },
    onRemove() {
      this.$refs.more.hide();
      this.hubSpaces.removeCourse = this.course;
    },
    onDuplicate() {
      this.$refs.more.hide();
      this.hubSpaces.duplicateCourse = this.course;
    },
  },
};
</script>
