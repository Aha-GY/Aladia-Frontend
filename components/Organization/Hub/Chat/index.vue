<template>
  <div
    class="relative z-10 flex w-full"
    :style="{ height: isPopup ? 'calc(100vh - 8.5rem)' : '' }"
  >
    <OrganizationHubChatLeftSide v-if="!courseId" :is-popup="isPopup" />
    <!-- <div class="flex flex-1 transition-all"> -->
    <OrganizationHubChatContent
      ref="chat"
      :class="
        hasLateral
          ? 'float-left w-[50%] border-r-4 border-black/80 max-xl:float-none max-xl:w-full max-xl:border-none'
          : ''
      "
      :is-popup="isPopup"
      :popup-room="courseId ? true : false"
      @read-message="readMessage"
      @read-reaction="readReaction"
    />
    <OrganizationHubChatContent
      v-if="hasLateral"
      ref="lateralChat"
      class="float-left w-[50%] max-xl:hidden"
      :is-popup="isPopup"
      :is-lateral="true"
      :popup-room="courseId ? true : false"
      @read-message="readMessage($event, true)"
      @read-reaction="readReaction($event, true)"
    />
    <div v-if="hasLateral" class="clear-both max-xl:hidden" />
    <!-- </div> -->
    <OrganizationHubChatRightSide
      v-if="!courseId && !isPopup"
      @locate-message="onLocateMessage"
    />
    <client-only>
      <el-dialog
        v-model="hubChatStore.isPreview"
        :fullscreen="true"
        :append-to-body="true"
        :show-close="false"
      >
        <OrganizationHubChatPreview />
      </el-dialog>
    </client-only>
    <OrganizationHubChatForward />
  </div>
</template>

<script>
import WebSocketService from '~/utils/websocket';

