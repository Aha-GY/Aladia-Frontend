<template>
  <div
    class="group/upload relative flex aspect-video h-12 cursor-pointer items-center justify-center rounded-md border border-dashed border-white/50 bg-black transition-all duration-300 hover:border-white md:h-20"
  >
    <div
      v-if="type === 'on-demand'"
      class="absolute inset-0 flex items-center justify-center"
    >
      <BaseCourseThumbnail
        v-if="thumbnail"
        class="absolute inset-0 h-full w-full rounded-md"
        :url="thumbnail"
      />
      <i
        v-else
        class="fa-light fa-clapperboard-play text-xl opacity-50 transition-all duration-300 group-hover/upload:scale-110 group-hover/upload:opacity-100"
      />
    </div>
    <div
      v-if="type === 'live'"
      class="absolute inset-0 flex items-center justify-center"
    >
      <div
        v-if="date"
        class="absolute inset-0 flex flex-col rounded-md object-cover"
      >
        <div class="rounded-t-md bg-black py-0.5 text-center font-semibold">
          {{ date.month }}
        </div>
        <div
          class="flex flex-1 items-center gap-1 rounded-b-md bg-[#d9d9d9] pl-2 text-black"
        >
          <div class="w-10 text-center text-3xl font-semibold">
            {{ date.day }}
          </div>
          <div class="flex flex-col gap-0.5 text-right leading-none">
            <div>{{ date.week }}</div>
            <div>
              {{ date.start.time }}
              <span class="font-light opacity-50">
                {{ date.start.unit }}
              </span>
            </div>
            <div>
              {{ date.end.time }}
              <span class="font-light opacity-50">
                {{ date.end.unit }}
              </span>
            </div>
          </div>
        </div>
        <div
          class="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-br-md rounded-tl-md bg-black/50"
        >
          <i class="fa-light fa-calendar-lines-pen" />
        </div>
      </div>
      <i
        v-else
        class="fa-light fa-calendar-circle-plus text-xl opacity-50 transition-all duration-300 group-hover/upload:scale-110 group-hover/upload:opacity-100"
      />
    </div>
  </div>
</template>

<script>
import dayJS from 'dayjs';

const dayjs = dayJS.tz;

export default {
  props: {
    lecture: Object,
  },
  setup() {
    const hubCourse = useHubCoursesStore();
    return { hubCourse };
  },
  computed: {
    course() {
      return this.hubCourse.detail;
    },
    type() {
      return this.lecture.type || this.course.type;
    },
    thumbnail() {
      return this.lecture.thumbnail.url || this.course.thumbnail.url;
    },
    event() {
      return this.lecture.originalEvent;
    },
    date() {
      const { startDate, endDate } = this.event?.dates || {};
      if (startDate && endDate) {
        const day1 = dayjs(new Date(startDate));
        const day2 = dayjs(new Date(endDate));
        return {
          month: day1.format('MMMM YYYY'),
          day: day1.date(),
          week: day1.format('dddd'),
          start: {
            time: day1.format('h:mm'),
            unit: day1.format('a'),
          },
          end: {
            time: day2.format('h:mm'),
            unit: day2.format('a'),
          },
        };
      } else {
        return null;
      }
    },
  },
};
</script>
