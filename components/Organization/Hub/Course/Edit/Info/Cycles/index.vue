<template>
  <div
    class="-mx-1 -ml-2 mb-4 flex flex-col gap-3 rounded border border-white/10 px-1 py-2 text-13"
  >
    <OrganizationHubCourseEditInfoCyclesItem
      v-for="(item, index) in cycles"
      :key="index"
      :index="index"
      :item="item"
      :more="more"
      :diff="diff"
      :length="course.cycles.length"
      :course="course"
      @add="onAddCycle"
      @delete="onDeleteCycle"
      @less="more = false"
      @more="more = true"
    />
    <div v-if="more && cycles.length > 1" class="pl-7">
      <div
        class="inline-flex cursor-pointer rounded bg-white/10 px-2 py-1 hover:bg-white/20"
        data-cy="edit-course-cycle-add-1"
        @click="onAddCycle"
      >
        + {{ $t('course.cycle.add') }}
      </div>
    </div>
  </div>
</template>

<script>
import dayJS from 'dayjs';

const dayjs = dayJS.tz;

export default {
  setup() {
    const open = ref(false);
    const buttonRef = ref(null);
    const hubCourse = useHubCoursesStore();
    return { hubCourse, open, buttonRef };
  },
  data() {
    return {
      more: false,
    };
  },
  computed: {
    course() {
      return this.hubCourse.detail;
    },
    cycles() {
      if (this.more) {
        return this.course.cycles || [];
      } else {
        return this.course.cycles?.slice(0, 1) || [];
      }
    },
    diff() {
      const startTime = this.cycles[0].dates.startDate;
      const endTime = this.cycles[0].dates.endDate;
      return dayjs(new Date(endTime)).diff(dayjs(new Date(startTime)));
    },
  },
  methods: {
    onAddCycle() {
      const lastCycle = this.cycles[this.cycles.length - 1];
      if (!lastCycle.dates.startDate || !lastCycle.dates.endDate) {
        return this.$toast.error('Please fill the previous cycle first');
      }

      this.more = true;
      this.cycles.push({
        dates: {
          startDate: '',
          endDate: '',
        },
      });
    },
    onDeleteCycle(index) {
      this.cycles.splice(index, 1);
    },
  },
};
</script>
