<template>
  <div class="flex justify-center py-2">
    <div
      ref="datepicker"
      class="flex w-[7.5rem] cursor-pointer items-center justify-center rounded-full bg-[#262626] p-2 text-sm leading-3 text-white/80 hover:bg-[#252525]"
    >
      {{ label }}
    </div>
    <client-only>
      <el-popover
        v-model:visible="showDatepicker"
        :virtual-ref="datepicker"
        popper-class="bg-[#0A0A0A]/80 p-0 "
        :show-arrow="false"
        placement="bottom"
        trigger="click"
        virtual-triggering
        :width="220"
        :offset="0"
        @before-enter="showDatepicker = true"
        @before-leave="showDatepicker = false"
      >
        <BaseDatePicker
          v-model="dateValue"
          mode="date"
          :disabled-dates="disabledDates"
          @change="changeDate"
        />
      </el-popover>
    </client-only>
  </div>
</template>
<script>
import dayJS from 'dayjs';

const dayjs = dayJS.tz;

export default {
  props: {
    label: {
      type: String,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    date: {
      type: String,
    },
    scrollValue: {
      type: Number,
    },
  },
  emits: ['locate-message'],
  setup() {
    const datepicker = ref();
    const hubChatStore = useHubChatStore();
    return { hubChatStore, datepicker };
  },
  data() {
    return {
      showDatepicker: false,
      disabledDates: [{ start: dayjs().subtract(1, 'day') }],
      dateValue: null,
    };
  },
  watch: {
    scrollValue() {
      this.showDatepicker = false;
    },
    mounted() {
      this.dateValue = this.date
        ? dayjs(new Date(this.date)).toDate()
        : new Date();
    },
  },
  methods: {
    async changeDate(date) {
      this.hubChatStore.searchParams.from = dayjs(date).toISOString();
      this.hubChatStore.searchParams.to = dayjs(date)
        .add(1, 'day')
        .toISOString();
      this.showDatepicker = false;
      this.hubChatStore.searchPrefixs = [
        {
          content: formatDate(
            this.hubChatStore.searchParams.from,
            'MMM D, YYYY',
          ),
          class: 'text-[#FFC700]/80',
        },
      ];
      const { data } = await this.hubChatStore.getFromDateMessages({
        roomId: this.hubChatStore.chatId,
        date: dayjs(date).toISOString(),
        limit: 1,
      });
      if (data && data.length > 0) {
        this.$emit('locate-message', data[0].id);
      }
    },
  },
};
</script>
