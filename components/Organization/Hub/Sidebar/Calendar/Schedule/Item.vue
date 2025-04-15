<template>
  <div class="flex gap-2 font-normal">
    <div
      class="flex h-9 w-8 items-center text-sm"
      :class="unavailable ? 'text-[#707070]' : 'text-white'"
    >
      {{ title }}
    </div>
    <div
      class="flex flex-1 flex-col gap-1.5 overflow-hidden transition-all duration-300"
      :style="{
        height: length ? `${46 * length - 8}px` : `36px`,
      }"
    >
      <div v-for="(time, m) in timeList" :key="m" class="flex gap-2">
        <div class="flex h-9 flex-1 items-center justify-center gap-4">
          <OrganizationHubSidebarCalendarScheduleTime
            v-model="time.startTime"
            :last-time="m === 0 ? '' : times[m - 1].endTime"
            @error="onError($event, m)"
          />
          <div
            class="flex h-0.5 w-1.5 items-center justify-center rounded-full bg-[#D9D9D9]"
          />
          <OrganizationHubSidebarCalendarScheduleTime
            v-model="time.endTime"
            :start-time="time.startTime"
            @error="onError($event, m)"
          />
        </div>

        <div class="flex h-9 w-16 items-center justify-end gap-0.5">
          <el-tooltip
            v-if="m === 0"
            content="Unavailable"
            effect="light"
            placement="bottom"
            :enterable="false"
          >
            <div
              class="flex h-5 w-5 cursor-pointer items-center justify-center rounded-5 bg-black/30 transition-all hover:bg-[#e2e2e2]/10 active:scale-95"
              data-cy="99b1e89d080862ac"
              @click="onUnavailable"
            >
              <i class="fa-regular fa-ban text-xs text-[#FAFAFA]" />
            </div>
          </el-tooltip>
          <el-tooltip
            v-if="m === 0 && lastTime <= '23:30'"
            content="Add another period"
            effect="light"
            placement="bottom"
            :enterable="false"
          >
            <div
              class="flex h-5 w-5 cursor-pointer items-center justify-center rounded-5 bg-black/30 transition-all hover:bg-[#e2e2e2]/10 active:scale-95"
              data-cy="d24a9b1633a250b8"
              @click="onAdd"
            >
              <i class="fa-regular fa-plus text-xs text-[#FAFAFA]" />
            </div>
          </el-tooltip>
          <el-tooltip
            v-if="m === 0"
            content="Duplicate"
            effect="light"
            placement="bottom"
            :enterable="false"
          >
            <div
              class="flex h-5 w-5 cursor-pointer items-center justify-center rounded-5 bg-black/30 transition-all hover:bg-[#e2e2e2]/10 active:scale-95"
              @click="onCopy"
            >
              <i class="fa-regular fa-copy text-xs text-[#FAFAFA]" />
            </div>
          </el-tooltip>
          <el-tooltip
            v-if="m !== 0"
            content="Delete"
            effect="light"
            placement="bottom"
            :enterable="false"
          >
            <div
              class="flex h-5 w-5 cursor-pointer items-center justify-center rounded-5 bg-black/30 transition-all hover:bg-[#e2e2e2]/10 active:scale-95"
              data-cy="6e1aeced79aad81f"
              @click="onRemove(m)"
            >
              <i class="fa-regular fa-minus text-xs text-[#FAFAFA]" />
            </div>
          </el-tooltip>
        </div>
      </div>
      <div v-if="!length" class="flex gap-2">
        <div class="flex h-9 flex-1 items-center justify-center rounded-md">
          <div class="text-xs text-[#707070]">
            {{
              $t(
                unavailable
                  ? 'event.schedule.empty'
                  : 'event.schedule.available',
              )
            }}
          </div>
        </div>

        <div class="flex h-9 w-16 items-center justify-end gap-0.5">
          <el-tooltip
            v-if="!unavailable"
            content="Unavailable"
            effect="light"
            placement="bottom"
            :enterable="false"
          >
            <div
              class="flex h-5 w-5 cursor-pointer items-center justify-center rounded-5 bg-black/30 transition-all hover:bg-[#e2e2e2]/10 active:scale-95"
              @click="onUnavailable"
            >
              <i class="fa-regular fa-ban text-xs text-[#FAFAFA]" />
            </div>
          </el-tooltip>
          <el-tooltip
            content="Add another period"
            effect="light"
            placement="bottom"
            :enterable="false"
          >
            <div
              class="flex h-5 w-5 cursor-pointer items-center justify-center rounded-5 bg-black/30 transition-all hover:bg-[#e2e2e2]/10 active:scale-95"
              data-cy="bfa83494c0d84a6d"
              @click="onAdd"
            >
              <i class="fa-regular fa-plus text-xs text-[#FAFAFA]" />
            </div>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);
export default {
  props: {
    title: String,
    times: Array,
  },
  data() {
    return {
      errors: [],
    };
  },
  computed: {
    timeList() {
      return this.times.filter((r) => r);
    },
    length() {
      return this.timeList.length;
    },
    lastTime() {
      if (this.times.length) {
        return this.times[this.times.length - 1].endTime;
      } else {
        return '';
      }
    },
    unavailable() {
      return !!this.times.filter((r) => !r).length;
    },
  },
  // watch: {
  //   unavailable() {
  //     this.times.splice(0, this.times.length);
  //   },
  // },
  methods: {
    onRemove(index) {
      this.times.splice(index, 1);
    },
    onUnavailable() {
      this.times.splice(0, this.times.length);
      this.times.push(false);
      this.$emit('change');
    },
    onAdd() {
      if (this.unavailable) {
        this.times.splice(0, this.times.length);
        return;
      }
      if (this.lastTime) {
        const endTime =
          this.lastTime >= '23:00'
            ? '23:45'
            : dayjs(this.lastTime, 'HH:mm').add(1, 'hour').format('HH:mm');
        this.times.push({
          startTime: this.lastTime,
          endTime,
        });
      } else {
        this.times.push({
          startTime: '08:00',
          endTime: '18:00',
        });
      }
      this.$emit('change');
    },
    onCopy() {
      const times = this.times.filter(
        (res, index) => !this.errors.includes(index),
      );
      this.$emit('copy', times);
    },
    onError($event, index) {
      const _index = this.errors.indexOf(index);
      if ($event) {
        if (_index === -1) {
          this.errors.push(index);
        }
      } else {
        if (_index !== -1) {
          this.errors.splice(_index, 1);
        }
      }

      this.$emit('error', $event);
    },
  },
};
</script>
