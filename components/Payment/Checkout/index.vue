<template>
  <client-only>
    <PaymentCheckoutStepsOnTimePaidConfirmCycles />
    <PaymentCheckoutStepsSubscribeDialog />
    <PaymentCheckoutStepsCheckoutDialog />
    <PaymentCheckoutStepsSuccess @assign="onAssignLicenses" />
    <OrganizationHubCourseLicenses
      v-model:show-dialog="assignDialogShow"
      :course-id="courseObject?.id"
    />
  </client-only>
</template>

<script setup>
/**
 * DialogSteps:
 * free course -> [confirmCyclesDialog?]
 * one-time-paid course -> cycles ? [confirmCyclesDialog, checkoutDialog] : [subscribeDialog, checkoutDialog]
 * recurring course -> [subscribeDialog, checkoutDialog]
 */
const paymentStore = usePaymentStore();
const assignDialogShow = ref(false);
const courseObject = computed(() => paymentStore.currentCourseObject);

function onAssignLicenses() {
  assignDialogShow.value = true;
}
</script>
