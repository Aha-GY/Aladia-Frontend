<template>
  <div
    class="flex cursor-pointer items-center gap-1 rounded px-2 py-1 text-sm hover:bg-white/10"
  >
    <div class="relative flex size-5 items-center justify-center">
      <i class="fa-light fa-filter-list" />
      <span
        v-if="active"
        class="absolute right-0.5 top-0.5 size-1.5 rounded-full bg-[#d9bb4c]"
      />
    </div>
    {{ $t('org.filter') }}
  </div>
</template>

<script>
export default {
  computed: {
    active() {
      const route = useRoute();
      const { title, categoryId, subCategoryId, ...rest } = route.query;
      return Object.keys(rest).length > 0;
    },
  },
};
</script>
