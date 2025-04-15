<template>
  <OrganizationHubPaymentHistoryDrawerFilterCompsRowItem
    icon-class="fa-regular fa-rectangle-history"
  >
    <OrganizationHubPaymentHistoryDrawerFilterCompsProduct
      :filter-params="sidebarFilters"
      is-own-courses
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
    icon-class="fa-regular fa-credit-card"
    :sub-title="$t('category.amount.label')"
  >
    <OrganizationHubPaymentHistoryDrawerFilterCompsAmount
      :filter-params="sidebarFilters"
      :filter-key="FILTER_KEYS.NET_AMOUNT_EQUAL"
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
    icon-class="fa-regular fa-grid"
    :sub-title="$t('category.transaction.purpose')"
  >
    <OrganizationHubPaymentHistoryDrawerFilterCompsType
      :filter-params="sidebarFilters"
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
      :filter-key="FILTER_KEYS.ID"
      :placeholder="$t('category.transaction.labelId.enter')"
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
