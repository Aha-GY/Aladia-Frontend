<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center gap-2">
      <div class="text-xs font-medium text-[#707070]">
        {{ $t('meet.chat.reply') }}
      </div>
      <div class="flex items-center gap-2 rounded-full bg-white/5 p-1.5 pr-3.5">
        <div class="flex h-7 w-7 items-center justify-center">
          <i class="fa-solid fa-users text-sm text-[#FAFAFA]" />
        </div>
        <div class="text-sm text-[#D4D4D4]">
          {{ $t('meet.chat.everyone') }}
        </div>
      </div>
    </div>

    <div class="flex items-center gap-2 rounded-5 bg-black/60 p-2">
      <div class="flex w-0 flex-1 items-center gap-2.5 px-2 py-1">
        <input
          v-model="draftMessage"
          class="w-0 flex-1 border-none bg-transparent outline-none"
          data-cy="1176446f541c66a3"
          @keydown.enter="sendMessage"
        />
        <el-popover
          v-model:visible="open"
          trigger="click"
          :show-arrow="false"
          :width="300"
          placement="top"
          :teleported="false"
          :persistent="false"
        >
          <template #reference>
            <div
              class="flex h-5 w-5 cursor-pointer items-center justify-center rounded-5 hover:bg-white/5"
            >
              <i class="fa-solid fa-smile text-xs text-[#E5E5E5]" />
            </div>
          </template>
          <LazyBaseEmojiPicker @change="onEmojiChange" />
        </el-popover>
      </div>

      <div
        v-if="draftMessage"
        class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-5 bg-white/5 transition-all"
        data-cy="c0c7f0f7b11c5f30"
        @click="sendMessage"
      >
        <i class="fa-regular fa-send text-base text-[#FAFAFA]" />
      </div>
    </div>
  </div>
</template>

<script>
import { hmsActions } from '~/utils/hms';

export default {
  setup() {
    const hmsStore = useHmsStore();
    return { hmsStore };
  },
  data() {
    return {
      draftMessage: '',
      role: '',
      peerId: '',
      open: false,
    };
  },
  methods: {
    async sendMessage() {
      if (this.draftMessage && this.draftMessage.trim().length > 0) {
        try {
          if (this.role) {
            await hmsActions.sendGroupMessage(this.draftMessage, [this.role]);
          } else if (this.peerId) {
            await hmsActions.sendDirectMessage(this.draftMessage, this.peerId);
          } else {
            await hmsActions.sendBroadcastMessage(this.draftMessage);
          }
          this.draftMessage = '';
        } catch (err) {
          this.$toast.error(
            this.$t('meet.chat.error', {
              error: err.message,
            }),
          );
        }
      }
    },
    select({ role, peerId }) {
      this.role = role;
      this.peerId = peerId;
    },
    onEmojiChange(emoji) {
      if (emoji) {
        this.draftMessage += emoji.i;
      }
      this.open = false;
    },
  },
};
</script>
