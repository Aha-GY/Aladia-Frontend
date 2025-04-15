<template>
  <NuxtLayout>
    <div class="relative z-10">
      <OrganizationSearch />
    </div>
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
