<template>
  <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
    <OrganizationHubPaymentWidgetsSvgCircle />
    <div
      class="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center"
    >
      <div class="text-[1.4375rem] font-semibold">
        {{ moneyFormatCut(data, 5) }} {{ currency }}
      </div>
      <div class="text-center text-xs opacity-80">{{ label }}</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: [String, Number],
  label: String,
  currency: String,
});
const currency = props.currency || '$';
</script>
