<template>
  <div
    class="flex flex-col gap-1 rounded-md bg-[#0A0A0A]/80 p-1 shadow-[2px_2px_4px_rgba(0,0,0,0.25)] backdrop-blur"
  >
    <template v-if="!room?.deleted">
      <div
        class="flex cursor-pointer items-center gap-2 rounded-md p-2 text-white/60 transition-all hover:bg-white/5 hover:text-white/80 active:scale-95"
        data-cy="a641392815de0116"
        @click="onInfo"
      >
        <div class="flex h-4 w-4 items-center justify-center">
          <i class="fa-regular fa-circle-info text-xs" />
        </div>
        <div class="text-sm">
          {{ $t('org.activity.chat.info') }}
        </div>
      </div>
      <div
        class="flex cursor-pointer items-center gap-2 rounded-md p-2 text-white/60 transition-all hover:bg-white/5 hover:text-white/80 active:scale-95"
        data-cy="7cc0139d385a8fa2"
        @click="
          onSelect(true);
          onClose();
        "
      >
        <div class="flex h-4 w-4 items-center justify-center">
          <i class="fa-regular fa-circle-check text-xs" />
        </div>
        <div class="text-sm">{{ $t('org.activity.chat.select') }}</div>
      </div>
      <div
        class="flex cursor-pointer items-center gap-2 rounded-md p-2 text-white/60 transition-all hover:bg-white/5 hover:text-white/80 active:scale-95"
        data-cy="8a5e90da6d9ca21e"
        @click="onMute"
      >
        <div class="flex h-4 w-4 items-center justify-center">
          <i v-if="room?.preferences?.mute" class="fa-solid fa-bell text-xs" />
          <i v-else class="fa-solid fa-bell-slash text-xs" />
        </div>
        <div class="text-sm">
          {{
            room?.preferences?.mute
              ? $t('org.activity.room.unmute')
              : $t('org.activity.room.mute')
          }}
        </div>
      </div>
      <div
        class="flex cursor-pointer items-center gap-2 rounded-md p-2 text-white/60 transition-all hover:bg-white/5 hover:text-white/80 active:scale-95"
        data-cy="f465029a2742fd3b"
        @click="onShowClear"
      >
        <div class="flex h-4 w-4 items-center justify-center">
          <i class="fa-solid fa-brush rotate-180 text-xs" />
        </div>
        <div class="text-sm">
          {{ $t('org.activity.chat.clear.label') }}
        </div>
      </div>
    </template>
    <OrganizationHubChatLeftSideDelete v-if="room" :item="room" />
  </div>
  <client-only>
    <el-dialog
      v-model="showClear"
      :show-close="false"
      align-center
      append-to-body
      width="27.5rem"
      class="!rounded-lg"
    >
      <div
        class="rounded-md border border-[#fff]/10 bg-[#020202] p-3 text-sm text-white/80"
      >
        <div class="mb-3 flex items-center justify-between text-base">
          <div class="flex items-center gap-3">
            <i class="fa-solid fa-brush rotate-180 text-xs" />
            {{ $t('org.activity.chat.clear.label') }}
          </div>
          <BaseIconClose @click="showClear = false" />
        </div>
        <div class="flex flex-col justify-center gap-4 text-white/60">
          <div
            v-if="room.type === 'one-to-one'"
            class="flex flex-col items-center gap-2"
            data-cy="9e0f90226d4d9a92"
            @click="deleteForAll = !deleteForAll"
          >
            <div>
              {{ $t('org.activity.chat.clear.dialog') }}
            </div>
            <div class="flex cursor-pointer items-center gap-2">
              <BaseCheckboxStyle
                :state="deleteForAll ? 'checked' : 'unchecked'"
              />
              {{
                $t('org.activity.chat.clear.delete', {
                  roomName: room.name,
                })
              }}
            </div>
          </div>
          <div
            v-else
            class="flex flex-col items-center gap-2"
            data-cy="01822f159f3aefff"
            @click="deleteForAll = !deleteForAll"
          >
            <span v-if="!isDeleteForAll">
              {{ $t('org.activity.chat.clear.forMe') }}
            </span>
            <span v-else>
              {{ $t('org.activity.chat.clear.forAll') }}
            </span>
            <div
              v-if="isDeleteForAll"
              class="flex cursor-pointer items-center gap-2 hover:text-white/80"
            >
              <BaseCheckboxStyle
                :state="deleteForAll ? 'checked' : 'unchecked'"
              />
              {{ $t('org.activity.chat.clear.everyone') }}
            </div>
          </div>
          <div class="flex items-center justify-end gap-4">
            <BaseButton
              type="tertiary"
              data-cy="2ae3ede8c3510b59"
              @click="showClear = false"
            >
              {{ $t('base.upload.cancel') }}
            </BaseButton>
            <BaseButton
              type="error"
              :loading="clearLoading"
              data-cy="22c46b7704c47419"
              @click="onClear"
            >
              {{ $t('base.upload.clear') }}
            </BaseButton>
          </div>
        </div>
      </div>
    </el-dialog>
  </client-only>
</template>
<script>
export default {
  props: {
    onSelect: Function,
    room: Object,
  },
  emits: ['onClose'],
  setup() {
    const hubChatStore = useHubChatStore();
    return { hubChatStore };
  },
  data() {
    return {
      clearLoading: false,
      showClear: false,
      deleteForAll: false,
    };
  },
  computed: {
    isDeleteForAll() {
      return (
        this.room.userRole === 'chat-room-admin' ||
        this.room.userRole === 'chat-room-owner'
      );
    },
  },
  watch: {
    showClear: {
      handler(val) {
        if (!val) {
          this.deleteForAll = false;
        }
      },
      immediate: true,
    },
  },
  methods: {
    onChange(label) {
      switch (label) {
        case '':
          break;
      }
    },
    onClose() {
      this.$emit('onClose');
    },
    async onInfo() {
      this.onClose();
      this.hubChatStore.openRoomInfo(this.hubChatStore.chatId);
    },
    async onMute() {
      this.onClose();
      await this.hubChatStore.muteRoom({
        roomId: this.room.id,
        value: this.room.preferences?.mute ? false : true,
      });
    },
    onShowClear() {
      this.showClear = true;
      this.isDeleteForAll = false;
      this.onClose();
    },
    async onClear() {
      this.clearLoading = true;
      const params = {
        roomId: this.hubChatStore.chatId,
      };
      if (this.isDeleteForAll) {
        params.deleteForAll = this.deleteForAll;
      }
      try {
        await this.hubChatStore.clearRoomHistory(params);
        this.clearLoading = false;
        this.showClear = false;
      } catch {
        this.clearLoading = false;
      }
    },
  },
};
</script>
