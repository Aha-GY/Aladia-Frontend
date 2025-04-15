<template>
  <div
    v-if="!$device.isMobile"
    class="flex min-w-[20rem] flex-grow flex-col gap-4 overflow-hidden"
  >
    <OrganizationHubPaymentWidgetsPaymentMethodHeader @add="handleClickNew" />
    <div v-if="!loading">
      <div v-if="!noCards" class="relative flex w-full justify-center">
        <div class="-translate-y-5 scale-75">
          <PaymentCheckoutCompsCarouselList
            :show-set-default="false"
            @change="handleCarouseChange"
          />
        </div>
        <img
          v-if="currentPaymentMethodIsDefault"
          class="absolute right-0 top-2 h-3 w-[3rem]"
          src="~/assets/payment/default.svg"
        />
      </div>
      <div
        v-else
        class="flex h-full w-full items-center justify-center"
        data-cy="ee4ddb3ed5832d2c"
        @click="handleClickNew"
      >
        <div
          class="rounded-4 flex h-[8.375rem] w-[13.4375rem] cursor-pointer flex-col items-center justify-center gap-1 border border-[#707070] bg-[#737373]/10 text-[#707070]"
        >
          <i class="fa-light fa-add" />
          Add Card
        </div>
      </div>
    </div>
    <div v-else class="flex h-full items-center justify-center">
      <i class="fa-solid fa-spinner animate-spin text-2xl" />
    </div>
  </div>

  <div v-else class="flex w-full flex-shrink-0 flex-col gap-4 overflow-hidden">
    <OrganizationHubPaymentWidgetsPaymentMethodHeader @add="handleClickNew" />
    <div v-if="!loading">
      <div v-if="!noCards" class="relative flex w-full justify-center">
        <div class="-translate-y-5 scale-75">
          <PaymentCheckoutCompsCarouselList
            :show-set-default="false"
            @change="handleCarouseChange"
          />
        </div>
        <img
          v-if="currentPaymentMethodIsDefault"
          class="absolute -top-2 right-0 h-3 w-[3rem]"
          src="~/assets/payment/default.svg"
        />
      </div>
      <div
        v-else
        class="flex h-full w-full items-center justify-center"
        data-cy="d0317f286c11f70e"
        @click="handleClickNew"
      >
        <div
          class="rounded-4 flex h-[8.375rem] w-[13.4375rem] cursor-pointer flex-col items-center justify-center gap-1 border border-[#707070] bg-[#737373]/10 text-[#707070]"
        >
          <i class="fa-light fa-add" />
          Add Card
        </div>
      </div>
    </div>
    <div v-else class="flex h-full items-center justify-center">
      <i class="fa-solid fa-spinner animate-spin text-2xl" />
    </div>
  </div>
</template>

<script setup>
const paymentStore = usePaymentStore();
const noCards = computed(() => !paymentStore.paymentMethods.length);
const loading = computed(() => paymentStore.paymentMethodsFetchLoading);
const currentPaymentMethodIsDefault = computed(() => {
  if (!paymentStore.paymentMethods.length) {
    return false;
  } else {
    return !!paymentStore.paymentMethods[
      paymentStore.selectedPaymentMethodIndex
    ]?.isDefault;
  }
});
onBeforeMount(() => {
  paymentStore.getStripePaymentMethodsList();
});

function handleClickNew() {
  paymentStore.addCardDialog = true;
}

function handleCarouseChange(index) {
  paymentStore.selectedPaymentMethodIndex = index;
}
</script>
