<template>
  <div class="relative">
    <div
      v-if="props.status === PAYMENT_STATUS.COMPLETED.text"
      class="relative flex h-7 w-7 items-center justify-center rounded-full bg-[#88C359]"
    >
      <div
        class="absolute flex h-5 w-5 items-center justify-center rounded-full bg-black"
      >
        <div
          class="flex h-4 w-4 items-center justify-center rounded-full bg-[#88C359]"
        >
          <div
            class="flex h-3 w-3 items-center justify-center rounded-full bg-black"
          >
            <i class="fa-regular fa-circle-check text-[#88C359]" />
          </div>
        </div>
      </div>
    </div>
    <div
      v-else-if="
        props.status === PAYMENT_STATUS.PENDING.text ||
        props.status === PAYMENT_STATUS.REFUNDED.text
      "
    >
      <div
        class="relative flex h-7 w-7 items-center justify-center rounded-full bg-[#7D7D7B]"
      >
        <div
          class="absolute flex h-5 w-5 items-center justify-center rounded-full bg-black"
        >
          <div
            class="flex h-4 w-4 items-center justify-center rounded-full bg-[#7D7D7B]"
          >
            <div
              class="flex h-3 w-3 items-center justify-center rounded-full bg-black"
            >
              <i class="fa-regular fa-circle-minus text-[#7D7D7B]" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="relative flex h-7 w-7 items-center justify-center rounded-full bg-[#EF4444]"
    >
      <div
        class="absolute flex h-5 w-5 items-center justify-center rounded-full bg-black"
      >
        <div
          class="flex h-4 w-4 items-center justify-center rounded-full bg-[#EF4444]"
        >
          <div
            class="flex h-3 w-3 items-center justify-center rounded-full bg-black"
          >
            <i class="fa-regular fa-circle-xmark text-[#EF4444]" />
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="showLine"
      class="absolute left-3.5 top-10 z-0 w-[2px] border-l border-solid text-center"
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
  status: {
    type: String,
    required: true,
  },
  lineHeight: {
    type: String,
    default: '24px',
  },
  showLine: {
    type: Boolean,
    default: true, // Show line by default
  },
});
const textColor = computed(() => getProgressColor(props.status).color);
function getProgressColor(status) {
  switch (status) {
    case PAYMENT_STATUS.COMPLETED.text:
      return {
        color: '#88C359',
      };
    case PAYMENT_STATUS.PENDING.text:
    default:
      return {
        color: '#767675',
      };
  }
}
</script>
