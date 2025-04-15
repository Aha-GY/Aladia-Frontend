<template>
  <div
    class="relative bg-white/5"
    :class="marketStore.subCategoriesOpen ? 'mb-32' : 'mb-20'"
  >
    <div v-if="authStore.logged" class="pb-11 md:hidden">
      <OrganizationHubHeader />
    </div>
    <client-only>
      <MarketHeaderCarousels />
    </client-only>
    <MarketHeaderMore />
    <MarketHeaderSliders />
    <MarketHeaderLess />
  </div>
</template>

<script setup>
const authStore = useAuthStore();
const marketStore = useMarketStore();

async function getCategories() {
  return marketStore.getCategories();
}

if (import.meta.server) {
  try {
    await getCategories();
  } catch (error) {
    console.log(error.message);
  }
}

onMounted(async () => {
  if (marketStore.categories.length === 0) {
    await getCategories();
  }
});
</script>