export default {
  props: {
    isPopup: {
      type: Boolean,
      default: false,
    },
    courseId: {
      type: String,
      default: null,
    },
  },
  setup() {
    const hubChatStore = useHubChatStore();
    const authStore = useAuthStore();
    const profileStore = useProfileStore();
    const websocket = WebSocketService.getInstance();
    return { hubChatStore, websocket, authStore, profileStore };
  },
  data() {
    return {
      typingTimeout: null,
    };
  },
  computed: {
    userId() {
      return this.authStore.context;
    },
    user() {
      return this.profileStore.myProfileDetail;
    },
    profile() {
      return this.profileStore.myUserProfileDetail;
    },
    isOrgMember() {
      return this.user.activeUserRole === 'organization-member';
    },
    hasLateral() {
      return !!this.hubChatStore.lateralChatId && !this.isPopup;
    },
  },
  watch: {
    async 'hubChatStore.chatId'(id) {
      if (this.isPopup && !this.hubChatStore.showPopup) {
        return;
      }
      this.hubChatStore.initRoom();
      if (id) {
        const roomInfo = this.hubChatStore.getRoomById(id);
        this.hubChatStore.chatInfo = roomInfo;
        if (roomInfo?.type === 'space' || roomInfo?.type === 'folder') {
          if (roomInfo.type === 'space') {
            this.hubChatStore.spaceId = roomInfo.id;
            this.hubChatStore.spaceEntityId = roomInfo.entityId;
            this.hubChatStore.spaceList = [];
            this.hubChatStore.spaceParams.next = null;
          }
          if (roomInfo.type !== 'folder') {
            await this.hubChatStore.getSpaceList(
              roomInfo.entityId,
              roomInfo.type,
            );
          }
        }
        if (roomInfo?.locked) {
          return;
        }
        const room = this.hubChatStore.roomsMessages.find(
          (item) => item.id === id,
        );
        if (room) {
          // this.hubChatStore.messages = [...room.messages];
          room.firstUnreadMessageId = room.messages.find(
            (item) =>
              item.dataType === 'message' &&
              !item.read &&
              item.author.id !== this.userId,
          )?.id;
          if (room.lastReadMessageId) {
            this.$nextTick(() => {
              // space room跳转时定位
              if (this.hubChatStore.locateChatMessageId) {
                this.$refs.chat?.locateMessage(
                  this.hubChatStore.locateChatMessageId,
                  false,
                  true,
                );
                this.hubChatStore.locateChatMessageId = null;
              } else {
                this.$refs.chat?.locateMessage(room.lastReadMessageId);
              }
              this.$refs.chat?.observeUnreadMessage();
              this.$refs.chat?.observeReactionMessage();
            });
          }
        } else {
          this.hubChatStore.messagesLoading = true;
          const room = await this.hubChatStore.getRoomMessages({
            roomId: id,
          });
          // if (
          //   roomInfo.type === 'space' ||
          //   roomInfo.type === 'folder' ||
          //   roomInfo.type === 'course'
          // ) {
          //   await this.hubChatStore.syncRoomUnread(id);
          // }
          const { lastReadMessageId } = room;
          // this.hubChatStore.messages = [...messages];
          room.firstUnreadMessageId = room.messages.find(
            (item) =>
              item.dataType === 'message' &&
              !item.read &&
              item.author.id !== this.userId,
          )?.id;
          this.hubChatStore.messagesLoading = false;
          this.hubChatStore.getRoomPinnedMessages({
            roomId: id,
          });
          this.$nextTick(() => {
            if (this.hubChatStore.locateChatMessageId) {
              this.$refs.chat?.locateMessage(
                this.hubChatStore.locateChatMessageId,
                false,
                true,
              );
              this.hubChatStore.locateChatMessageId = null;
            } else {
              this.$refs.chat?.locateMessage(lastReadMessageId);
            }
            this.$refs.chat?.observeUnreadMessage();
            this.$refs.chat?.observeReactionMessage();
          });
        }
      }
      this.$nextTick(() => {
        this.$refs.chat?.onSelect(false);
      });
    },
    async 'hubChatStore.lateralChatId'(id) {
      if (this.isPopup && !this.hubChatStore.showPopup) {
        return;
      }
      this.hubChatStore.initRoom();
      if (id) {
        const roomInfo = this.hubChatStore.getRoomById(id);
        this.hubChatStore.lateralChatInfo = roomInfo;
        if (roomInfo.locked) {
          return;
        }
        const room = this.hubChatStore.roomsMessages.find(
          (item) => item.id === id,
        );
        if (room) {
          // this.hubChatStore.messages = [...room.messages];
          room.firstUnreadMessageId = room.messages.find(
            (item) =>
              item.dataType === 'message' &&
              !item.read &&
              item.author.id !== this.userId,
          )?.id;
          if (room.lastReadMessageId) {
            this.$nextTick(() => {
              // space room跳转时定位
              if (this.hubChatStore.locateChatMessageId) {
                this.$refs.lateralChat?.locateMessage(
                  this.hubChatStore.locateChatMessageId,
                  false,
                  true,
                );
                this.hubChatStore.locateChatMessageId = null;
              } else {
                this.$refs.lateralChat?.locateMessage(room.lastReadMessageId);
              }
              this.$refs.lateralChat?.observeUnreadMessage();
              this.$refs.lateralChat?.observeReactionMessage();
            });
          }
        } else {
          // this.hubChatStore.messagesLoading = true;
          const room = await this.hubChatStore.getRoomMessages({
            roomId: id,
          });
          const { lastReadMessageId } = room;
          // this.hubChatStore.messages = [...messages];
          room.firstUnreadMessageId = room.messages.find(
            (item) =>
              item.dataType === 'message' &&
              !item.read &&
              item.author.id !== this.userId,
          )?.id;
          // this.hubChatStore.messagesLoading = false;
          this.hubChatStore.getRoomPinnedMessages({
            roomId: id,
          });
          this.$nextTick(() => {
            if (this.hubChatStore.locateChatMessageId) {
              this.$refs.lateralChat?.locateMessage(
                this.hubChatStore.locateChatMessageId,
                false,
                true,
              );
              this.hubChatStore.locateChatMessageId = null;
            } else {
              this.$refs.lateralChat?.locateMessage(lastReadMessageId);
            }
            this.$refs.lateralChat?.observeUnreadMessage();
            this.$refs.lateralChat?.observeReactionMessage();
          });
        }
      }
      this.$nextTick(() => {
        this.$refs.lateralChat?.onSelect(false);
        this.hubChatStore.refLateralChat = this.$refs.lateralChat;
      });
    },
    async 'hubChatStore.popupChatId'(id) {
      if (this.isPopup && !this.hubChatStore.showPopup) {
        return;
      }
      this.hubChatStore.initRoom();
      if (id) {
        const roomInfo = this.hubChatStore.getRoomById(id);
        this.hubChatStore.popupChatInfo = roomInfo;
        if (roomInfo?.type === 'space' || roomInfo?.type === 'folder') {
          if (roomInfo.type === 'space') {
            this.hubChatStore.popupSpaceId = roomInfo.id;
            this.hubChatStore.popupSpaceEntityId = roomInfo.entityId;
            this.hubChatStore.popupSpaceList = [];
            this.hubChatStore.popupSpaceParams.next = null;
          }
          if (roomInfo.type !== 'folder') {
            await this.hubChatStore.getPopupSpaceList(
              roomInfo.entityId,
              roomInfo.type,
            );
          }
        }
        if (roomInfo?.locked) {
          return;
        }
        const room = this.hubChatStore.roomsMessages.find(
          (item) => item.id === id,
        );
        if (room) {
          // this.hubChatStore.messages = [...room.messages];
          room.firstUnreadMessageId = room.messages.find(
            (item) =>
              item.dataType === 'message' &&
              !item.read &&
              item.author.id !== this.userId,
          )?.id;
          if (room.lastReadMessageId) {
            this.$nextTick(() => {
              // space room跳转时定位
              if (this.hubChatStore.locateChatMessageId) {
                this.$refs.chat?.locateMessage(
                  this.hubChatStore.locateChatMessageId,
                  false,
                  true,
                );
                this.hubChatStore.locateChatMessageId = null;
              } else {
                this.$refs.chat?.locateMessage(room.lastReadMessageId);
              }
              this.$refs.chat?.observeUnreadMessage();
              this.$refs.chat?.observeReactionMessage();
            });
          }
        } else {
          // this.hubChatStore.messagesLoading = true;
          const room = await this.hubChatStore.getRoomMessages({
            roomId: id,
          });
          const { lastReadMessageId } = room;
          // this.hubChatStore.messages = [...messages];
          room.firstUnreadMessageId = room.messages.find(
            (item) =>
              item.dataType === 'message' &&
              !item.read &&
              item.author.id !== this.userId,
          )?.id;
          // this.hubChatStore.messagesLoading = false;
          this.hubChatStore.getRoomPinnedMessages({
            roomId: id,
          });
          this.$nextTick(() => {
            if (this.hubChatStore.locateChatMessageId) {
              this.$refs.chat?.locateMessage(
                this.hubChatStore.locateChatMessageId,
                false,
                true,
              );
              this.hubChatStore.locateChatMessageId = null;
            } else {
              this.$refs.chat?.locateMessage(lastReadMessageId);
            }
            this.$refs.chat?.observeUnreadMessage();
            this.$refs.chat?.observeReactionMessage();
          });
        }
      }
      this.$nextTick(() => {
        this.$refs.chat?.onSelect(false);
      });
    },
    'authStore.context'() {
      this.hubChatStore.clear();
      this.hubChatStore.getListRooms();
    },
  },
  async mounted() {
    if (this.courseId) {
      await this.initCourseChat();
    }

    this.hubChatStore.refChats.push(this.$refs.chat);
    const events = this.websocket.socket._callbacks;
    if (events && events['$chat-room']) {
      return;
    }
    this.websocket.on('chat-room', async (eventData) => {
      const { type } = eventData;
      console.log(type);
      switch (type) {
        case 'user-typing':
          this.handleTyping(eventData);
          break;
        case 'new-message':
          await this.handleNewMessage(eventData);
          break;
        case 'room-deleted':
          this.handleRoomDeleted(eventData);
          break;
        case 'new-room':
          this.handleNewRoom(eventData);
          break;
        case 'members-added':
          this.handleMemberAdded(eventData);
          break;
        case 'members-removed':
          this.handleMemberRemoved(eventData);
          break;
        case 'message-unpinned':
        case 'message-pinned':
          this.handlePinnedMessage(eventData);
          break;
        case 'message-updated':
          this.handleUpdatedMessage(eventData);
          break;
        case 'forward-messages':
          this.handleForwardMessage(eventData);
          break;
        case 'message-deleted':
          this.handleDeletedMessage(eventData);
          break;
        case 'clear-history':
          this.handleClearHistory(eventData);
          break;
        case 'room-updated':
          this.handleRoomUpdated(eventData);
          break;
        case 'reaction-added':
        case 'reaction-removed':
          this.handleReaction(eventData);
          break;
        case 'new-activities':
          this.handleNewActivities(eventData);
          break;
        default:
          break;
      }
    });
    this.websocket.on('chat-user', async (eventData) => {
      const { type } = eventData;
      console.log(type);
      switch (type) {
        case 'tag': {
          break;
        }
        case 'user-read-message':
          this.handleReadMessage(eventData);
          break;
        case 'message-deleted':
          this.handleDeletedMessage(eventData, true);
          break;
        case 'mention-removed':
        case 'mention-added':
          this.handleMention(eventData);
          break;
        case 'new-room':
          this.handleNewRoom(eventData);
          break;
        default:
          break;
      }
    });
    this.websocket.on('chat-member', async (eventData) => {
      const { type } = eventData;
      console.log(type);
      switch (type) {
        case 'online':
        case 'offline':
          this.handleOnline(eventData, type);
          break;
        case 'profile-updated':
          this.handleProfileUpdated(eventData);
          break;
        default:
          break;
      }
    });
  },
  unmounted() {
    if (this.isPopup) {
      this.hubChatStore.refChats.shift();
      return;
    }
    this.hubChatStore.refChats.pop();
    this.hubChatStore.clear();
  },
  methods: {
    isOrgAdmin(orgId) {
      return (
        (this.user.activeUserRole === 'organization-admin' ||
          this.user.activeUserRole === 'organization-owner') &&
        this.user.id === orgId
      );
    },
    isOwnMessage(message) {
      if (message.author.type === 'profile') {
        if (message.authorFrom) {
          return message.author.id === this.profile.id;
        }
        return message.author.id === this.userId;
      } else if (message.author.type === 'organization' && message.createdBy) {
        return (
          message.author.id === this.userId &&
          message.createdBy.id === this.profile.id
        );
      }
      return false;
    },
    isActive() {
      return document.hasFocus();
    },
    scrollToBottom() {
      this.hubChatStore.refChats.forEach((chat, index) => {
        if (
          chat?.isScrollEnd() &&
          (index || (!index && this.hubChatStore.showPopup)) &&
          this.isActive()
        ) {
          this.$nextTick(() => {
            chat?.scrollToBottom(true);
          });
        }
        this.$nextTick(() => {
          chat?.observeUnreadMessage();
        });
      });
    },
    lateralScrollToBottom() {
      if (this.hubChatStore.refLateralChat?.isScrollEnd() && this.isActive()) {
        this.$nextTick(() => {
          this.hubChatStore.refLateralChat?.scrollToBottom(true);
        });
      }
      this.$nextTick(() => {
        this.hubChatStore.refLateralChat?.observeUnreadMessage();
      });
    },
    async initCourseChat() {
      const roomInfo = await this.hubChatStore.getRoomInfo({
        roomId: this.courseId,
        entity: 'course',
      });
      this.hubChatStore.coursePopupRoom = [roomInfo];
      this.hubChatStore.chatId = roomInfo.id;
    },
    async onLocateMessage(id) {
      this.hubChatStore.rightSiderType = '';
      const roomId = this.hubChatStore.roomId;
      if (roomId === this.hubChatStore.chatId) {
        this.$refs.chat.locateMessage(id, false, true);
      } else if (roomId === this.hubChatStore.lateralChatId) {
        this.$refs.lateralChat.locateMessage(id, false, true);
      } else {
        this.hubChatStore.chatId = roomId;
        this.$nextTick(() => {
          this.$refs.chat.locateMessage(id, false, true);
        });
      }
    },
    async readMessage({ id }, isLateral = false) {
      const roomId = isLateral
        ? this.hubChatStore.lateralChatId
        : this.isPopup
          ? this.hubChatStore.popupChatId
          : this.hubChatStore.chatId;
      const room = this.hubChatStore.getRoomById(roomId);
      // this.websocket.send('user-read-message', {
      //   roomId,
      //   messageId: id,
      //   authorId,
      // });

      this.hubChatStore.viewMessage({ roomId, messageId: id });
      this.readMessageByRoomId(id, room.id);
    },
    readMessageByRoomId(id, roomId) {
      const room = this.hubChatStore.getReactiveRoomById(roomId);
      if (room) {
        if (room.lastTagMessageId === id) {
          room.lastTagMessageId = null;
        }
        if (room.unreadMessages > 0) {
          if (
            !(
              room.type === 'space' ||
              (room.type === 'folder' && room.innerRooms)
            )
          ) {
            room.unreadMessages -= 1;
          }
          // if (
          //   room.type === 'course' ||
          //   (room.type === 'folder' && room.innerRooms)
          // ) {
          //   this.hubChatStore.updateParentUnread(room.id);
          // }

          const roomMsg = this.hubChatStore.roomsMessages.find(
            (item) => item.id === roomId,
          );
          if (roomMsg) {
            roomMsg.lastReadMessageId = id;
            const msg = roomMsg.messages.find((msg) => msg.id === id);
            if (msg) {
              msg.read = true;
            }
          }
        }
        // if (this.hubChatStore.totalUnreadMessages > 0 && countTotal) {
        //   this.hubChatStore.totalUnreadMessages -= 1;
        // }
      }
    },
    readReaction({ id }, isLateral = false) {
      const roomId = isLateral
        ? this.hubChatStore.lateralChatId
        : this.hubChatStore.chatId;
      // this.websocket.send('user-read-message', {
      //   roomId,
      //   messageId: id,
      //   authorId,
      // });
      this.hubChatStore.viewMessage({ roomId, messageId: id });
      const roomInfo = this.hubChatStore.getReactiveRoomById(roomId);
      if (roomInfo && roomInfo.lastReactionMessageId === id) {
        roomInfo.lastReactionMessageId = null;
      }
    },
    async handleNewMessage(eventData, isForward = false) {
      const { id, data } = eventData;
      const isOwner = this.isOwnMessage(data);
      data.dataType = 'message';
      let isAddTotal = false;
      // update room info
      const updateRoom = this.hubChatStore.getReactiveRoomById(id);
      if (updateRoom && updateRoom.locked) {
        return;
      }
      if (!updateRoom) {
        const roomInfo = await this.hubChatStore.getRoomInfo({ roomId: id });
        if (roomInfo && roomInfo.locked) {
          return;
        }
        if (
          this.hubChatStore.roomsList.findIndex((item) => item.id === id) === -1
        ) {
          if (roomInfo.type !== 'folder' && roomInfo.type !== 'course') {
            this.hubChatStore.roomsList.unshift(roomInfo);
          } else if (
            !isOwner &&
            (roomInfo.type === 'course' ||
              (roomInfo.type === 'folder' && roomInfo.innerRooms === null))
          ) {
            const courseRoom = this.hubChatStore.getCourseRoom(roomInfo.id);
            if (courseRoom) {
              this.hubChatStore.updateRoomCount(courseRoom.roomId);
            }
          }
        }
      } else {
        const {
          id,
          author: { fullname },
          content,
          createdAt,
          taggedUsers,
          sourceRoom,
          attachments,
          social,
        } = data;
        const { unreadMessages, lastTagMessageId } = updateRoom;
        updateRoom.lastMessage = {
          id,
          author: {
            name: fullname,
            id: data.author.id,
          },
          preview: content,
          sourceRoom,
          attachment:
            attachments && attachments.length > 0 ? attachments[0] : null,
          createdAt,
          social,
        };
        updateRoom.lastMessageCreatedAt = createdAt;
        if (!isOwner) {
          if (updateRoom.type !== 'space' && updateRoom.type !== 'folder') {
            updateRoom.unreadMessages = unreadMessages + 1;
            isAddTotal = true;
          }
          if (
            updateRoom.type === 'course' ||
            (updateRoom.type === 'folder' && updateRoom.innerRooms === null)
          ) {
            const courseRoom = this.hubChatStore.getCourseRoom(updateRoom.id);
            if (courseRoom) {
              this.hubChatStore.updateRoomCount(courseRoom.roomId);
            }
          }
          updateRoom.lastTagMessageId = taggedUsers.find(
            (i) => i === this.userId,
          )
            ? id
            : lastTagMessageId;
        }
      }

      // update total unread
      if (!isOwner && isAddTotal) {
        this.hubChatStore.totalUnreadMessages += 1;
      }

      // update room message
      const room = this.hubChatStore.roomsMessages.find(
        (item) => item.id === id,
      );
      if (room && !room.next) {
        const { story, post } = data;
        if (!room.messages.find((item) => item.id === data.id)) {
          if (
            data.author?.type === 'organization' &&
            !this.isOrgAdmin(data.author.id) &&
            data.createdBy
          ) {
            delete data.createdBy;
          }
          if (
            !(
              isOwner &&
              (id === this.hubChatStore.chatId ||
                id === this.hubChatStore.lateralChatId) &&
              !isForward &&
              !story &&
              !post
            )
          ) {
            room.messages.push(data);
          }

          if (
            this.hubChatStore.chatId === id ||
            this.hubChatStore.popupChatId === id
          ) {
            this.scrollToBottom();
          }
          if (this.hubChatStore.lateralChatId === id) {
            this.lateralScrollToBottom();
          }
        }
      }
    },
    async handleTyping(eventData) {
      const {
        id,
        data: { userId, userName },
      } = eventData;
      if (userId === this.userId) {
        return;
      }
      const room = this.hubChatStore.roomsTyping.find((item) => item.id === id);
      if (room) {
        const typing = room.typings.find((item) => item.id === userId);
        if (typing) {
          clearTimeout(typing.timer);
          typing.timer = setTimeout(() => {
            room.typings = room.typings.filter((item) => item.id !== userId);
          }, 4000);
        } else {
          room.typings.push({
            id: userId,
            name: userName,
            timer: setTimeout(() => {
              room.typings = room.typings.filter((item) => item.id !== userId);
            }, 4000),
          });
        }
      } else {
        const room = {
          id,
          typings: [
            {
              id: userId,
              name: userName,
              timer: setTimeout(() => {
                room.typings = room.typings.filter(
                  (item) => item.id !== userId,
                );
              }, 4000),
            },
          ],
        };
        this.hubChatStore.roomsTyping.push(room);
      }
    },
    async handleRoomDeleted(eventData) {
      const { id } = eventData;
      this.hubChatStore.handleDeleteRoom(id);
    },
    async handleReaction(eventData) {
      const {
        type,
        data: { roomId, user, messageId, reaction },
      } = eventData;
      if (user.id === this.userId) {
        return;
      }
      const room = this.hubChatStore.roomsMessages.find(
        (item) => item.id === roomId,
      );
      if (room) {
        const message = room.messages.find((item) => item.id === messageId);
        if (message) {
          if (message.reactions && message.reactions.count) {
            if (type === 'reaction-added') {
              message.reactions.count[reaction] = message.reactions.count[
                reaction
              ]
                ? message.reactions.count[reaction] + 1
                : 1;
              if (message.reactions.data[reaction]) {
                message.reactions.data[reaction].unshift({
                  userProfile: {
                    id: user.id,
                    image: user.image,
                  },
                  reaction,
                });
              } else {
                message.reactions.data[reaction] = [
                  {
                    reaction,
                    userProfile: {
                      id: user.id,
                      image: user.image,
                    },
                  },
                ];
              }
            } else {
              message.reactions.count[reaction] = message.reactions.count[
                reaction
              ]
                ? message.reactions.count[reaction] - 1
                : 0;
              if (
                message.reactions &&
                message.reactions.data[reaction].find(
                  (r) => r.userProfile.id === user.id,
                )
              ) {
                message.reactions.data[reaction] = message.reactions.data[
                  reaction
                ].filter((r) => r.userProfile.id !== user.id);
              }
            }
          } else {
            message.reactions = {
              count: { [reaction]: 1 },
              data: {
                [reaction]: [
                  {
                    reaction,
                    userProfile: {
                      id: user.id,
                      image: user.image,
                    },
                  },
                ],
              },
            };
          }
        }
        if (message && message.author.id === this.userId) {
          const roomInfo = this.hubChatStore.getReactiveRoomById(roomId);
          if (roomInfo) {
            if (type === 'reaction-added') {
              roomInfo.lastReactionMessageId = messageId;
              this.hubChatStore.refChats.forEach((chat, index) => {
                if (index || (!index && this.hubChatStore.showPopup)) {
                  this.$nextTick(() => {
                    chat?.observeReactionMessage();
                  });
                }
              });
            } else {
              if (roomInfo.lastReactionMessageId === messageId) {
                roomInfo.lastReactionMessageId = null;
              }
            }
          }
        }

        // if (this.hubChatStore.chatId === roomId) {
        //   this.hubChatStore.messages = [...room.messages];
        // }
      }
    },
    async handlePinnedMessage(eventData) {
      const { type, id, data } = eventData;
      const room = this.hubChatStore.roomsMessages.find(
        (item) => item.id === id,
      );
      const pinnedRoom = this.hubChatStore.pinnedMessages.find(
        (item) => item.id === id,
      );
      if (type === 'message-pinned') {
        const { pinnedMessages } = data;
        if (pinnedRoom) {
          pinnedRoom.messages.push(...pinnedMessages);
        }
        if (room) {
          pinnedMessages.forEach((item) => {
            const message = room.messages.find((m) => m.id === item.id);
            if (message) {
              message.pinned = true;
            }
          });
        }
      } else {
        data.forEach((item) => {
          if (pinnedRoom) {
            pinnedRoom.messages = pinnedRoom.messages.filter(
              (m) => m.id !== item,
            );
          }
          if (room) {
            const message = room.messages.find((m) => m.id === item);
            if (message) {
              message.pinned = false;
            }
          }
        });
      }
    },
    async handleForwardMessage(eventData) {
      const { id, data } = eventData;
      for (let i = 0; i < data.length; i++) {
        const message = data[i];
        await this.handleNewMessage(
          {
            id,
            data: {
              ...message,
            },
          },
          true,
        );
      }
    },
    async handleDeletedMessage(eventData, isUser = false) {
      const {
        id,
        data: { roomId, messageIds },
      } = eventData;
      await this.hubChatStore.deleteMessages(messageIds, isUser ? roomId : id);
    },
    async handleReadMessage(eventData) {
      const {
        data: { roomId, messageId, userId },
      } = eventData;
      if (userId === this.userId) {
        this.hubChatStore.readRoomMessages(roomId);
        return;
      }
      const room = this.hubChatStore.roomsMessages.find(
        (item) => item.id === roomId,
      );
      if (room) {
        room.messages.forEach((item) => {
          if (item.id === messageId) {
            item.viewCount = item.viewCount ? item.viewCount + 1 : 1;
          }
        });
      }
      const roomInfo = this.hubChatStore.roomsList.find(
        (item) => item.id === roomId,
      );
      if (
        roomInfo &&
        roomInfo.lastMessage.id === messageId &&
        roomInfo.lastMessage.author.id === this.userId
      ) {
        roomInfo.lastMessage.viewCount = 1;
      }
    },
    async handleOnline(eventData) {
      const { id, type } = eventData;
      const room = this.hubChatStore.roomsList.find(
        (item) => item.oneToOnePeer && item.oneToOnePeer.id === id,
      );
      if (room) {
        room.oneToOnePeer = {
          id,
          isOnline: type === 'online' ? true : false,
        };
      }
    },
    async handleClearHistory(eventData) {
      const { id } = eventData;
      this.hubChatStore.clearMessages(id);
    },
    async handleUpdatedMessage(eventData) {
      const { id, data } = eventData;
      const room = this.hubChatStore.roomsMessages.find((r) => r.id === id);
      if (room) {
        const index = room.messages.findIndex((m) => m.id === data.id);
        if (index !== -1) {
          room.messages[index] = data;
        }
        // if (this.hubChatStore.chatId === id) {
        //   const index = this.hubChatStore.messages.findIndex(
        //     (m) => m.id === data.id,
        //   );
        //   if (index !== -1) {
        //     this.hubChatStore.messages[index] = data;
        //   }
        // }
      }
      const roomUpdate = this.hubChatStore.getReactiveRoomById(id);
      if (roomUpdate.lastMessage.id === data.id) {
        roomUpdate.lastMessage.preview = data.content;
      }
    },
    async handleMention(eventData) {
      const {
        type,
        data: { roomId, messageId },
      } = eventData;
      const room = this.hubChatStore.getReactiveRoomById(roomId);
      if (type === 'mention-added') {
        if (room && !room.lastTagMessageId) {
          room.lastTagMessageId = messageId;
        }
      } else {
        if (room && room.lastTagMessageId === messageId) {
          room.lastTagMessageId = null;
        }
      }
    },
    async handleProfileUpdated(eventData) {
      const {
        id,
        data: { name, image },
      } = eventData;
      const room = this.hubChatStore.roomsList.find(
        (r) => r.oneToOnePeer && r.oneToOnePeer.id === id,
      );
      if (room) {
        room.name = name;
        room.image = image;
        const messages = this.hubChatStore.roomsMessages.find(
          (r) => r.id === room.id,
        )?.messages;
        if (messages) {
          messages.forEach((m) => {
            if (m.author.id === id) {
              m.author.name = name;
              m.author.image = image;
            }
          });
        }
      }
    },
    async handleRoomUpdated(eventData) {
      const {
        id,
        data: { updatedFields },
      } = eventData;
      const room = this.hubChatStore.getReactiveRoomById(id);
      if (room) {
        if (updatedFields && updatedFields.length > 0) {
          updatedFields.forEach((field) => {
            room[field] = eventData.data[field];
          });
        }
      }
      if (this.hubChatStore.roomInfo && this.hubChatStore.roomInfo.id === id) {
        if (updatedFields && updatedFields.length > 0) {
          updatedFields.forEach((field) => {
            this.hubChatStore.roomInfo[field] = eventData.data[field];
          });
        }
      }
      if (this.hubChatStore.chatInfo && this.hubChatStore.chatInfo.id === id) {
        if (updatedFields && updatedFields.length > 0) {
          updatedFields.forEach((field) => {
            if (field === 'name') {
              this.hubChatStore.chatBreadcrumbs[
                this.hubChatStore.chatBreadcrumbs.length - 1
              ].title = eventData.data[field];
            }
          });
        }
      }
    },
    async handleNewRoom(eventData) {
      const { data } = eventData;
      const room = this.hubChatStore.getRoomById(data.id);
      if (!room && ['space', 'one-to-one', 'group'].includes(data.type)) {
        this.hubChatStore.roomsList.unshift(data);
      }
    },
    async handleMemberAdded(eventData) {
      const {
        id,
        data: { members },
      } = eventData;
      const isMe = members.find((m) => m.id === this.userId);
      const room = this.hubChatStore.getRoomById(id);
      if (isMe) {
        if (!room) {
          const room = await this.hubChatStore.getRoomInfo({ roomId: id });
          if (['space', 'one-to-one', 'group'].includes(room.type)) {
            this.hubChatStore.roomsList.unshift(room);
          }
        } else {
          room.deleted = false;
        }
      }
    },
    async handleMemberRemoved(eventData) {
      const {
        id,
        data: { members },
      } = eventData;
      const isMe = members.find((m) => m.id === this.userId);
      const room = this.hubChatStore.getReactiveRoomById(id);
      if (isMe) {
        if (room) {
          room.deleted = true;
        }
      }
    },
    async handleNewActivities(eventData) {
      const { id, data } = eventData;
      const room = this.hubChatStore.roomsMessages.find((r) => r.id === id);
      if (room) {
        data.forEach((item) => {
          room.messages.push({ dataType: 'activity', ...item });
        });
        const roomInfo = this.hubChatStore.getReactiveRoomById(id);
        if (roomInfo) {
          roomInfo.lastActivity = data[data.length - 1];
        }
      } else {
        // this.hubChatStore.roomsMessages.push({
        //   id: id,
        //   messages: data.map((item) => {
        //     return { dataType: 'activity', ...item };
        //   }),
        // });
      }
    },
  },
};
</script>
