<template>
  <div class="flex items-center justify-between gap-1 text-[#D9D9D9]">
    <div class="flex items-center text-xs">
      <BaseIconCurrency :currency="item.incomeCurrency" />
      <div class="ml-1">
        {{ moneyFormat(item.amount) }}
      </div>
    </div>
    <i class="fa-solid fa-arrow-down mr-1 text-xs text-[#B31414]" />
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: {
        name: String,
        nameIcon: String,
        amount: Number,
        incomeCurrency: String,
        downloadUrl: [String, null],
        exchangeRate: [Number, null],
      },
      required: true,
    },
  },
};
</script>
