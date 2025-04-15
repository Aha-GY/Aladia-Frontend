<template>
  <div
    ref="input"
    class="group/input relative w-full flex-1 rounded-md transition-all duration-300"
  >
    <div
      v-if="
        hubChatStore.editData &&
        hubChatStore.editData.roomId &&
        hubChatStore.editData.roomId === chatId
      "
      class="relative flex items-center bg-[#020202]"
    >
      <OrganizationHubChatContentEdit class="flex-1" />
      <div
        class="group flex w-[2.875rem] cursor-pointer items-center justify-center text-white/50 transition-all hover:text-white/70"
        data-cy="2140bb84aa424c3a"
        @click="closeEdit"
      >
        <BaseIconClose />
      </div>
    </div>
    <div
      v-else-if="
        replyItem.id &&
        replyItem.roomId === chatId &&
        !hubChatStore.forwardData.targetRoomId
      "
      class="relative flex items-center bg-[#020202]"
    >
      <OrganizationHubChatContentReply
        :is-draft="true"
        :item="replyItem"
        class="flex-1"
      />
      <div
        class="group flex w-[2.875rem] cursor-pointer items-center justify-center text-white/50 transition-all hover:text-white/70"
        data-cy="77a638a75d8bd3e7"
        @click="onReply({})"
      >
        <BaseIconClose />
      </div>
    </div>
    <div
      v-else-if="
        hubChatStore.forwardData.targetRoomId &&
        hubChatStore.forwardData.targetRoomId === chatId
      "
      class="relative flex items-center bg-[#020202]"
    >
      <OrganizationHubChatContentForward :is-draft="true" class="flex-1" />
      <div
        class="group flex w-[2.875rem] cursor-pointer items-center justify-center text-white/50 transition-all hover:text-white/70"
        data-cy="46fb461b63829702"
        @click="hubChatStore.forwardData.targetRoomId = null"
      >
        <BaseIconClose />
      </div>
    </div>

    <div class="flex w-full items-center gap-2 bg-[#020202]">
      <client-only>
        <div class="flex-1">
          <LazyBaseEditor
            ref="editor"
            v-model="message"
            :name="
              isPopup
                ? 'chat-editor-popup'
                : isLateral
                  ? 'lateral-chat-editor'
                  : 'chat-editor'
            "
            :options="{
              placeholder: $t('org.activity.message.placeholder'),
            }"
            :auto-clear="true"
            :send-whitespace="sendWhitespace"
            :get-tag-list="getTagList"
            :uniform-bg="true"
            :auto-send-gif="true"
            @change="onChange"
            @send="onSend"
            @send-gif="onSendGif"
          />
        </div>
        <OrganizationHubChatContentMode
          v-if="authStore.isOrg && isOrgAdmin"
          :mode="mode"
          @change="($event) => (mode = $event)"
        />
      </client-only>
    </div>
  </div>
</template>

<script>
import WebSocketService from '~/utils/websocket';

