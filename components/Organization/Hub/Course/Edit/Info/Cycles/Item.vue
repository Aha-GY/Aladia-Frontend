<template>
  <div class="relative flex items-center gap-3 pr-2">
    <div class="flex size-5 items-center justify-center">
      <i class="fa-light fa-calendar-days text-sm text-white/60" />
    </div>
    <el-popover
      v-model:visible="open"
      :disabled="disabled"
      trigger="click"
      placement="bottom"
      width="380"
    >
      <template #reference>
        <div
          class="flex flex-1 items-center gap-2"
          :class="disabled ? 'pointer-events-none' : ''"
        >
          <div class="w-28 cursor-pointer">
            <div class="text-white/50">
              {{ $t('course.cycle.start') }}
              <span class="text-red-600">*</span>
            </div>
            <BaseInput
              ref="start"
              v-model="start"
              readonly
              placeholder="MM DD YYYY"
              fixed
              :default-focus="open"
              :data-cy="`edit-course-cycle-start-${index}`"
            />
          </div>
          <div class="flex-1 cursor-pointer">
            <div class="text-white/50">
              {{ $t('course.cycle.end') }}
              <span v-if="!standalone && index === 0" class="text-red-600">
                *
              </span>
            </div>
            <BaseInput
              ref="end"
              v-model="end"
              readonly
              :disabled="index !== 0"
              placeholder="MM DD YYYY"
              fixed
              :class="index !== 0 ? 'opacity-50' : ''"
              data-cy="edit-course-cycle-end"
            />
          </div>
        </div>
      </template>
      <div class="p-2" @click="onFocus">
        <BaseDatePicker
          v-if="index === 0 && !standalone"
          v-model="range"
          mode="daterange"
          :disabled-dates="disabledDates"
          class="!w-full"
          @change="onDatesChange"
        />
        <BaseDatePicker
          v-else
          v-model="dates.startDate"
          :disabled-dates="disabledDates"
          data-cy="calendar-choose-date"
          :default-value="lastCycleStartDate"
          @change="onCycleChange"
        />
        <BasePopupBottom @close="open = false" />
      </div>
    </el-popover>
    <div
      v-if="index === 0 && !standalone"
      class="absolute right-2 cursor-pointer"
    >
      <div
        v-if="length <= 1"
        class="rounded bg-white/10 px-2 py-1 hover:bg-white/20"
        data-cy="edit-course-cycle-add-2"
        @click="$emit('add')"
      >
        + {{ $t('course.cycle.add') }}
      </div>
      <div v-else>
        <div v-if="more" @click="$emit('less')">
          {{ $t('post.content.less') }}
        </div>
        <div v-else @click="$emit('more')">
          {{ $t('course.cycle.show') }}
        </div>
      </div>
    </div>
    <div v-else-if="!standalone" class="absolute right-2 translate-y-2">
      <div
        class="flex size-5 cursor-pointer items-center justify-center text-white/50 hover:text-white"
        @click="onDelete"
      >
        <i v-if="loading" class="fa-solid fa-spinner animate-spin text-xs" />
        <i v-else class="fa-light fa-trash-can" />
      </div>
    </div>
    <div
      v-if="index > 0"
      class="absolute -top-5 left-2.5 h-7 w-[1px] bg-white/50"
    />
  </div>
</template>

<script>
import dayJS from 'dayjs';

const dayjs = dayJS.tz;

