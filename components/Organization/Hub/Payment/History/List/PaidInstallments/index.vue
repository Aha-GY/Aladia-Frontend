<template>
  <div class="group flex items-center gap-2 overflow-hidden">
    <div class="relative">
      <BaseProgress
        :diameter="32"
        :stroke-width="5"
        :inner-stroke-width="5"
        :animate-speed="100"
        :completed-steps="currentStep"
        :total-steps="totalStep"
        :start-color="textColor"
        :stop-color="textColor"
        inner-stroke-color="#393939"
      />
      <i
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm"
        :class="iconClass"
      />
    </div>
    <span v-if="currentStep !== undefined">{{ currentStep }}</span>
    <span v-if="text !== undefined" class="text-[#707070]">{{ $t(text) }}</span>
  </div>
</template>

<script setup>
import { PAYMENT_STATUS } from '~/constant/payment';

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
  currentStep: {
    type: Number,
    default: 0,
  },
  totalStep: {
    type: Number,
    default: 10,
  },
  text: {
    type: String,
  },
});
const textColor = computed(() => getProgressColor(props.status).color);
const iconClass = computed(() => getProgressColor(props.status).iconClass);

function getProgressColor(status) {
  switch (status) {
    case PAYMENT_STATUS.ACTIVE.text:
      if (props.currentStep === 0) {
        return {
          color: '#d9d9d9',
          iconClass:
            'fa-solid fa-circle-xmark transaction-progress-item-cancel-color',
        };
      } else {
        return {
          color: '#88C359',
          iconClass:
            'fa-solid fa-circle-check transaction-progress-item-success-color',
        };
      }
    case PAYMENT_STATUS.PAST_DUE.text:
      return {
        color: '#ef4444',
        iconClass:
          'fa-solid fa-circle-exclamation transaction-progress-item-failed-color',
      };
    case PAYMENT_STATUS.CANCELED.text:
      return {
        color: '#d9d9d9',
        iconClass:
          'fa-solid fa-circle-xmark transaction-progress-item-cancel-color',
      };
    case PAYMENT_STATUS.UNPAID.text:
    default:
      return {
        color: '#a75527',
        iconClass:
          'fa-solid fa-circle-clock transaction-progress-item-unpaid-color',
      };
  }
}
</script>
<style>
.transaction-progress-item-success-color {
  color: #88c359;
}
.transaction-progress-item-failed-color {
  color: #ef4444;
}
.transaction-progress-item-unpaid-color {
  color: #a75527;
}
.transaction-progress-item-cancel-color {
  color: #d9d9d9;
}
.transaction-progress-item-default-color {
  color: #767675;
}
</style>
