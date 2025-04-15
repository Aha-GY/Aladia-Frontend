<template>
  <div
    v-if="marketStore.subCategoriesOpen && !marketStore.categoriesLoading"
    class="absolute bottom-0 left-0 right-0 -mb-28 flex justify-center"
  >
    <div
      class="group flex h-10 w-10 cursor-pointer items-center justify-center rounded bg-white transition-all active:scale-90"
      data-cy="dda49c83e39470cc"
      @click="marketStore.subCategoriesOpen = false"
    >
      <i class="fa-solid fa-xmark text-black" />
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const marketStore = useMarketStore();
    return { marketStore };
  },
};
</script>
