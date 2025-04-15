<template>
  <div class="flex items-center justify-between gap-2">
    {{ $t(PAYMENT_HISTORY_TABLE_COLUMNS.PRODUCT.headerName) }}
  </div>
</template>

<script setup>
import { PAYMENT_HISTORY_TABLE_COLUMNS } from '~/constant/payment';
</script>
