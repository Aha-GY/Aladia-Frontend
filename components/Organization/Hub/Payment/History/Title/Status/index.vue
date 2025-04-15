<template>
  <div class="relative flex items-center justify-between">
    <span>
      {{ $t('payment.transaction.status') }}
    </span>
  </div>
</template>

<script setup>
defineProps({
  column: Object,
});
</script>
