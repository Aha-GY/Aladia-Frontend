<template>
  <div
    class="flex h-[3.4375rem] items-center justify-between bg-[#0c0c0c] px-4 py-2"
  >
    <div class="flex items-center gap-3 text-sm">
      <BaseIconClose
        v-if="isClose"
        data-cy="OrganizationHubChatRightSideMediasMessagesHeader-close"
        @click="onBack"
      />
      <div
        v-else
        class="group/close flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-all hover:bg-white/5 active:scale-95"
        data-cy="fec757fc8b2b62de"
        @click="onBack"
      >
        <i
          class="fa-light fa-arrow-left transition-all group-hover/close:scale-125"
        />
      </div>
      <div v-if="hubChatStore.rightSiderType === 'create'">
        {{
          hubChatStore.roomId === -1
            ? $t('org.room.create.new')
            : $t('org.room.member.add')
        }}
      </div>

      <div v-else>
        {{
          titleMap[hubChatStore.rightSiderType]
            ? $t(titleMap[hubChatStore.rightSiderType])
            : titleMap[hubChatStore.rightSiderType]
        }}
      </div>
    </div>
    <div
      v-if="hubChatStore.rightSiderType === 'info'"
      class="flex items-center gap-3 text-white/80"
    >
      <i class="fa-regular fa-bell text-xs" />
      <BaseSwitcher
        :active="!(room?.preferences?.mute || false)"
        @click="onMute"
      />
    </div>
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
      titleMap: {
        info: 'org.titleMap.info',
        members: 'org.titleMap.members',
        medias: 'org.titleMap.medias',
        messages: 'org.titleMap.messages',
        edit: 'org.titleMap.edit',
        media: 'Photo&Video',
        file: 'Files',
        link: 'Shared Links',
      },
      muteLoading: false,
    };
  },
  computed: {
    isClose() {
      return (
        this.hubChatStore.rightSiderType === 'create' ||
        this.hubChatStore.rightSiderType === 'info'
      );
    },
    room() {
      return this.hubChatStore.roomInfo;
    },
  },
  methods: {
    onBack() {
      switch (this.hubChatStore.rightSiderType) {
        case 'create':
        case 'info':
          this.hubChatStore.roomId = null;
          this.hubChatStore.rightSiderType = '';
          break;
        default:
          this.hubChatStore.rightSiderType = 'info';
          break;
      }
    },
    async onMute() {
      if (this.muteLoading) {
        return;
      }
      this.muteLoading = true;
      await this.hubChatStore.muteRoom({
        roomId: this.room.id,
        value: !this.room.preferences?.mute,
      });
      this.muteLoading = false;
    },
  },
};
</script>
