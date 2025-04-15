<template>
  <OrganizationHubPaymentHistoryTableTransactions
    v-if="
      dataType === DATA_TYPES.TRANS_INCOME ||
      dataType === DATA_TYPES.TRANS_SPENDING
    "
  />
  <OrganizationHubPaymentHistoryTableSubscriptions
    v-if="
      dataType === DATA_TYPES.SUB_INCOME || dataType === DATA_TYPES.SUB_SPENDING
    "
  />
  <OrganizationHubPaymentHistoryTablePayout
    v-if="dataType === DATA_TYPES.PAYOUT"
  />
  <OrganizationHubPaymentHistoryTableCustomers
    v-if="dataType === DATA_TYPES.CUSTOMER"
  />
</template>

<script setup>
import { DATA_TYPES } from '~/constant/payment';

const hubPaymentStore = useHubPaymentStore();
const dataType = computed(() => hubPaymentStore.dataType);

onBeforeUnmount(() => {
  hubPaymentStore.$reset();
});
</script>
<style lang="scss">
#hub-table-expand {
  height: calc(100% - 6rem);
  &.with-tab {
    height: calc(100% - 9rem);
  }
  .el-table thead th {
    padding: 0.625rem 0;
    background-color: #101010;
  }

  /* Remove the vertical lines when hovering over column headers */
  .el-table th:hover {
    border-right: none !important;
    border-left: none !important;
    position: relative; /* Allows overlapping content to be positioned */
    z-index: 10; /* Ensures the hovered cell is above others */
    overflow: visible; /* Ensures child elements can overflow the bounds */
  }
  .el-table__body tr.el-table__row {
    background: transparent;
    cursor: pointer;
  }

  .el-table__body tr.current-row > td.el-table__cell {
    background: rgba(255, 255, 255, 0.04);
  }

  .el-table__body-wrapper tr.current-row > td.el-table-fixed-column--left {
    background: rgb(26, 26, 26) !important;
  }
  .el-loading-mask {
    background-color: transparent;
  }

  .el-loading-spinner .circular circle {
    stroke: white;
  }

  .reset-width-icon {
    display: none;
  }
  .el-table thead th:hover {
    background-color: rgba(255, 255, 255, 0.05); /* Equivalent to white/5 */
    transition: all;
  }
  th.el-table__cell:hover {
    .reset-width-icon {
      display: block;
    }
  }
}
</style>
