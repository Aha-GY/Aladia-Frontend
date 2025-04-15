<template>
  <el-popover
    v-if="editable"
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
        :class="
          checked || open
            ? 'bg-white/10'
            : 'opacity-0 group-hover/course:opacity-100'
        "
      >
        <i class="fa-light fa-ellipsis text-sm" />
      </div>
    </template>
    <div class="flex flex-col gap-1 p-1 text-sm">
      <div
        class="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 hover:bg-white/10"
        data-cy="259eeb7827828298"
        @click="onEdit"
      >
        <i class="fa-regular fa-pen-to-square" />
        {{ $t('space.open.builder') }}
      </div>
      <div
        class="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 hover:bg-white/10"
        data-cy="0fafdf288216706b"
        @click="onOpen"
      >
        <i class="fa-regular fa-pen-to-square" />
        {{ $t('space.open.course') }}
      </div>
      <div
        class="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 hover:bg-white/10"
        data-cy="3d00e3fc05126da4"
        @click="onLeave"
      >
        <i class="fa-light fa-arrow-right-from-bracket" />
        {{ $t('space.leave.label') }}
      </div>
      <div
        class="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 hover:bg-white/10"
        data-cy="80c99170f75367aa"
        @click="onDelete"
      >
        <i class="fa-light fa-trash" />
        {{ $t('base.editor.delete') }}
      </div>
      <div
        class="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 hover:bg-white/10"
        data-cy="40bd2570b7b2aa1a"
        @click="onRemove"
      >
        <i class="fa-light fa-trash" />
        {{ $t('base.member.invite.remove') }}
      </div>
    </div>
  </el-popover>
</template>

<script>
export default {
  props: {
    space: Object,
    folder: Object,
    course: Object,
  },
  setup() {
    const hubSpaces = useHubSpacesStore();
    const hubCourse = useHubCoursesStore();
    const hubSidebar = useHubSidebarStore();
    return { hubCourse, hubSpaces, hubSidebar };
  },
  data() {
    return {
      open: false,
    };
  },
  computed: {
    editable() {
      return this.hubSpaces.checkCourseEditable(this.course);
    },
    checked() {
      return this.course._state === 'checked';
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
          version: 'latest',
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
  },
};
</script>
