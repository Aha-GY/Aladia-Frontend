<template>
  <div class="relative flex select-none items-center justify-center">
    <svg
      :width="size"
      :height="size"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp"
    >
      <circle
        :cx="center"
        :cy="center"
        :r="radius - 4"
        fill="none"
        class="base-circle stroke-[#333] stroke-[14]"
      />
      <path
        :d="getArcPath(limitedStartAngle, limitedEndAngle)"
        fill="none"
        class="stroke-[#dcb73d] stroke-[12]"
      />
      <g
        :transform="`translate(${getPositionFromAngle(limitedStartAngle).x}, ${getPositionFromAngle(limitedStartAngle).y})`"
        cursor="pointer"
        class="handle start-handle"
        @mousedown="startDragging('start', $event)"
      >
        <circle r="12" fill="#CFA200" class="transition-all duration-200" />
        <circle r="6" fill="#d5ceb1" class="transition-all duration-200" />
      </g>
      <g
        :transform="`translate(${getPositionFromAngle(limitedEndAngle).x}, ${getPositionFromAngle(limitedEndAngle).y})`"
        cursor="pointer"
        class="handle end-handle"
        @mousedown="startDragging('end', $event)"
      >
        <circle r="12" fill="#CFA200" class="transition-all duration-200" />
        <circle r="6" fill="#d5ceb1" class="transition-all duration-200" />
      </g>
    </svg>
    <div
      class="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      <div class="text-center text-xl">
        <div>{{ startHours }} ~ {{ endHours }}</div>
        <div>
          {{ $t('course.duration.hours') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    range: {
      type: Array,
      default: () => [1, 100],
      validator: (value) =>
        value.length === 2 &&
        value[0] >= 0 &&
        value[0] < value[1] &&
        value[1] <= 100,
    },
  },
  data() {
    return {
      size: 300,
      radius: 100,
      startAngle: 0,
      endAngle: 0,
      isDragging: false,
      activeHandle: null,
      maxHours: 100,
      minAngleDiff: 1,
      dragStartAngle: 0,
      dragStartPos: { x: 0, y: 0 },
    };
  },
  computed: {
    center() {
      return this.size / 2;
    },
    limitedStartAngle() {
      return Math.min(this.startAngle, this.endAngle);
    },
    limitedEndAngle() {
      return Math.max(this.endAngle, this.startAngle);
    },
    selectedHours() {
      const diff = this.getAngleDifference(
        this.limitedStartAngle,
        this.limitedEndAngle,
      );
      return Math.round((diff / 360) * this.maxHours);
    },
    startHours() {
      return Math.round((this.limitedStartAngle / 360) * this.maxHours);
    },
    endHours() {
      return Math.round((this.limitedEndAngle / 360) * this.maxHours);
    },
  },
  watch: {
    range: {
      immediate: true,
      handler(newRange) {
        this.startAngle = (newRange[0] / this.maxHours) * 360;
        this.endAngle = (newRange[1] / this.maxHours) * 360;
      },
    },
  },
  methods: {
    getPositionFromAngle(angle) {
      const adjustedAngle = angle - 90;
      const radians = adjustedAngle * (Math.PI / 180);
      return {
        x: this.center + this.radius * Math.cos(radians),
        y: this.center + this.radius * Math.sin(radians),
      };
    },
    getAngleFromPosition(x, y) {
      const dx = x - this.center;
      const dy = y - this.center;
      let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      if (angle < 0) {
        angle += 360;
      }
      return angle;
    },
    getAngleDifference(start, end) {
      const diff = end - start;
      return diff < 0 ? diff + 360 : diff;
    },
    getArcPath(start, end) {
      const startPos = this.getPositionFromAngle(start);
      const endPos = this.getPositionFromAngle(end);
      const diff = end - start;
      const largeArcFlag = Math.abs(diff) > 180 ? 1 : 0;
      const sweepFlag = diff > 0 ? 1 : 0;
      return `M ${startPos.x} ${startPos.y} A ${this.radius} ${this.radius} 0 ${largeArcFlag} ${sweepFlag} ${endPos.x} ${endPos.y}`;
    },
    startDragging(handle, event) {
      this.isDragging = true;
      this.activeHandle = handle;
      const rect = event.target.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      this.dragStartPos = { x, y };
      this.dragStartAngle =
        this.activeHandle === 'start' ? this.startAngle : this.endAngle;
    },
    handleMouseUp() {
      this.isDragging = false;
      this.activeHandle = null;
    },
    handleMouseMove(event) {
      if (!this.isDragging) {
        return;
      }
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const newAngle = this.getAngleFromPosition(x, y);

      // 计算一个小时对应的角度
      const minAngleDiff = (1 / this.maxHours) * 360;

      if (this.activeHandle === 'start') {
        // 开始时间滑块不能逆时针越过0点（12点）
        if (newAngle > this.endAngle) {
          this.startAngle = 0; // 限制到0点
        } else if (this.endAngle - newAngle < minAngleDiff) {
          // 如果角度差小于一个小时对应的角度，则不允许继续移动
          this.startAngle = this.endAngle - minAngleDiff;
          return this.handleMouseUp();
        } else {
          this.startAngle = newAngle;
        }
      } else if (this.activeHandle === 'end') {
        // 结束时间滑块不能顺时针越过12点（0点）
        if (newAngle < this.startAngle) {
          this.endAngle = 360; // 限制到12点
        } else if (newAngle - this.startAngle < minAngleDiff) {
          // 如果角度差小于一个小时对应的角度，则不允许继续移动
          this.endAngle = this.startAngle + minAngleDiff;
          return this.handleMouseUp();
        } else {
          this.endAngle = newAngle;
        }
      }

      const startValue = Math.round(
        (this.limitedStartAngle / 360) * this.maxHours,
      );
      const endValue = Math.round((this.limitedEndAngle / 360) * this.maxHours);
      this.$emit('change', [startValue, endValue]);
    },
  },
};
</script>

<style scoped>
.handle:hover circle:first-child {
  r: 14;
}

.handle:hover circle:nth-child(2) {
  r: 7;
}
</style>
