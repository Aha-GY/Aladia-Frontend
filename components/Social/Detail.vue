<template>
  <client-only>
    <SocialComments v-if="socialStore.commentsPopup" />
    <SocialCommentsQuestionPopup v-if="socialStore.questionPopup" />
    <SocialItemReactSelect v-if="socialStore.reactSelect" />
  </client-only>
</template>

<script>
export default {
  setup() {
    const socialStore = useSocialStore();
    return { socialStore };
  },
};
</script>
