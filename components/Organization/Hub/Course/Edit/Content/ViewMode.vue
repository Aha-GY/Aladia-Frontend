<template>
  <div>
    <client-only>
      <el-tooltip
        ref="more"
        trigger="click"
        placement="bottom-end"
        effect="light"
        :offset="5"
        :show-arrow="false"
        popper-class="!bg-[#0D0D0D] !border !border-white/10 !p-1"
        @show="show = true"
        @hide="show = false"
      >
        <div
          class="flex cursor-pointer items-center gap-1 rounded-5 border-[0.5px] border-[rgba(226,226,226,0.03)] bg-[rgba(226,226,226,0.03)] px-1 py-1.5 text-xs text-[#E5E5E5] hover:bg-white/10"
        >
          <i
            v-if="active === 'calendar'"
            class="fa-solid fa-calendar-days px-1"
          />
          <i v-if="active === 'list-closed'" class="fa-solid fa-list px-1" />
          <i
            v-if="active === 'list-opened'"
            class="fa-solid fa-list-tree px-1"
          />
          <i class="fa-regular fa-angles-up-down text-sm text-[#B0B0B0]" />
        </div>

        <template #content>
          <div class="flex flex-col gap-1">
            <div
              class="cursor-pointer rounded p-1 hover:bg-white/5"
              :class="active === 'list-closed' ? 'bg-white/10' : ''"
              @click="toggleListView(false)"
            >
              Close List View
            </div>
            <div
              class="cursor-pointer rounded p-1 hover:bg-white/5"
              :class="active === 'list-opened' ? 'bg-white/10' : ''"
              @click="toggleListView(true)"
            >
              Open List View
            </div>
            <div
              v-if="course.type === 'live'"
              class="cursor-pointer rounded p-1 hover:bg-white/5"
              :class="active === 'calendar' ? 'bg-white/10' : ''"
              @click="calendarMode(true)"
            >
              Calendar View
            </div>
          </div>
        </template>
      </el-tooltip>
    </client-only>
  </div>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    return { hubCourse };
  },
  data() {
    return {
      show: false,
    };
  },
  computed: {
    course() {
      return this.hubCourse.detail;
    },
    active() {
      if (this.hubCourse.calendarView) {
        return 'calendar';
      } else if (this.hubCourse.listView) {
        return 'list-opened';
      } else {
        return 'list-closed';
      }
    },
  },
  methods: {
    calendarMode(value) {
      this.$refs.more.hide();
      this.hubCourse.calendarView = value;
    },
    async toggleListView(value) {
      this.$refs.more.hide();
      this.hubCourse.calendarView = false;
      this.hubCourse.listView = value;
    },
  },
};
</script>
