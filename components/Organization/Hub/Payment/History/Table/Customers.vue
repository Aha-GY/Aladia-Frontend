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
    <el-table-column
      :width="COLUMNS.CUSTOMER_NAME.width"
      :fixed="!$device.isMobile && 'left'"
    >
      <template #header="{ column }">
        <OrganizationHubPaymentHistoryTitleContainer :column="column">
          {{ $t(COLUMNS.CUSTOMER_NAME.headerName) }}
        </OrganizationHubPaymentHistoryTitleContainer>
      </template>
      <template #default="scope">
        <OrganizationHubPaymentHistoryListUser :user-item="scope.row.owner" />
      </template>
    </el-table-column>
    <el-table-column :width="260">
      <template #header="{ column }">
        <OrganizationHubPaymentHistoryTitleContainer :column="column">
          <i class="fa-regular fa-envelope mr-1" />
          <span>{{ $t('org.info.email') }}</span>
        </OrganizationHubPaymentHistoryTitleContainer>
      </template>
      <template #default="scope">
        <span class="text-[#707070]">
          {{ scope.row.owner?.owner.email || '--' }}
        </span>
      </template>
    </el-table-column>
    <el-table-column :width="COLUMNS.AMOUNT.width">
      <template #header="{ column }">
        <OrganizationHubPaymentHistoryTitleContainer :column="column">
          {{ $t('category.money.spent.total') }}
        </OrganizationHubPaymentHistoryTitleContainer>
      </template>
      <template #default="scope">
        <div class="flex items-center pr-2">
          <BaseIconCurrency currency="usd" />
          <div class="ml-1 font-bold">
            {{ moneyFormat(scope.row.totalSpent) }}
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column width="160">
      <template #header="{ column }">
        <OrganizationHubPaymentHistoryTitleContainer :column="column">
          <i class="fa-regular fa-money-bills mr-1" />
          <span>{{ $t('category.transaction.involved') }}</span>
        </OrganizationHubPaymentHistoryTitleContainer>
      </template>
      <template #default="scope">
        <span class="text-[#CECECE]">
          {{ scope.row.totalTransactions }}
        </span>
      </template>
    </el-table-column>
    <el-table-column width="160">
      <template #header="{ column }">
        <OrganizationHubPaymentHistoryTitleContainer :column="column">
          <i class="fa-regular fa-calendar-clock mr-1" />
          {{ $t('category.subscription.enrolled') }}
        </OrganizationHubPaymentHistoryTitleContainer>
      </template>
      <template #default="scope">
        <span class="text-[#CECECE]">
          {{ scope.row.totalSubs }}
        </span>
      </template>
    </el-table-column>
    <el-table-column width="160">
      <template #header="{ column }">
        <OrganizationHubPaymentHistoryTitleContainer :column="column">
          <i class="fa-regular fa-calendar-check mr-1 text-[#86EFAC]" />
          {{ $t('category.subscription.active') }}
        </OrganizationHubPaymentHistoryTitleContainer>
      </template>
      <template #default="scope">
        <span class="text-[#CECECE]">
          {{ scope.row.activeSubscriptions }}
        </span>
      </template>
    </el-table-column>
    <el-table-column width="180">
      <template #header="{ column }">
        <OrganizationHubPaymentHistoryTitleContainer :column="column">
          {{ $t('category.subscription.since') }}
        </OrganizationHubPaymentHistoryTitleContainer>
      </template>
      <template #default="scope">
        {{
          scope.row?.createdAt
            ? formatDate(scope.row.createdAt, 'DD MMM YYYY')
            : '--'
        }}
      </template>
    </el-table-column>
    <el-table-column min-width="180">
      <template #header>
        <OrganizationHubPaymentHistoryTitleContainer>
          Customer Stripe Id
        </OrganizationHubPaymentHistoryTitleContainer>
      </template>
      <template #default="scope">
        <OrganizationHubPaymentHistoryListTransactionID
          :item="{
            id: scope.row.stripeCustomerId,
          }"
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
