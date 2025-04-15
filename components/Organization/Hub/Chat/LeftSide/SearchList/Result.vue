<template>
  <div v-if="loading" class="flex flex-col">
    <div v-for="i in 8" :key="i" class="flex gap-1 p-2">
      <BaseSkeleton :length="1" class="w-10" />
      <BaseSkeleton :length="1" class="flex-1" />
    </div>
  </div>
  <div v-else class="flex h-full flex-col pb-2">
    <div class="felx-1 flex max-h-[50%] flex-col">
      <div
        class="flex items-center justify-between rounded-sm bg-[#0c0c0c] px-2 py-2 text-xs text-[#b0b0b0]"
      >
        <div>
          {{ $t('org.activity.chat.found.rooms') }}
        </div>
        <div>{{ roomsTotal }}</div>
      </div>
      <div
        v-if="rooms.length"
        v-infinite-scroll="() => search('room')"
        :infinite-scroll-disabled="roomLoading || !roomsNext"
        class="hide-scrollbar overflow-y-auto overscroll-contain"
      >
        <OrganizationHubChatLeftSideMember
          v-for="item in rooms"
          :key="item.id"
          :item="item"
          :is-search="true"
          data-cy="9f6f43d120ae244c"
          @click.stop="$emit('locate-room', item)"
        />
        <div v-if="roomLoading" class="flex flex-col">
          <div v-for="i in 4" :key="i" class="flex gap-1 p-2">
            <BaseSkeleton :length="1" class="w-10" />
            <BaseSkeleton :length="1" class="flex-1" />
          </div>
        </div>
      </div>
      <!-- <div v-else class="h-2" /> -->
    </div>
    <div class="flex flex-1 flex-col overflow-y-auto pb-4">
      <div
        class="flex items-center justify-between rounded-sm bg-[#0c0c0c] px-2 py-2 text-xs text-[#b0b0b0]"
      >
        <div>
          {{ $t('org.activity.chat.found.messages') }}
        </div>
        <div>{{ messagesTotal }}</div>
      </div>
      <div
        v-if="messages.length"
        v-infinite-scroll="() => search('message')"
        :infinite-scroll-disabled="messageLoading || !messagesNext"
        class="flex flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden overscroll-contain py-2"
      >
        <div
          v-for="item in messages"
          :key="item.id"
          class="flex h-14 cursor-pointer items-center gap-2 rounded-5 px-1 hover:bg-white/5"
          data-cy="29ff026f698ae507"
          @click.stop="$emit('locate-room', item.room, item)"
        >
          <div
            class="relative flex h-14 w-12 items-center justify-center rounded-full transition-all"
          >
            <OrganizationHubChatLeftSideMemberAvatar
              :is-search="true"
              :item="item.room"
            />
          </div>
          <div
            class="flex flex-1 flex-col gap-1 truncate text-sm leading-4 transition-all"
          >
            <div class="flex items-center justify-between text-white/60">
              <div class="flex-1 truncate pr-1">
                {{ item.room?.name }}
              </div>
              <div v-if="item.createdAt" class="px-2 text-xs text-white/30">
                {{ dateAgo(item.createdAt) }}
              </div>
            </div>
            <div class="flex items-center gap-1">
              <div class="flex items-center gap-1 text-xs text-white/40">
                <div>{{ item.author?.fullname }}:</div>
              </div>

              <div
                class="h-4 flex-1 truncate font-light text-white/80 transition-all group-hover/item:text-[#828282] [&_p]:overflow-hidden [&_p]:text-ellipsis [&_p]:whitespace-nowrap"
                v-html="item.content"
              />
            </div>
          </div>
        </div>

        <div v-if="messageLoading" class="flex flex-col">
          <div v-for="i in 4" :key="i" class="flex gap-1 p-2">
            <BaseSkeleton :length="1" class="w-10" />
            <BaseSkeleton :length="1" class="flex-1" />
          </div>
        </div>
      </div>

      <div v-else class="flex flex-1 items-center">
        <BaseNoData />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    query: String,
  },
  emits: ['locate-room'],
  setup() {
    const hubChatStore = useHubChatStore();
    const authStore = useAuthStore();
    return { hubChatStore, authStore };
  },
  data() {
    return {
      rooms: [],
      roomsTotal: 0,
      roomsNext: null,
      messages: [],
      messagesTotal: 0,
      messagesNext: null,
      loading: false,
      roomLoading: false,
      messageLoading: false,
      timer: null,
    };
  },
  watch: {
    query(val) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        if (val) {
          this.rooms = [];
          this.message = [];
          this.messagesNext = null;
          this.roomsNext = null;
          this.messageLoading = false;
          this.roomLoading = false;
          this.search(val);
        } else {
          this.next = null;
        }
      }, 500);
    },
  },
  methods: {
    async search(type) {
      if (type === 'room' && this.roomsNext) {
        this.loadRoom();
        return;
      }
      if (type === 'message' && this.messagesNext) {
        this.loadMessage();
        return;
      }
      this.loading = true;
      const { rooms, messages } = await this.hubChatStore.search({
        query: this.query,
      });
      if (rooms) {
        this.rooms = [...rooms.data];
        this.rooms.forEach((m) => {
          m.name = this.highlightedContent(m.name);
        });
        this.roomsTotal = rooms.cursor.totalItems;
        this.roomsNext = rooms.cursor.next;
      } else {
        this.rooms = [];
        this.roomsTotal = 0;
        this.roomsNext = null;
      }
      if (messages) {
        this.messages = [...messages.data];
        this.messages.forEach((m) => {
          m.content = this.highlightedContent(m.content);
        });
        this.messagesTotal = messages.cursor.totalItems;
        this.messagesNext = messages.cursor.next;
      } else {
        this.messages = [];
        this.messagesTotal = 0;
        this.messagesNext = null;
      }
      this.loading = false;
    },
    async loadRoom() {
      if (this.roomLoading || !this.roomsNext) {
        return;
      }
      this.roomLoading = true;
      const { rooms } = await this.hubChatStore.search({
        query: this.query,
        next: this.roomsNext,
      });
      if (rooms) {
        rooms.data.forEach((m) => {
          m.name = this.highlightedContent(m.name);
        });
        this.rooms = this.rooms.concat(rooms.data);
        this.roomsTotal = rooms.cursor.totalItems;
        this.roomsNext = rooms.cursor.next;
      }
      this.roomLoading = false;
    },
    async loadMessage() {
      if (this.messageLoading || !this.messagesNext) {
        return;
      }
      this.messageLoading = true;
      const { messages } = await this.hubChatStore.search({
        query: this.query,
        next: this.messagesNext,
      });
      if (messages) {
        messages.data.forEach((m) => {
          m.content = this.highlightedContent(m.content);
        });
        this.messages = this.messages.concat(messages.data);
        this.messagesTotal = messages.cursor.totalItems;
        this.messagesNext = messages.cursor.next;
      }
      this.messageLoading = false;
    },
    highlightedContent(content) {
      if (!this.query) {
        return content;
      }
      return highlightKeywords(content || '', [this.query]);
    },
    escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    },
  },
};
</script>
