<template>
  <div
    ref="itemHeader"
    class="relative flex"
    data-cy="c4cc5605e407dc99"
    @click="handleUserClick"
  >
    <div class="relative shrink-0">
      <BaseAvatarNext
        :picture="item?.owner?.picture"
        :story="item?.owner?.story"
        :user-id="item?.owner?.id"
        :online="item?.owner?.online || isCurrUser"
        :source="'feed'"
        size="md"
      />
    </div>

    <div class="flex flex-1 items-center overflow-hidden bg-transparent">
      <PostsItemHeaderPost
        :item="item"
        :is-popup="isPopup"
        :data-cy="isPopup ? 'post-popup-options' : 'post-options'"
        :is-repost="isRepost"
        @delete="handleDelete"
        @hide="handleHide"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
    isPopup: {
      type: Boolean,
      default: false,
    },
    isRepost: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const authStore = useAuthStore();
    const socialStore = useSocialStore();
    const profileStore = useProfileStore();
    const fluxesStore = useFluxesStore();
    return { socialStore, authStore, profileStore, fluxesStore };
  },
  data() {
    return {
      optionShow: false,
    };
  },
  computed: {
    user() {
      return this.authStore.context;
    },
    isCurrUser() {
      return this.user === this.item?.owner?.id;
    },
    postType() {
      if (this.item.type === 'repost') {
        return this.item.parent.type;
      }
      return this.item.type;
    },
    isTypePost() {
      return this.postType === 'post';
    },
    isTypeReview() {
      return this.postType === 'review';
    },
    isTypeQuestion() {
      return this.postType === 'question';
    },
    isAutoPost() {
      return this.postType === 'auto-post';
    },
    isReel() {
      return this.postType === 'reel';
    },
  },
  methods: {
    show(value) {
      console.log(value);
    },
    handleUserClick(event) {
      const parent = this.$refs.itemHeader;
      let target = event.target;

      while (target && target !== parent && !target.dataset.action) {
        target = target.parentElement;
      }

      if (target && target.dataset.action === 'toProfile') {
        this.socialStore.hidePostsPopup();
        this.profileStore.gotoProfilePage(this.item.owner);
      }
    },
    handleDelete(item) {
      this.$emit('delete', item);
    },
    handleHide(item) {
      this.$emit('hide', item);
    },
  },
};
</script>
