<template>
  <div ref="box" class="relative h-0 min-h-44 flex-1">
    <div
      v-if="pins.length && hmsMessages.length > 0"
      class="absolute left-0 top-0 z-10 flex h-14 w-full cursor-pointer items-center bg-[#020202] px-4 py-2"
      data-cy="7971ef4e7078c0a4"
      @click="pinIndex = (pinIndex + 1) % pins.length"
    >
      <div class="mr-5 flex h-full shrink-0 flex-col gap-0.5">
        <div
          v-for="(msg, index) in pins"
          :key="msg.id"
          class="h-full w-0.5 cursor-pointer rounded-full"
          :class="
            pinIndex === index
              ? 'bg-[#E0B92C]'
              : 'bg-[#CFA200] opacity-50 hover:bg-[#E0B92C]'
          "
        />
      </div>
      <div class="flex w-0 flex-1 flex-col">
        <div class="text-sm text-[#CFA200]">
          {{
            hmsLocalPeer?.id === pins[pinIndex]?.piner
              ? $t('meet.pin.default')
              : $t('meet.pin.action', {
                  name: pins[pinIndex]?.pinerName,
                })
          }}
        </div>
        <div class="flex items-center gap-1 text-sm">
          <div class="font-bold text-[#B0B0B0]">
            {{ pins[pinIndex]?.senderName }}:
          </div>
          <div
            class="w-0 flex-1 truncate text-[#989898]"
            v-html="messageFormat(pins[pinIndex]?.message)"
          />
        </div>
      </div>
      <div
        class="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-5 hover:bg-white/5"
        data-cy="9b70ef9055b8d06d"
        @click.stop="onDeletePin"
      >
        <i class="fa-regular fa-close text-xs text-[#FAFAFA]" />
      </div>
    </div>
    <div
      v-if="hmsMessages.length > 0"
      ref="chatBodyElement"
      class="hide-scrollbar relative -mr-2 flex h-full flex-col gap-2 overflow-y-auto pr-2"
    >
      <div v-if="pins.length" class="h-14 shrink-0" />
      <div class="mt-auto" />
      <div ref="readBodyElement" class="flex flex-col gap-2">
        <div
          v-for="msg in readMessages"
          :key="msg.id"
          :class="hmsLocalPeer?.id === msg.sender ? 'ml-auto' : ''"
          class="relative flex items-end"
        >
          <div
            v-if="hmsLocalPeer?.id !== msg.sender"
            class="mr-2 flex h-9 w-9 items-center justify-end"
          >
            <BaseAvatarNext
              v-if="msg.isLastFromSameUser"
              :picture="picture(msg.sender)"
              online
              size="sm"
            />
          </div>
          <div
            class="group relative min-w-32 max-w-[14.125rem] rounded-lg bg-gradient-to-b p-2"
            :class="
              hmsLocalPeer?.id === msg.sender
                ? `${msg.isLastFromSameUser ? 'message-self' : ''} from-[#3B3111]/70 to-[#3B3111]/80`
                : `${msg.isLastFromSameUser ? 'message-bubble' : ''} from-black/50 to-black/80`
            "
          >
            <div class="flex items-center justify-between gap-2">
              <div class="flex w-full items-center gap-2">
                <div class="truncate text-sm font-bold text-[#D1D1D1]">
                  {{
                    hmsLocalPeer?.id === msg.sender
                      ? $t('meet.you')
                      : msg.senderName
                  }}1
                </div>
                <div class="shrink-0 text-xs capitalize text-[#555]">
                  {{ msg.senderRole }}
                </div>
              </div>
              <div
                v-if="pins.findIndex((pin) => pin.id === msg.id) === -1"
                class="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center opacity-0 transition-all group-hover:opacity-100"
                @click="onPin(msg)"
              >
                <i class="fa-regular fa-thumbtack text-xs text-[#FAFAFA]" />
              </div>
              <!-- <div
            v-if="msg.recipientPeer || msg.recipientRoles"
            class="flex items-center gap-1 rounded border p-1"
          >
            To {{ getName(msg.recipientPeer) }}
            <div class="h-4 w-[1px] bg-white" />
            {{ getType(msg.recipientRoles) }}
          </div> -->
            </div>
            <div
              class="break-words text-sm text-[#989898]"
              v-html="messageFormat(msg.message)"
            />
            <div class="mt-1 text-end text-xs font-light text-[#555]">
              {{ formatDate(msg.time, 'HH:mm') }}
            </div>
          </div>
          <!-- <div v-if="hmsLocalPeer?.id === msg.sender" class="w-7 text-center">
          <i class="fa-solid fa-check-double text-xs text-[#E0B92C]" />
        </div> -->
        </div>
      </div>
      <div
        v-if="unReadMessages.length > 0"
        class="my-2 flex items-center justify-center bg-black/90 px-0 py-1 text-xs text-white/60"
      >
        {{ $t('org.activity.message.unread') }}
      </div>
      <div
        v-for="msg in unReadMessages"
        :key="msg.id"
        :class="hmsLocalPeer?.id === msg.sender ? 'ml-auto' : ''"
        class="relative flex items-end"
      >
        <div
          v-if="hmsLocalPeer?.id !== msg.sender"
          class="mr-2 flex h-9 w-9 items-center justify-end"
        >
          <BaseAvatarNext
            v-if="msg.isLastFromSameUser"
            :picture="picture(msg.sender)"
            online
            size="sm"
          />
        </div>
        <div
          class="group relative min-w-32 max-w-[14.125rem] rounded-lg bg-gradient-to-b p-2"
          :class="
            hmsLocalPeer?.id === msg.sender
              ? `${msg.isLastFromSameUser ? 'message-self' : ''} from-[#3B3111]/70 to-[#3B3111]/80`
              : `${msg.isLastFromSameUser ? 'message-bubble' : ''} from-black/50 to-black/80`
          "
        >
          <div class="flex items-center justify-between gap-2">
            <div class="flex w-full items-center gap-2">
              <div class="truncate text-sm font-bold text-[#D1D1D1]">
                {{
                  hmsLocalPeer?.id === msg.sender
                    ? $t('meet.you')
                    : msg.senderName
                }}
              </div>
              <div class="shrink-0 text-xs capitalize text-[#555]">
                {{ msg.senderRole }}
              </div>
            </div>
            <div
              v-if="pins.findIndex((pin) => pin.id === msg.id) === -1"
              class="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center opacity-0 transition-all group-hover:opacity-100"
              @click="onPin(msg)"
            >
              <i class="fa-regular fa-thumbtack text-xs text-[#FAFAFA]" />
            </div>
            <!-- <div
            v-if="msg.recipientPeer || msg.recipientRoles"
            class="flex items-center gap-1 rounded border p-1"
          >
            To {{ getName(msg.recipientPeer) }}
            <div class="h-4 w-[1px] bg-white" />
            {{ getType(msg.recipientRoles) }}
          </div> -->
          </div>
          <div
            class="break-words text-sm text-[#989898]"
            v-html="messageFormat(msg.message)"
          />
          <div class="mt-1 text-end text-xs font-light text-[#555]">
            {{ formatDate(msg.time, 'HH:mm') }}
          </div>
        </div>
        <!-- <div v-if="hmsLocalPeer?.id === msg.sender" class="w-7 text-center">
          <i class="fa-solid fa-check-double text-xs text-[#E0B92C]" />
        </div> -->
      </div>
    </div>
    <div
      v-else
      class="absolute left-1/2 top-1/2 flex w-[17.75rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-xl bg-[#202020] px-4 py-5"
    >
      <img src="~/assets/meet/no-message.svg" class="mb-4" alt="" />
      <div class="mb-1 text-base font-medium text-[#767675]">
        {{ $t('meet.conversation.start') }}
      </div>
      <div class="text-center text-xs font-light text-[#767675]">
        <p>{{ $t('meet.conversation.send.message1') }}</p>
        <p>{{ $t('meet.conversation.send.message2') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import {
  selectPeerMetadata,
  selectSessionStore,
} from '@100mslive/hms-video-store';

import { hmsActions, hmsStore } from '~/utils/hms';

export default {
  setup() {
    const hmsStore = useHmsStore();
    return { hmsStore };
  },
  data() {
    return {
      autoScroll: false,
      unsub: null,
      pins: [],
      pinIndex: 0,
    };
  },
  computed: {
    hmsPeers() {
      return this.hmsStore.hmsPeers;
    },
    hmsLocalPeer() {
      return this.hmsStore.hmsLocalPeer;
    },
    hmsMessages() {
      const messages = this.hmsStore.hmsMessages.filter(
        (msg) => msg.type !== 'EMOJI_REACTION',
      );
      // 添加标识
      return messages.map((msg, index) => {
        const isLastFromSameUser =
          index < messages.length - 1 &&
          messages[index + 1].sender === msg.sender;
        return {
          ...msg,
          isLastFromSameUser: !isLastFromSameUser,
        };
      });
    },
    readMessages() {
      let isRead = true;
      return this.hmsMessages.filter((msg) => {
        if (!msg.read) {
          isRead = false;
        }
        return isRead;
      });
    },
    unReadMessages() {
      let isRead = false;
      return this.hmsMessages.filter((msg) => {
        if (!msg.read) {
          isRead = true;
        }
        return isRead;
      });
    },
  },
  mounted() {
    this.init();
    this.scrollToBottom(true);
  },
  beforeUpdate() {
    const chatBodyElement = this.$refs.chatBodyElement;
    this.autoScroll = Boolean(
      chatBodyElement &&
        chatBodyElement.offsetHeight + chatBodyElement.scrollTop >
          chatBodyElement.scrollHeight - 20,
    );
  },
  updated() {
    if (this.autoScroll) {
      this.scrollToBottom();
    }
  },
  beforeUnmount() {
    if (this.unsub) {
      this.unsub();
    }
    // hmsActions.setMessageRead(true);
  },
  methods: {
    init() {
      hmsActions.setMessageRead(true);
      this.unsub = hmsStore.subscribe((pins) => {
        this.pins = pins || [];
      }, selectSessionStore('msgPins'));
    },
    scrollToBottom(instant = false) {
      const chatBodyElement = this.$refs.chatBodyElement;
      const readBodyElement = this.$refs.readBodyElement;
      const box = this.$refs.box;
      if (chatBodyElement) {
        chatBodyElement.scrollTo({
          top: !instant
            ? chatBodyElement.scrollHeight
            : readBodyElement.scrollHeight - box.scrollHeight,
          behavior: instant ? 'auto' : 'smooth',
        });
      }
    },
    getName(id) {
      if (!id) {
        return '';
      }
      const peer = this.hmsPeers.find((peer) => peer.id === id);
      return this.hmsLocalPeer?.id === id ? this.$t('meet.you') : peer?.name;
    },
    getType(roles) {
      return roles ? roles[0] : 'PRIVATE';
    },
    picture(id) {
      return hmsStore.getState(selectPeerMetadata(id))?.picture;
    },
    onPin(msg) {
      hmsActions.sessionStore.set('msgPins', [
        ...this.pins,
        {
          ...msg,
          piner: this.hmsLocalPeer?.id,
          pinerName: this.hmsLocalPeer?.name,
        },
      ]);
    },
    onDeletePin() {
      if (this.pinIndex === this.pins.length) {
        this.pinIndex = 0;
      }
      hmsActions.sessionStore.set(
        'msgPins',
        this.pins.filter((_, index) => index !== this.pinIndex),
      );
    },
    extractUrls(text) {
      const pattern =
        /^(?:(?:(?:https?|ftp):)?\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;

      return text.match(pattern);
    },
    messageFormat(msg) {
      const urls = this.extractUrls(msg);
      if (urls) {
        urls.forEach((url) => {
          const href = url.startsWith('http') ? url : `http://${url}`;
          msg = msg.replace(
            url,
            `<a href="${href}" target="_blank" class="text-sm text-[#CFA200] underline underline-offset-4">${url}</a>`,
          );
        });
      }
      return msg;
    },
  },
};
</script>
<style scoped>
.message-bubble::after {
  content: '';
  position: absolute;
  background: rgba(0, 0, 0, 0.8);
  bottom: 0;
  left: 0;
  width: 1rem;
  height: 1.875rem;
  clip-path: path('M 0 0 Q 10 10 20 0 Q 10 24 0 0');
  transform: translate(-0.0625rem, 1rem) rotate(-60deg);
}
.message-self::after {
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
