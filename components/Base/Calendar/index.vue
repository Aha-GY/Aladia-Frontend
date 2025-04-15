<template>
  <el-popover
    ref="popover"
    placement="bottom-start"
    :width="800"
    trigger="click"
  >
    <template #reference>
      <div>
        <BaseButton
          type="outline"
          icon="fa-regular fa-calendar-days"
          :size="buttonSize"
        >
          {{ label }}
        </BaseButton>
      </div>
    </template>
    <div class="flex flex-col gap-2 rounded bg-black p-2 text-sm">
      <div class="flex gap-2">
        <div class="flex w-32 flex-col gap-2">
          <div
            v-for="shortcut in shortcuts"
            :key="shortcut.label"
            class="cursor-pointer rounded px-2 py-1 text-white/80 hover:bg-white/10 hover:text-white"
            @click="onShortcut(shortcut)"
          >
            {{ shortcut.label }}
          </div>
        </div>
        <div class="flex flex-1 flex-col gap-2">
          <div class="flex items-center gap-8 pl-4">
            <div class="flex items-center gap-2">
              Start
              <BaseCalendarDateField v-model="currentDates[0]" />
            </div>
            <div class="flex items-center gap-2">
              End
              <BaseCalendarDateField v-model="currentDates[1]" />
            </div>
          </div>
          <div class="relative h-[21rem]">
            <el-date-picker
              v-model="currentDates"
              type="daterange"
              unlink-panels
              class="opacity-0"
              :editable="false"
              :teleported="false"
              :range-separator="$t('space.date.separator')"
              :start-placeholder="$t('space.date.start')"
              :end-placeholder="$t('space.date.end')"
              :disabled-date="disabledDate"
              placement="bottom-start"
              popper-class="date-picker-popop"
              size="small"
              :popper-options="{
                modifiers: [
                  {
                    name: 'preventOverflow',
                    options: {
                      boundary: null,
                    },
                  },
                  {
                    name: 'flip',
                    enabled: false,
                  },
                  {
                    name: 'offset',
                    options: {
                      offset: [0, 0],
                    },
                  },
                ],
              }"
            />
          </div>
        </div>
      </div>
      <div class="flex items-center justify-end gap-4">
        <BaseButton type="outline" @click="onClear">Clear</BaseButton>
        <BaseButton @click="onApply">Apply</BaseButton>
      </div>
    </div>
  </el-popover>
</template>

<script>
import dayjs from 'dayjs';

export default {
  props: {
    dates: {
      type: Array,
      default: () => [
        dayjs().startOf('month').toDate(),
        dayjs().endOf('day').toDate(),
      ],
    },
    shortcut: {
      type: String,
      default: 'Month to date',
    },
    buttonSize: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      currentShortcut: this.shortcut, // 预选快捷键
      currentDates: cloneDeep(this.dates), // 预选日期
      defaultDates: cloneDeep(this.dates), // 默认日期
      activeDates: cloneDeep(this.dates), // 当前日期
    };
  },
  computed: {
    label() {
      const shortcut = this.shortcuts.find(
        (shortcut) =>
          shortcut.dates[0].getTime() === this.activeDates[0].getTime() &&
          shortcut.dates[1].getTime() === this.activeDates[1].getTime(),
      )?.label;
      const startOfDay = dayjs(this.activeDates[0]).format('YYYY-MM-DD');
      const endOfDay = dayjs(this.activeDates[1]).format('YYYY-MM-DD');
      const custom = `${startOfDay} - ${endOfDay}`;
      return this.currentShortcut || shortcut || custom;
    },
    shortcuts() {
      return [
        {
          label: 'Last 7 days',
          dates: [
            dayjs().subtract(7, 'days').startOf('day').toDate(),
            dayjs().endOf('day').toDate(),
          ],
        },
        {
          label: 'Last 4 weeks',
          dates: [
            dayjs().subtract(4, 'week').startOf('week').toDate(),
            dayjs().subtract(1, 'week').endOf('week').toDate(),
          ],
        },
        {
          label: 'Last month',
          dates: [
            dayjs().subtract(1, 'month').startOf('month').toDate(),
            dayjs().subtract(1, 'month').endOf('month').toDate(),
          ],
        },
        {
          label: 'Last 3 month',
          dates: [
            dayjs().subtract(3, 'month').startOf('month').toDate(),
            dayjs().subtract(1, 'month').endOf('month').toDate(),
          ],
        },
        {
          label: 'Last 12 month',
          dates: [
            dayjs().subtract(12, 'month').startOf('month').toDate(),
            dayjs().subtract(1, 'month').endOf('month').toDate(),
          ],
        },
        {
          label: 'Month to date',
          dates: [
            dayjs().startOf('month').toDate(),
            dayjs().endOf('day').toDate(),
          ],
        },
        {
          label: 'Quarter to date',
          dates: [
            dayjs().startOf('quarter').toDate(),
            dayjs().endOf('day').toDate(),
          ],
        },
        {
          label: 'Year to date',
          dates: [
            dayjs().startOf('year').toDate(),
            dayjs().endOf('day').toDate(),
          ],
        },
      ];
    },
  },
  methods: {
    disabledDate(date) {
      return date > dayjs().endOf('day');
    },
    onShortcut(shortcut) {
      this.currentDates = cloneDeep(shortcut.dates);
    },
    onClear() {
      this.currentDates = cloneDeep(this.defaultDates);
      this.activeDates = cloneDeep(this.defaultDates);
    },
    onApply() {
      if (dayjs(this.currentDates[0]).isAfter(dayjs(this.currentDates[1]))) {
        this.$toast.error('Start date must be before end date');
        return;
      }

      this.currentShortcut = '';
      this.activeDates = cloneDeep(this.currentDates);
      this.$emit('change', {
        dates: [...this.activeDates],
        days: [
          dayjs(this.activeDates[0]).format('YYYY-MM-DD'),
          dayjs(this.activeDates[1]).format('YYYY-MM-DD'),
        ],
      });
      this.$refs.popover.hide();
    },
  },
};
</script>

<style lang="scss">
.date-picker-popop {
  top: 0px !important;
  display: block !important;
  border: none !important;
  .el-popper__arrow {
    display: none !important;
  }
  .el-date-range-picker__content.is-left {
    border-right: none !important;
  }
}
</style>
