<template>
  <div
    class="relative flex items-center justify-center transition-all"
    :class="[
      item.type === 'one-to-one' ? 'rounded-full' : 'rounded-md',
      size === 'small' ? 'h-8 w-8' : 'h-12 w-12',
    ]"
  >
    <div v-if="item.type === 'one-to-one' || item.type === 'group'">
      <BaseAvatarNext
        :picture="item.type === 'one-to-one' ? item.picture : item.image"
        :user-id="item.oneToOnePeer?.id || item.id"
        :show-online="false"
        :show-check="false"
        :story="
          item.type === 'one-to-one'
            ? item?.oneToOnePeer?.story || item.story
            : null
        "
        :size="size === 'small' ? 'sm' : 'md'"
        :round="item.type === 'group' ? false : true"
        :show-story="item.type === 'group' ? false : true"
        :default-icon="
          item.type === 'group' ? 'fa-light fa-users' : 'fa-light fa-user'
        "
      >
        <template v-if="showCheck" #button>
          <slot />
        </template>
      </BaseAvatarNext>
    </div>

    <template v-else-if="item.type === 'space'">
      <BaseAvatarNext
        v-if="item.image"
        :picture="item.image"
        :show-online="false"
        :size="size === 'small' ? 'sm' : 'md'"
        :round="false"
        :show-story="false"
      >
        <template v-if="showCheck" #button>
          <slot />
        </template>
      </BaseAvatarNext>
      <SocialShareSpace
        v-else
        :item="item"
        :is-shopping="isShopping"
        :size="size === 'small' ? 'sm' : 'md'"
      >
        <template v-if="showCheck" #button>
          <slot />
        </template>
      </SocialShareSpace>
    </template>

    <SocialShareSpace
      v-else-if="item.type === 'folder'"
      :item="item"
      :is-shopping="isShopping"
      :size="size === 'small' ? 'sm' : 'md'"
      :open="showFolder"
      :space="false"
    >
      <template v-if="showCheck" #button>
        <slot />
      </template>
    </SocialShareSpace>
    <BaseAvatarNext
      v-else
      :picture="item.image"
      :show-online="false"
      :size="size === 'small' ? 'sm' : 'md'"
      :round="false"
      :show-story="false"
      default-icon="fa-light fa-book-open-reader"
    >
      <template v-if="showCheck" #button>
        <slot />
      </template>
    </BaseAvatarNext>
  </div>
</template>
<script>
export default {
  props: {
    item: Object,
    showFolder: Boolean,
    showSpace: Boolean,
    checkedItems: {
      type: Array,
      default: () => [],
    },
    size: {
      type: String,
      default: 'normal', // small, normal, large
    },
    showCheck: {
      type: Boolean,
      default: true,
    },
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
    isChecked() {
      return this.checkedItems.some((item) => item.id === this.item.id);
    },
  },
};
</script>
