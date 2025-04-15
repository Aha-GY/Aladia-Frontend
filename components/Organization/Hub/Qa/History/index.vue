<template>
  <div class="flex flex-col gap-2 text-[#D9D9D9]">
    <div class="mb-2 text-2xl">
      {{ $t('filter.qa') }}
    </div>
    <OrganizationHubQaHistoryHeader />
    <PostsDetail />
    <PostsCreation type="question-only-tab" @send="onSend" />
    <SocialContextSwitchPopup />
    <client-only>
      <OrganizationHubQaHistoryTable />
    </client-only>
  </div>
</template>

<script>
export default {
  setup() {
    const hubQaStore = useHubQaStore();
    const socialStore = useSocialStore();
    return { hubQaStore, socialStore };
  },
  data() {
    return {
      deleteLoading: false,
      confirmShow: false,
    };
  },
  methods: {
    async onSend() {
      await this.$nextTick();
      this.hubQaStore.getPosts();
    },
  },
};
</script>
