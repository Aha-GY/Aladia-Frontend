<template>
  <div
    class="ql-editor flex w-full justify-end rounded-md !p-0 transition-all"
    :class="showAvatar ? 'overflow-hidden' : ''"
  >
    <div
      class="max-w-screen-sm:max-w-[80%] flex max-w-[50%] items-end gap-1.5 py-0.5 pr-2"
      :class="[
        showAvatar ? 'overflow-hidden' : '',
        isPopup ? 'max-w-[80%]' : '',
      ]"
    >
      <div
        ref="box"
        class="group/item relative flex w-full flex-1 flex-col rounded-xl bg-gradient-to-b from-[#3B3111]/70 to-[#3B3111]/80 px-2 py-1 pt-2"
        :class="showAvatar ? 'message-bubble' : ''"
      >
        <div
          v-if="showName"
          class="mb-0.5 flex items-center justify-between gap-2"
        >
          <div class="flex items-center gap-2 truncate">
            <div
              class="cursor-pointer text-sm font-bold text-white/70 underline-offset-4 hover:underline"
            >
              {{ $t('meet.you') }}
            </div>
            <div class="text-xs text-white/30">
              {{ room?.userRole.slice('chat-room-'.length) }}
            </div>
          </div>
        </div>
        <OrganizationHubChatContentForward v-if="forward" :forward="forward" />
        <OrganizationHubChatContentReply
          v-if="reply && reply.id"
          :item="reply"
          @locate-reply-message="$emit('locate-reply-message', $event)"
        />
        <div class="flex flex-col gap-1">
          <div
            v-for="(file, index) in files"
            :key="index"
            class="relative flex items-center justify-center"
          >
            <img
              v-if="file.src && file.type.includes('image')"
              class="flex-1 rounded-5 object-cover"
              :class="!isPopup ? '' : ''"
              :src="file.src"
            />
            <video
              v-else-if="file.src && file.type.includes('video')"
              class="flex-1 rounded-5 object-cover"
              :class="!isPopup ? 'max-h-[18.75rem]' : ''"
              :src="file.src"
            />
            <BaseEditorAttachment
              v-else
              :files="[file]"
              :is-click="false"
              :is-close="false"
            />

            <div
              class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <el-progress
                type="circle"
                :percentage="progress[index]"
                :width="50"
                :stroke-width="3"
                color="RGBA(255, 255, 255, 0.6)"
              >
                <span v-if="progress[index] < 100">
                  {{ progress[index] }} %
                </span>
                <i v-else class="fa-thin fa-check text-xl text-[#FFFFFF]/80" />
              </el-progress>
            </div>
          </div>
        </div>
        <OrganizationHubChatContentAnswersLoom
          v-if="message.loomUrls && message.loomUrls.length"
          :urls="message.loomUrls"
          :is-popup="isPopup"
        />
        <div
          style="word-break: break-word"
          class="chat-message ql-quill-editor flex-shrink-0 text-sm leading-4 text-[#828282] [&_a]:text-white/70"
          v-html="message.content"
        />
        <div
          class="flex items-center justify-end gap-2 py-1 text-right text-xs font-[300] text-white/30"
        >
          <span>{{ formatDate(new Date(), 'HH:mm') }}</span>
          <div class="flex w-3 items-end text-white/60">
            <el-popover
              v-if="isError"
              v-model:visible="showActions"
              trigger="hover"
              width="80"
              placement="top"
              :teleported="true"
              :show-arrow="false"
              :popper-style="{
                minWidth: '5rem',
                padding: '0px !important',
                borderRadius: '0.3125rem',
              }"
            >
              <template #reference>
                <i
                  class="fa-regular fa-circle-exclamation cursor-pointer text-xs text-[#F56C6C]"
                />
              </template>
              <div
                class="flex flex-col gap-0.5 p-[0.25rem] text-xs text-white/80"
              >
                <div
                  class="flex cursor-pointer items-center gap-1 rounded-[0.3125rem] p-1 hover:bg-white/10 active:scale-95"
                  data-cy="d2c38efc6ccd0b7f"
                  @click.stop="onResend"
                >
                  <i class="fa-solid fa-rotate-right text-[0.625rem]" />
                  {{ $t('org.activity.message.resend') }}
                </div>
                <div
                  class="flex cursor-pointer items-center gap-1 rounded-[0.3125rem] p-1 text-[#FF4A4A]/80 hover:bg-white/10 active:scale-95"
                  data-cy="ee7a3e664d81b200"
                  @click.stop="onDelete"
                >
                  <i class="fa-solid fa-trash-can text-[0.625rem]" />
                  {{ $t('org.activity.message.delete') }}
                </div>
              </div>
            </el-popover>
            <i v-else class="fa-solid fa-timer animate-spin text-xs" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    showAvatar: Boolean,
    showName: Boolean,
    sendingMessage: Object,
    isPopup: Boolean,
    scrollToBottom: Function,
  },
  emits: ['scroll-to-bottom'],
  setup() {
    const authStore = useAuthStore();
    const hubChatStore = useHubChatStore();
    return { hubChatStore, authStore };
  },
  data() {
    return {
      progress: [],
      isError: false,
      showActions: false,
    };
  },
  computed: {
    files() {
      return this.sendingMessage.sending.files;
    },
    reply() {
      return this.sendingMessage.reply;
    },
    forward() {
      return this.sendingMessage.forward;
    },
    message() {
      return this.sendingMessage.sending;
    },
    room() {
      return this.hubChatStore.chatInfo;
    },
    isLast() {
      return this.hubChatStore.sendingMessages.length - 1;
    },
  },
  mounted() {
    const { isSending } = this.sendingMessage;
    if (!isSending) {
      this.send();
    }
  },
  methods: {
    async onResend() {
      this.isError = false;
      this.showActions = false;
      this.send();
    },
    async onDelete() {
      this.showActions = false;
      const { id, roomId } = this.sendingMessage;
      const room = this.hubChatStore.sendingMessages.find(
        (item) => item.roomId === roomId,
      );
      room.messages = room.messages.filter((item) => item.id !== id);
    },
    async send() {
      const { forward } = this.sendingMessage;
      if (forward && forward.targetRoomId) {
        this.sendForwardMessage();
      } else {
        this.sendNewMessage();
      }
    },
    async sendNewMessage() {
      const { sending, reply, id, roomId } = this.sendingMessage;
      const { files, content, text, taggedUsers, loomUrls, mode } = sending;
      const sendingRoom = this.hubChatStore.sendingMessages.find(
        (item) => item.roomId === roomId,
      );
      if (sendingRoom) {
        sendingRoom.messages = sendingRoom.messages.map((item) => {
          if (item.id === id) {
            item.isSending = true;
          }
          return item;
        });
      }
      const message = {
        content,
        text,
        taggedUsers,
        roomId,
        loomUrls,
        attachments: [],
        mode,
      };
      try {
        if (files && files.length) {
          for (let i = 0; i < files.length; i++) {
            this.progress.push(0);
            const { fileId } = await upload({
              file: files[i],
              onProgress: (progress) => {
                this.progress[i] = progress;
              },
            });
            const metadata = {
              mimetype: files[i].type,
              size: files[i].size,
              name: files[i].name,
            };
            if (files[i].dimensions) {
              metadata.width = files[i].dimensions.width;
              metadata.height = files[i].dimensions.height;
            }
            message.attachments.push({
              fileId,
              metadata,
            });
          }
        }
        const url = this.extractUrl(content);
        if (url && !this.containsImgTag(content)) {
          const res = await this.hubChatStore.getLinkData({
            url,
          });
          if (res && res.title) {
            const { title, description, image } = res;
            message.link = {
              url,
              title,
              description,
              image,
            };
            message.content = this.convertUrlsToLinks(content);
          } else {
            message.content = this.convertUrlsToLinks(content);
          }
        }
        if (reply && reply.id) {
          message.replyTo = reply.id;
        }
        if (message.attachments.length === 0) {
          delete message.attachments;
        }
        const newMsg = await this.hubChatStore.createRoomMessage(message);
        if (newMsg) {
          if (sendingRoom) {
            if (newMsg.attachments && newMsg.attachments.length > 0) {
              newMsg.attachments.forEach((attachment) => {
                const sendingMsg = sendingRoom.messages.find(
                  (item) => item.id === id,
                );
                attachment.url = sendingMsg.sending.files.find(
                  (file) => file.name === attachment.name,
                ).src;
                attachment.loaded = true;
              });
            }
            sendingRoom.messages = sendingRoom.messages.filter(
              (item) => item.id !== id,
            );
            // add message to room
            const room = this.hubChatStore.roomsMessages.find(
              (item) => item.id === message.roomId,
            );
            if (!room?.messages.find((item) => item.id === newMsg.id)) {
              newMsg.dataType = 'message';
              room.messages.push(newMsg);
              this.scrollToBottom();
            }
          }
        }
      } catch (error) {
        this.isError = true;
        console.log(error);
      }
    },
    async sendForwardMessage() {
      const { id } = this.sendingMessage;
      const { targetRoomId, roomId, messages } = this.forward;
      if (targetRoomId === this.hubChatStore.chatId) {
        try {
          const res = await this.hubChatStore.forwardMessages({
            roomId,
            targetRoomId,
            messageIds: messages.map((r) => r.id),
          });
          if (res) {
            const sendingRoom = this.hubChatStore.sendingMessages.find(
              (item) => item.roomId === targetRoomId,
            );
            if (sendingRoom) {
              sendingRoom.messages = sendingRoom.messages.filter(
                (item) => item.id !== id,
              );
            }
          }
          this.loading = false;
          this.$emit('scroll-to-bottom');
          return;
        } catch (e) {
          console.log(e);
          this.isError = true;
        }
      }
    },
    containsImgTag(html) {
      const imgTagRegex = /<img\b[^>]*>/i;
      return imgTagRegex.test(html);
    },
    extractUrl(text) {
      const str = text.replace(/<a\b[^>]*\bhref="[^"]*"[^>]*>/gi, '<a>');
      const UrlRegExp =
        /\b(?:https?:\/\/|www\.)[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+(?:[^\s<>[\]{}]*)\b/;
      const match = str.match(UrlRegExp);
      return match ? match[0] : null;
    },
    convertUrlsToLinks(text) {
      const placeholders = [];
      const preservedText = text.replace(/<a\b[^>]*>(.*?)<\/a>/gi, (match) => {
        const placeholder = `__PLACEHOLDER__${placeholders.length}__`;
        placeholders.push(match);
        return placeholder;
      });

      const urlRegex =
        /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;
      let convertedText = preservedText.replace(
        urlRegex,
        '<a href="$1" style="color:#CFA200">$1</a>',
      );

      placeholders.forEach((placeholder, index) => {
        convertedText = convertedText.replace(
          `__PLACEHOLDER__${index}__`,
          placeholder,
        );
      });

      return convertedText;
    },
  },
};
</script>
<style scoped>
.message-bubble::after {
  content: '';
  position: absolute;
  background-color: rgba(59, 49, 17, 0.8);
  bottom: 0;
  right: 0;
  width: 1.875rem;
  height: 1rem;
  clip-path: path('M 0 0 Q 10 10 20 0 Q 10 24 0 0');
  transform: translate(1rem, 0.375rem) rotate(60deg);
}
</style>
