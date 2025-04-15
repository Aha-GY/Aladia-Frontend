<template>
  <div v-if="!autoStore.finishedSignup" class="flex h-full items-center">
    <BaseNoData />
  </div>
  <div
    v-else
    v-show="!initLoading"
    class="h-[13.3125rem] w-[24rem] flex-shrink-0 overflow-y-auto overflow-x-hidden px-2"
  >
    <div id="balances-container" />
  </div>
  <div v-if="initLoading" class="flex h-full items-center justify-center">
    <i class="fa-solid fa-spinner animate-spin text-2xl" />
  </div>
</template>

<script setup>
const autoStore = useAuthStore();
const initLoading = ref(false);
const paymentStore = usePaymentStore();

onMounted(() => {
  handleAndLoadBalance();
});

async function handleAndLoadBalance() {
  try {
    if (!autoStore.finishedSignup) {
      return;
    }
    initLoading.value = true;
    await paymentStore.initStripeBalancesElement('balances-container');
  } catch (err) {
    console.log('err', err);
  } finally {
    setTimeout(() => {
      initLoading.value = false;
    }, 1000);
  }
}
</script>
