<template>
  <div class="relative">
    <BaseProgress
      :uni-key="uniKey"
      :diameter="30"
      :stroke-width="5"
      :inner-stroke-width="5"
      :animate-speed="100"
      :completed-steps="completedSteps"
      :total-steps="totalSteps"
      :start-color="textColor"
      :stop-color="textColor"
      inner-stroke-color="#393939"
    />
    <div
      class="absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center rounded-full text-10"
      :class="textColorClass"
    >
      {{ completedSteps }}
    </div>
    <div
      v-if="completedSteps !== totalSteps - 1"
      class="absolute left-3.5 top-8 z-0 w-[1px] border-l border-solid text-center"
      :style="{
        height: lineHeight,
        borderColor: textColor,
      }"
    />
  </div>
</template>

<script setup>
import { PAYMENT_STATUS } from '~/constant/payment';

const props = defineProps({
  uniKey: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: true,
  },
  completedSteps: {
    type: Number,
    required: true,
  },
  totalSteps: {
    type: Number,
    required: true,
  },
  lineHeight: {
    type: String,
    default: '24px',
  },
});

const textColor = computed(() => getProgressColor(props.status).color);
const textColorClass = computed(
  () => getProgressColor(props.status).colorClass,
);

function getProgressColor(status) {
  switch (status) {
    case PAYMENT_STATUS.SUCCESS.text:
      return {
        color: '#88C359',
        colorClass: 'transaction-progress-item-success',
      };
    case PAYMENT_STATUS.FAILED.text:
      return {
        color: '#ef4444',
        colorClass: 'transaction-progress-item-failed',
      };
    case PAYMENT_STATUS.PENDING.text:
    default:
      return {
        color: '#767675',
        colorClass: 'transaction-progress-item-default',
      };
  }
}
</script>
<style lang="scss">
.transaction-progress-item-success {
  color: #88c359;
}
.transaction-progress-item-failed {
  color: #ef4444;
}
.transaction-progress-item-default {
  color: #767675;
}
</style>
