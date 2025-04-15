<template>
  <div class="flex items-center justify-center gap-2">
    <BaseCheckboxStyle
      :state="checkStatus"
      data-cy="1ac88bd18ff510b6"
      @click="onClick"
    />
  </div>
</template>

<script setup>
const hubPaymentStore = useHubPaymentStore();

const checkStatus = computed(() => {
  if (hubPaymentStore.v2PaymentTransactions.length === 0) {
    return 'unchecked';
  }

  if (hubPaymentStore.usersSelect.length === 0) {
    return 'unchecked';
  }

  if (
    hubPaymentStore.v2PaymentTransactions.length ===
    hubPaymentStore.usersSelect.length
  ) {
    return 'checked';
  }

  return 'halfChecked';
});

function onClick() {
  hubPaymentStore.handleCheckbox({
    titleCheckbox: true,
  });
}
</script>