export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    index: {
      type: Number,
      default: 0,
    },
    more: {
      type: Boolean,
      default: false,
    },
    length: {
      type: Number,
      default: 0,
    },
    diff: {
      type: Number,
      default: 0,
    },
    course: {
      type: Object,
      required: true,
    },
    standalone: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const open = ref(false);
    const buttonRef = ref(null);
    const hubCourse = useHubCoursesStore();
    return { hubCourse, open, buttonRef };
  },
  data() {
    return {
      loading: false,
      range: {
        start: null,
        end: null,
      },
      localDates: {},
    };
  },
  computed: {
    disabled() {
      if (this.item.id && !this.standalone) {
        // 已有id的周期，只有课程是草稿状态，去没发布过才可编辑
        const canEdit =
          this.course.status === 'draft' &&
          this.course.cycles[0].status === 'draft';
        return !canEdit;
      } else {
        // 新增周期：任何状态的都可以新增
        return false;
      }
    },
    cycles() {
      return this.course.cycles || [];
    },
    lastCycleStartDate() {
      const startDate = this.cycles[this.index - 1]?.dates?.startDate;
      return startDate ? dayjs(startDate).add(1, 'day').toDate() : null;
    },
    dates() {
      if (this.standalone) {
        return this.localDates;
      }
      return this.item.dates || {};
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
    disabledDates() {
      // 只有一个规则：不能小于第一个周期的开始时间的后一天
      const result = [
        {
          start: null,
          end: dayjs().subtract(1, 'day').toDate(),
        },
        {
          start: null,
          end: dayjs(this.course.cycles[0].startDate)
            .subtract(1, 'day')
            .toDate(),
        },
      ];

      // if (this.index === 0) {
      //   return result;
      // }

      // for (let index = 0; index < this.cycles.length; index++) {
      //   const cycle = this.cycles[index];
      //   if (this.open && index === this.index) {
      //     continue;
      //   }
      //   result.push({
      //     start: null,
      //     end: cycle.dates?.startDate
      //       ? dayjs(new Date(cycle.dates?.startDate)).toDate()
      //       : null,
      //     // end: dayjs(cycle.dates?.startDate).add(1, 'day').toDate(),
      //   });
      // }

      return result;
    },
  },
  watch: {
    async open(value) {
      await sleep(100);
      this.$refs.start.focus = value;
      // this.$refs.end.focus = value;
    },
    course: {
      immediate: true,
      handler(newCourse) {
        if (this.standalone && newCourse?.cycles?.[0]?.dates) {
          this.localDates = JSON.parse(
            JSON.stringify(newCourse.cycles[0].dates),
          );
        }
      },
    },
  },
  mounted() {
    if (this.index === 0) {
      this.range = {
        start: this.dates.startDate,
        end: this.dates.endDate,
      };
      // Emit start date to parent
      if (this.dates.startDate) {
        const startDate = dayjs(this.dates.startDate).toISOString();
        this.$emit('dates-change', {
          startDate,
        });
      }
    }
  },
  methods: {
    onDatesChange(range) {
      if (!range.start || !range.end) {
        return;
      }
      this.dates.startDate = getZeroTimeZone(range.start);
      this.dates.endDate = getZeroTimeZone(range.end);
      this.hubCourse.mainCycleChanged = true;
    },
    onCycleChange(date) {
      const startDate = getZeroTimeZone(date);

      if (this.standalone) {
        // Update only local dates for standalone mode
        this.localDates.startDate = startDate;
        const endTime = dayjs(startDate).add(this.diff, 'millisecond');
        this.localDates.endDate = dayjs(endTime).endOf('day').toISOString();

        // Emit dates-change with local dates
        this.$emit('dates-change', {
          startDate: this.localDates.startDate,
        });
        return;
      }

      const lastCycle = this.cycles[this.index - 1];
      if (lastCycle) {
        if (
          dayjs(startDate).isBefore(dayjs(new Date(lastCycle.dates?.startDate)))
        ) {
          this.dates.startDate = '';
          this.dates.endDate = '';
          return this.$toast.error(
            'Cycle start date should be after the previous cycle start date',
          );
        }
      }

      this.dates.startDate = startDate;
      const endTime = dayjs(startDate).add(this.diff, 'millisecond');
      this.dates.endDate = dayjs(endTime).endOf('day').toISOString();

      if (this.item.id) {
        this.item.changed = true;
      }

      // Emit start date to parent
      this.$emit('dates-change', {
        startDate: this.dates.startDate,
      });
    },
    async onDelete() {
      if (this.loading) {
        return;
      }
      if (this.item.id) {
        this.loading = true;
        await this.hubCourse.deleteCycle({
          courseId: this.course.id,
          cycleId: this.item.id,
        });
        this.loading = false;
      }
      this.$emit('delete', this.index);
    },
  },
};
</script>
