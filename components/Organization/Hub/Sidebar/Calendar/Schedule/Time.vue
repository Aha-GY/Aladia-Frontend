<template>
  <el-popover
    v-model:visible="show"
    trigger="click"
    :show-arrow="false"
    placement="bottom"
    :offset="5"
    :persistent="false"
  >
    <template #reference>
      <div
        class="group/item relative cursor-pointer rounded-md p-1 px-4 text-center text-white transition-all hover:bg-white/5 active:scale-95"
        :class="isError ? 'bg-[#8c1d18]' : ''"
      >
        <span class="text-sm">{{ modelValue }}</span>
        <!-- <span class="text-xs">
          {{ unit }}
        </span> -->
        <!-- <BaseLine v-if="show" :active="show" /> -->
      </div>
    </template>
    <BaseTimePicker
      :time="modelValue"
      :start-time="startTime"
      :last-time="lastTime"
      type="HH:mm"
      @on-change="onChange"
    />
  </el-popover>
</template>
<script>
export default {
  props: {
    modelValue: String,
    startTime: String,
    lastTime: String,
  },
  data() {
    return {
      show: false,
    };
  },
  computed: {
    time() {
      const time = this.modelValue.split(':');
      return time[0] > 12
        ? `${zeroFormat(time[0] - 12)}:${time[1]}`
        : this.modelValue;
    },
    unit() {
      const time = this.modelValue.split(':');
      return time[0] > 12 ? 'pm' : 'am';
    },
    isError() {
      return (
        (this.startTime && this.startTime >= this.modelValue) ||
        (this.lastTime && this.lastTime > this.modelValue)
      );
    },
  },
  watch: {
    isError() {
      this.$emit('error', this.isError);
    },
  },
  methods: {
    onChange(item) {
      this.$emit('update:modelValue', item);
      this.show = false;
    },
  },
};
</script>
