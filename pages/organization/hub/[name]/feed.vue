<template>
  <div class="__feed relative mx-auto flex max-w-[82.5rem] justify-center">
    <div class="relative flex">
      <PostsWidgetsLeft v-if="!$device.isMobile" class="max-xl:hidden" />
      <Social />
      <PostsWidgetsRight v-if="!$device.isMobile" class="max-lg:hidden" />
    </div>

    <div>
      <SocialProfile />
      <PostsDetail />
    </div>
  </div>
</template>
<script>
export default {
  setup() {
    const socialStore = useSocialStore();
    return { socialStore };
  },
  beforeMount() {
    const { postId } = this.$route.query;

    !postId && this.resetPopup();
  },
  methods: {
    resetPopup() {
      this.socialStore.commentsPopup = false;
      this.socialStore.questionPopup = false;
      this.socialStore.sharePopup = false;
      this.socialStore.postItem = null;
      this.socialStore.contextSwitchPopUpVisible = false;
    },
  },
};
</script>
