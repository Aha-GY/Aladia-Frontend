<template>
  <div class="flex items-center justify-between text-xs text-[#D9D9D9]">
    <div class="flex items-center text-xs">
      <BaseIconCurrency :currency="item.incomeCurrency" />
      <div class="ml-1">
        {{ moneyFormat(item.amount) }}
      </div>
    </div>

    <div
      ref="buttonRef"
      class="flex h-4 w-4 cursor-pointer items-center justify-center rounded transition-all hover:!bg-white/10"
      @mouseenter="open = true"
      @mouseleave="open = false"
    >
      <i class="fa-solid fa-info text-[#B0B0B0]" />
    </div>

    <BasePopup
      :open="open"
      :button-ref="buttonRef"
      placement="bottom-start"
      :width="400"
      @close="open = false"
    >
      <div class="p-2 text-sm text-[#D9D9D9]">
        <div class="mb-2.5 font-semibold">
          {{ $t('category.exchange.rate') }}
        </div>
        <div class="flex">
          <div class="flex items-center">
            <BaseIconCurrency :currency="item.courseCurrency" />
            <span>1.00</span>
          </div>
          <span>-></span>
          <div class="flex items-center">
            <BaseIconCurrency :currency="item.incomeCurrency" />
            <span>{{ item.exchangeRate }}</span>
          </div>
        </div>
      </div>
    </BasePopup>
  </div>
</template>

<script>
import getSymbolFromCurrency from 'currency-symbol-map';

export default {
  props: {
    item: {
      type: {
        name: String,
        nameIcon: String,
        amount: Number,
        incomeCurrency: String,
        courseCurrency: String,
        downloadUrl: [String, null],
        exchangeRate: [Number, null],
      },
      required: true,
    },
  },
  setup() {
    const open = ref(false);
    const buttonRef = ref(null);

    return { open, buttonRef };
  },
  computed: {
    currency() {
      return this.item.currency;
    },
    exchangeRes() {
      const { currency, exchangeRate } = this.item.incomeDetail;

      return `${getSymbolFromCurrency(currency)} ${exchangeRate} ${currency.toUpperCase()}`;
    },
  },
};
</script>
