<template>
  <div class="h-full min-w-56 md:flex-1">
    <div class="mb-4 flex items-center gap-2">
      <i
        class="fa-solid text-base"
        :class="icon"
        :style="{
          color: color,
        }"
      />
      {{ $t(title) }}
    </div>
    <div class="mb-4 flex items-center gap-4">
      <div class="shrink-0 text-xl font-medium">{{ value }}</div>
      <div class="flex items-center gap-1 text-sm text-[#39816d]">
        <i class="fa-solid fa-caret-up" />
        {{ (increase || 0).toFixed(2) }}%
      </div>
    </div>
    <div class="mb-2 h-1 rounded-full bg-white/10">
      <div
        class="h-full rounded-full transition-all duration-300"
        :style="{
          backgroundColor: color,
          width: `${percentage}%`,
        }"
      />
    </div>
    <div class="mb-2 truncate text-xs text-white/50" v-html="tip" />
    <div class="mb-2 rounded bg-white/5 p-1.5">
      <div class="mb-0.5 text-xs text-white/60">
        {{ $t('space.price.unit') }}
      </div>
      <div class="mb-1 text-13">{{ `${currencySymbol} ${price}` }}</div>
      <div class="mb-0.5 text-xs text-white/60">
        {{ $t('space.price.due') }}
      </div>
      <div class="text-13">{{ `${currencySymbol} ${amount}` }}</div>
    </div>
  </div>
</template>

<script>
import { STRIPE_COUNTRIES } from '~/constant/countries';

export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    tip: {
      type: String,
      required: true,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    increase: {
      type: Number,
      default: 0,
    },
    price: {
      type: String,
      default: '',
    },
    amount: {
      type: String,
      default: '',
    },
    date: {
      type: String,
      default: '',
    },
    currency: {
      type: String,
      default: 'usd',
    },
  },
  setup() {
    const hubSpaces = useHubSpacesStore();
    const authStore = useAuthStore();
    return { hubSpaces, STRIPE_COUNTRIES, authStore };
  },
  computed: {
    currencySymbol() {
      const currencyItem = getCountryItemByCurrency(
        this.currency,
        STRIPE_COUNTRIES,
      );
      return currencyItem.currency_symbol;
    },
  },
};
</script>
