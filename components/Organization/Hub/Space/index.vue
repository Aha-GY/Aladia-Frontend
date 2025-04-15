<template>
  <div id="space-main" data-drag="true" class="relative pb-72 pr-2 font-light">
    <OrganizationHubSpaceOverview />
    <OrganizationHubSpaceBreadcrumb />
    <OrganizationHubSpaceTool />
    <OrganizationHubSpaceMain />
    <Teleport to="body">
      <OrganizationHubSpaceEditCostumize v-if="hubSpaces.editCostumize" />
      <OrganizationHubSpaceDeleteSpace v-if="hubSpaces.deleteSpace" />
      <OrganizationHubSpaceDeleteFolder v-if="hubSpaces.deleteFolder" />
      <OrganizationHubSpaceDeleteCourse v-if="hubSpaces.deleteCourse" />
      <OrganizationHubSpaceDeleteSubject v-if="hubSpaces.deleteSubject" />
      <OrganizationHubSpaceLeaveSpace v-if="hubSpaces.leaveSpace" />
      <OrganizationHubSpaceLeaveCourse v-if="hubSpaces.leaveCourse" />
      <OrganizationHubSpaceRemoveCourse v-if="hubSpaces.removeCourse" />
      <OrganizationHubSpaceDuplicateCourse v-if="hubSpaces.duplicateCourse" />
    </Teleport>
  </div>
</template>

<script>
export default {
  setup() {
    const hubSpaces = useHubSpacesStore();
    const paymentStore = usePaymentStore();
    return { hubSpaces, paymentStore };
  },
  watch: {
    '$route.query': {
      handler() {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      },
      deep: true,
    },
  },
  mounted() {
    this.hubSpaces.getCompletions();
    this.paymentStore.getStripePaymentMethodsList();
  },
  beforeUnmount() {
    this.hubSpaces.$reset();
  },
};
</script>
