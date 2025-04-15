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
        <OrganizationHubPaymentHistoryListStatus :item="scope.row" />
      </template>
    </el-table-column>
    <el-table-column :width="COLUMNS.AMOUNT.width">
      <template #header="{ column }">
        <OrganizationHubPaymentHistoryTitleContainer :column="column">
          {{ $t(COLUMNS.AMOUNT.headerName) }}
        </OrganizationHubPaymentHistoryTitleContainer>
      </template>
      <template #default="scope">
        <OrganizationHubPaymentHistoryListAmount :item="scope.row" />
      </template>
    </el-table-column>
    <el-table-column :width="COLUMNS.PAYMENT_METHOD.width">
      <template #header="{ column }">
        <OrganizationHubPaymentHistoryTitleContainer :column="column">
          {{ $t(COLUMNS.PAYMENT_METHOD.headerName) }}
        </OrganizationHubPaymentHistoryTitleContainer>
      </template>
      <template #default="scope">
        <OrganizationHubPaymentHistoryListMethod :item="scope.row" />
      </template>
    </el-table-column>
    <el-table-column :width="COLUMNS.TYPE.width">
      <template #header="{ column }">
        <OrganizationHubPaymentHistoryTitleContainer :column="column">
          {{ $t(COLUMNS.TYPE.headerName) }}
        </OrganizationHubPaymentHistoryTitleContainer>
      </template>
      <template #default="scope">
        <div>{{ scope.row?.purpose }}</div>
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
    <el-table-column :width="COLUMNS.OCCURRED_ON.width">
      <template #header="{ column }">
        <OrganizationHubPaymentHistoryTitleContainer :column="column">
          {{ $t(COLUMNS.OCCURRED_ON.headerName) }}
        </OrganizationHubPaymentHistoryTitleContainer>
      </template>
      <template #default="scope">
        {{ formatDate(scope.row.createdAt, 'DD MMM YYYY, HH:mm') }}
      </template>
    </el-table-column>
    <el-table-column :min-width="COLUMNS.TRANSACTION_ID.width">
      <template #header>{{ $t(COLUMNS.TRANSACTION_ID.headerName) }}</template>
      <template #default="scope">
        <OrganizationHubPaymentHistoryListTransactionID
          :item="scope.row"
          :download-url="scope.row.invoice.pdf"
        />
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
