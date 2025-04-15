<template>
  <div class="relative mb-3 text-[#D9D9D9]">
    <div
      class="transition-all duration-300"
      :class="hubPaymentStore.open ? 'h-[15.3125rem]' : 'h-0 opacity-0'"
    >
      <OrganizationHubPaymentWidgetsGeneral v-if="activeIndex === 0" />
      <OrganizationHubPaymentWidgetsSpending v-if="activeIndex === 1" />
      <OrganizationHubPaymentWidgetsIncome v-if="activeIndex === 2" />
      <OrganizationHubPaymentWidgetsPayment v-if="activeIndex === 3" />
    </div>
    <div
      v-if="!$device.isMobile"
      class="absolute -bottom-8 left-1/2 z-10 translate-x-1/2"
    >
      <!-- buttons of the slider -->
      <div v-if="hubPaymentStore.open" class="flex items-center gap-0.5">
        <div
          v-for="(item, n) in 4"
          :key="item"
          class="flex h-4 w-4 items-center justify-center"
        >
          <div
            class="h-2 w-2 cursor-pointer rounded-full bg-[#707070] transition-all duration-300"
            :class="
              n === activeIndex
                ? 'h-3 w-3 bg-[#D9D9D9]'
                : 'hover:h-2.5 hover:w-2.5'
            "
            data-cy="ef221739f30ab691"
            @click="hubPaymentStore.switchChartIndex(n)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const hubPaymentStore = useHubPaymentStore();
const activeIndex = computed(() => hubPaymentStore.index);
</script>
