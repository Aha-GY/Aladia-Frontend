<template>
  <OrganizationHubChatContentAnswersPinned
    v-show="!hubChatStore.messagesLoading"
    :room-id="chatId"
    @locate-pinned-message="onLocateMessage($event, true, true)"
  />
  <div
    ref="boxs"
    class="chat-answer relative h-0 flex-1 overflow-x-hidden pr-4 pt-3 max-sm:px-0"
  >
    <span
      v-if="loadingPrev"
      class="absolute left-[50%] top-2 -translate-x-1/2 text-xs text-white/50"
    >
      <i class="fa-solid fa-spinner mr-1 animate-spin text-xs" />
      {{ $t('org.activity.message.loading') }}
    </span>
    <div
      ref="main"
      class="hide-scrollbar -mr-4 flex h-full flex-col-reverse overflow-y-auto pb-2"
      @scroll="onScroll"
    >
      <div
        v-for="(item, index) in sendingMessages"
        :key="item.id"
        class="flex justify-end px-4"
      >
        <div class="w-[3.875rem]" />
        <div class="flex flex-1 flex-col gap-0.5">
          <OrganizationHubChatContentAnswersSending
            :show-avatar="index === sendingMessages.length - 1"
            :show-name="index === 0 && !lastIsOwner"
            :sending-message="item"
            :is-popup="isPopup"
            :scroll-to-bottom="scrollToBottom"
          />
        </div>
      </div>
      <div ref="box" class="flex flex-col pt-4">
        <template v-for="(group, index) in groupMessages" :key="index">
          <OrganizationHubChatContentAnswersTime
            v-if="isNewDate(index)"
            :class="[
              showSticky ? 'sticky top-0 z-10' : '',
              searchShow ? 'top-6' : '',
            ]"
            :label="
              formatDate(group[0].createdAt, 'DD MMMM') ==
              formatDate(new Date(), 'DD MMMM')
                ? $t('nav.header.update.today')
                : formatDate(group[0].createdAt, 'DD MMMM')
            "
            :date="group[0].createdAt"
            :scroll-value="scrollValue"
            @locate-message="(id) => onLocateMessage(id, true, true)"
          />
          <div
            v-if="group[0].dataType === 'activity'"
            class="flex flex-col gap-2 py-2"
          >
            <OrganizationHubChatContentAnswersActivity
              v-for="item in group"
              :key="item.id"
              :activity="item"
              :is-popup="isPopup"
            />
          </div>
          <template v-else>
            <div
              v-if="
                room &&
                firstUnreadMessageId(room.id) === group[0].id &&
                room?.oneToOnePeer &&
                !room?.oneToOnePeer?.isFollowing
              "
              class="flex items-center justify-center py-2"
            >
              <OrganizationHubChatContentAnswersSafer
                :user="room.oneToOnePeer.user"
                :room="room"
                @scroll-to-distance="scrollToDistance"
              />
            </div>
            <div
              v-if="room && firstUnreadMessageId(room.id) === group[0].id"
              class="my-2 flex items-center justify-center bg-black/90 px-0 py-1 text-xs text-white/60"
            >
              {{ $t('org.activity.message.unread') }}
            </div>
            <div class="flex items-end px-4">
              <div
                v-if="
                  (group[0].author?.id !== userId ||
                    group[0]?.createdBy?.id !== profileId) &&
                  group[0].createdBy?.id !== userId &&
                  group[0].author?.id !== profileId
                "
                class="sticky bottom-0 flex justify-center py-0.5"
              >
                <BaseAvatarNext
                  :picture="group[0]?.author?.image"
                  :story="group[0]?.author?.story"
                  :user-id="group[0]?.author?.id"
                  size="md"
                  :online="group[0]?.author?.online"
                  :show-story="true"
                />
              </div>
              <div v-else class="w-[3.875rem]" />
              <div class="flex-1 truncate">
                <template v-for="(item, index) in group" :key="item.id">
                  <div
                    :ref="item.id"
                    :data-id="item.id"
                    :data-author-id="item.author?.id"
                    :data-new="!item.read"
                    :data-reaction="
                      room?.lastReactionMessageId &&
                      item.id === room?.lastReactionMessageId
                    "
                  >
                    <OrganizationHubChatContentAnswersOwn
                      v-if="
                        (item?.author?.id === userId &&
                          item?.createdBy?.id === profileId) ||
                        item?.createdBy?.id === userId ||
                        item?.author?.id === profileId
                      "
                      :item="item"
                      :is-popup="isPopup"
                      :is-select="isSelect"
                      :show-avatar="index === group.length - 1"
                      :show-name="index === 0"
                      :on-reply="onReply"
                      :actives="actives"
                      :on-change="onChange"
                      :on-select="onSelect"
                      :scroll-value="scrollValue"
                      :is-lateral="isLateral"
                      @right-menu="onRightMenu"
                      @locate-reply-message="
                        (id, sourceId) =>
                          onLocateMessage(id, true, true, true, sourceId)
                      "
                    />

                    <OrganizationHubChatContentAnswersOther
                      v-else
                      :item="item"
                      :is-popup="isPopup"
                      :is-select="isSelect"
                      :show-avatar="index === group.length - 1"
                      :show-name="index === 0"
                      :on-reply="onReply"
                      :actives="actives"
                      :on-change="onChange"
                      :on-select="onSelect"
                      :scroll-value="scrollValue"
                      :is-customer="room?.customer"
                      :is-lateral="isLateral"
                      @right-menu="onRightMenu"
                      @locate-reply-message="
                        (id, sourceId) =>
                          onLocateMessage(id, true, true, true, sourceId)
                      "
                      @scroll-to-distance="scrollToDistance"
                    />
                  </div>
                </template>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>
    <span
      v-if="loadingNext"
      class="absolute bottom-2 left-[50%] -translate-x-1/2 text-xs text-white/50"
    >
      <i class="fa-solid fa-spinner mr-1 animate-spin text-xs" />
      {{ $t('org.activity.message.loading') }}
    </span>
    <div
      v-if="room && room.locked"
      class="absolute top-1/2 w-full -translate-y-1/2"
    >
      <BaseNoData
        description="nav.header.notificationKey.systems.platform.locked"
        icon-class="fa-light fa-ban text-[2.8125rem] text-[#D9D9D94D]"
      />
    </div>
    <div
      v-else-if="messages && !messages.length && !sendingMessages.length"
      class="absolute top-1/2 w-full -translate-y-1/2"
    >
      <BaseNoData />
    </div>

    <div
      v-if="room && room.lastReactionMessageId"
      class="absolute right-[0.4375rem] z-50 flex -translate-y-1/2 cursor-pointer flex-col items-center justify-center rounded-full text-white/60 transition-all hover:bg-white/5 hover:text-white/80"
      :class="
        (room && room.unreadMessages > 0) ||
        (!isScrollEnd && !hubChatStore.messagesLoading)
          ? 'bottom-11'
          : 'bottom-0'
      "
      @click="onLocateMessage(room.lastReactionMessageId, true, true)"
    >
      <div
        class="flex size-8 items-center justify-center rounded-full bg-white/15 hover:bg-white/20"
      >
        <i class="fa-solid fa-heart" />
      </div>
    </div>

    <div
      v-if="
        (room &&
          room.unreadMessages > 0 &&
          room.type !== 'space' &&
          room.type !== 'folder') ||
        (!isScrollEnd && !hubChatStore.messagesLoading)
      "
      class="absolute bottom-0 right-[0.4375rem] z-50 flex -translate-y-1/2 cursor-pointer flex-col items-center justify-center rounded-full text-white/60 transition-all hover:text-white/80"
      @click="onEndOrPrevReply"
    >
      <div
        v-if="
          room &&
          room.unreadMessages > 0 &&
          room.type !== 'space' &&
          room.type !== 'folder'
        "
        class="absolute -bottom-1.5 -right-1 flex items-center justify-center rounded-full px-1 py-0.5 text-10 text-[#252525]"
        :class="[
          room.preferences?.mute ? 'bg-[#979797]' : 'bg-[#FFE072]',
          room.unreadMessages < 10 ? 'size-4' : '-bottom-2',
        ]"
      >
        {{ unreadMessagesText }}
      </div>
      <div
        class="flex size-8 items-center justify-center rounded-full bg-white/15 hover:bg-white/20"
      >
        <i class="fa-solid fa-chevron-down" />
      </div>
    </div>
  </div>
  <client-only>
    <el-popover
      :visible="popoverShow"
      :offset="-90"
      :width="220"
      :show-arrow="false"
      popper-class="flex justify-center message-options"
      :popper-style="{
        position: 'absolute',
        padding: '0px !important',
        background: 'transparent',
        position: 'fixed',
        top: popoverPosition.y + 'px',
        left: popoverPosition.x + 'px',
        overflow: 'visible ',
      }"
    >
      <OrganizationHubChatContentAnswersOptions
        ref="options"
        :item="message"
        :is-owner="message?.author?.id === userId"
        :on-change="onChangeReact"
        :popup-room="popupRoom"
        :is-lateral="isLateral"
        :is-popup="isPopup"
        @select="select"
        @reply="onReply"
      />
      <template #reference>
        <div class="absolute h-0 w-0" />
      </template>
    </el-popover>
  </client-only>
