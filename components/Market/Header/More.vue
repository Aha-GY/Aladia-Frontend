<template>
  <div
    v-if="!marketStore.subCategoriesOpen && !marketStore.categoriesLoading"
    class="absolute bottom-[4.5rem] left-0 right-0 z-20 flex w-full flex-col items-center justify-center text-sm"
  >
    <div
      class="next-icon flex cursor-pointer flex-col items-center justify-center transition-all hover:underline active:scale-90"
      data-cy="e412cd83ec602c67"
      @click="marketStore.subCategoriesOpen = true"
    >
      <div>
        {{ $t('index.view.more') }}
      </div>
      <BaseNextWhite class="rotate-90" />
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