export default {
  props: {
    replyItem: Object,
    onReply: Function,
    isLateral: Boolean,
    isPopup: Boolean,
  },
  emits: ['sent', 'resize'],
  setup() {
    const hubChatStore = useHubChatStore();
    const authStore = useAuthStore();
    const profileStore = useProfileStore();
    const websocket = WebSocketService.getInstance();
    return { hubChatStore, websocket, authStore, profileStore };
  },
  data() {
    return {
      focus: false,
      message: '',
      isEmoji: false,
      quill: null,
      files: [],
      loading: false,
      typingInterval: null,
      taggedUsers: [],
      sendWhitespace: false,
      resizeObserver: false,
      mode: 'organization',
    };
  },
  computed: {
    user() {
      return this.profileStore.myProfileDetail;
    },
    isOrgAdmin() {
      return this.authStore.isOrgAdmin;
    },
    chatId() {
      return this.isLateral
        ? this.hubChatStore.lateralChatId
        : this.isPopup
          ? this.hubChatStore.popupChatId
          : this.hubChatStore.chatId;
    },
  },
  watch: {
    'authStore.isOrg'() {
      if (this.isOrgAdmin) {
        this.mode = 'organization';
      } else {
        this.mode = 'organization-member';
      }
    },
    'hubChatStore.chatId'() {
      this.message = '';
    },
    'hubChatStore.lateralChatId'() {
      this.message = '';
    },
    'hubChatStore.editData.message'(val) {
      if (val) {
        if (this.hubChatStore.editData.roomId === this.chatId) {
          this.message = this.hubChatStore.editData.message.content;
          this.$nextTick(() => {
            this.$refs.editor.focus();
          });
        }
      }
    },
    'hubChatStore.forwardData.targetRoomId'(val) {
      if (
        val &&
        val === this.chatId &&
        this.hubChatStore.editData.roomId !== this.chatId
      ) {
        this.sendWhitespace = true;
      } else {
        this.sendWhitespace = false;
      }
    },
    'replyItem.id'(val) {
      if (val && this.replyItem.roomId === this.chatId) {
        this.$refs.editor.focus();
      }
    },
  },
  mounted() {
    if (!this.isOrgAdmin) {
      this.mode = 'organization-member';
    }
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === this.$refs.input) {
          this.$emit('resize', entry.contentRect.height);
        }
      }
    });
    this.resizeObserver.observe(this.$refs.input);
  },
  beforeUnmount() {
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  },
  methods: {
    async getTagList(searchTerm) {
      if (this.hubChatStore.chatInfo?.type === 'one-to-one') {
        return;
      }
      const { data } = await this.hubChatStore.searchRoomMembers({
        query: searchTerm,
        roomId: this.chatId,
      });
      return data;
    },
    onChange(val) {
      // this.message = val;
      if (val) {
        this.websocket.send('user-typing', {
          userName: this.authStore.isOrg ? this.user.name : this.user.firstName,
          userId: this.authStore.context,
          roomId: this.chatId,
        });
        if (!this.typingInterval) {
          this.typingInterval = setInterval(() => {
            this.websocket.send('user-typing', {
              userName: this.authStore.isOrg
                ? this.user.name
                : this.user.firstName,
              userId: this.authStore.context,
              roomId: this.chatId,
            });
          }, 3000);
        }
      } else {
        if (this.typingInterval) {
          clearInterval(this.typingInterval);
        }
      }
    },
    deepCopy(obj) {
      return JSON.parse(JSON.stringify(obj));
    },
    async sendTestMessage() {
      const sendingMessage = [];
      for (let i = 0; i < 60; i++) {
        const message = {
          roomId: this.chatId,
          content: `Test message ${i}`,
          text: `Test message ${i}`,
          files: [],
          taggedUsers: [],
        };
        sendingMessage.push({
          id: new Date().toISOString() + i,
          roomId: this.chatId,
          sending: message,
        });
      }
      const sendingRoom = this.hubChatStore.sendingMessages.find(
        (item) => item.roomId === this.chatId,
      );
      if (sendingRoom) {
        sendingRoom.messages = sendingRoom.messages.concat(sendingMessage);
      } else {
        this.hubChatStore.sendingMessages.push({
          roomId: this.chatId,
          isPopup: this.isPopup,
          messages: sendingMessage,
        });
      }
      this.$emit('sent');
    },
    stripHtmlTags(html) {
      return html.replace(/<[^>]*>/g, '');
    },
    containsImgTag(html) {
      const imgTagRegex = /<img\b[^>]*>/i;
      return imgTagRegex.test(html);
    },
    isCanSend() {
      return this.loading ||
        (this.files.length === 0 &&
          this.loomUrls.length === 0 &&
          !this.stripHtmlTags(this.message).trim() &&
          !this.containsImgTag(this.message))
        ? false
        : true;
    },
    isOnlyEmojis(text) {
      const emojiRegex = /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu;
      const matches = text.match(emojiRegex);
      const nonEmojiText = text.replace(emojiRegex, '').trim();
      if (nonEmojiText.length > 0) {
        return 0;
      }
      return matches && matches.length > 0 ? matches.length : 0;
    },
    containsEmojiGif(text) {
      const angryEmojiRegex = /[\u{1F620}-\u{1F621}]/u;
      const clapEmojiRegex = /[\u{1F44F}]/u;
      const lovelyEmojiRegex = /[\u{1F60D}\u{1F618}\u{1F970}]/u;
      const sadEmojiRegex = /[\u{1F622}-\u{1F625}\u{1F62D}]/u;
      const funnyEmojiRegex = /[\u{1F602}\u{1F923}]/u;

      if (angryEmojiRegex.test(text)) {
        return 'angry';
      } else if (clapEmojiRegex.test(text)) {
        return 'clap';
      } else if (lovelyEmojiRegex.test(text)) {
        return 'lovely';
      } else if (sadEmojiRegex.test(text)) {
        return 'sad';
      } else if (funnyEmojiRegex.test(text)) {
        return 'funny';
      }
      return '';
    },
    wrapperMessage(content, text) {
      const nums = this.isOnlyEmojis(text);
      if (nums && nums < 6) {
        if (nums === 1) {
          const gif = this.containsEmojiGif(text);
          if (gif) {
            return `<img src='/gifs/${gif}.gif' class='w-[1rem] emoji-gif '/>`;
          }
        }
        return `<div class='emoji-${nums}'>${text}</div>`;
      }
      return content;
    },
    async onSendGif(gif) {
      // const content = `<img class='chat-gif' src=${gif.images.fixed_height.url} />`;
      const file = await generateGifFile(gif);
      const newMessage = {
        id: new Date().toISOString(),
        roomId: this.chatId,
        sending: {
          content: '',
          text: '',
          files: [file],
          taggedUsers: [],
          loomUrls: [],
          mode: this.authStore.isOrg ? this.mode : 'personal',
        },
      };
      const sendingRoom = this.hubChatStore.sendingMessages.find(
        (item) => item.roomId === this.chatId,
      );
      if (sendingRoom) {
        sendingRoom.messages.push(newMessage);
      } else {
        this.hubChatStore.sendingMessages.push({
          roomId: this.chatId,
          isPopup: this.isPopup,
          messages: [newMessage],
        });
      }
      await sleep(0);
      this.$nextTick(() => {
        this.$emit('sent');
      });
    },
    async onSend(content, files, taggedUsers, text, loomFiles) {
      console.log('looms:', loomFiles);
      content = this.wrapperMessage(content, text);

      this.files = files;
      this.taggedUsers = taggedUsers;
      this.loomUrls = [];
      if (loomFiles && loomFiles.length) {
        this.loomUrls = loomFiles.map(
          (item) => item.embedUrl || item.sharedUrl,
        );
      }
      if (
        this.hubChatStore.editData.roomId &&
        this.hubChatStore.editData.roomId === this.chatId
      ) {
        this.editMessage(content, text);

        return;
      }
      if (this.hubChatStore.forwardData.targetRoomId === this.chatId) {
        const forwardMessage = {
          id: new Date().toISOString(),
          roomId: this.chatId,
          sending: {
            content: '',
            text: '',
            files: [],
            taggedUsers: [],
            mode: this.authStore.isOrg ? this.mode : 'personal',
          },
          forward: this.deepCopy(this.hubChatStore.forwardData),
        };
        this.forwardMessage(forwardMessage);
        this.hubChatStore.forwardData.targetRoomId = null;
      }
      if (!this.isCanSend()) {
        return;
      }
      this.loading = true;
      const newMessage = {
        id: new Date().toISOString(),
        roomId: this.chatId,
        sending: {
          content,
          text,
          files: this.files,
          taggedUsers: this.taggedUsers,
          loomUrls: this.loomUrls,
          mode: this.authStore.isOrg ? this.mode : 'personal',
        },
        reply: this.replyItem,
        edit: this.hubChatStore.editData,
      };
      const sendingRoom = this.hubChatStore.sendingMessages.find(
        (item) => item.roomId === this.chatId,
      );
      if (sendingRoom) {
        sendingRoom.messages.push(newMessage);
      } else {
        this.hubChatStore.sendingMessages.push({
          roomId: this.chatId,
          isPopup: this.isPopup,
          messages: [newMessage],
        });
      }

      this.message = '';
      this.onReply({});
      this.files = [];
      this.$emit('sent');
      this.hubChatStore.editData = {
        roomId: null,
        message: null,
      };
      this.$refs.editor.clear();
      this.loading = false;
    },
    async forwardMessage(message) {
      message.forward = this.deepCopy(this.hubChatStore.forwardData);
      message.id = new Date().toISOString();
      const sendingRoom = this.hubChatStore.sendingMessages.find(
        (item) => item.roomId === this.chatId,
      );
      if (sendingRoom) {
        sendingRoom.messages.push(message);
      } else {
        this.hubChatStore.sendingMessages.push({
          roomId: this.chatId,
          isPopup: this.isPopup,
          messages: [message],
        });
      }
    },
    async editMessage(content, text) {
      try {
        this.loading = true;
        const message = {
          content,
          text,
          taggedUsers: this.taggedUsers,
        };

        if (this.files.length) {
          const { fileId } = await upload({
            file: this.files[0],
          });
          message.attachment = {
            id: this.hubChatStore.editData.message.attachments[0].id,
            replacement: {
              fileId,
              metadata: {
                mimetype: this.files[0].type,
                size: this.files[0].size,
                name: this.files[0].name,
              },
            },
          };
        }
        const url = this.extractUrl(this.message);
        if (url) {
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
            message.content = this.convertUrlsToLinks(this.message);
          } else {
            message.content = this.convertUrlsToLinks(this.message);
          }
        } else {
          message.link = {
            url: '',
            title: '',
            description: '',
            image: '',
          };
        }
        const newMsg = await this.hubChatStore.updateRoomMessage({
          roomId: this.chatId,
          messageId: this.hubChatStore.editData.message.id,
          ...message,
        });
        if (newMsg) {
          this.hubChatStore.editData = {
            roomId: null,
            message: null,
          };
          this.files = [];
          this.message = '';
        }
        this.loading = false;
      } catch (e) {
        console.log(e);
      }
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
        '<a href="$1">$1</a>',
      );

      placeholders.forEach((placeholder, index) => {
        convertedText = convertedText.replace(
          `__PLACEHOLDER__${index}__`,
          placeholder,
        );
      });

      return convertedText;
    },
    closeEdit() {
      this.hubChatStore.editData = {
        roomId: null,
        message: null,
      };
      this.message = '';
    },
  },
};
</script>
