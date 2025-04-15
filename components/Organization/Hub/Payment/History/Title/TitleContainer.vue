<template>
  <div class="flex items-center justify-between">
    <div class="block max-w-full truncate">
      <slot />
    </div>
    <OrganizationHubPaymentHistoryTitleDragIcon
      v-if="column"
      :column="column"
    />
  </div>
</template>
<script setup>
defineProps({
  column: Object,
});
</script>
