<template>
  <div
    ref="buttonRef"
    class="mt-2 flex items-center gap-3 pl-1 text-13 text-white"
  >
    <i class="fa-light fa-calendar" />
    <div
      class="group/input relative z-30 flex flex-col items-center justify-end"
      :class="disabled || !courseDates.startDate ? 'pointer-events-none' : ''"
      data-cy="course-start-date"
      @click="open = true"
    >
      <div class="flex w-full items-center gap-1.5 transition-all duration-300">
        <input
          readonly
          :value="start"
          :placeholder="$t('course.range.start')"
          class="h-6 w-24 min-w-0 cursor-pointer rounded bg-transparent px-1 text-center placeholder-white/30 outline-none hover:bg-white/10"
          data-cy="course-range-start"
          @focus="startFocus = true"
          @blur="startFocus = false"
        />
        <div class="w-6 text-center text-white/50">-</div>
        <input
          readonly
          :value="end"
          :placeholder="$t('course.range.end')"
          class="h-6 w-24 min-w-0 cursor-pointer rounded bg-transparent px-1 text-center placeholder-white/30 outline-none hover:bg-white/10"
          data-cy="5b41e682778782a7"
          @focus="endFocus = true"
          @blur="endFocus = false"
        />
      </div>
    </div>
    <BasePopup
      id="create-time"
      :open="open"
      :store="hubCourse"
      :button-ref="buttonRef"
      :arrow="false"
      :width="width"
      placement="bottom-start"
      @close="open = false"
    >
      <div ref="popupRef" class="p-2">
        <BaseDatePicker
          v-model="range"
          mode="daterange"
          :disabled-dates="disabledDates"
          class="!w-full"
          @change="onChange"
        />
        <BasePopupBottom @close="open = false" />
      </div>
    </BasePopup>
  </div>
</template>

<script>
import dayJS from 'dayjs';

const dayjs = dayJS.tz;

export default {
  props: {
    chapter: {
      type: Object,
      default: () => ({}),
    },
    course: {
      type: Object,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    isUpdate: {
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
      default: 405,
    },
    chapterIndex: {
      type: Number,
      default: 0,
    },
  },
  setup() {
    const open = ref(false);
    const buttonRef = ref(null);
    const popupRef = ref(null);
    const hubCourse = useHubCoursesStore();

    onClickOutside(
      buttonRef,
      () => {
        open.value = false;
      },
      {
        ignore: [popupRef],
      },
    );

    return { hubCourse, open, buttonRef, popupRef };
  },
  data() {
    return {
      startFocus: false,
      endFocus: false,
      range: {
        start: null,
        end: null,
      },
    };
  },
  computed: {
    courseDates() {
      return this.course?.cycles[0]?.dates || this.course?.cycles || {};
    },
    disabledDates() {
      const lastChapter = this.course.chapters[this.chapterIndex - 1];
      const lastChapterendDate = lastChapter?.cycles[0]?.dates?.endDate;
      return [
        {
          start: null,
          end: dayjs(new Date(this.courseDates.startDate)).subtract(1, 'day'),
        },
        {
          start: dayjs(new Date(this.courseDates.endDate)).subtract(1, 'day'),
          end: null,
        },
        {
          start: null,
          end: lastChapterendDate ? dayjs(new Date(lastChapterendDate)) : null,
        },
      ];
    },
    dates() {
      return this.chapter?.dates || this.chapter?.cycles[0]?.dates || {};
    },
    start() {
      if (this.dates.startDate) {
        if (this.open) {
          return formatDate(this.dates.startDate, 'DD/MM/YYYY');
        } else {
          return formatDate(this.dates.startDate, 'DD MMM YYYY');
        }
      } else {
        return '';
      }
    },
    end() {
      if (this.dates.endDate) {
        if (this.open) {
          return formatDate(this.dates.endDate, 'DD/MM/YYYY');
        } else {
          return formatDate(this.dates.endDate, 'DD MMM YYYY');
        }
      } else {
        return '';
      }
    },
    hasValue() {
      return this.start || this.end || this.open;
    },
  },
  mounted() {
    this.range = {
      start: this.dates.startDate,
      end: this.dates.endDate,
    };
  },
  methods: {
    async onChange(range) {
      const lastStartDate = this.dates.startDate;
      const lastEndDate = this.dates.endDate;
      try {
        if (range.start && range.end) {
          this.dates.startDate = getZeroTimeZone(range.start);
          this.dates.endDate = getZeroTimeZone(range.end);
          if (this.isUpdate) {
            await this.hubCourse.updateChapter({
              chapterId: this.chapter.id,
              courseId: this.course.id,
              dates: this.dates,
            });

            // 同步到popup
            if (this.hubCourse.popupOpen) {
              this.hubCourse.chapterPopup.dates = this.dates;
            }
          }
        }
      } catch (error) {
        this.dates.startDate = lastStartDate;
        this.dates.endDate = lastEndDate;
        this.range = {
          start: lastStartDate,
          end: lastEndDate,
        };
        throw error;
      }
    },
  },
};
</script>
