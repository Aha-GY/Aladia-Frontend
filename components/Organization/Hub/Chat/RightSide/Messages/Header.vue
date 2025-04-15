<template>
  <div
    class="flex h-[3.4375rem] items-center justify-between bg-[#0c0c0c] px-3 py-2"
  >
    <div class="flex flex-1 items-center justify-between text-sm">
      <div class="flex items-center gap-3">
        <div
          class="group/close flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-all hover:bg-white/5 active:scale-95"
          data-cy="fec757fc8b2b62de"
          @click="onBack"
        >
          <i
            class="fa-light fa-arrow-left transition-all group-hover/close:scale-125"
          />
        </div>
        <div class="flex items-center gap-2">
          <i class="fa-regular fa-bookmark" />
          Saved messages
        </div>
      </div>
      <div class="flex">
        <div
          class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-white/80 transition-all hover:bg-white/5 active:scale-95"
          @click="$emit('select-all')"
        >
          <i class="fa-regular fa-circle-check" />
        </div>
        <div
          class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-white/80 transition-all hover:bg-white/5 active:scale-95"
          @click="$emit('filter-member')"
        >
          <i class="fa-regular fa-user-group" />
        </div>
        <el-popover
          v-model:visible="showDatepicker"
          :width="280"
          trigger="click"
          placement="bottom-end"
        >
          <template #reference>
            <div
              class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-white/80 transition-all hover:bg-white/5 active:scale-95"
            >
              <i class="fa-regular fa-calendar-days" />
            </div>
          </template>
          <BaseDatePicker
            v-model="dateValue"
            mode="date"
            :disabled-dates="disabledDates"
            @change="changeDate"
          />
        </el-popover>
      </div>
    </div>
  </div>
</template>
<script>
import dayJS from 'dayjs';

const dayjs = dayJS.tz;

export default {
  setup() {
    const hubChatStore = useHubChatStore();
    return { hubChatStore };
  },
  data() {
    return {
      showDatepicker: false,
      disabledDates: [{ start: dayjs().subtract(1, 'day') }],
      dateValue: null,
    };
  },
  computed: {
    types() {
      return this.type === 'media' ? this.mediaTypes : this.fileTypes;
    },
  },
  methods: {
    onBack() {
      this.hubChatStore.rightSiderType = 'info';
    },
    async changeDate(date) {
      const dateFormat = dayjs(date).toISOString();
      this.showDatepicker = false;
      this.$emit('filter-date', dateFormat);
    },
  },
};
</script>
