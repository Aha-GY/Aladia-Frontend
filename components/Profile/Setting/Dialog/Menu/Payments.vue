<template>
  <ProfileSettingDialogCompsBox>
    <div class="flex justify-between">
      <div class="text-sm">
        {{ $t('payment.method.label') }}
      </div>
      <BaseButton
        icon="fa-solid fa-plus"
        label="$t:personal.profile.new"
        data-cy="add-payment-method"
        @click="handleClickNew"
      />
    </div>
    <div v-if="loading" class="flex justify-center">
      <i class="fa-solid fa-spinner animate-spin" />
    </div>
    <BaseNoData v-else-if="dataList.length === 0" class="py-3" />
    <ProfileSettingDialogCompsPaymentMethodItem
      v-for="dataItem in dataList"
      v-else
      :key="dataItem.paymentMethodId"
      :payment-method-item="dataItem"
    />
  </ProfileSettingDialogCompsBox>
</template>
<script setup>
const paymentStore = usePaymentStore();
const dataList = computed(() => paymentStore.paymentMethods);
const loading = computed(() => paymentStore.paymentMethodsFetchLoading);

onMounted(() => {
  paymentStore.initStripe();
  initMethods();
});

onBeforeUnmount(() => {
  // todo reset the store data
});

function handleClickNew() {
  paymentStore.addCardDialog = true;
}

async function initMethods() {
  await paymentStore.getStripePaymentMethodsList();
}
</script>
