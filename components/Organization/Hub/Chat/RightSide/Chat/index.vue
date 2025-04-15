<template>
  <div class="flex h-full w-[25rem] flex-col">
    <OrganizationHubChatRightSideChatHeader />

    <OrganizationHubChatContentAnswers
      :is-lateral="true"
      :is-select="isSelect"
      :on-reply="onReply"
      :actives="actives"
      :on-change="onChange"
      :messages="hubChatStore.lateralMessages"
      class="bg-[#080808]"
    />
    <client-only>
      <div v-if="hubChatStore.lateralChatId" class="w-full">
        <OrganizationHubChatContentEditor
          :is-lateral="true"
          :reply-item="replyItem"
          :on-reply="onReply"
        />
      </div>
    </client-only>
  </div>
</template>
<script>
export default {
  setup() {
    const hubChatStore = useHubChatStore();
    return { hubChatStore };
  },
  data() {
    return {
      isSelect: false,
      replyItem: {},
      actives: [],
    };
  },
  methods: {
    onSelect(state) {
      this.isSelect = state;
      if (!this.isSelect) {
        this.actives = [];
      }
    },
    onReply(item) {
      this.replyItem = item;
    },
    onChange(id) {
      if (!this.isSelect) {
        return;
      }
      const index = this.actives.indexOf(id);
      if (index === -1) {
        this.actives.push(id);
      } else {
        this.actives.splice(index, 1);
      }
    },
  },
};
</script>
