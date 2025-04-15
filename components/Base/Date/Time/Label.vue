<template>
  <div
    class="group/input relative flex h-8 cursor-pointer items-center text-center transition-all active:scale-95"
    :class="$device.isMobile ? 'px-1 text-xs' : 'px-2 text-sm'"
  >
    <div v-if="!isTime" class="text-nowrap text-white">
      {{ formatDate(date, 'DD MMM YYYY') }}
    </div>
    <span v-if="isTime && !show" ref="timeRef" class="text-nowrap text-white">
      {{ formatDate(date, 'HH:mm') }}
    </span>
    <input
      v-if="isTime && show"
      ref="input"
      v-model="time"
      type="text"
      placeholder="HH:mm"
      class="bg-transparent leading-5 outline-none placeholder:text-10 placeholder:text-[#505050]"
      :style="{ width: labelWidth + 'px' }"
      @blur="onBlur"
      @keydown.enter="onEnter"
      @change="onChange"
      @input="onInput"
    />
    <!-- <span v-if="isTime" class="text-xs font-[100] leading-none text-white">
      {{ formatDate(date, 'a') }}
    </span> -->

    <div
      class="absolute bottom-0 left-0 right-0 flex h-[1px] justify-center bg-[#303030]/50 group-hover/input:bg-[#505050]"
    >
      <div
        class="h-full bg-[#937a32] transition-all duration-300"
        :class="show ? 'w-full' : 'w-0'"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    date: {
      type: Date,
      default: new Date(),
    },
    show: {
      type: Boolean,
      default: false,
    },
    isTime: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      time: '',
      oldTime: '',
      labelWidth: 0,
    };
  },
  watch: {
    show() {
      if (this.show) {
        this.time = formatDate(this.date, 'HH:mm');
        this.$nextTick(() => {
          this.$refs.input && this.$refs.input.focus();
        });
      } else {
        this.getLabelWidth();
      }
    },
  },
  mounted() {
    this.getLabelWidth();
  },
  methods: {
    onBlur() {
      if (this.time !== formatDate(this.date, 'HH:mm')) {
        const time = formatTimeInput(this.time, formatDate(this.date, 'HH:mm'));
        this.$emit('onChange', time);
      }
    },
    onEnter() {
      this.$refs.input.blur();
      this.$emit('hide');
    },
    onChange(event) {
      event.stopPropagation();
      event.preventDefault();
    },
    onInput(event) {
      const oldValue = this.oldTime.replace(/[^0-9]/g, '');
      let value = event.target.value.replace(/[^0-9]/g, ''); // 只允许输入数字
      let isEnterThree = false;
      // 如果第一位不是0, 1, 2，那么前面新增0
      if (value.length > 0 && !['0', '1', '2'].includes(value[0])) {
        value = `0${value}`;
      }
      // 第3位数字必须小于等于6，如果为6那么第四位必为0
      if (value.length > 2) {
        if (parseInt(value[2]) > 6) {
          isEnterThree = true;
          value = value.slice(0, 2);
        } else if (value[2] === '6' && value.length > 3) {
          value = `${value.slice(0, 3)}0`;
        }
      }
      // 最多只能输入4个数字
      if (value.length > 4) {
        value = value.slice(0, 4);
      }

      if (oldValue === value && value.length === 2 && !isEnterThree) {
        value = value.slice(0, 1);
        this.oldTime = '';
      }

      // 如果数字大于等于2个，那么在第二个后面新增‘:’
      if (value.length >= 2) {
        value = `${value.slice(0, 2)}:${value.slice(2)}`;
        this.oldTime = value;
      }

      this.time = value;
    },
    async getLabelWidth() {
      await sleep(400);
      if (this.$refs.timeRef) {
        const rect = this.$refs.timeRef.getBoundingClientRect();
        this.labelWidth = rect.width;
      }
    },
  },
};
</script>
