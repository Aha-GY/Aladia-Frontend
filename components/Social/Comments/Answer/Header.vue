<template>
  <div class="mb-2 flex items-center gap-4 text-sm">
    <div class="flex items-center gap-2 font-semibold">
      <span
        class="cursor-pointer underline-offset-2 transition-all hover:underline"
        data-cy="8e8c61b0a7e201a8"
        @click="onUserClick"
      >
        {{ item.owner.name }}
      </span>
      <i v-if="isOwner" class="fa-solid fa-badge-check" />
    </div>
    <div class="text-white/50">
      {{ formatDate(item.createdAt, 'hh:mm a DD MMM YYYY') }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
  },
  setup() {
    const socialStore = useSocialStore();
    return { socialStore };
  },
  computed: {
    isOwner() {
      return this.item?.owner?.id === this.socialStore.postItem?.owner?.id;
    },
  },
  methods: {
    onUserClick() {
      this.$emit('onUserClick');
    },
  },
};
</script>
