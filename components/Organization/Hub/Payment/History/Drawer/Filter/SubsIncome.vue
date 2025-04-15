<template>
  <OrganizationHubPaymentHistoryDrawerFilterCompsRowItem
    icon-class="fa-regular fa-rectangle-history"
  >
    <OrganizationHubPaymentHistoryDrawerFilterCompsProduct
      :filter-params="sidebarFilters"
      @change="handleFilterChange"
    />
  </OrganizationHubPaymentHistoryDrawerFilterCompsRowItem>

  <OrganizationHubPaymentHistoryDrawerFilterCompsRowItem
    icon-class="fa-light fa-calendar"
    :sub-title="$t('base.occur.date')"
  >
    <OrganizationHubPaymentHistoryDrawerFilterCompsRangeDatePicker
      :filter-params="sidebarFilters"
      :filter-key-start="FILTER_KEYS.START_DATE"
      :filter-key-end="FILTER_KEYS.END_DATE"
      @change="handleFilterChange"
    />
  </OrganizationHubPaymentHistoryDrawerFilterCompsRowItem>

  <OrganizationHubPaymentHistoryDrawerFilterCompsRowItem
    icon-class="fa-light fa-user-gear"
    :sub-title="$t('category.role.customer')"
  >
    <OrganizationHubPaymentHistoryDrawerFilterCompsUser
      :filter-params="sidebarFilters"
      :filter-key="FILTER_KEYS.CUSTOMERS"
      type="paymentCustomer"
      :text="$t('category.transaction.selectCustomers')"
      @change="handleFilterChange"
    />
  </OrganizationHubPaymentHistoryDrawerFilterCompsRowItem>

  <OrganizationHubPaymentHistoryDrawerFilterCompsRowItem
    icon-class="fa-regular fa-layer-group"
    :sub-title="$t('category.payout.quantity')"
  >
    <OrganizationHubPaymentHistoryDrawerFilterCompsAmount
      :filter-params="sidebarFilters"
      :filter-key="FILTER_KEYS.QUANTITY_EQUAL"
      @change="handleFilterChange"
    />
  </OrganizationHubPaymentHistoryDrawerFilterCompsRowItem>

  <OrganizationHubPaymentHistoryDrawerFilterCompsRowItem
    icon-class="fa-solid fa-screwdriver-wrench"
    :sub-title="$t('filter.payment.history.installments.paid')"
  >
    <OrganizationHubPaymentHistoryDrawerFilterCompsAmount
      :filter-params="sidebarFilters"
      :filter-key="FILTER_KEYS.PAID_INSTALLMENT_EQUAL"
      @change="handleFilterChange"
    />
  </OrganizationHubPaymentHistoryDrawerFilterCompsRowItem>

  <OrganizationHubPaymentHistoryDrawerFilterCompsRowItem
    icon-class="fa-solid fa-screwdriver-wrench"
    :sub-title="$t('filter.payment.history.installments.planned')"
  >
    <OrganizationHubPaymentHistoryDrawerFilterCompsAmount
      :filter-params="sidebarFilters"
      :filter-key="FILTER_KEYS.PLANNED_INSTALLMENT_EQUAL"
      @change="handleFilterChange"
    />
  </OrganizationHubPaymentHistoryDrawerFilterCompsRowItem>

  <OrganizationHubPaymentHistoryDrawerFilterCompsRowItem
    icon-class="fa-regular fa-credit-card"
    :sub-title="$t('filter.payment.history.netAmountReceived')"
  >
    <OrganizationHubPaymentHistoryDrawerFilterCompsAmount
      :filter-params="sidebarFilters"
      :filter-key="FILTER_KEYS.NET_RECEIVED_EQUAL"
      @change="handleFilterChange"
    />
  </OrganizationHubPaymentHistoryDrawerFilterCompsRowItem>

  <OrganizationHubPaymentHistoryDrawerFilterCompsRowItem
    icon-class="fa-regular fa-credit-card"
    :sub-title="$t('category.amount.total')"
  >
    <OrganizationHubPaymentHistoryDrawerFilterCompsAmount
      :filter-params="sidebarFilters"
      :filter-key="FILTER_KEYS.TOTAL_AMOUNT_EQUAL"
      @change="handleFilterChange"
    />
  </OrganizationHubPaymentHistoryDrawerFilterCompsRowItem>

  <OrganizationHubPaymentHistoryDrawerFilterCompsRowItem
    icon-class="fa-regular fa-radar"
    :sub-title="$t('category.transaction.status')"
  >
    <OrganizationHubPaymentHistoryDrawerFilterCompsStatus
      :filter-params="sidebarFilters"
      @change="handleFilterChange"
    />
  </OrganizationHubPaymentHistoryDrawerFilterCompsRowItem>

  <OrganizationHubPaymentHistoryDrawerFilterCompsRowItem
    icon-class="fa-light fa-calendar"
    sub-title="Next Installment On"
  >
    <OrganizationHubPaymentHistoryDrawerFilterCompsRangeDatePicker
      :filter-params="sidebarFilters"
      :filter-key-start="FILTER_KEYS.NEXT_INSTALLMENT_START"
      :filter-key-end="FILTER_KEYS.NEXT_INSTALLMENT_END"
      @change="handleFilterChange"
    />
  </OrganizationHubPaymentHistoryDrawerFilterCompsRowItem>

  <OrganizationHubPaymentHistoryDrawerFilterCompsRowItem
    icon-class="fa-regular fa-waves-sine"
    :sub-title="$t('category.transaction.status')"
  >
    <OrganizationHubPaymentHistoryDrawerFilterCompsFrequency
      :filter-params="sidebarFilters"
      @change="handleFilterChange"
    />
  </OrganizationHubPaymentHistoryDrawerFilterCompsRowItem>

  <OrganizationHubPaymentHistoryDrawerFilterCompsRowItem
    icon-class="fa-regular fa-hashtag"
    :sub-title="$t('category.transaction.labelId.subTitle')"
  >
    <OrganizationHubPaymentHistoryDrawerFilterCompsId
      :filter-params="sidebarFilters"
      :filter-key="FILTER_KEYS.SUB_ID"
      :placeholder="$t('category.transaction.labelId.subId')"
      @change="handleFilterChange"
    />
  </OrganizationHubPaymentHistoryDrawerFilterCompsRowItem>
</template>

<script setup>
import { FILTER_KEYS } from '~/constant/payment.js';

const hubPaymentStore = useHubPaymentStore();

const sidebarFilters = computed(() => hubPaymentStore.sidebarFilters);

function handleFilterChange(filterObject) {
  hubPaymentStore.getPaymentFilterInDrawersChange(filterObject);
}
</script>
