<template>
  <OrganizationHubPaymentHistoryDrawerFilterCompsRowItem
    icon-class="fa-light fa-calendar"
    :sub-title="$t('category.subscription.since')"
  >
    <OrganizationHubPaymentHistoryDrawerFilterCompsRangeDatePicker
      :filter-params="sidebarFilters"
      :filter-key-start="FILTER_KEYS.CUSTOMER_SINCE_START"
      :filter-key-end="FILTER_KEYS.CUSTOMER_SINCE_END"
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
    icon-class="fa-light fa-envelope"
    :sub-title="$t('org.info.email')"
  >
    <OrganizationHubPaymentHistoryDrawerFilterCompsEmail
      :filter-params="sidebarFilters"
      @change="handleFilterChange"
    />
  </OrganizationHubPaymentHistoryDrawerFilterCompsRowItem>

  <OrganizationHubPaymentHistoryDrawerFilterCompsRowItem
    icon-class="fa-regular fa-calendar-check"
    :sub-title="$t('category.subscription.active')"
  >
    <OrganizationHubPaymentHistoryDrawerFilterCompsAmount
      :filter-params="sidebarFilters"
      :filter-key="FILTER_KEYS.ACTIVE_SUBSCRIPTIONS_EQUAL"
      @change="handleFilterChange"
    />
  </OrganizationHubPaymentHistoryDrawerFilterCompsRowItem>

  <OrganizationHubPaymentHistoryDrawerFilterCompsRowItem
    icon-class="fa-regular fa-square-dollar"
    :sub-title="$t('category.amount.totalSpend')"
  >
    <OrganizationHubPaymentHistoryDrawerFilterCompsAmount
      :filter-params="sidebarFilters"
      :filter-key="FILTER_KEYS.TOTAL_SPENDING_EQUAL"
      @change="handleFilterChange"
    />
  </OrganizationHubPaymentHistoryDrawerFilterCompsRowItem>

  <OrganizationHubPaymentHistoryDrawerFilterCompsRowItem
    icon-class="fa-regular fa-money-bills"
    :sub-title="$t('category.transaction.involved')"
  >
    <OrganizationHubPaymentHistoryDrawerFilterCompsAmount
      :filter-params="sidebarFilters"
      :filter-key="FILTER_KEYS.TOTAL_TRANSACTIONS_EQUAL"
      @change="handleFilterChange"
    />
  </OrganizationHubPaymentHistoryDrawerFilterCompsRowItem>

  <OrganizationHubPaymentHistoryDrawerFilterCompsRowItem
    icon-class="fa-regular fa-calendar-clock"
    :sub-title="$t('category.subscription.enrolled')"
  >
    <OrganizationHubPaymentHistoryDrawerFilterCompsAmount
      :filter-params="sidebarFilters"
      :filter-key="FILTER_KEYS.TOTAL_SUBSCRIPTIONS_EQUAL"
      @change="handleFilterChange"
    />
  </OrganizationHubPaymentHistoryDrawerFilterCompsRowItem>

  <OrganizationHubPaymentHistoryDrawerFilterCompsRowItem
    icon-class="fa-regular fa-calendar-check"
    :sub-title="$t('category.subscription.active')"
  >
    <OrganizationHubPaymentHistoryDrawerFilterCompsAmount
      :filter-params="sidebarFilters"
      :filter-key="FILTER_KEYS.ACTIVE_SUBSCRIPTIONS_EQUAL"
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
