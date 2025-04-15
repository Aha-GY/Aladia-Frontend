<template>
  <div class="fixed left-1/2 top-[7rem] grid w-[19.5rem] translate-x-[23rem]">
    <PostsWidgetsCategories class="mb-[0.625rem]" />
    <PostsWidgetsUserSearch class="mb-[0.625rem]" />
    <PostsWidgetsNewcourses class="mb-[0.625rem]" />
    <PostsWidgetsSuggestions />
  </div>
</template>

<script>
export default {
  setup() {
    const socialStore = useSocialStore();
    return { socialStore };
  },
};
</script>
