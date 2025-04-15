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
          <i :class="icons[hubChatStore.rightSiderType]" />
          {{ titles[hubChatStore.rightSiderType] }}
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
          v-if="type !== 'link'"
          v-model:visible="showFilter"
          :width="180"
          trigger="click"
          placement="bottom-end"
        >
          <template #reference>
            <div
              class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-white/80 transition-all hover:bg-white/5 active:scale-95"
            >
              <i class="fa-regular fa-filter" />
            </div>
          </template>
          <div class="flex flex-col gap-1 p-1 text-white/80">
            <div
              v-for="key in Object.keys(types)"
              :key="key"
              class="flex cursor-pointer items-center gap-2 rounded p-2 text-sm hover:bg-white/10 active:scale-95"
              @click="onFilterType(key)"
            >
              <BaseCheckboxStyle
                :state="
                  checkedTypes.includes(key) ? 'correctChecked' : 'unchecked'
                "
              />
              <span>{{ types[key] }}</span>
            </div>
          </div>
        </el-popover>

        <el-popover
          v-if="type !== 'link'"
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
  props: {
    type: String,
  },
  setup() {
    const hubChatStore = useHubChatStore();
    return { hubChatStore };
  },
  data() {
    return {
      icons: {
        media: 'fa-regular fa-grid ',
        file: 'fa-regular fa-file',
        link: 'fa-regular fa-link',
      },
      titles: {
        media: 'Photo&Video',
        file: 'Files',
        link: 'Shared Links',
      },
      showFilter: false,
      mediaTypes: {
        image: 'Photos',
        video: 'Videos',
        gif: 'GIF',
      },
      fileTypes: {
        pdf: 'PDF',
        doc: 'DOC',
        csv: 'CSV',
      },
      checkedTypes: [],
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
    onFilterType(key) {
      if (this.checkedTypes.includes(key)) {
        this.checkedTypes = this.checkedTypes.filter((item) => item !== key);
      } else {
        this.checkedTypes.push(key);
      }
      this.$emit('filter-type', this.checkedTypes);
      this.showFilter = false;
    },
    async changeDate(date) {
      const dateFormat = dayjs(date).toISOString();
      this.showDatepicker = false;
      this.$emit('filter-date', dateFormat);
    },
  },
};
</script>
