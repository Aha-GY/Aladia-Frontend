<template>
  <!-- 返回一个带国家旗帜(根据货币) + 货币符号(opt) + 货币简称 -->
  <div
    class="flex items-center"
    :class="{
      'text-xs': size === 'small',
      'text-sm': size === 'normal',
      'text-base': size === 'big',
    }"
  >
    <CountryFlag
      v-if="size === 'big'"
      :country="countryItem.alpha2"
      :size="size"
      class="-translate-x-1.5 scale-75"
    />
    <span v-else-if="size === 'normal'" class="pb-1">
      <CountryFlag :country="countryItem.alpha2" :size="size" />
    </span>
    <span v-else class="pt-1">
      <CountryFlag :country="countryItem.alpha2" :size="size" />
    </span>

    <span
      v-if="countryItem.currency_symbol === countryItem.currency_code"
      class="w-1"
    />
    <span v-else class="px-1">
      {{ countryItem.currency_symbol }}
    </span>
    <span>{{ countryItem.currency_code }}</span>
  </div>
</template>
<script setup>
import CountryFlag from 'vue-country-flag-next';

import { STRIPE_COUNTRIES } from '~/constant/countries';

const props = defineProps({
  // ISO_4217
  currency: {
    type: String,
    default: 'USD',
    required: true,
  },
  size: {
    type: String,
    // small, normal, big
    default: 'small',
  },
});

const countryItem = computed(() =>
  getCountryItemByCurrency(props.currency, STRIPE_COUNTRIES),
);
</script>
