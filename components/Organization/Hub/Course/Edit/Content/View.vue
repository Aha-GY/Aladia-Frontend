<template>
  <div
    class="group/switcher relative flex h-6 w-[2.8125rem] shrink-0 cursor-pointer items-center rounded-full transition-all duration-300"
    :class="active ? 'bg-[#E4B53D]' : 'bg-[#52743b]'"
    data-cy="9a33a601d363b851"
    @click="onChange(!active)"
  >
    <div
      class="relative h-5 w-5 rounded-full bg-white shadow-[0_0.25rem_0.25rem_rgba(0,0,0,0.1)] transition-all duration-300"
      :class="active ? 'translate-x-[1.4375rem]' : 'translate-x-0.5'"
    >
      <div
        class="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-all group-hover/switcher:opacity-100"
        :class="active ? 'bg-[#E4B53D]/30' : 'bg-[#BABABA]/20'"
      />
    </div>
    <i v-if="active" class="fa-light fa-calendar absolute left-2 text-xs" />
    <i v-if="!active" class="fa-light fa-list absolute right-2 text-xs" />
  </div>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    return { hubCourse };
  },
  computed: {
    active() {
      return this.hubCourse.calendarView;
    },
  },
  methods: {
    onChange(value) {
      this.hubCourse.calendarView = value;
    },
  },
};
</script>
