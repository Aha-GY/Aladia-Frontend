<template>
  <AdminCategories />
</template>

<script>
export default {
  setup() {
    const categoriesStore = useCategoriesStore();
    return { categoriesStore };
  },
};
</script>
