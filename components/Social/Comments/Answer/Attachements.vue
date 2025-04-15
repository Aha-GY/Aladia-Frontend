<template>
  <div v-if="item.files?.length" class="flex items-center gap-3 pb-3 pt-1">
    <img
      v-for="file in item.files"
      :key="file.id"
      class="aspect-video h-24 rounded object-cover"
      :src="file.url"
    />
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
  },
};
</script>
