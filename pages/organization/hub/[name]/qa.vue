<template>
  <div class="relative">
    <OrganizationHubQaWidget />
    <OrganizationHubQaHistory />
    <OrganizationHubQaToggle />
  </div>
</template>

<script>
export default {
  setup() {
    const hubQaStore = useHubQaStore();
    return { hubQaStore };
  },
  beforeUnmount() {
    this.hubQaStore.$reset();
  },
};
</script>
