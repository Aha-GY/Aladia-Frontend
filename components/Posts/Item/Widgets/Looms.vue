<template>
  <div class="mt-4">
    <div
      v-for="file in files"
      :key="file"
      class="mb-4 rounded-[0.3125rem] last:mb-0"
    >
      <PostsItemWidgetsLoomItem :src="file" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    files: Array,
  },
};
</script>
