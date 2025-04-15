<template>
  <BaseTable
    id="hub-table-expand"
    v-loading="loading"
    :row-class-name="tableRowClassName"
    :border="false"
    :data="paymentTransactionsList"
    :highlight-current-row="detailDialogOpen"
    @row-click="handleRowClick"
  >
    <template #empty>
      {{ loading ? '' : $t('base.noData') }}
    </template>
    <el-table-column :width="COLUMNS.CHECKBOX.width">
      <template #header>
        <OrganizationHubPaymentHistoryTitleCheck />
      </template>
      <template #default="scope">
        <OrganizationHubPaymentHistoryListCheck :item="scope.row" />
      </template>
    </el-table-column>
    <el-table-column :width="COLUMNS.AMOUNT.width">
      <template #header="{ column }">
        <OrganizationHubPaymentHistoryTitleContainer :column="column">
          {{ $t(COLUMNS.AMOUNT.headerName) }}
        </OrganizationHubPaymentHistoryTitleContainer>
      </template>
      <template #default="scope">
        <div class="flex items-center text-xs">
          <BaseIconCurrency :currency="scope.row.bankAccount.currency" />
          <div class="ml-1">
            {{ moneyFormat(scope.row.totalAmount) }}
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column :width="180">
      <template #header="{ column }">
        <OrganizationHubPaymentHistoryTitleContainer :column="column">
          {{ $t(COLUMNS.STATUS.headerName) }}
        </OrganizationHubPaymentHistoryTitleContainer>
      </template>
      <template #default="scope">
        <OrganizationHubPaymentHistoryListStatus :item="scope.row" />
      </template>
    </el-table-column>
    <el-table-column :width="COLUMNS.BANK.width">
      <template #header="{ column }">
        <OrganizationHubPaymentHistoryTitleContainer :column="column">
          {{ $t(COLUMNS.BANK.headerName) }}
        </OrganizationHubPaymentHistoryTitleContainer>
      </template>
      <template #default="scope">
        <OrganizationHubPaymentHistoryListBank :item="scope.row" />
      </template>
    </el-table-column>
    <el-table-column :width="COLUMNS.OCCURRED_ON.width">
      <template #header="{ column }">
        <OrganizationHubPaymentHistoryTitleContainer :column="column">
          {{ $t('filter.column.initiated') }}
        </OrganizationHubPaymentHistoryTitleContainer>
      </template>
      <template #default="scope">
        {{ formatDate(scope.row.createdAt, 'DD MMM YYYY, HH:mm') }}
      </template>
    </el-table-column>
    <el-table-column :width="COLUMNS.OCCURRED_ON.width">
      <template #header="{ column }">
        <OrganizationHubPaymentHistoryTitleContainer :column="column">
          {{ $t('filter.column.arrival') }}
        </OrganizationHubPaymentHistoryTitleContainer>
      </template>
      <template #default="scope">
        {{ formatDate(scope.row.arrivalDate, 'DD MMM YYYY') }}
      </template>
    </el-table-column>
    <el-table-column :min-width="COLUMNS.TRANSACTION_ID.width - 70">
      <template #header>
        {{ $t('filter.column.payout.id') }}
      </template>
      <template #default="scope">
        <OrganizationHubPaymentHistoryListTransactionID :item="scope.row" />
      </template>
    </el-table-column>
  </BaseTable>
  <OrganizationHubPaymentHistoryDialog v-model="detailDialogOpen" />
</template>

<script setup>
import { PAYMENT_HISTORY_TABLE_COLUMNS } from '~/constant/payment';

const hubPaymentStore = useHubPaymentStore();
const COLUMNS = PAYMENT_HISTORY_TABLE_COLUMNS;

const detailDialogOpen = ref(false);
const loading = computed(() => hubPaymentStore.loading);
const dataType = computed(() => hubPaymentStore.dataType);
const paymentTransactionsList = computed(
  () => hubPaymentStore.v2PaymentTransactions,
);

function tableRowClassName({ row }) {
  if (hubPaymentStore.usersSelect.find((user) => user.id === row.id)) {
    return 'user-active';
  }
  return '';
}

function handleRowClick(row) {
  detailDialogOpen.value = true;
  hubPaymentStore.addDialogNavHistory({
    dataType,
    cacheData: row,
  });
}
</script>
<style></style>
