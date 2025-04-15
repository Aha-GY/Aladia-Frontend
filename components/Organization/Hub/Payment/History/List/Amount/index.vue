<template>
  <div class="flex w-full items-center justify-between gap-1">
    <div class="flex items-center text-xs">
      <BaseIconCurrency currency="USD" />
      <div class="ml-1">
        {{ moneyFormat(item.totalAmount) }}
      </div>
    </div>
    <i
      v-if="isIcon"
      class="fa-solid mr-1"
      :class="
        isSpending
          ? 'fa-arrow-down text-[#B31414]'
          : 'fa-arrow-up text-[#44AD1F]'
      "
    />
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
    isIcon: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const hubPaymentStore = useHubPaymentStore();
    return { hubPaymentStore };
  },
  computed: {
    isSpending() {
      return !this.item.isIncoming;
    },
  },
};
</script>
