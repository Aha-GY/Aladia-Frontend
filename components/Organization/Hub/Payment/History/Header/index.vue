<template>
  <!-- web display -->
  <div v-if="!$device.isMobile">
    <!-- row 1, spending/sales/payouts filter -->
    <div class="flex items-center justify-between">
      <div class="flex">
        <span class="text-base text-white">
          {{ $t('payment.label') }}
        </span>

        <div
          class="mx-4 flex items-center rounded bg-black p-1.5 text-[#FAFAFA]"
        >
          <OrganizationHubPaymentHistoryHeaderTabItemB
            v-for="item in QUERY_PARAMS.FILTER_QUERY"
            :key="item.key"
            :title="item.text"
            :name="item.key"
          />
        </div>
      </div>

      <!-- Filter and Manage Column and toggle chart button -->
      <div class="flex items-center justify-between gap-2">
        <BaseButton
          label="$t:base.filter.label"
          icon="fa-regular fa-filter-list"
          size="small"
          type="outline"
          data-cy="a61e27e9db4fe012"
          @click="handleClickFilter"
        />
        <BaseButton
          label="$t:base.sort.label"
          icon="fa-light fa-sort"
          size="small"
          type="outline"
          data-cy="a61e27e9db4fe012"
          @click="handleClickSort"
        />
        <BaseButton
          label="$t:org.manage.column"
          icon="fa-solid fa-table-layout"
          size="small"
          type="outline"
          data-cy="5e55026e1bd2d4db"
          @click="handleClickManage"
        />

        <div
          class="flex size-8 cursor-pointer items-center justify-center rounded bg-black hover:bg-white/10"
          data-cy="d64d811b75d10181"
          @click="handleSwitchOnchange"
        >
          <i
            class="fa-light fa-chevron-down text-sm transition-all duration-300"
            :class="hubPaymentStore.open ? 'rotate-180' : ''"
          />
        </div>
      </div>
    </div>

    <!-- row 2, transcation/sub tab-->
    <div v-if="rowPurposeShow" class="my-3 flex">
      <OrganizationHubPaymentHistoryHeaderTabItem
        v-for="item in QUERY_PARAMS.ENDPOINTS"
        :key="item.key"
        :title="item.text"
        :name="item.key"
      >
        {{ $t(item.text) }}
      </OrganizationHubPaymentHistoryHeaderTabItem>
    </div>
  </div>

  <!-- mobile display -->
  <div v-else>
    <!-- row 1, spending/sales/payouts filter -->
    <div class="flex items-center justify-between">
      <span class="text-base text-white">
        {{ $t('payment.label') }}
      </span>

      <BaseSwitcherIcon
        class="transition-all"
        :active="hubPaymentStore.open"
        @change="handleSwitchOnchange"
      />
    </div>

    <!-- row 2, transcation/sub tab -->
    <div class="mt-2 flex items-center rounded bg-black p-1.5 text-[#FAFAFA]">
      <OrganizationHubPaymentHistoryHeaderTabItemB
        v-for="item in QUERY_PARAMS.FILTER_QUERY"
        :key="item.key"
        :title="item.text"
        :name="item.key"
      />
    </div>

    <!-- row 3, transcation/sub tab-->
    <div v-if="rowPurposeShow" class="flex">
      <OrganizationHubPaymentHistoryHeaderTabItem
        v-for="item in QUERY_PARAMS.ENDPOINTS"
        :key="item.key"
        :title="item.text"
        :name="item.key"
      >
        {{ $t(item.text) }}
      </OrganizationHubPaymentHistoryHeaderTabItem>
    </div>

    <!-- row4, filters , sort and manager columns -->
    <div class="my-3 flex items-center justify-between">
      <BaseButton
        label="$t:base.filter.label"
        icon="fa-regular fa-filter-list"
        size="small"
        data-cy="e4e3fe899d1151c2"
        @click="handleClickFilter"
      />
      <BaseButton
        label="$t:base.sort.label"
        icon="fa-light fa-sort"
        size="small"
        data-cy="a61e27e9db4fe012"
        @click="handleClickSort"
      />
      <BaseButton
        label="$t:org.manage.column"
        icon="fa-solid fa-table-layout"
        size="small"
        data-cy="115de7382ae2acbe"
        @click="handleClickManage"
      />
    </div>
  </div>
</template>

<script setup>
import { QUERY_PARAMS } from '~/constant/payment';

const hubPaymentStore = useHubPaymentStore();
const hubSidebar = useHubSidebarStore();
const rowPurposeShow = computed(
  () =>
    hubPaymentStore.v2PaymentTransactionsFilterQuery.filterQuery !==
      QUERY_PARAMS.FILTER_QUERY.PAYOUTS.key &&
    hubPaymentStore.v2PaymentTransactionsFilterQuery.filterQuery !==
      QUERY_PARAMS.FILTER_QUERY.CUSTOMERS.key,
);
// const authStore = useAuthStore();
// const loading = computed(() => hubPaymentStore.loading);

function handleSwitchOnchange() {
  hubPaymentStore.open = !hubPaymentStore.open;
}

function handleClickFilter() {
  hubSidebar.state = true;
  hubSidebar.payment.state = true;
}
function handleClickSort() {
  hubSidebar.state = true;
  hubSidebar.sort.state = true;
}

function handleClickManage() {
  console.log('handleClickManage');
}
</script>
