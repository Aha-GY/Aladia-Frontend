<template>
  <div
    v-for="item in checkedItems"
    :key="item.id"
    class="flex items-center gap-2 rounded-full bg-white/5 p-1 px-2 text-white/80 hover:bg-white/10"
  >
    <OrganizationHubChatLeftSideMemberAvatar
      size="small"
      :item="item"
      :show-online="false"
    />
    <div class="flex-1 truncate">{{ item.name }}</div>
    <div
      class="flex size-5 cursor-pointer items-center justify-center rounded-full hover:bg-white/10"
      @click="handleCheck(item)"
    >
      <i class="fa-solid fa-close text-xs" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    checkedItems: Array,
  },
  emits: ['check'],
  methods: {
    handleCheck(item) {
      this.$emit('check', item);
    },
  },
};
</script>
