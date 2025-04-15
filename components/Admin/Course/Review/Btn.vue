<template>
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
        :class="
          open
            ? 'bg-white/10'
            : 'opacity-100 hover:bg-white/10 group-hover/course:opacity-100'
        "
        :data-cy="`course-card-icon-`"
        @pointerdown.stop
        @pointerup.stop
      >
        <i class="fa-regular fa-ellipsis" />
      </div>
    </template>
    <div class="flex flex-col gap-1 p-1 text-sm">
      <div
        class="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 hover:bg-white/10"
        :data-cy="`open-builder-button-`"
        @click="onEdit"
      >
        <i class="fa-regular fa-pen-to-square" />
        {{ $t('space.open.builder') }}
      </div>
      <div
        class="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 hover:bg-white/10"
        :data-cy="`open-course-button-`"
        @click="onEdit"
      >
        <i class="fa-regular fa-arrow-up-right-from-square" />
        {{ $t('space.open.course') }}
      </div>
    </div>
  </el-popover>
</template>
<script>
export default {
  props: {
    course: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const hubSidebar = useHubSidebarStore();
    return { hubSidebar };
  },
  data() {
    return {
      open: false,
    };
  },
  methods: {
    async onEdit() {
      this.hubSidebar.course.state = false;
      this.hubSidebar.state = false;
      await this.$nextTick();
      this.hubSidebar.course.data = this.course;
      this.hubSidebar.course.state = true;
      this.hubSidebar.state = true;
    },
  },
};
</script>
