<template>
  <div class="flex h-full w-60 flex-col justify-between p-3">
    <div class="relative flex items-center gap-2">
      <i class="fa-light" :class="iconClass" />
      {{ title }}
      <div
        v-if="title !== 'Total Balance'"
        class="absolute right-0 top-1/2 z-10 -translate-y-1/2"
        data-cy="b8f27a7f403e9d21"
        @click="$emit('change')"
      >
        <OrganizationHubPaymentWidgetsGeneralPie :data="data" :color="color" />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-1 border-b border-[#D9D9D9] py-1">
        <div class="flex-1 text-[1.625rem]">
          {{ moneyFormat(number) }} {{ currency }}
        </div>
        <div
          v-if="!noRatio"
          class="flex items-center gap-0.5"
          :class="isIncrease ? 'text-[#88C359]' : 'text-[#DA4242]'"
        >
          <div class="flex h-4 w-4 items-center justify-center">
            <i
              class="fa-solid fa-caret-up"
              :class="isIncrease ? '' : 'rotate-180'"
            />
          </div>
          {{ Number(ratio) ? Math.abs(ratio.toFixed(2)) : ratio }}%
        </div>
      </div>
      <div v-if="!noRatio" class="text-xs text-[#707070]">
        {{ $t('filter.payment.decrease.from', { date: startDate }) }}
      </div>
      <div v-else class="text-xs opacity-0">o</div>
    </div>

    <div class="relative flex justify-end">
      <div
        v-if="title === 'Spending'"
        class="absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer shadow-[0px_6px_4px_rgba(0,0,0,0.25)] transition-all hover:scale-[1.15]"
        data-cy="f3a9ff7bdfb72609"
        @click="hubPaymentStore.index = 3"
      >
        <img src="~/assets/payment/card.png" class="w-10" alt="" />
      </div>
      <BaseButton
        type="secondary"
        :label="label"
        data-cy="cdc6fc1f44c256d2"
        @click="$emit('change')"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  iconClass: {
    type: String,
    default: 'scale-balanced',
  },
  title: {
    type: String,
    default: '',
  },
  number: [String, Number],
  ratio: [String, Number],
  label: {
    type: String,
    default: '',
  },
  data: Array,
  color: Array,
  currency: {
    type: String,
    default: '$',
  },
});

const hubPaymentStore = useHubPaymentStore();
const startDate = computed(() =>
  hubPaymentStore.startDate
    ? formatDate(hubPaymentStore.startDate, 'MMMM YYYY')
    : '----',
);
const isIncrease = computed(() => props.ratio > 0);
const noRatio = computed(() => props.ratio === '--');
</script>
