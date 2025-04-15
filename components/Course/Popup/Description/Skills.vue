<template>
  <div v-if="skills && skills.length > 0" class="flex flex-col gap-2">
    <div
      v-for="(item, index) in skills"
      :key="index"
      class="flex items-center gap-4 rounded p-2 hover:bg-white/5"
    >
      <div
        class="flex size-10 items-center justify-center rounded-full bg-[#E2E2E2]/5"
      >
        <i class="fa-thin fa-lightbulb-gear text-[#89BD80]" />
      </div>
      <div>
        <div>{{ $t(item.content) }}</div>
      </div>
    </div>
  </div>
  <CoursePopupDescriptionNoData v-else />
</template>

<script>
export default {
  setup() {
    const courseStore = useCourseStore();
    return { courseStore };
  },
  data() {
    return {
      ranking: {
        0: 'course.ranking.first',
        1: 'course.ranking.second',
        2: 'course.ranking.third',
        3: 'course.ranking.fourth',
        4: 'course.ranking.fifth',
        5: 'course.ranking.sixth',
        6: 'course.ranking.seventh',
        7: 'course.ranking.eighth',
        8: 'course.ranking.ninth',
      },
    };
  },
  computed: {
    course() {
      return this.courseStore.course;
    },
    skills() {
      return this.course.skills
        .map((item, index) => ({
          ranking: this.ranking[index],
          content: item,
        }))
        .slice(0, 9);
    },
  },
};
</script>
