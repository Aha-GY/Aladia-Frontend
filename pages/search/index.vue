<template>
  <NuxtLayout>
    <div class="relative z-10">
      <Search />
    </div>
    <MarketCardFloat v-if="marketStore.floatCourse" />
  </NuxtLayout>
</template>

<script>
export default {
  setup() {
    const marketStore = useMarketStore();
    return { marketStore };
  },
  beforeUnmount() {
    this.marketStore.$reset();
  },
};
</script>
