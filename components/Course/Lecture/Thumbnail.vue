<template>
  <div
    class="group/upload relative flex h-full w-full cursor-pointer items-center justify-center rounded bg-black transition-all duration-300"
  >
    <div
      v-if="type === 'live' && date && status !== 'past'"
      class="absolute inset-0 flex items-center justify-center"
    >
      <div class="absolute inset-0 flex flex-col rounded object-cover">
        <div
          class="rounded-t bg-black py-[1px] text-center text-xs font-semibold"
        >
          {{ date.month }}
        </div>
        <div
          class="flex flex-1 items-center gap-1 rounded-b bg-[#d9d9d9] px-1 text-black"
        >
          <div class="w-7 text-center text-xl font-semibold">
            {{ date.day }}
          </div>
          <div class="flex flex-col text-right text-xs leading-none">
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
      </div>
    </div>
    <div v-else class="absolute inset-0 flex items-center justify-center">
      <BaseCourseThumbnail
        class="absolute inset-0 h-full w-full"
        :url="thumbnail"
      />
    </div>
  </div>
</template>

<script>
import dayJS from 'dayjs';

const dayjs = dayJS.tz;

export default {
  props: {
    lecture: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  setup() {
    const courseStore = useCourseStore();
    return { courseStore };
  },
  computed: {
    course() {
      return this.courseStore.course;
    },
    type() {
      return this.lecture.type || this.course.type;
    },
    thumbnail() {
      return this.lecture.thumbnail?.url || this.course.thumbnail?.url;
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
