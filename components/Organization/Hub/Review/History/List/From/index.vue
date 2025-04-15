<template>
  <div class="flex items-center gap-2">
    <BaseAvatarNext
      :picture="item?.owner?.picture"
      size="md"
      :show-online="false"
    />
    <div class="truncate text-xs text-[#D9D9D9]">{{ name }}</div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    name() {
      return this.item?.owner?.name;
    },
  },
};
</script>
