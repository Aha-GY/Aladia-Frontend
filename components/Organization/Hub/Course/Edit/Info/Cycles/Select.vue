<template>
  <el-popover
    v-if="active"
    ref="cycle"
    trigger="click"
    width="208"
    placement="bottom"
    :disabled="cycles.length <= 1"
    :offset="5"
  >
    <template #reference>
      <div
        class="flex cursor-pointer items-center justify-between rounded bg-white/5 px-2 py-1 text-13 text-white/70 hover:text-white"
        :class="cycles.length <= 1 ? '' : 'w-52'"
      >
        <div>
          {{ formatDate(active.dates.startDate, 'DD MMM YYYY') }} -
          {{ formatDate(active.dates.endDate, 'DD MMM YYYY') }}
        </div>
        <i v-if="cycles.length > 1" class="fa-light fa-chevron-down" />
      </div>
    </template>
    <div class="flex max-h-72 flex-col overflow-y-auto px-1 py-1 text-13">
      <div
        v-for="item in cycles"
        :key="item.id"
        class="flex cursor-pointer justify-center rounded py-1 text-white/70 hover:bg-white/10 hover:text-white"
        @click="onClick(item)"
      >
        {{ formatDate(item.dates.startDate, 'DD MMM YYYY') }} -
        {{ formatDate(item.dates.endDate, 'DD MMM YYYY') }}
      </div>
    </div>
  </el-popover>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    const hubCalendarStore = useHubCalendarStore();
    return { hubCalendarStore, hubCourse };
  },
  computed: {
    course() {
      return this.hubCourse.detail;
    },
    cycles() {
      return (this.course.cycles || []).filter((cycle) => !!cycle.id);
    },
    cycleId() {
      return this.hubCourse.cycleId;
    },
    active() {
      return this.cycles.find((cycle) => cycle.id === this.cycleId);
    },
  },
  methods: {
    async onClick(item) {
      this.hubCourse.cycleId = item.id;
      this.$refs.cycle.hide();
      this.hubCourse.getChapters();
      this.hubCalendarStore.handleChangeCycle(item, this.course);
    },
  },
};
</script>
