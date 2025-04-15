<template>
  <OrganizationHubSidebarWrap :open="open">
    <OrganizationHubPaymentHistoryDrawerSortBy @close="onClose" />
  </OrganizationHubSidebarWrap>
</template>

<script setup>
const hubSidebar = useHubSidebarStore();
const open = ref(false);

onMounted(() => {
  setTimeout(() => {
    open.value = true;
  }, 100);
});

async function onClose() {
  open.value = false;
  await sleep(500);
  hubSidebar.sort.state = false;
  hubSidebar.state = false;
}
</script>
