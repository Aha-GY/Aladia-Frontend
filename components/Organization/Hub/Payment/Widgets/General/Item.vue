<template>
  <div class="flex h-full w-60 flex-col justify-between py-3">
    <div class="relative flex items-center gap-2">
      <i class="fa-light" :class="iconClass" />
      {{ $t(title) }}
      <div
        class="absolute right-0 top-1/2 z-10 -translate-y-1/2"
        data-cy="a32aaecae3bb8770"
        @click="$emit('change')"
      >
        <OrganizationHubPaymentWidgetsGeneralPie :data="data" :color="color" />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-1 border-b border-[#D9D9D9] py-1">
        <div class="flex-1 text-[1.625rem]">
          {{ moneyFormatCut(number, 5) }} {{ currency }}
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
        data-cy="f66658ad3632514c"
        @click="hubPaymentStore.index = 3"
      >
        <img src="~/assets/payment/card.png" class="w-10" alt="" />
      </div>
      <BaseButton
        type="secondary"
        :label="label"
        data-cy="c44dfb5afc3d8345"
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
    ? formatDate(hubPaymentStore.startDate, 'DD MMM YYYY')
    : '----',
);

const isIncrease = computed(() => props.ratio > 0);
const noRatio = computed(() => props.ratio === '--');
</script>
