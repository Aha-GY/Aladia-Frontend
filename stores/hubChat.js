import {
  searchRooms,
  createRoom,
  listRooms,
  retrieveRoom,
  muteRoom,
  unreadRoom,
  readRoom,
  updateRoom,
  deleteRoom,
  getRoomMembers,
  searchRoomMembers,
  addRoomMembers,
  deleteRoomMembers,
  changeRoomMembersRole,
  getRoomFiles,
  getRoomLinks,
  getRoomMedia,
  searchRoomFiles,
  searchRoomLinks,
  searchRoomMedia,
  deleteRoomAttachment,
  getRoomMessagesV2,
  searchRoomMessages,
  createRoomMessage,
  deleteRoomMessages,
  addReationInMessage,
  deleteReationInMessage,
  getReationsInMessage,
  deleteSavedMessages,
  addSavedMessages,
  getSavedMessages,
  searchSavedMessages,
  getLinkData,
  getRoomPinnedMessages,
  addRoomPinnedMessages,
  deleteRoomPinnedMessage,
  pinRoom,
  forwardMessages,
  getMessageInfo,
  getUnreadMessages,
  updateRoomMessage,
  clearRoomHistory,
  getFromDateMessages,
  getSearchHistory,
  createSearchHistory,
  deleteSearchHistory,
  clearSearchHistory,
  getRecentRooms,
  search,
  updatePreferences,
  listCommonRooms,
  getInviteLink,
  acceptInvite,
  viewMessage,
} from '~/api/v2/chat';
import { getFollowers } from '~/api/v2/followers';
import {
  searchProfile,
  searchProfilesAndOrganizations,
  retrieveProfile,
  retrieveOrganization,
} from '~/api/v2/profile';

