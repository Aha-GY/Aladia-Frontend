<template>
  <div class="flex min-w-[17rem] flex-col gap-4 overflow-hidden">
    <OrganizationHubPaymentWidgetsPaymentBankHeader />
    <div v-if="loading" class="flex h-full items-center justify-center">
      <i class="fa-solid fa-spinner animate-spin text-2xl" />
    </div>
    <div v-else class="overflow-auto">
      <BaseNoData v-if="!bankList.length" />

      <OrganizationHubPaymentWidgetsPaymentBankItem
        v-for="bank in bankList"
        v-else
        :key="bank.id"
        :bank="bank"
      />
    </div>
  </div>
</template>

<script setup>
const paymentStore = usePaymentStore();

const loading = ref(false);
const bankList = computed(() => paymentStore.bankList);

onBeforeMount(() => {
  getData();
});

async function getData() {
  loading.value = true;
  await paymentStore.getBankAccounts();
  loading.value = false;
}
</script>
