<template>
  <el-popover
    v-model:visible="open"
    trigger="hover"
    destroy-on-close
    placement="top"
    width="13rem"
    popper-class="no-padding"
    :disabled="!shouldShowTooltip"
    :popper-options="{
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [-37, 0],
          },
        },
      ],
    }"
  >
    <!-- Tooltip Content -->
    <div class="flex items-center gap-1 p-2 text-xs">
      <BaseIconCurrency :currency="currency" :size="size" />
      <span :class="{ 'font-bold': isBold }">
        {{ moneyFormat(money) }}
      </span>
    </div>
    <!-- Reference Element -->
    <template #reference>
      <div
        class="flex items-center gap-1"
        :class="[
          { 'font-bold': isBold },
          shouldShowTooltip ? 'cursor-pointer' : 'cursor-default',
        ]"
      >
        <BaseIconCurrency
          v-if="showCurrency"
          :currency="currency"
          :size="size"
        />
        <span v-if="isNegative">- {{ valueForDisplay }}</span>
        <span v-else>{{ valueForDisplay }}</span>
      </div>
    </template>
  </el-popover>
</template>

<script setup>
const props = defineProps({
  money: {
    type: [String, Number],
    required: true,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  size: {
    type: String,
    default: 'small',
  },
  showCurrency: {
    type: Boolean,
    default: true,
  },
  isBold: {
    type: Boolean,
    default: false,
  },
  isNegative: {
    type: Boolean,
    default: false,
  },
});

const open = ref(false);
const valueForDisplay = computed(() => moneyFormatCut(props.money));
// Determine if the tooltip should be shown based on displayValue
const shouldShowTooltip = computed(
  () =>
    valueForDisplay.value.includes('M') || valueForDisplay.value.includes('B'),
);
</script>
