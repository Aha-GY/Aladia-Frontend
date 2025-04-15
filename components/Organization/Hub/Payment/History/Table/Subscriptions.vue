<template>
  <BaseTable
    id="hub-table-expand"
    v-loading="loading"
    class="with-tab"
    :row-class-name="tableRowClassName"
    :border="false"
    :data="paymentTransactionsList"
    :highlight-current-row="detailDialogOpen"
    @row-click="handleRowClick"
  >
    <template #empty>
      {{ loading ? '' : $t('base.noData') }}
    </template>
    <el-table-column
      :width="COLUMNS.CHECKBOX.width"
      :fixed="!$device.isMobile && 'left'"
    >
      <template #header>
        <OrganizationHubPaymentHistoryTitleCheck />
      </template>
      <template #default="scope">
        <OrganizationHubPaymentHistoryListCheck :item="scope.row" />
      </template>
    </el-table-column>
    <el-table-column
      :width="COLUMNS.PRODUCT.width"
      :fixed="!$device.isMobile && 'left'"
    >
      <template #header="{ column }">
        <OrganizationHubPaymentHistoryTitleContainer :column="column">
          {{ $t(COLUMNS.PRODUCT.headerName) }}
        </OrganizationHubPaymentHistoryTitleContainer>
      </template>
      <template #default="scope">
        <OrganizationHubPaymentHistoryListProduct :item="scope.row" />
      </template>
    </el-table-column>
    <el-table-column :width="COLUMNS.QUANTITY.width">
      <template #header="{ column }">
        <OrganizationHubPaymentHistoryTitleContainer :column="column">
          {{ $t(COLUMNS.QUANTITY.headerName) }}
        </OrganizationHubPaymentHistoryTitleContainer>
      </template>
      <template #default="scope">
        {{ scope.row.licencesBought ? `x ${scope.row.licencesBought}` : '---' }}
      </template>
    </el-table-column>
    <el-table-column :width="COLUMNS.STATUS.width">
      <template #header="{ column }">
        <OrganizationHubPaymentHistoryTitleContainer :column="column">
          {{ $t(COLUMNS.STATUS.headerName) }}
        </OrganizationHubPaymentHistoryTitleContainer>
      </template>
      <template #default="scope">
        <OrganizationHubPaymentHistoryListStatus
          :item="{
            status: mapStatusCanceledToCompleted({
              status: scope.row.subscriptionStatus,
            }),
          }"
        />
      </template>
    </el-table-column>
    <!-- todo -->
    <el-table-column :width="COLUMNS.PAID_INSTALLMENT.width">
      <template #header="{ column }">
        <OrganizationHubPaymentHistoryTitleContainer :column="column">
          {{ $t(COLUMNS.PAID_INSTALLMENT.headerName) }}
        </OrganizationHubPaymentHistoryTitleContainer>
      </template>
      <template #default="scope">
        <OrganizationHubPaymentHistoryListPaidInstallments
          :status="scope.row.subscriptionStatus"
          :current-step="scope.row.currentInstallment"
          :total-step="scope.row.totalInstallment"
          text="filter.status.paid"
        />
      </template>
    </el-table-column>
    <el-table-column :width="COLUMNS.PLANNED_INSTALLMENT.width">
      <template #header="{ column }">
        <OrganizationHubPaymentHistoryTitleContainer :column="column">
          {{ $t(COLUMNS.PLANNED_INSTALLMENT.headerName) }}
        </OrganizationHubPaymentHistoryTitleContainer>
      </template>
      <template #default="scope">
        <OrganizationHubPaymentHistoryListPlanInstallments :item="scope.row" />
      </template>
    </el-table-column>
    <el-table-column :width="COLUMNS.AMOUNT_PAID.width">
      <template #header="{ column }">
        <OrganizationHubPaymentHistoryTitleContainer :column="column">
          {{ $t(COLUMNS.AMOUNT_PAID.headerName) }}
        </OrganizationHubPaymentHistoryTitleContainer>
      </template>
      <template #default="scope">
        <OrganizationHubPaymentHistoryListAmountPaid :item="scope.row" />
      </template>
    </el-table-column>
    <el-table-column :width="COLUMNS.AMOUNT.width">
      <template #header="{ column }">
        <OrganizationHubPaymentHistoryTitleContainer :column="column">
          {{ $t('category.amount.total') }}
        </OrganizationHubPaymentHistoryTitleContainer>
      </template>
      <template #default="scope">
        <OrganizationHubPaymentHistoryListTotalAmount :item="scope.row" />
      </template>
    </el-table-column>
    <el-table-column :width="COLUMNS.NEXT_INSTALLMENT.width">
      <template #header="{ column }">
        <OrganizationHubPaymentHistoryTitleContainer :column="column">
          {{ $t(COLUMNS.NEXT_INSTALLMENT.headerName) }}
        </OrganizationHubPaymentHistoryTitleContainer>
      </template>
      <template #default="scope">
        <OrganizationHubPaymentHistoryListNextInstallment :item="scope.row" />
      </template>
    </el-table-column>
    <el-table-column :width="COLUMNS.FREQUENCY.width">
      <template #header="{ column }">
        <OrganizationHubPaymentHistoryTitleContainer :column="column">
          {{ $t(COLUMNS.FREQUENCY.headerName) }}
        </OrganizationHubPaymentHistoryTitleContainer>
      </template>
      <template #default="scope">
        <OrganizationHubPaymentHistoryListFrequency :item="scope.row" />
      </template>
    </el-table-column>
    <el-table-column :width="COLUMNS.CUSTOMER.width">
      <template #header="{ column }">
        <OrganizationHubPaymentHistoryTitleContainer :column="column">
          {{ $t(COLUMNS.CUSTOMER.headerName) }}
        </OrganizationHubPaymentHistoryTitleContainer>
      </template>
      <template #default="scope">
        <OrganizationHubPaymentHistoryListUser :user-item="scope.row.payer" />
      </template>
    </el-table-column>
    <el-table-column :width="COLUMNS.SELLER.width">
      <template #header="{ column }">
        <OrganizationHubPaymentHistoryTitleContainer :column="column">
          {{ $t(COLUMNS.SELLER.headerName) }}
        </OrganizationHubPaymentHistoryTitleContainer>
      </template>
      <template #default="scope">
        <OrganizationHubPaymentHistoryListUser
          :user-item="scope.row.recipient"
        />
      </template>
    </el-table-column>
    <el-table-column :width="COLUMNS.STARTED_ON.width">
      <template #header="{ column }">
        <OrganizationHubPaymentHistoryTitleContainer :column="column">
          {{ $t(COLUMNS.STARTED_ON.headerName) }}
        </OrganizationHubPaymentHistoryTitleContainer>
      </template>
      <template #default="scope">
        {{ formatDate(scope.row.dates?.startDate, 'DD MMM YYYY, HH:mm') }}
      </template>
    </el-table-column>
    <el-table-column :width="COLUMNS.ENDS_ON.width">
      <template #header="{ column }">
        <OrganizationHubPaymentHistoryTitleContainer :column="column">
          {{ $t(COLUMNS.ENDS_ON.headerName) }}
        </OrganizationHubPaymentHistoryTitleContainer>
      </template>
      <template #default="scope">
        {{ formatDate(scope.row.dates?.endDate, 'DD MMM YYYY, HH:mm') }}
      </template>
    </el-table-column>
    <el-table-column :min-width="COLUMNS.TRANSACTION_ID.width - 70">
      <template #header>
        <OrganizationHubPaymentHistoryTitleContainer>
          SubscriptionID
        </OrganizationHubPaymentHistoryTitleContainer>
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