export const useHubChatStore = defineStore('hubChat', {
  state: () => ({
    // membersLoading: false,
    // isMembersMore: true,
    // membersNextType: '',
    // members: [],
    // followers: [],
    // profileSearchParams: {
    //   firstName: '',
    //   next: null,
    //   limit: 10,
    // },
    // searchedProfiles: [],
    roomId: null,

    isSetting: false,
    chatBgColor: '#101010',
    nameColor: '',
    siderWidth: 0,

    chatBreadcrumbs: [
      // {
      //   title: 'Aladia Organization',
      //   subTitle: 'today’s messages',
      // },
    ],

    // info, create, members
    rightSiderType: '',
    roomInfo: {},
    lateralRoomInfo: {},

    isChat: false,

    selecteds: [],
    roomsParams: {
      limit: 20,
      pinned: false,
      next: null,
    },
    isRoomsMore: true,
    roomListLoading: true,
    roomsList: [],

    showSpace: false,
    spaceId: null,
    spaceEntityId: null,
    spaceInfo: null,
    spaceList: [],
    spaceParams: {
      limit: 20,
      next: null,
    },
    isSpaceMore: false,
    spaceListLoading: false,
    spaceListType: '',

    searchRoomsParams: {
      query: '',
      limit: 20,
      next: null,
    },
    isSearchRoomsMore: false,
    searchRoomListLoading: false,
    searchRoomsList: [],

    chatId: null,
    chatInfo: null,
    lateralChatId: null,
    lateralChatInfo: null,

    popupChatId: null,
    popupChatInfo: null,
    popupSpaceId: null,
    popupSpaceEntityId: null,
    popupSpaceInfo: null,
    popupShowSpace: false,
    popupSpaceList: [],
    popupSpaceParams: {
      limit: 20,
      next: null,
    },
    popupIsSpaceMore: false,
    popupSpaceListLoading: false,
    popupSpaceListType: '',

    rightClickId: null,

    isPreview: false,
    previewId: null,
    previewData: [],

    membersTotal: 0,
    membersParams: {
      search: '',
      pageNumber: 1,
      pageSize: 20,
    },
    isMembersSelect: false,
    membersActives: [],
    createRoomData: {
      name: '',
      description: '',
      picture: '',
    },
    roomsMessages: [],
    messages: [],
    sendingMessages: [],
    pinnedMessages: [],
    lateralMessages: [],
    isNowMessage: false,
    isMessagesPrev: false,
    isLateralMessagesPrev: false,
    sortMessageId: '',
    endMessageId: '',

    searchMessageIndex: 1,
    typingName: '',
    messagesLoading: false,

    roomsTyping: [],

    showForward: false,
    forwardData: {
      roomId: null,
      targetRoomId: null,
      messages: [],
    },
    totalUnreadMessages: 0,
    editData: {
      roomId: null,
      message: null,
    },
    locateChatMessageId: null,
    coursePopupRoom: [],
    popupSpace: false,
    showPopup: false,
    infoLoading: false,
    refChats: [],
    refLateralChat: null,
    dragging: false,
  }),
  getters: {
    sortRoomList() {
      return this.sortRooms(this.roomsList);
    },
    sortSpaceRoomList() {
      return this.sortRooms(this.spaceList);
    },
    sortPopupSpaceRoomList() {
      return this.sortRooms(this.popupSpaceList);
    },
  },
  actions: {
    initRoom() {
      this.typingName = '';
      this.messages = [];
      this.messagesLoading = false;
    },
    clear() {
      this.chatId = null;
      this.chatInfo = null;
      this.messages = [];
      this.roomsList = [];
      this.roomsMessages = [];
      this.showSpace = false;
      this.spaceList = [];
      this.spaceId = null;
      this.rightSiderType = '';
      this.roomId = null;
      this.roomInfo = null;
      this.lateralChatId = null;
      this.roomsParams.next = null;
      this.spaceParams.next = null;
      this.pinnedMessages = [];
    },
    closeRightSider() {
      this.roomId = null;
      this.roomInfo = null;
      this.rightSiderType = '';
      const sidebar = useHubSidebarStore();
      sidebar.invite.state = false;
    },
    closeLateral() {
      this.lateralChatId = null;
      this.lateralChatInfo = null;
    },
    previewMedia(id, roomId) {
      const room = this.roomsMessages.find((r) => r.id === roomId);
      const medias = room.messages
        .filter((r) => r.attachments && r.attachments.length)
        .map((r) => r.attachments.map((item) => ({ ...item, messageId: r.id })))
        .flat()
        .filter((r) => r.category?.includes('media'));
      this.previewData = medias;
      this.previewId = id;
      this.isPreview = true;
    },
    sortRooms(list) {
      const pinList = list
        .filter((r) => r.preferences?.pin === true)
        .sort(
          (a, b) => new Date(this.lastTime(b)) - new Date(this.lastTime(a)),
        );
      const unPinList = list
        .filter((r) => r.preferences?.pin === false)
        .sort(
          (a, b) => new Date(this.lastTime(b)) - new Date(this.lastTime(a)),
        );
      return [...pinList, ...unPinList];
    },
    lastTime(item) {
      if (item.lastActivity && item.lastMessage) {
        if (
          new Date(item.lastActivity.createdAt) >
          new Date(item.lastMessage.createdAt)
        ) {
          return item.lastActivity.createdAt;
        } else {
          return item.lastMessage.createdAt;
        }
      } else if (!item.lastActivity && item.lastMessage) {
        return item.lastMessage.createdAt;
      } else if (item.lastActivity && !item.lastMessage) {
        return item.lastActivity.createdAt;
      }
      return item.lastMessageCreatedAt;
    },
    async openRoomInfo(roomId) {
      this.infoLoading = true;
      this.rightSiderType = 'info';
      await this.retrieveRoom({ roomId });
      this.roomId = roomId;
      this.infoLoading = false;
    },
    async openOneToOneRoom(userId, type) {
      let room = this.roomsList.find((r) => r.oneToOnePeer?.id === userId);
      if (!room) {
        room = await createRoom({
          type: 'one-to-one',
          members: [
            {
              id: userId,
              type,
              role: 'chat-room-admin',
            },
          ],
        });
      }
      this.chatId = room.id;
      this.chatInfo = room;
    },

    async shareStory(
      storyId,
      content,
      text,
      roomIds = [],
      profiles = [],
      files = [],
    ) {
      return await this.shareMessagesBySocial(
        'story',
        storyId,
        content,
        text,
        roomIds,
        profiles,
        files,
      );
    },

    async sharePost(
      postId,
      content,
      text,
      roomIds = [],
      profiles = [],
      files = [],
    ) {
      return await this.shareMessagesBySocial(
        'post',
        postId,
        content,
        text,
        roomIds,
        profiles,
        files,
      );
    },

    async shareMessagesBySocial(
      type,
      shareId,
      content,
      text,
      roomIds = [],
      profiles = [],
      files = [],
      action = 'share',
    ) {
      const sharePromise = [];
      const share = {};
      if (type === 'story') {
        share.story = {
          storyId: shareId,
          action,
        };
      } else if (type === 'post') {
        share.postId = shareId;
      }

      const attachments = [];
      if (files && files.length) {
        for (let i = 0; i < files.length; i++) {
          const { fileId } = await upload({
            file: files[i],
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
          attachments.push({
            fileId,
            metadata,
          });
        }
      }

      if (Array.isArray(profiles) && profiles.length > 0) {
        const roomPromise = profiles.map((profile) =>
          createRoom({
            type: 'one-to-one',
            members: [
              {
                id: profile.id,
                type: profile.entityType || 'profile',
                role: 'chat-room-admin',
              },
            ],
          }),
        );
        await Promise.all(roomPromise).then((rooms) => {
          rooms.forEach((room) => {
            sharePromise.push(
              createRoomMessage({
                roomId: room.id,
                content,
                text,
                attachments,
                ...share,
              }),
            );
          });
        });
      }
      if (Array.isArray(roomIds) && roomIds.length > 0) {
        roomIds.forEach((roomId) => {
          sharePromise.push(
            createRoomMessage({
              roomId,
              content,
              text,
              attachments,
              ...share,
            }),
          );
        });
      }
      return await Promise.all(sharePromise);
    },

    async sendStoryMessage(id, storyId, content, text, type = 'one-to-one') {
      let room = null;
      if (type === 'one-to-one') {
        room = this.roomsList.find((r) => r.oneToOnePeer?.id === id);
      } else {
        room = this.roomsList.find((r) => r.id === id);
      }
      if (!room) {
        room = await createRoom({
          type,
          members: [
            {
              id,
              role: 'chat-room-admin',
            },
          ],
        });
      }
      const message = {
        roomId: room.id,
        content,
        text,
        story: {
          storyId,
          action: 'reply',
        },
      };
      await this.createRoomMessage(message);
    },
    async sendReelMessage(userId, reelId, content, text) {
      let room = this.roomsList.find((r) => r.oneToOnePeer?.id === userId);
      if (!room) {
        room = await createRoom({
          type: 'one-to-one',
          members: [
            {
              id: userId,
              role: 'chat-room-admin',
            },
          ],
        });
      }
      const message = {
        roomId: room.id,
        content,
        text,
        reelId,
      };
      await this.createRoomMessage(message);
    },
    async goToOneToOneRoom({ id, entityType }) {
      if (!id) {
        return;
      }
      const router = useRouter();
      const authStore = useAuthStore();
      const url = `${authStore.hub}/chat`;
      console.log(url);
      await router.push(url);
      let room = this.roomsList.find((r) => r.oneToOnePeer?.id === id);
      console.log(room);
      if (!room) {
        room = await createRoom({
          type: 'one-to-one',
          members: [
            {
              id,
              type: entityType || 'profile',
              role: 'chat-room-admin',
            },
          ],
        });
      }
      this.chatId = room.id;
      this.chatInfo = room;
      this.showSpace = false;
    },
    async storyToChat(userId, msgContent, msgText) {
      const router = useRouter();
      const authStore = useAuthStore();
      const url = `${authStore.hub}/chat`;
      router.push(url);
      let room = this.roomsList.find((r) => r.oneToOnePeer?.id === userId);
      if (!room) {
        room = await createRoom({
          type: 'one-to-one',
          members: [
            {
              id: userId,
              role: 'chat-room-admin',
            },
          ],
        });
      }
      this.chatId = room.id;
      this.chatInfo = room;
      this.showSpace = false;
      const newMsg = {
        id: new Date().toISOString(),
        roomId: room.id,
        sending: {
          content: msgContent,
          text: msgText,
        },
      };
      const sendingRoom = this.sendingMessages.find(
        (item) => item.roomId === room.id,
      );
      if (sendingRoom) {
        sendingRoom.messages.push(newMsg);
      } else {
        this.sendingMessages.push({
          roomId: room.id,
          isPopup: false,
          messages: [newMsg],
        });
      }
    },
    getParentRoomIds(id) {
      const room = this.spaceList.find((r) => r.id === id);
      if (room) {
        return [this.spaceId];
      } else {
        const folders = this.spaceList.filter(
          (r) => r.type === 'folder' && r.courses && r.courses.length > 0,
        );
        let parentFolder = null;
        folders.forEach((folder) => {
          const course = folder.courses.find((c) => c.id === id);
          if (course) {
            parentFolder = folder;
          }
        });
        return [this.spaceId, parentFolder?.id];
      }
    },
    getRoomById(id) {
      const courseRooms = this.spaceList
        .filter(
          (item) =>
            item.type === 'folder' && item.courses && item.courses.length > 0,
        )
        .flatMap((item) => item.courses);
      const popupCourseRooms = this.popupSpaceList
        .filter(
          (item) =>
            item.type === 'folder' && item.courses && item.courses.length > 0,
        )
        .flatMap((item) => item.courses);
      return [
        ...this.roomsList,
        ...this.spaceList,
        ...this.popupSpaceList,
        ...courseRooms,
        ...popupCourseRooms,
        ...this.coursePopupRoom,
      ].find((r) => r.id === id);
    },
    getReactiveRoomById(id) {
      const room = this.getRoomById(id);
      if (!room) {
        return null;
      }
      if (['space', 'one-to-one', 'group'].includes(room.type)) {
        const roomIndex = this.roomsList.findIndex((r) => r.id === id);
        return this.roomsList[roomIndex];
      } else {
        const popupRoomIndex = this.popupSpaceList.findIndex(
          (r) =>
            r.id === id ||
            (r.courses && r.courses.findIndex((c) => c.id === id) > -1),
        );
        if (popupRoomIndex !== -1) {
          if (this.popupSpaceList[popupRoomIndex].id === id) {
            return this.popupSpaceList[popupRoomIndex];
          } else {
            const courseIndex = this.popupSpaceList[
              popupRoomIndex
            ].courses.findIndex((c) => c.id === id);
            if (courseIndex !== -1) {
              return this.popupSpaceList[roomIndex].courses[courseIndex];
            }
          }
        }

        const roomIndex = this.spaceList.findIndex(
          (r) =>
            r.id === id ||
            (r.courses && r.courses.findIndex((c) => c.id === id) > -1),
        );
        if (roomIndex !== -1) {
          if (this.spaceList[roomIndex].id === id) {
            return this.spaceList[roomIndex];
          } else {
            const courseIndex = this.spaceList[roomIndex].courses.findIndex(
              (c) => c.id === id,
            );
            return this.spaceList[roomIndex].courses[courseIndex];
          }
        }
      }
      if (this.coursePopupRoom.findIndex((r) => r.id === id) !== -1) {
        return this.coursePopupRoom.find((r) => r.id === id);
      }
      return null;
    },

    getCourseRoom(id) {
      const spaceRooms = this.roomsList
        .filter((r) => r.type === 'space' && !!r.innerRooms)
        .flatMap((r) => r.innerRooms);
      const innerRoom = spaceRooms
        .filter((r) => !!r.innerRooms)
        .flatMap((r) => r.innerRooms);
      return [...spaceRooms, ...innerRoom].find((r) => r.roomId === id);
    },

    async updateRoomCount(roomId) {
      const spaceRooms = this.roomsList.filter(
        (r) => r.type === 'space' && !!r.innerRooms,
      );
      const folderRooms = this.spaceList.filter((r) => r.type === 'folder');
      let courseRoom = null;
      let folderRoom = null;
      [...spaceRooms, ...folderRooms].forEach((room) => {
        if (room.id === roomId) {
          room.unreadMessages += 1;
          return;
        }

        room.innerRooms?.forEach((subRoom) => {
          if (subRoom.roomId === roomId) {
            courseRoom = subRoom;
            return;
          }
          if (subRoom.innerRooms) {
            const subSubRoom = subRoom.innerRooms.find(
              (r) => r.roomId === roomId,
            );
            if (subSubRoom) {
              folderRoom = subRoom;
              courseRoom = subSubRoom;
              return;
            }
          }
        });
        if (courseRoom) {
          courseRoom.count += 1;
          if (folderRoom) {
            folderRoom.count = folderRoom.innerRooms.reduce(
              (acc, room) => acc + (room.count > 0 ? 1 : 0),
              0,
            );
          }
          room.unreadMessages = room.innerRooms?.reduce(
            (acc, room) => acc + (room.count > 0 ? 1 : 0),
            0,
          );
          courseRoom = null;
          folderRoom = null;
        }
      });
    },

    async updateParentUnread(roomId, isReadAll = false) {
      const parentIds = this.getParentRoomIds(roomId);
      parentIds.forEach((id) => {
        this.reduceRoomUnread(id, roomId, isReadAll);
      });
    },

    reduceRoomUnread(roomId, targetRoomId, isReadAll = false) {
      const room = this.getReactiveRoomById(roomId);
      if (room) {
        room.innerRooms.forEach((r) => {
          if (r.roomId === targetRoomId) {
            if (r.count > 0) {
              if (isReadAll) {
                r.count = 0;
              } else {
                r.count -= 1;
              }
            }
            room.unreadMessages = room.innerRooms?.reduce(
              (acc, room) => acc + (room.count > 0 ? 1 : 0),
              0,
            );
          }
          if (r.innerRooms) {
            r.innerRooms.forEach((subRoom) => {
              if (subRoom.roomId === targetRoomId) {
                if (subRoom.count > 0) {
                  if (isReadAll) {
                    subRoom.count = 0;
                  } else {
                    subRoom.count -= 1;
                  }
                }
              }
            });
            r.count = r.innerRooms.reduce(
              (acc, room) => acc + (room.count > 0 ? 1 : 0),
              0,
            );
          }
        });
        room.unreadMessages = room.innerRooms?.reduce(
          (acc, room) => acc + (room.count > 0 ? 1 : 0),
          0,
        );
      }
      return room;
    },

    updateRoomUnread(roomId, targetRoom) {
      const room = this.getReactiveRoomById(roomId);
      if (room) {
        room.innerRooms.forEach((r) => {
          if (r.roomId === targetRoom.id) {
            r.count = targetRoom.unreadMessages;
            room.unreadMessages = room.innerRooms?.reduce(
              (acc, room) => acc + (room.count > 0 ? 1 : 0),
              0,
            );
          }
        });
      }
      return room;
    },

    async syncRoomUnread(roomId) {
      const room = this.getReactiveRoomById(roomId);
      const { innerRooms, unreadMessages } = await this.retrieveRoom({
        roomId,
      });
      room.innerRooms = innerRooms;
      room.unreadMessages = unreadMessages;
      const parentIds = this.getParentRoomIds(roomId);
      if (parentIds.length === 1) {
        this.updateRoomUnread(parentIds[0], room);
      } else if (parentIds.length === 2) {
        const folderRoom = this.updateRoomUnread(parentIds[1], room);
        if (folderRoom) {
          this.updateRoomUnread(parentIds[0], folderRoom);
        }
      }
    },

    async readRoomMessages(roomId) {
      const spaceRooms = this.roomsList.filter(
        (r) => r.type === 'space' && !!r.innerRooms,
      );
      const spaceInnerRooms = this.spaceList;
      let courseRoom = null;
      let folderRoom = null;
      [...spaceRooms, ...spaceInnerRooms].forEach((room) => {
        if (room.id === roomId && room.innerRooms === null) {
          if (room.unreadMessages > 0) {
            room.unreadMessages -= 1;
          }
          return;
        }
        if (room.courses && room.courses.length > 0) {
          const course = room.courses.find((r) => r.id === roomId);
          if (course && course.unreadMessages > 0) {
            course.unreadMessages -= 1;
          }
        }

        room.innerRooms?.forEach((subRoom) => {
          if (subRoom.roomId === roomId) {
            courseRoom = subRoom;
            return;
          }
          if (subRoom.innerRooms) {
            const subSubRoom = subRoom.innerRooms.find(
              (r) => r.roomId === roomId,
            );
            if (subSubRoom) {
              folderRoom = subRoom;
              courseRoom = subSubRoom;
              return;
            }
          }
        });
        if (courseRoom) {
          if (courseRoom.count > 0) {
            courseRoom.count--;
          }
          if (folderRoom) {
            const count = folderRoom.innerRooms.reduce(
              (acc, room) => acc + (room.count > 0 ? 1 : 0),
              0,
            );
            const folderCount = room.innerRooms.find(
              (r) => r.roomId === folderRoom.roomId,
            );
            folderCount.count = count;
          }
          room.unreadMessages = room.innerRooms?.reduce(
            (acc, room) => acc + (room.count > 0 ? 1 : 0),
            0,
          );
          courseRoom = null;
          folderRoom = null;
        }
      });
    },

    async getFollowers(params) {
      return await getFollowers(params);
    },
    async getSuggestions(params) {
      return await searchProfile(params);
    },
    async searchProfile(params) {
      return await searchProfilesAndOrganizations(params);
    },

    async createRoom(params) {
      const data = await createRoom(params);
      this.roomInfo = data;
      this.rightSiderType = 'info';
      this.roomId = data.id;
      if (!this.roomsList.some((r) => r.id === data.id)) {
        this.roomsList.unshift(data);
      }
      this.chatId = data.id;
      return data;
    },
    async getAllPinnedRooms(_next = null) {
      const {
        data,
        cursor: { next },
      } = await listRooms({ limit: 100, pinned: true, next: _next });
      data.forEach((room) => {
        if (!this.roomsList.some((r) => r.id === room.id)) {
          this.roomsList.push(room);
        }
      });
      if (next) {
        return await this.getAllPinnedRooms(next);
      }
      return data;
    },
    async getListRooms() {
      this.roomListLoading = true;
      if (!this.roomsParams.next) {
        await this.getAllPinnedRooms();
      }
      const {
        data,
        cursor: { next },
      } = await listRooms(this.roomsParams);
      data.forEach((room) => {
        if (!this.roomsList.some((r) => r.id === room.id)) {
          this.roomsList.push(room);
        }
      });
      this.roomsParams.next = next;
      this.isRoomsMore = next ? true : false;
      this.roomListLoading = false;
      return data;
    },

    async getAllPinnedSpaceRooms(id, type, _next = null) {
      const {
        data,
        cursor: { next },
      } = await listRooms({
        limit: 100,
        pinned: true,
        next: _next,
        [type]: id,
      });
      if (type === 'space') {
        if (this.spaceEntityId !== id) {
          return;
        }
        data.forEach((room) => {
          if (!this.spaceList.some((r) => r.id === room.id)) {
            this.spaceList.push(room);
          }
        });
      } else {
        const folder = this.spaceList.find((r) => r.entityId === id);
        if (folder) {
          if (folder.courses) {
            data.forEach((room) => {
              if (!folder.courses.some((r) => r.id === room.id)) {
                folder.courses.push(room);
              }
            });
          } else {
            folder.courses = data;
          }
        }
      }
      if (next) {
        return await this.getAllPinnedSpaceRooms(id, type, next);
      }
      return data;
    },

    async getAllPinnedPopupSpaceRooms(id, type, _next = null) {
      const {
        data,
        cursor: { next },
      } = await listRooms({
        limit: 100,
        pinned: true,
        next: _next,
        [type]: id,
      });
      if (type === 'space') {
        if (this.popupSpaceEntityId !== id) {
          return;
        }
        data.forEach((room) => {
          if (!this.popupSpaceList.some((r) => r.id === room.id)) {
            this.popupSpaceList.push(room);
          }
        });
      } else {
        const folder = this.popupSpaceList.find((r) => r.entityId === id);
        if (folder) {
          if (folder.courses) {
            data.forEach((room) => {
              if (!folder.courses.some((r) => r.id === room.id)) {
                folder.courses.push(room);
              }
            });
          } else {
            folder.courses = data;
          }
        }
      }

      if (next) {
        return await this.getAllPinnedPopupSpaceRooms(id, type, next);
      }
      return data;
    },
    async getSpaceList(id, type) {
      this.spaceListLoading = true;
      this.spaceListType = type;

      if (type === 'space') {
        if (!this.spaceParams.next) {
          await this.getAllPinnedSpaceRooms(id, type);
        }
        const {
          data,
          cursor: { next },
        } = await listRooms({ ...this.spaceParams, [type]: id });
        if (this.spaceEntityId !== id) {
          return;
        }
        data.forEach((room) => {
          if (!this.spaceList.some((r) => r.id === room.id)) {
            this.spaceList.push({ ...room, show: false });
          }
        });
        this.spaceParams.next = next;
        this.isSpaceMore = next ? true : false;
        this.spaceListLoading = false;
        return data;
      } else {
        const folder = this.spaceList.find((r) => r.entityId === id);
        folder.show = true;
        folder.loading = true;
        if (!folder.next) {
          await this.getAllPinnedSpaceRooms(id, type);
        }
        const {
          data,
          cursor: { next },
        } = await listRooms({
          ...this.spaceParams,
          next: folder.next,
          [type]: id,
        });
        if (folder.courses) {
          data.forEach((room) => {
            if (!folder.courses.some((r) => r.id === room.id)) {
              folder.courses.push(room);
            }
          });
        } else {
          folder.courses = data;
        }
        folder.next = next;
        folder.isMore = next ? true : false;
        folder.loading = false;
        return data;
      }
    },
    async getPopupSpaceList(id, type, isShowFolder = true) {
      this.popupSpaceListLoading = true;
      this.popupSpaceListType = type;

      if (type === 'space') {
        if (!this.popupSpaceParams.next) {
          await this.getAllPinnedPopupSpaceRooms(id, type);
        }
        const {
          data,
          cursor: { next },
        } = await listRooms({ ...this.popupSpaceParams, [type]: id });
        if (this.popupSpaceEntityId !== id) {
          return;
        }
        data.forEach((room) => {
          if (!this.popupSpaceList.some((r) => r.id === room.id)) {
            this.popupSpaceList.push({ ...room, show: false });
          }
        });
        this.popupSpaceParams.next = next;
        this.popupIsSpaceMore = next ? true : false;
        this.popupSpaceListLoading = false;
        return data;
      } else {
        const folder = this.popupSpaceList.find((r) => r.entityId === id);
        if (isShowFolder) {
          folder.show = true;
          folder.loading = true;
        }
        if (!folder.next) {
          await this.getAllPinnedPopupSpaceRooms(id, type);
        }
        const {
          data,
          cursor: { next },
        } = await listRooms({
          ...this.popupSpaceParams,
          next: folder.next,
          [type]: id,
        });
        if (folder.courses) {
          data.forEach((room) => {
            if (!folder.courses.some((r) => r.id === room.id)) {
              folder.courses.push(room);
            }
          });
        } else {
          folder.courses = data;
        }
        folder.next = next;
        folder.isMore = next ? true : false;
        folder.loading = false;
        return data;
      }
    },
    async getRoomInfo(params) {
      const data = await retrieveRoom(params);
      return data;
    },

    async getRoomsByEntityId(params) {
      return await listRooms(params);
    },

    async retrieveRoom(params) {
      const data = await retrieveRoom(params);
      this.roomInfo = data;
      return data;
    },
    async retrieveLateralRoom(params) {
      const data = await retrieveRoom(params);
      this.lateralRoomInfo = data;
      return data;
    },
    async updateRoom(params) {
      const data = await updateRoom(params);
      return data;
    },
    async muteRoom(params) {
      const { success } = await muteRoom(params);
      if (success) {
        const room = this.roomsList.find((r) => r.id === params.roomId);
        room.preferences.mute = params.value;
        if (this.roomId === params.roomId) {
          this.roomInfo.preferences.mute = params.value;
        }
      }
    },
    async searchRooms(query, isNext = false) {
      this.searchRoomsParams.query = query;
      this.searchRoomListLoading = true;
      const {
        data,
        cursor: { next },
      } = await searchRooms(this.searchRoomsParams);
      if (isNext || this.searchRoomsParams.next) {
        this.searchRoomsList = this.searchRoomsList.concat(data);
      } else {
        this.searchRoomsList = data;
      }
      this.searchRoomsParams.next = next;
      this.isSearchRoomsMore = next ? true : false;
      this.searchRoomListLoading = false;
      return data;
    },
    async unreadRoom(params) {
      const data = await unreadRoom(params);
      return data;
    },
    async readRoom(params) {
      await readRoom(params);
      const room = this.getReactiveRoomById(params.roomId);
      if (room) {
        const num = room.unreadMessages;
        if (this.totalUnreadMessages >= num) {
          this.totalUnreadMessages -= num;
        } else {
          this.totalUnreadMessages = 0;
        }
        room.lastTagMessageId = null;
        room.unreadMessages = 0;

        if (room.type === 'course') {
          this.updateParentUnread(params.roomId, true);
        }
      }
    },
    async handleDeleteRoom(roomId) {
      if (this.roomId === roomId) {
        this.roomId = null;
        this.rightSiderType = null;
      }
      // if (this.chatId === roomId) {
      //   this.chatId = null;
      //   this.messages = [];
      //   this.chatBreadcrumbs.pop();
      // }
      if (this.lateralChatId === roomId) {
        this.lateralChatId = null;
        this.isChat = false;
      }
      const index = this.roomsList.findIndex((room) => room.id === roomId);
      if (index !== -1) {
        this.roomsList.splice(index, 1);
        if (this.chatId === roomId && this.roomsList[index]) {
          this.chatId = this.roomsList[index].id;
        } else if (this.chatId === roomId && this.roomsList[index - 1]) {
          this.chatId = this.roomsList[index - 1].id;
        } else if (this.chatId === roomId) {
          this.chatId = null;
          this.messages = [];
          this.chatBreadcrumbs = [];
        }
      }
      const roomIndex = this.roomsMessages.findIndex(
        (room) => room.id === roomId,
      );
      if (roomIndex !== -1) {
        this.roomsMessages.splice(roomIndex, 1);
      }
      this.getTotalUnreadMessages();
    },
    async deleteRoom(params) {
      const data = await deleteRoom(params);
      this.handleDeleteRoom(params.roomId);
      return data;
    },
    async getRoomMembers(params) {
      const data = await getRoomMembers(params);
      return data;
    },
    async searchRoomMembers({ query, roles, ...params }) {
      params.limit = params.limit || 50;
      if (query || roles) {
        return await searchRoomMembers({ ...params, query, roles });
      } else {
        return await getRoomMembers(params);
      }
    },
    async deleteRoomMembers(params) {
      const data = await deleteRoomMembers(params);
      return data;
    },
    async addRoomMembers(params) {
      const data = await addRoomMembers(params);
      return data;
    },
    async changeRoomMembersRole(params) {
      const data = await changeRoomMembersRole(params);
      return data;
    },

    async getRoomFiles(params) {
      const data = await getRoomFiles(params);
      return data;
    },
    async searchRoomFiles({ query, owner, types, date, ...params }) {
      if (query || owner || types || date) {
        return await searchRoomFiles({ ...params, query, owner, date, types });
      } else {
        return await getRoomFiles(params);
      }
    },
    async getRoomLinks(params) {
      const data = await getRoomLinks(params);
      return data;
    },
    async searchRoomLinks({ query, owner, ...params }) {
      if (query || owner) {
        return await searchRoomLinks({ ...params, query, owner });
      } else {
        return await getRoomLinks(params);
      }
    },
    async getRoomMedia(params) {
      const data = await getRoomMedia(params);
      return data;
    },
    async searchRoomMedia({ query, owner, types, date, ...params }) {
      if (query || owner || types || date) {
        return await searchRoomMedia({ ...params, query, date, owner, types });
      } else {
        return await getRoomMedia(params);
      }
    },
    async deleteRoomAttachment(params) {
      const data = await deleteRoomAttachment(this.roomId, params);
      return data;
    },

    async locateLastMessages(params) {
      const { next } = await this.getRoomMessages(params, false, true);
      if (next) {
        await this.getRoomMessages({ ...params, next }, false, true);
      }
    },

    async getRoomMessages(params, isPrev = false, isNext = false) {
      if (!params.limit) {
        params.limit = 20;
      }
      const {
        data,
        cursor: { prev, next },
      } = await getRoomMessagesV2(params);
      let messages = data || [];
      messages = messages.flatMap((item) => ({
        ...item.data,
        dataType: item.type,
      }));

      const room = this.roomsMessages.find((room) => room.id === params.roomId);
      if (room) {
        if (isPrev) {
          room.prev = prev;
        }
        if (isNext) {
          room.next = next;
        }
        if (room.messages.length === 0) {
          room.messages = messages;
        } else {
          const ids = room.messages.map((r) => r.id);
          if (isPrev) {
            messages.reverse().forEach((item) => {
              if (!ids.includes(item.id)) {
                room.messages.unshift(item);
              }
            });
          } else {
            messages.forEach((item) => {
              if (!ids.includes(item.id)) {
                room.messages.push(item);
              }
            });
          }
        }
        // if (this.chatId === params.roomId) {
        //   this.messages = [...room.messages];
        // }
        return room;
      } else {
        this.getOTORoomProfile(params.roomId);
        const index = messages.findLastIndex((msg) => msg.read);
        // const unReadIndex = messages.findIndex(
        //   (msg) => !msg.read && msg.dataType === 'message',
        // );
        const room = {
          id: params.roomId,
          messages,
          prev,
          next,
          firstUnreadMessageId: '',
          lastReadMessageId:
            index > -1
              ? messages[index].id
              : messages.length > 0
                ? messages[0].id
                : null,
          // lastReadMessageId: messages[messages.length - 1]?.id,
        };
        this.roomsMessages.push(room);
        return room;
      }
    },

    async getOTORoomProfile(roomId) {
      const room = this.roomsList.find((r) => r.id === roomId);
      if (
        room &&
        room.oneToOnePeer?.id &&
        !room.oneToOnePeer?.isFollowing &&
        !room.oneToOnePeer?.user
      ) {
        if (room.oneToOnePeer.type === 'organization') {
          const user = await retrieveOrganization({
            orgId: room.oneToOnePeer.id,
          });
          room.oneToOnePeer.user = user;
        } else {
          const user = await retrieveProfile({
            profileId: room.oneToOnePeer.id,
          });
          room.oneToOnePeer.user = user;
        }
      }
    },
    async searchRoomMessages(params) {
      return await searchRoomMessages(params);
    },
    async locateMessage({ messageId, ...params }) {
      const { messages, prev } = await this.getRoomMessages(params, true);
      if (prev && !messages.some((r) => r.id === messageId)) {
        return this.locateMessage({ messageId, ...params, prev });
      } else {
        return messages.some((r) => r.id === messageId);
      }
    },
    async getLinkData(params) {
      const data = await getLinkData(params);
      return data;
    },
    async createRoomMessage(params) {
      const data = await createRoomMessage(params);
      return data;
    },
    async deleteMessages(messageIds, roomId) {
      const room = this.getReactiveRoomById(roomId);
      const roomMsg = this.roomsMessages.find((r) => r.id === roomId);
      let unReadTotal = 0;
      if (roomMsg) {
        const deletedMessage = roomMsg.messages.filter((item) =>
          messageIds.includes(item.id),
        );
        roomMsg.messages = roomMsg.messages.filter(
          (item) => !messageIds.includes(item.id),
        );

        deletedMessage.forEach((msg) => {
          if (
            !msg.read &&
            (room?.type === 'course' ||
              room?.type === 'one-to-one' ||
              room?.type === 'group' ||
              (room?.type === 'folder' && !room.innerRooms))
          ) {
            unReadTotal++;
          }
        });
      } else {
        if (
          room &&
          (room.type === 'course' ||
            room.type === 'one-to-one' ||
            room.type === 'group' ||
            (room.type === 'folder' && !room.innerRooms))
        ) {
          unReadTotal = messageIds.length;
        }
      }
      if (room && unReadTotal) {
        const { unreadMessages } = room;
        room.unreadMessages =
          unreadMessages - unReadTotal > 0 ? unreadMessages - unReadTotal : 0;
      }
      if (unReadTotal) {
        if (
          room.type === 'course' ||
          (room.type === 'folder' && !room.innerRooms)
        ) {
          console.log('readRoomMessages', room.type, room.id);
          this.readRoomMessages(room.id);
        }
        this.declineTotalUnreadMessages(unReadTotal);
      }

      if (roomMsg) {
        const lastMessage = roomMsg?.messages.findLast(
          (r) => r.dataType === 'message',
        );
        if (lastMessage) {
          if (room?.lastMessage && room.lastMessage.id !== lastMessage?.id) {
            room.lastMessage = lastMessage;
            const {
              id,
              author: { fullname },
              content,
              sourceRoom,
              attachments,
            } = lastMessage;
            room.lastMessage = {
              id,
              author: {
                name: fullname,
                id: lastMessage.author.id,
              },
              preview: content,
              sourceRoom,
              attachment:
                attachments && attachments.length > 0 ? attachments[0] : null,
            };
          }
        } else {
          room.lastMessage = null;
        }
      } else {
        if (room && messageIds.includes(room.lastMessage?.id)) {
          const data = await retrieveRoom({ roomId });
          if (data) {
            room.lastMessage = data.lastMessage;
          }
        }
      }
    },

    declineTotalUnreadMessages(count) {
      this.totalUnreadMessages =
        this.totalUnreadMessages - count > 0
          ? this.totalUnreadMessages - count
          : 0;
    },

    async deleteRoomMessages(params) {
      try {
        const data = await deleteRoomMessages(params);
        const { messageIds, roomId, deleteForAll } = params;
        const pinnedRoom = this.pinnedMessages.find((r) => r.id === roomId);
        if (pinnedRoom && pinnedRoom.messages) {
          const deletedIds = pinnedRoom.messages.filter((msg) =>
            messageIds.includes(msg.id),
          );
          if (deletedIds && deletedIds.length > 0) {
            const ids = deletedIds.map((msg) => msg.id);
            if (deleteForAll) {
              this.deleteRoomPinnedMessage({
                roomId,
                messageIds: ids,
              });
            } else {
              pinnedRoom.messages = pinnedRoom.messages.filter(
                (msg) => !ids.includes(msg.id),
              );
              console.log(pinnedRoom.messages);
            }
          }
        }
        this.deleteMessages(messageIds, roomId);
        return data;
      } catch (e) {
        console.log(e);
      }
    },
    async addReationInMessage(params) {
      const data = await addReationInMessage(params);
      return data;
    },
    async deleteReationInMessage(params) {
      const data = await deleteReationInMessage(params);
      return data;
    },
    async getReationsInMessage(params) {
      const data = await getReationsInMessage(params);
      return data;
    },
    async addSavedMessages(params) {
      const data = await addSavedMessages(params);
      const room = this.roomsMessages.find((r) => r.id === params.roomId);
      if (room) {
        params.messageIds.forEach((messageId) => {
          const message = room.messages.find((r) => r.id === messageId);
          if (message) {
            message.saved = true;
          }
        });
      }
      return data;
    },
    async searchSavedMessages({ query, author, date, ...params }) {
      if (query || author || date) {
        return await searchSavedMessages({
          ...params,
          query,
          author,
          date,
        });
      } else {
        return await getSavedMessages(params);
      }
    },
    async deleteSavedMessages(params) {
      const data = await deleteSavedMessages(params);
      const room = this.roomsMessages.find((r) => r.id === params.roomId);
      if (room) {
        params.messageIds.forEach((messageId) => {
          const message = room.messages.find((r) => r.id === messageId);
          if (message) {
            message.saved = false;
          }
        });
      }
      return data;
    },
    async getRoomPinnedMessages(params) {
      if (params) {
        params.limit = 100;
      }
      const { data } = await getRoomPinnedMessages(params);
      const room = this.pinnedMessages.find((r) => r.id === params.roomId);
      if (!room && data) {
        this.pinnedMessages.push({
          id: params.roomId,
          messages: data.reverse(),
        });
      }
    },
    async addRoomPinnedMessages(params) {
      await addRoomPinnedMessages(params);
      // const room = this.roomsMessages.find((r) => r.id === params.roomId);
      // if (room) {
      //   params.messageIds.forEach((messageId) => {
      //     const message = room.messages.find((r) => r.id === messageId);
      //     if (message) {
      //       message.pinned = true;
      //       const pinnedRoom = this.pinnedMessages.find(
      //         (r) => r.id === params.roomId,
      //       );
      //       if (pinnedRoom.messages.find((r) => r.id === messageId)) return;
      //       pinnedRoom.messages.push(message);
      //     }
      //   });
      // }
    },
    async deleteRoomPinnedMessage(params) {
      await deleteRoomPinnedMessage(params);
      const room = this.roomsMessages.find((r) => r.id === params.roomId);
      if (room) {
        params.messageIds.forEach((messageId) => {
          const message = room.messages.find((r) => r.id === messageId);
          if (message) {
            message.pinned = false;
          }
          const pinnedRoom = this.pinnedMessages.find(
            (r) => r.id === params.roomId,
          );
          pinnedRoom.messages = pinnedRoom.messages.filter(
            (r) => r.id !== messageId,
          );
        });
      }
    },
    async pinRoom(params, roomType) {
      const { success } = await pinRoom(params);
      if (success) {
        if (['folder', 'course'].includes(roomType)) {
          const room = this.spaceList.find(
            (r) =>
              r.id === params.roomId ||
              (r.courses && r.courses.find((c) => c.id === params.roomId)),
          );
          if (params.roomId === room.id) {
            room.preferences.pin = params.value;
          } else {
            const course = room.courses.find((c) => c.id === params.roomId);
            course.preferences.pin = params.value;
          }
        } else {
          const room = this.roomsList.find((r) => r.id === params.roomId);
          room.preferences.pin = params.value;
        }
      }
    },
    async forwardMessages(params) {
      const data = await forwardMessages(params);
      return data;
    },
    async getMessageInfo(params) {
      return await getMessageInfo(params);
    },
    async getTotalUnreadMessages() {
      const notificationStore = useNotificationStore();
      const { totalUnreadMessages, totalUnreadNotifications } =
        await getUnreadMessages();
      this.totalUnreadMessages = totalUnreadMessages || 0;
      notificationStore.totalUnread = totalUnreadNotifications || 0;
    },
    async updateRoomMessage(params) {
      const data = await updateRoomMessage(params);
      const room = this.roomsMessages.find((r) => r.id === params.roomId);
      if (room) {
        const messageIndex = room.messages.findIndex(
          (r) => r.id === params.messageId,
        );
        room.messages[messageIndex] = data;
      }
      // if (params.roomId === this.chatId) {
      //   const messageIndex = this.messages.findIndex(
      //     (r) => r.id === params.messageId,
      //   );
      //   this.messages[messageIndex] = data;
      // }
      return data;
    },
    async clearMessages(roomId) {
      // if (this.chatId === roomId) {
      //   this.messages = [];
      // }
      const roomMsg = this.roomsMessages.find((item) => item.id === roomId);
      if (roomMsg) {
        roomMsg.messages = [];
      }

      const room = this.roomsList.find((item) => item.id === roomId);
      if (room) {
        room.lastMessage = null;
        room.lastActivity = null;
        room.unreadMessages = 0;
        room.lastTagMessageId = null;
        room.lastReadMessageId = null;
      }
      // this.readRoom({ roomId: roomId });
      // this.getTotalUnreadMessages();
    },
    async clearRoomHistory(params) {
      await clearRoomHistory(params);
      this.clearMessages(params.roomId);
    },

    async getFromDateMessages(params) {
      const data = await getFromDateMessages(params);
      return data;
    },
    async getSearchHistory(params) {
      return await getSearchHistory(params);
    },

    async createSearchHistory(id) {
      return await createSearchHistory(id);
    },

    async deleteSearchHistory(id) {
      return await deleteSearchHistory(id);
    },

    async clearSearchHistory() {
      return await clearSearchHistory();
    },

    async getRecentRooms(params) {
      return await getRecentRooms(params);
    },

    async search(params) {
      return await search(params);
    },

    async updatePreferences(params) {
      return await updatePreferences(params);
    },
    async listCommonRooms(params) {
      return await listCommonRooms(params);
    },
    async locateRoom(roomId, spaceId, folderId) {
      let room = this.getRoomById(roomId);
      if (folderId) {
        if (!this.showSpace) {
          this.spaceId = null;
          this.spaceInfo = null;
          this.spaceEntityId = null;
          await this.locateSpaceRoom(spaceId);
        }
        await this.locateFolderRoom(folderId, false);
        const room = this.getRoomById(roomId);
        if (room) {
          this.chatId = roomId;
          this.chatInfo = room;
        }
      } else if (spaceId) {
        this.spaceId = null;
        this.spaceInfo = null;
        this.spaceEntityId = null;
        await this.locateSpaceRoom(spaceId);
        const room = this.getRoomById(roomId);
        if (room) {
          this.chatId = roomId;
          this.chatInfo = room;
        }
      } else {
        this.showSpace = false;
        if (!room) {
          room = await retrieveRoom({ roomId });
          this.roomsList.push(room);
        }
      }
      this.chatId = roomId;
      this.chatInfo = room;
    },

    async locateSpaceRoom(spaceId) {
      let spaceRoom = this.getRoomById(spaceId);
      if (!spaceRoom) {
        spaceRoom = await retrieveRoom({ roomId: spaceId });
        this.roomsList.push(spaceRoom);
      }
      this.chatId = spaceRoom.id;
      this.chatInfo = spaceRoom;
      this.spaceId = spaceId;
      this.spaceEntityId = spaceRoom.entityId;
      this.spaceInfo = spaceRoom;
      this.showSpace = true;
      await this.getSpaceList(spaceRoom.entityId, 'space');
    },
    async locateFolderRoom(folderId, isShow = true) {
      let folderRoom = this.getReactiveRoomById(folderId);
      if (!folderRoom) {
        folderRoom = await retrieveRoom({ roomId: folderId });
        this.spaceList.push(folderRoom);
      }
      if (isShow) {
        this.chatId = folderRoom.id;
        this.chatInfo = folderRoom;
      } else {
        folderRoom.show = true;
      }
      await this.getSpaceList(folderRoom.entityId, 'folder');
    },
    async locatePopupRoom(roomId, spaceId, folderId) {
      let room = this.getRoomById(roomId);
      if (folderId) {
        if (!this.popupShowSpace) {
          this.popupSpaceId = null;
          this.popupSpaceInfo = null;
          this.popupSpaceEntityId = null;
          await this.locatePopupSpaceRoom(spaceId);
        }
        await this.locatePopupFolderRoom(folderId, false);
        const room = this.getRoomById(roomId);
        if (room) {
          this.popupChatId = roomId;
          this.popupChatInfo = room;
        }
      } else if (spaceId) {
        this.popupSpaceId = null;
        this.popupSpaceInfo = null;
        this.popupSpaceEntityId = null;
        await this.locatePopupSpaceRoom(spaceId);
        const room = this.getRoomById(roomId);
        if (room) {
          this.popupChatId = roomId;
          this.popupChatInfo = room;
        }
      } else {
        this.popupShowSpace = false;
        if (!room) {
          room = await retrieveRoom({ roomId });
          this.roomsList.push(room);
        }
      }
      this.popupChatId = roomId;
      this.popupChatInfo = room;
    },

    async locatePopupSpaceRoom(spaceId) {
      let spaceRoom = this.getRoomById(spaceId);
      if (!spaceRoom) {
        spaceRoom = await retrieveRoom({ roomId: spaceId });
        this.roomsList.push(spaceRoom);
      }
      this.popupChatId = spaceRoom.id;
      this.popupChatInfo = spaceRoom;
      this.popupSpaceId = spaceId;
      this.popupSpaceEntityId = spaceRoom.entityId;
      this.popupSpaceInfo = spaceRoom;
      // this.popupShowSpace = true;
      await this.getPopupSpaceList(spaceRoom.entityId, 'space');
    },
    async locatePopupFolderRoom(folderId) {
      let folderRoom = this.getReactiveRoomById(folderId);
      if (!folderRoom) {
        folderRoom = await retrieveRoom({ roomId: folderId });
        this.popupSpaceList.push(folderRoom);
      }
      // if (isShow) {
      //   this.popupChatId = folderRoom.id;
      //   this.popupChatInfo = folderRoom;
      // } else {
      //   folderRoom.show = true;
      // }
      await this.getPopupSpaceList(folderRoom.entityId, 'folder', false);
    },
    async getInviteLink(params) {
      return await getInviteLink(params);
    },
    async acceptInvite(params) {
      return await acceptInvite(params);
    },
    async viewMessage(params) {
      return await viewMessage(params);
    },
  },
});
