<template>
  <div class="text-xs font-semibold">
    <div
      v-if="isDiffMonth"
      class="flex h-7 w-7 cursor-default items-center justify-center rounded-md border border-transparent text-[#707070]/40"
    >
      {{ day }}
    </div>
    <div
      v-else-if="item.entry.length"
      ref="more"
      class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-transparent transition-all active:scale-95 active:border-[#FED54A]"
      :class="getClass(item.entry.length)"
      data-cy="ef832cbad6c76a67"
      @click.stop="onMoreShow"
    >
      {{ day }}
    </div>
    <div
      v-else
      class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-transparent transition-all hover:bg-[#6A6537] hover:text-[#989898] active:scale-95 active:border-[#FED54A]"
      :class="[
        isToday
          ? 'text-[#e4b53d]'
          : isSameInit
            ? 'text-[#4a4a4a]'
            : 'text-white',
      ]"
      data-cy="357e47f442459677"
      @click="onOpenDay(item)"
    >
      {{ day }}
    </div>
  </div>
  <el-popover
    v-if="item.entry.length"
    :show-arrow="false"
    :width="324"
    popper-class="more-popper"
    :virtual-ref="more"
    :visible="moreShow"
    virtual-triggering
    :persistent="false"
  >
    <div class="flex select-none flex-col gap-1.5 p-2">
      <div class="flex items-center px-1.5">
        <div class="flex w-0 flex-1 items-center gap-2">
          <div
            class="cursor-pointer rounded-md p-1.5 text-sm font-semibold leading-none text-[#D9D9D9] transition-all hover:bg-white/5 active:scale-95"
            data-cy="39d388514116f790"
            @click="onOpenDay(item)"
          >
            {{ formatDate(date, 'DD MMM') }}
          </div>
          <div
            class="flex h-7 w-7 items-center justify-center rounded-5 bg-white/5"
          >
            {{ item.entry.length }}
          </div>
        </div>
        <BaseIconClose
          data-cy="f59003a9814443fc"
          @click.stop="moreShow = false"
        />
      </div>
      <div class="flex max-h-64 flex-col gap-1 overflow-y-auto">
        <OrganizationHubCalendarMainListItem
          v-for="entry in item.entry"
          :key="entry.id"
          :entry="entry"
          data-cy="17a06f7fbe0877b8"
          @click.stop="onView(entry)"
        />
      </div>
    </div>
  </el-popover>
</template>
<script>
import dayJS from 'dayjs';

const dayjs = dayJS.tz;

export default {
  props: {
    item: Object,
    month: Number,
  },
  setup() {
    const more = ref();
    const moreShow = ref(false);
    onClickOutside(
      more,
      () => {
        moreShow.value = false;
      },
      {
        ignore: ['.more-popper'],
      },
    );
    const hubCalendarStore = useHubCalendarStore();
    return { hubCalendarStore, more, moreShow };
  },
  data() {
    return {
      date: null,
    };
  },
  computed: {
    isDiffMonth() {
      return dayjs(this.item.date).month() !== this.month;
    },
    day() {
      return dayjs(this.item.date).date();
    },
    isToday() {
      return dayjs().isSame(dayjs(this.item.date), 'day');
    },
    initDate() {
      return this.hubCalendarStore.initDate;
    },
    isSameInit() {
      return dayjs(this.initDate).isSame(dayjs(this.item.date), 'day');
    },
  },
  methods: {
    onView(entry) {
      if (entry.id === 'create') {
        return;
      }
      if (entry.isPersonal) {
        return;
      }
      this.moreShow = false;
      this.hubCalendarStore.create(entry);
    },
    onOpenDay(item) {
      this.hubCalendarStore.dateTypeIndex = 0;
      this.hubCalendarStore.initDate = dayjs(item.date).toDate();
    },
    onMoreShow() {
      this.moreShow = true;
      this.date = this.item.date;
    },
    getClass(length) {
      return {
        'bg-[#ECD691] text-black': length > 0 && length <= 2,
        'bg-[#E6C867] text-black': length > 2 && length <= 4,
        'bg-[#E3C04E] text-black': length > 4 && length <= 6,
        'bg-[#E0B92C] text-black': length > 6 && length <= 8,
        'bg-[#C3A025] text-black': length > 8 && length <= 10,
        'bg-[#A6891E] text-white': length > 10 && length <= 15,
        'bg-[#8A7117] text-white': length > 15 && length <= 20,
        'bg-[#806300] text-black': length > 20,
        'border-[#FED54A]': this.moreShow,
      };
    },
  },
};
</script>
