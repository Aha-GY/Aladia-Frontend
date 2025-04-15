<template>
  <div v-if="!autoStore.finishedSignup" class="flex h-full items-center">
    <BaseNoData />
  </div>
  <div v-else class="text-[#D9D9D9]">
    <div class="mb-4 text-lg font-semibold">Your Balance</div>

    <div class="grid grid-cols-[1.25rem_auto_6.25rem] items-center gap-1">
      <!-- title -->
      <i class="fa-light fa-scale-balanced w-4 text-base" />
      <div class="flex items-center gap-3">
        <span class="text-base">Total balance</span>
        <el-popover
          v-model:visible="tipOpen"
          trigger="hover"
          destroy-on-close
          placement="top-start"
          popper-class="no-padding"
          width="250"
        >
          <div class="p-2 text-xs">Todo: friendly tips for ExchangeRate</div>
          <template #reference>
            <i
              class="fa-square-info cursor-pointer text-xs text-[#989898] transition-all"
              :class="tipOpen ? 'fa-solid' : 'fa-light'"
            />
          </template>
        </el-popover>
      </div>

      <!-- balance value-->
      <div class="col-span-2 col-start-2 flex items-center text-xs">
        <BaseIconCurrency size="normal" :currency="currency" />
        <span class="ml-1">
          {{ moneyFormat(total) }}
        </span>
      </div>

      <div
        class="all-transition col-start-3 cursor-pointer justify-self-end text-xs text-[#fafafa] hover:opacity-80"
        @click="handleShowStripe"
      >
        See details
      </div>

      <div class="col-span-3 my-1 border-b border-[#D9D9D9]" />

      <!-- Escrow title -->
      <i class="fa-light fa-clock w-4 text-base" />
      <div class="col-span-2 text-base">Escrow balance(todo)</div>

      <!-- Escrow value-->
      <div class="col-span-2 col-start-2 flex items-center text-xs">
        <BaseIconCurrency size="normal" currency="usd" />
        <span class="ml-1">
          {{ moneyFormat(12345) }}
        </span>
      </div>
    </div>
  </div>

  <el-dialog
    :model-value="showStripe"
    :need-padding="false"
    align-center
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="26rem"
    destroy-on-close
    append-to-body
    :show-close="false"
    @open="handleInit"
  >
    <!-- header -->
    <div
      class="flex items-center justify-between rounded-t-md bg-[#0C0C0C] px-4 py-3.5"
    >
      <div class="bg-[#0C0C0C] text-base text-[#B0B0B0]">
        <i class="fa-regular fa-scale-balanced mr-2.5" />
        <span>Your Balance</span>
      </div>
      <BaseIconClose @click="showStripe = false" />
    </div>
    <!-- body -->
    <div v-loading="initLoading" class="min-h-32 p-2">
      <div id="balances-container" />
    </div>
  </el-dialog>
</template>

<script setup>
const autoStore = useAuthStore();
const paymentStore = usePaymentStore();
const hubPaymentStore = useHubPaymentStore();

const initLoading = ref(false);
const showStripe = ref(false);
const tipOpen = ref(false);
const total = computed(() => hubPaymentStore.balanceDatas?.total || 0);
const currency = computed(() => hubPaymentStore.balanceDatas?.currency);

onMounted(() => {
  // handleAndLoadBalance();
});

function handleInit() {
  handleAndLoadBalance();
}

function handleShowStripe() {
  showStripe.value = true;
}

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
