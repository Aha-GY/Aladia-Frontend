<template>
  <OrganizationHubPaymentHistoryDrawerFilterCompsRowItem
    icon-class="fa-light fa-calendar"
    sub-title="Initiated on"
  >
    <OrganizationHubPaymentHistoryDrawerFilterCompsDatePicker
      :filter-params="sidebarFilters"
      :filter-key="FILTER_KEYS.START_DATE"
      @change="handleFilterChange"
    />
  </OrganizationHubPaymentHistoryDrawerFilterCompsRowItem>

  <OrganizationHubPaymentHistoryDrawerFilterCompsRowItem
    icon-class="fa-light fa-calendar"
    :sub-title="$t('filter.column.arrival')"
  >
    <OrganizationHubPaymentHistoryDrawerFilterCompsRangeDatePicker
      :filter-params="sidebarFilters"
      :filter-key-start="FILTER_KEYS.ARRIVAL_START_DATE"
      :filter-key-end="FILTER_KEYS.ARRIVAL_END_DATE"
      :disabled-from-today="false"
      @change="handleFilterChange"
    />
  </OrganizationHubPaymentHistoryDrawerFilterCompsRowItem>

  <OrganizationHubPaymentHistoryDrawerFilterCompsRowItem
    icon-class="fa-regular fa-credit-card"
    :sub-title="$t('category.amount.label')"
  >
    <OrganizationHubPaymentHistoryDrawerFilterCompsAmount
      :filter-params="sidebarFilters"
      :filter-key="FILTER_KEYS.AMOUNT_EQUAL"
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
    icon-class="fa-regular fa-hashtag"
    :sub-title="$t('category.transaction.labelId.title')"
  >
    <OrganizationHubPaymentHistoryDrawerFilterCompsId
      :filter-params="sidebarFilters"
      :filter-key="FILTER_KEYS.PAYOUT_ID"
      :placeholder="$t('category.transaction.labelId.payoutId')"
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
