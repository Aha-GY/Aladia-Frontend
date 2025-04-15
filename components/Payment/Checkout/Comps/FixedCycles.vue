<template>
  <el-popover
    ref="cycleRef"
    trigger="click"
    :placement="placement"
    :offset="5"
    :width="0"
    :disabled="readOnly"
    @show="show = true"
    @hide="show = false"
  >
    <template #reference>
      <div
        class="flex items-center gap-2 rounded border border-white/20 bg-black/50 px-1.5 py-0.5 text-13 text-white/70"
        :class="
          readOnly ? 'cursor-not-allowed' : 'cursor-pointer hover:text-white'
        "
      >
        <i class="fa-light fa-calendar-days" />
        <div>
          {{ formatDate(cycle.startDate, 'DD MMM YY') }} -
          {{ formatDate(cycle.endDate, 'DD MMM YY') }}
        </div>
      </div>
    </template>
  </el-popover>
</template>

<script setup>
defineProps({
  cycle: {
    type: Object,
    required: true,
  },
  placement: {
    type: String,
    default: 'bottom',
  },
  showSeat: {
    type: Boolean,
    default: false,
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
});

const cycleRef = ref(null);
defineExpose({
  hide: () => cycleRef.value.hide(),
});
</script>
