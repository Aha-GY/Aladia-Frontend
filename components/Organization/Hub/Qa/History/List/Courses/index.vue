<template>
  <div class="group flex items-center gap-2 overflow-hidden">
    <div class="relative h-6 w-10 shrink-0">
      <BaseCourseThumbnail class="h-full w-full" :url="entity.thumbnail?.url" />
    </div>
    <div class="w-0 flex-1 truncate text-sm text-[#D9D9D9]">
      {{ entity.title || '---' }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
  },
  computed: {
    entity() {
      return this.item.entity || {};
    },
  },
};
</script>
