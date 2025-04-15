<template>
  <Teleport to="body">
    <div
      ref="rightSide"
      class="fixed right-0 top-16 z-[100] w-[28rem] overflow-hidden rounded-[0.3125rem] border-[1px] border-white/5 bg-[#060606] font-light text-[#FAFAFA] transition-all duration-300 max-sm:left-0"
      :class="[
        hubChatStore.isChat
          ? 'max-w-[28rem] max-sm:!w-full'
          : hubChatStore.rightSiderType
            ? 'max-sm:!w-full sm:max-w-[28rem]'
            : 'max-w-0 overflow-hidden',
        hubChatStore.rightSiderType ? 'sm:right-4' : '',
      ]"
      style="height: calc(100vh - 5rem)"
      data-cy="OrganizationHubChatRightSideMessages-1"
    >
      <Transition name="slide-fade-in" mode="out-in">
        <OrganizationHubChatRightSideChat v-if="hubChatStore.isChat" />

        <div v-else class="flex h-full flex-col max-sm:w-full sm:w-[28rem]">
          <OrganizationHubChatRightSideHeader v-if="showHeader" />
          <OrganizationHubChatRightSideCreate
            v-if="hubChatStore.rightSiderType === 'create'"
          />
          <OrganizationHubChatRightSideInfo
            v-if="hubChatStore.rightSiderType === 'info'"
          />
          <OrganizationHubChatRightSideEdit
            v-if="hubChatStore.rightSiderType === 'edit'"
          />
          <OrganizationHubChatRightSideMedia
            v-if="hubChatStore.rightSiderType === 'media'"
            @locate-message="$emit('locate-message', $event)"
          />
          <OrganizationHubChatRightSideFile
            v-if="hubChatStore.rightSiderType === 'file'"
            @locate-message="$emit('locate-message', $event)"
          />
          <OrganizationHubChatRightSideLink
            v-if="hubChatStore.rightSiderType === 'link'"
            @locate-message="$emit('locate-message', $event)"
          />
          <OrganizationHubChatRightSideMessages
            v-if="hubChatStore.rightSiderType === 'messages'"
            @locate-message="$emit('locate-message', $event)"
          />
        </div>
      </Transition>
    </div>
  </Teleport>
</template>
<script>
export default {
  emits: ['locate-message'],
  setup() {
    const hubChatStore = useHubChatStore();
    const rightSide = ref(null);
    onClickOutside(
      rightSide,
      () => {
        hubChatStore.closeRightSider();
      },
      {
        ignore: [
          '.el-popper',
          '.chat-preview',
          '.el-dialog',
          '.el-overlay-dialog',
        ],
      },
    );
    return { hubChatStore, rightSide };
  },
  computed: {
    showHeader() {
      return !['media', 'file', 'link', 'messages'].includes(
        this.hubChatStore.rightSiderType,
      );
    },
  },
};
</script>
