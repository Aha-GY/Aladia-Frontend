<template>
  <OrganizationHubSidebarWrap :open="open">
    <OrganizationHubPaymentHistoryDrawerFilter @close="onClose" />
  </OrganizationHubSidebarWrap>
</template>

<script setup>
const hubSidebar = useHubSidebarStore();
const open = ref(false);
// const open = computed(() => hubSidebar.payment.state);

onMounted(() => {
  setTimeout(() => {
    open.value = true;
  }, 100);
});

async function onClose() {
  open.value = false;
  await sleep(500);
  hubSidebar.payment.state = false;
  hubSidebar.state = false;
}
</script>
