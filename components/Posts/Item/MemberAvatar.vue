<template>
  <div
    class="relative flex h-11 w-11 items-center justify-center transition-all"
    :class="[
      item.type === 'one-to-one' ? 'rounded-full' : 'rounded-md',
      item.type === 'folder' || item.type === 'space' || item.type === 'course'
        ? 'bg-white/10 hover:brightness-75'
        : 'bg-white/10 hover:brightness-75',
    ]"
  >
    <BaseAvatarNext
      v-if="item.type === 'one-to-one'"
      :show-online="false"
      :picture="item.image"
      size="md"
    />
    <BaseAvatarNext
      v-else-if="item.type === 'group'"
      :picture="item.image"
      :is-group="true"
      :show-online="false"
      size="md"
    />
    <template v-else-if="item.type === 'space'">
      <i v-if="isShopping" class="fa-solid fa-book-open-reader" />
      <BaseAvatarNext
        v-else-if="item.image"
        :picture="item.image"
        :show-online="false"
        size="md"
      />
      <i
        v-else-if="item.icon"
        class="text-sm"
        :class="{
          [item.icon]: true,
          'fa-light': !isSelect,
          'fa-solid': isSelect,
        }"
        :style="{ color: item.color }"
      />
      <i
        v-else
        class="fa-hexagon"
        :class="isSelect ? 'fa-solid' : 'fa-light'"
        :style="{ color: item.color }"
      />
    </template>
    <BaseIconFolder
      v-else-if="item.type === 'folder'"
      :open="showFolder"
      class="size-10"
    />
    <BaseAvatarNext
      v-else
      :picture="item.image"
      :round="false"
      size="sm"
      :show-online="false"
    />
  </div>
</template>
<script>
export default {
  props: {
    item: Object,
    showFolder: Boolean,
    showSpace: Boolean,
  },
  setup() {
    const authStore = useAuthStore();
    const hubChatStore = useHubChatStore();
    const profileStore = useProfileStore();
    return { authStore, hubChatStore, profileStore };
  },
  computed: {
    user() {
      return this.profileStore.myProfileDetail;
    },
    isShopping() {
      return this.item.entityId === this.user.shoppingSpace;
    },
    isSelect() {
      return this.hubChatStore.chatId === this.item.id;
    },
    isShowSpace() {
      return (
        ['space', 'course', 'folder'].includes(
          this.hubChatStore.chatInfo.type,
        ) && this.item.type === 'space'
      );
    },
  },
};
</script>
