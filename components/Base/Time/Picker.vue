<template>
  <div
    ref="time"
    class="hide-scrollbar h-[10.625rem] overflow-y-auto rounded p-1 py-2 shadow-[0_6px_24px_rgba(0,0,0,0.06)] backdrop-blur"
  >
    <div class="flex flex-col gap-1.5">
      <div
        v-for="(item, index) in timeList"
        :key="index"
        class="group/item flex h-5 cursor-pointer items-center rounded-sm px-1 transition-all hover:bg-[#707070]/30"
        :class="time === item.time ? 'text-[#e4b53d]' : 'text-[#E5E5E5]'"
        data-cy="d608c1db6ac4244d"
        @click.stop="onChange(item.time)"
      >
        <span v-if="type === 'hh:mm'" class="text-xs leading-none">
          {{ item.name }}{{ item.unit }}
        </span>
        <span v-else class="text-xs leading-none">{{ item.time }}</span>
        <span v-if="startTime" class="ml-1 text-xs leading-none">
          ({{
            index + 1 > 3
              ? `${(index + 1) / 4} hrs`
              : `${(index + 1) * 15} mins`
          }})
        </span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      default: 'hh:mm',
    },
    time: String,
    startTime: String,
    lastTime: String,
    isSlice: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    timeList() {
      const startTime = this.startTime ? this.startTime : this.lastTime;
      const startTimes = startTime ? startTime.split(':') : [];
      const hours = [];
      if (this.isSlice) {
        hours.push(
          ...[
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20, 21, 22, 23,
          ].slice(startTimes[0] ? +startTimes[0] : 0),
        );
      } else {
        hours.push(
          ...this.moveElementsToEnd(
            [
              0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
              19, 20, 21, 22, 23,
            ],
            startTimes[0] ? +startTimes[0] : 0,
          ),
        );
      }
      // const hours = [
      //   0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
      //   20, 21, 22, 23,
      // ].slice(startTimes[0] ? +startTimes[0] : 0);
      // const hours = this.moveElementsToEnd(
      //   [
      //     0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
      //     20, 21, 22, 23,
      //   ],
      //   startTimes[0] ? +startTimes[0] : 0,
      // );
      const minutes = ['00', '15', '30', '45'];
      const times = [];
      hours.forEach((hour, m) => {
        minutes.forEach((min) => {
          if (m === 0 && startTimes[1]) {
            if (this.lastTime && min < startTimes[1]) {
              return;
            } else if (!this.lastTime && min <= startTimes[1]) {
              return;
            }
          }
          if (hour < 12) {
            times.push({
              name: `${hour === 0 ? 12 : hour}:${min}`,
              unit: 'am',
              time: `${hour < 10 ? `0${hour}` : hour}:${min}`,
            });
          } else {
            times.push({
              name: `${hour - 12 > 0 ? hour - 12 : 12}:${min}`,
              unit: 'pm',
              time: `${hour}:${min}`,
            });
          }
        });
      });
      if (!this.startTime) {
        times.splice(-1, 1);
      }
      return times;
    },
  },
  watch: {
    time() {
      this.onInit();
    },
  },
  mounted() {
    this.onInit();
  },
  methods: {
    onInit() {
      if (!this.time) {
        return;
      }
      const top = this.timeList.map((r) => r.time).indexOf(this.time);
      this.$refs.time.scrollTo({
        top: top * 26,
        behavior: `instant`,
      });
    },
    onChange(item) {
      this.$emit('onChange', item);
    },
    moveElementsToEnd(arr, count) {
      const removedElements = arr.splice(0, count);
      return arr.concat(removedElements);
    },
  },
};
</script>
