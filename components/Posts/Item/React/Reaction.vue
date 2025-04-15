<template>
  <div class="react-bg flex rounded p-2 backdrop-blur-sm">
    <PostsItemReactItem name="Lovely" :un-hover="true" class="mr-1.5" />
    <PostsItemReactItem name="Angry" :un-hover="true" class="mr-1.5" />
    <PostsItemReactItem name="Like" :un-hover="true" class="mr-1.5" />
    <PostsItemReactItem name="Funny" :un-hover="true" class="mr-1.5" />
    <PostsItemReactItem name="Sad" :un-hover="true" />
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
<style scoped>
.react-bg {
  background: linear-gradient(
    92deg,
    rgba(56, 113, 226, 0.6) 0.31%,
    rgba(234, 145, 99, 0.6) 58.05%,
    rgba(103, 103, 103, 0.6) 99.29%
  );
}
</style>
