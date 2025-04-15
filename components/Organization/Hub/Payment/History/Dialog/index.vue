<template>
  <client-only>
    <el-dialog
      v-model="model"
      :show-close="false"
      append-to-body
      destroy-on-close
      align-center
      :width="$device.isMobile ? '22rem' : '28.125rem'"
      class="overflow-hidden !rounded-5"
      @closed="handleClosedDialog"
    >
      <!-- title navigation -->
      <OrganizationHubPaymentHistoryDialogCompsNavigation
        :view-all-total="viewAllTotal"
        @close="handleClockDialog"
      />
      <!-- body -->
      <div class="overflow-hidden">
        <transition :name="slideLeft ? 'slide-fade-left' : 'slide-fade-right'">
          <OrganizationHubPaymentHistoryDialogTransactionsSpending
            v-if="dataType === DIALOG_TITLE_TYPES.TRANS_SPENDING"
            :item="cacheData"
            @close="handleClockDialog"
          />
          <OrganizationHubPaymentHistoryDialogTransactionsIncome
            v-else-if="dataType === DIALOG_TITLE_TYPES.TRANS_INCOME"
            :item="cacheData"
            @close="handleClockDialog"
          />
          <OrganizationHubPaymentHistoryDialogSubscriptionsSpending
            v-else-if="dataType === DIALOG_TITLE_TYPES.SUB_SPENDING"
            :item="cacheData"
            @close="handleClockDialog"
          />
          <OrganizationHubPaymentHistoryDialogSubscriptionsIncome
            v-else-if="dataType === DIALOG_TITLE_TYPES.SUB_INCOME"
            :item="cacheData"
            @close="handleClockDialog"
          />
          <OrganizationHubPaymentHistoryDialogPayout
            v-else-if="dataType === DIALOG_TITLE_TYPES.PAYOUT"
            :item="cacheData"
            @close="handleClockDialog"
          />
          <OrganizationHubPaymentHistoryDialogCustomers
            v-else-if="dataType === DIALOG_TITLE_TYPES.CUSTOMER"
            :item="cacheData"
            @close="handleClockDialog"
          />
          <OrganizationHubPaymentHistoryDialogPayoutViewAllTransaction
            v-else-if="dataType === DIALOG_TITLE_TYPES.PAYOUT_VIEW_ALL_TRANS"
            :item="cacheData"
            @close="handleClockDialog"
          />
          <!-- TODO: 
            ViewAllTransaction and TransactionViewAll should be one public component in the future:
            loading inside, and Infinite Scroll to load more data
          -->
          <OrganizationHubPaymentHistoryDialogCustomerTransactionViewAll
            v-else-if="dataType === DIALOG_TITLE_TYPES.CUS_VIEW_ALL_TRANS"
            :item="cacheData"
            @close="handleClockDialog"
          />
          <OrganizationHubPaymentHistoryDialogCustomerSubscriptionViewAll
            v-else-if="dataType === DIALOG_TITLE_TYPES.CUS_VIEW_ALL_SUBS"
            :item="cacheData"
            @close="handleClockDialog"
          />
        </transition>
      </div>
    </el-dialog>
  </client-only>
</template>
<script setup>
import { DIALOG_TITLE_TYPES } from '~/constant/payment';

const model = defineModel({
  type: Boolean,
  required: true,
});
const hubPaymentStore = useHubPaymentStore();
const cacheData = ref(null);
const viewAllTotal = ref(0);
const dataId = ref(null);
const dataType = ref(null);
const slideLeft = ref(true);

const dialogNavHistory = computed(() => hubPaymentStore.dialogNavHistory);

console.log('cacheData', cacheData.value);
console.log('viewAllTotal', viewAllTotal.value);

watch(
  () => dialogNavHistory.value,
  (newData, oldData) => {
    if (newData.length === 0) {
      return;
    }
    if (newData.length > oldData.length) {
      slideLeft.value = true;
    } else {
      slideLeft.value = false;
    }
    const targetData = newData[newData.length - 1];
    console.log('targetData', targetData);
    cacheData.value = targetData.cacheData;
    viewAllTotal.value = targetData?.length || 0;
    dataId.value = targetData?.id;
    dataType.value = targetData.dataType;
  },
  {
    deep: true,
  },
);

function handleClockDialog() {
  model.value = false;
}

function handleClosedDialog() {
  hubPaymentStore.dialogNavHistory = [];
}
</script>