</template>
<script>
export default {
  props: {
    isSelect: Boolean,
    onReply: Function,
    onChange: Function,
    actives: Array,
    isLateral: Boolean,
    onSelect: Function,
    popupRoom: Boolean,
    isPopup: Boolean,
    searchShow: Boolean,
  },
  emits: ['read-message', 'sent', 'read-reaction'],
  setup() {
    const hubChatStore = useHubChatStore();
    const authStore = useAuthStore();
    const fluxesStore = useFluxesStore();
    const globalStore = useGlobalStore();
    const profileStore = useProfileStore();
    return { hubChatStore, authStore, fluxesStore, globalStore, profileStore };
  },
  data() {
    return {
      isScrollEnd: true,
      scrollValue: 0,
      loadingPrev: false,
      observer: null,
      observerReaction: null,
      loadingNext: false,
      popoverShow: false,
      message: null,
      messageRef: null,
      popoverPosition: { x: 0, y: 0 },
      onChangeReact: null,
      child: null,
      replyHistory: [],
      showSticky: false,
      stickyTimer: null,
    };
  },
  computed: {
    chatId() {
      return this.isLateral
        ? this.hubChatStore.lateralChatId
        : this.isPopup
          ? this.hubChatStore.popupChatId
          : this.hubChatStore.chatId;
    },
    skeletons() {
      return this.popupRoom ? 3 : 6;
    },
    lastIsOwner() {
      const item = this.messages?.[this.messages.length - 1];
      return (
        (item?.author?.id === this.userId &&
          item?.createdBy?.id === this.profileId) ||
        item?.createdBy?.id === this.userId ||
        item?.author?.id === this.profileId
      );
    },
    groupMessages() {
      const room = this.hubChatStore.roomsMessages.find(
        (item) => item.id === this.chatId,
      );
      const roomMessages = room?.messages;
      if (!roomMessages) {
        return [];
      }
      const group = [];
      for (let i = 0; i < roomMessages.length; i++) {
        const cur = roomMessages[i];
        const pre = roomMessages[i - 1];
        if (i === 0) {
          group.push([cur]);
        } else {
          if (
            cur.author?.id === pre.author?.id &&
            cur.createdBy?.id === pre.createdBy?.id &&
            isSameday(cur.createdAt, pre.createdAt) &&
            room.firstUnreadMessageId !== cur.id &&
            (cur.sourceRoom === pre.sourceRoom ||
              (cur.sourceRoom?.type === pre.sourceRoom?.type &&
                cur.sourceRoom?.id === pre.sourceRoom?.id)) &&
            cur.dataType === pre.dataType
          ) {
            group[group.length - 1].push(cur);
          } else {
            group.push([cur]);
          }
        }
      }
      return group;
    },
    messages() {
      return this.hubChatStore.roomsMessages.find(
        (item) => item.id === this.chatId,
      )?.messages;
    },
    sendingMessages() {
      const room = this.hubChatStore.sendingMessages.find(
        (item) => item.roomId === this.chatId && item.isPopup === this.isPopup,
      );
      return room ? room.messages : [];
    },
    userId() {
      return this.profileStore.myProfileDetail.id;
    },
    profileId() {
      return this.profileStore.myUserProfileDetail.id;
    },
    room() {
      return this.hubChatStore.getRoomById(this.chatId);
    },
    unreadMessagesText() {
      if (this.room && this.room.unreadMessages > 999) {
        return `${(this.room.unreadMessages / 1000).toFixed(1)}k`;
      } else {
        return this.room ? this.room.unreadMessages : '';
      }
    },
  },
  watch: {
    scrollValue: debounce(function () {
      if (this.stickyTimer) {
        clearTimeout(this.stickyTimer);
      }
      this.showSticky = true;
      this.stickyTimer = setTimeout(() => {
        this.showSticky = false;
      }, 3000);
    }, 100),
  },
  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.observerReaction) {
      this.observerReaction.disconnect();
    }
  },
  methods: {
    firstUnreadMessageId(roomId) {
      return this.hubChatStore.roomsMessages.find((item) => item.id === roomId)
        ?.firstUnreadMessageId;
    },
    closePopover(e) {
      if (!this.messageRef.contains(e.target)) {
        this.child.isRightMenu = false;
        this.popoverShow = false;
        document.removeEventListener('click', this.closePopover);
        document.removeEventListener('dblclick', this.closePopover);
      }
    },
    onRightMenu(e, child) {
      if (this.child) {
        this.child.isRightMenu = false;
      }
      this.child = child;
      this.messageRef = child.box;
      this.message = child.item;
      this.onChangeReact = child.onChangeReact;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      let x = clientX;
      let y = clientY;
      if (clientX + 240 > innerWidth) {
        x = innerWidth - 240;
      }
      if (clientY + 500 > innerHeight) {
        y = innerHeight - 400;
      }
      this.popoverPosition = { x, y };
      document.addEventListener('click', this.closePopover);
      document.addEventListener('dblclick', this.closePopover);
      if (child.item.author.id !== this.userId) {
        this.$nextTick(() => {
          this.$refs.options?.reactionFlicker();
        });
      }
      this.popoverShow = true;
      this.child.isRightMenu = true;
      if (child.item?.author?.id === this.userId) {
        if (child.item.viewCount) {
          this.$refs.options?.getMessageInfo(child.item.id);
        }
      } else {
        if (
          child.item.reactions &&
          child.item.reactions.count &&
          Object.keys(child.item.reactions.count).reduce(
            (acc, cur) => acc + child.item.reactions.count[cur],
            0,
          )
        ) {
          this.$refs.options?.getMessageInfo(child.item.id);
        }
      }
    },
    select(item) {
      this.onSelect(true);
      this.onChange(item.id);
    },
    isNewDate(index) {
      if (index === 0) {
        return true;
      }
      const prev = this.groupMessages[index - 1];
      const current = this.groupMessages[index];
      return (
        new Date(prev[0].createdAt).getDate() !==
        new Date(current[0].createdAt).getDate()
      );
    },
    initObserve() {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5,
      };
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            entry.target.getAttribute('data-new') === 'true'
          ) {
            this.$emit('read-message', {
              id: entry.target.getAttribute('data-id'),
              authorId: entry.target.getAttribute('data-author-id'),
            });
            entry.target.setAttribute('data-new', false);
            this.observer.unobserve(entry.target);
          }
        });
      }, options);
      this.observeUnreadMessage();
    },
    observeUnreadMessage() {
      if (this.observer) {
        this.$refs.box
          .querySelectorAll('div[data-new="true"]')
          .forEach((element) => {
            this.observer.observe(element);
          });
      } else {
        this.initObserve();
      }
    },
    initReactionObserve() {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5,
      };
      this.observerReaction = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            entry.target.getAttribute('data-reaction') === 'true'
          ) {
            this.$emit('read-reaction', {
              id: entry.target.getAttribute('data-id'),
              authorId: entry.target.getAttribute('data-author-id'),
            });
            entry.target.setAttribute('data-reaction', false);
            this.observerReaction.unobserve(entry.target);
          }
        });
      }, options);
      this.observeReactionMessage();
    },
    observeReactionMessage() {
      if (this.observerReaction) {
        this.$refs.box
          .querySelectorAll('div[data-reaction="true"]')
          .forEach((element) => {
            this.observerReaction.observe(element);
          });
      } else {
        this.initReactionObserve();
      }
    },
    async onLocateMessage(
      id,
      isSmooth = false,
      isHighlight = false,
      isReply = false,
      sourceId = null,
    ) {
      const room = this.hubChatStore.roomsMessages.find(
        (item) => item.id === this.chatId,
      );
      if (room && room.messages.some((message) => message.id === id)) {
        const eleMsg = document.getElementById(
          `${this.isPopup ? 'popup-' : ''}msg-${id}`,
        );
        if (!eleMsg) {
          return;
        }
        await sleep(0);
        const scrollTop =
          eleMsg.offsetTop -
          this.$refs.boxs.offsetHeight +
          eleMsg.offsetHeight +
          200;
        this.$refs.main.scrollTo({
          top: scrollTop || 0,
          behavior: isSmooth ? `smooth` : 'auto',
        });
        if (isHighlight) {
          eleMsg.classList.add('msg-highlight');
          setTimeout(() => {
            eleMsg.classList.remove('msg-highlight');
          }, 2000);
        }
        if (isReply) {
          this.addReplyHistory(sourceId);
        }
      } else {
        // const room = this.hubChatStore.roomsMessages.find(
        //   (item) => item.id === this.hubChatStore.chatId,
        // );
        if (room && room.prev) {
          const res = await this.hubChatStore.locateMessage({
            roomId: room.id,
            messageId: id,
            prev: room.prev,
            limit: 100,
          });
          if (res) {
            this.$nextTick(() => {
              this.observeReactionMessage();
              const eleMsg = document.getElementById(
                `${this.isPopup ? 'popup-' : ''}msg-${id}`,
              );
              const scrollTop =
                eleMsg.offsetTop - this.$refs.boxs.offsetHeight + 300;
              this.$refs.main.scrollTo({
                top: scrollTop || 0,
                behavior: isSmooth ? `smooth` : 'auto',
              });
              if (isHighlight) {
                eleMsg.classList.add('msg-highlight');
                setTimeout(() => {
                  eleMsg.classList.remove('msg-highlight');
                }, 2000);
              }
            });
            if (isReply) {
              this.addReplyHistory(sourceId);
            }
          }
        }
      }
    },
    async onScroll(e) {
      // console.log('scrolling', e.target.scrollTop);
      const scrollTop = Math.abs(e.target.scrollTop);

      this.scrollValue = Math.floor(scrollTop);
      if (this.scrollValue === 0 && this.loadingNext === false) {
        const room = this.hubChatStore.roomsMessages.find(
          (item) => item.id === this.chatId,
        );
        if (room && room.next) {
          this.loadingNext = true;
          // const oldScrollHeight = this.$refs.box.scrollHeight;
          await this.hubChatStore.getRoomMessages(
            {
              roomId: this.chatId,
              next: room.next,
            },
            false,
            true,
          );
          this.$nextTick(() => {
            // const newContentHeight =
            //   this.$refs.box.scrollHeight - oldScrollHeight;
            // this.$refs.main.setScrollTop(newContentHeight);
            this.observeUnreadMessage();
            this.observeReactionMessage();
          });
          this.loadingNext = false;
        } else {
          this.isScrollEnd = true;
          this.replyHistory = [];
        }
      } else {
        this.isScrollEnd = false;
      }
      if (
        scrollTop + this.$refs.boxs.offsetHeight - 20 ===
        this.$refs.box.clientHeight
      ) {
        const room = this.hubChatStore.roomsMessages.find(
          (item) => item.id === this.chatId,
        );
        if (room && room.prev) {
          this.loadingPrev = true;
          const oldScrollHeight = this.$refs.box.scrollHeight;
          await this.hubChatStore.getRoomMessages(
            {
              roomId: this.chatId,
              prev: room.prev,
            },
            true,
          );
          this.$nextTick(() => {
            const newContentHeight = -oldScrollHeight;
            this.$refs.main.scrollTo({
              top: newContentHeight,
              behavior: 'auto',
            });
            this.observeReactionMessage();
          });
          this.loadingPrev = false;
        }
      }

      if (this.replyHistory.length) {
        this.replyHistory = this.replyHistory.filter(
          (item) => item.location > -scrollTop,
        );
      }
    },
    calcScrollTop(id) {
      const eleMsg = document.getElementById(
        `${this.isPopup ? 'popup-' : ''}msg-${id}`,
      );
      const scrollTop = eleMsg.offsetTop - this.$refs.boxs.offsetHeight + 400;
      return scrollTop;
    },
    async addReplyHistory(id) {
      if (this.replyHistory.some((message) => message.id === id)) {
        return;
      }
      const location = this.calcScrollTop(id);
      const message = this.messages.find((message) => message.id === id);
      if (message) {
        this.replyHistory.push({ ...message, location });
      }
    },
    async onEndOrPrevReply() {
      if (this.replyHistory.length) {
        const message = this.replyHistory.pop();
        await this.onLocateMessage(message.id, true, true);
      } else {
        this.onEnd();
      }
    },
    async onEnd() {
      if (this.room && this.room.unreadMessages > 0) {
        const room = this.hubChatStore.roomsMessages.find(
          (room) => room.id === this.chatId,
        );
        if (room.next) {
          await this.hubChatStore.locateLastMessages({
            roomId: this.chatId,
            next: room.next,
          });
          if (this.room.type !== 'space' && this.room.type !== 'folder') {
            this.hubChatStore.readRoom({ roomId: this.chatId });
          }
        } else {
          if (this.room.type !== 'space' && this.room.type !== 'folder') {
            this.hubChatStore.readRoom({ roomId: this.chatId });
          }
        }
      }
      this.scrollToBottom(true);
    },
    scrollToBottom(isSmooth = false) {
      this.$nextTick(() => {
        const wrap = this.$refs.box;
        const container = this.$refs.main;
        container.scrollTo({
          top: wrap.scrollHeight,
          behavior: isSmooth ? `smooth` : 'auto',
        });
      });
    },
    scrollToDistance(distance = 0) {
      this.$nextTick(() => {
        const container = this.$refs.main;
        container.scrollTo({
          top: -this.scrollValue + distance,
          behavior: 'auto',
        });
      });
    },
    getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
  },
};
</script>
<style>
@keyframes flashAnimation {
  0% {
    @apply bg-transparent;
  }
  50% {
    @apply bg-white/5;
  }
  100% {
    @apply bg-transparent;
  }
}

.msg-highlight {
  animation: flashAnimation 2s forwards;
}
.chat-answer .mention {
  :hover {
    color: #ffb600;
    text-decoration-line: underline;
    text-underline-offset: 0.25rem;
    cursor: pointer;
  }
}
</style>
