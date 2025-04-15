<template>
  <client-only>
    <div class="overflow-hidden rounded-5 bg-[#060606] bg-opacity-60">
      <div class="flex items-center justify-between gap-2 px-4 py-4">
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-3 text-xl text-[#B0B0B0]">
            <i class="fa-light fa-share-nodes" />
            <span>{{ $t('course.share') }}</span>
          </div>
        </div>

        <BaseIconClose
          class="!size-6 !text-[#fafafa] hover:!bg-transparent"
          data-cy="c322e7c4f7bbc78d"
          @click="onClose"
        />
      </div>

      <div class="relative p-4">
        <BaseInput
          v-model="name"
          search
          fixed
          clear
          :placeholder="$t('flux.search.chat')"
          class="!w-full"
        />
        <div class="mt-2">
          <SocialShareSelected
            :selected-items="checkedItems"
            :max-size="3"
            @remove="handleCheck"
          />
        </div>

        <div
          class="hide-scrollbar relative overflow-y-auto"
          :class="showEditor ? 'h-[21rem]' : 'h-[36.5rem]'"
        >
          <div class="mt-2 rounded-5 bg-gray-200/5">
            <div
              v-for="action in defaultActions"
              :key="action.type"
              class="translation-all flex cursor-pointer items-center gap-2 p-[0.375rem] text-[#F1F1F1] duration-300 hover:bg-white/5"
              data-cy="0f2bf817595f6be0"
              @click="action.action"
            >
              <div
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10"
              >
                <i :class="action.icon" />
              </div>
              <div class="text-base">{{ $t(action.label) }}</div>
            </div>
          </div>

          <!-- suggested -->

          <p class="my-2 px-3 py-2 text-base text-[#FAFAFA]">
            {{ $t('flux.suggested') }}
          </p>

          <div class="mt-2 rounded-5 bg-gray-200/5">
            <div
              v-show="!showSpace"
              v-infinite-scroll="load"
              :infinite-scroll-disabled="loading || !next"
              class="flex-1"
            >
              <div
                v-for="profile in profiles"
                :key="profile.id"
                class=":last:mb-0 translation-all mb-2 flex cursor-pointer items-center gap-2 p-[0.375rem] duration-300 hover:bg-white/5"
                data-cy="878ca94fdb07559f"
              >
                <SocialShareItems
                  :item="profile"
                  :checked-items="checkedItems"
                  :name="name"
                  @on-space="onSpace"
                  @on-click="handleCheck"
                />
              </div>
              <BaseSkeletonUserList v-show="loading" class="w-full" />
            </div>
            <div v-if="showSpace">
              <div class="flex h-full items-center gap-2 px-4 py-2">
                <div
                  class="mr-1 flex size-8 cursor-pointer items-center justify-center rounded-5 hover:bg-white/10"
                  @click="showSpace = false"
                >
                  <i class="fa-regular fa-arrow-left text-white/60" />
                </div>

                <div class="flex items-center gap-2 text-base">
                  <SocialShareIcon
                    :item="spaceRoom"
                    :is-shopping="isShopping(spaceRoom)"
                    :is-select="true"
                    size="md"
                  />
                  <p>
                    {{ spaceRoom?.name }}
                  </p>
                </div>
              </div>

              <div
                class="hide-scrollbar relative w-full overflow-y-auto bg-[#0A0A0A] px-4"
                :class="showEditor ? 'h-[10rem]' : 'h-[19rem]'"
              >
                <div
                  v-for="roomSub in spaceList"
                  :key="roomSub.id"
                  class="mb-2"
                >
                  <SocialShareItems
                    :item="roomSub"
                    :checked-items="checkedItems"
                    :name="name"
                    class="my-2 flex cursor-pointer items-center gap-2 rounded-5 p-[0.375rem] hover:bg-white/5"
                    :show-folder="isOpenFolder(roomSub)"
                    @on-space="onSpace"
                    @on-click="handleCheck"
                  />

                  <transition name="fade">
                    <div
                      v-show="roomSub.type === 'folder' && roomSub.open"
                      class="pl-8"
                    >
                      <div v-for="course in roomSub.courses" :key="course.id">
                        <SocialShareItems
                          :item="course"
                          :checked-items="checkedItems"
                          :name="name"
                          :show-folder="isOpenFolder(roomSub)"
                          class="my-2 cursor-pointer items-center gap-2 rounded-5 p-[0.375rem] hover:bg-white/5"
                          @on-space="onSpace"
                          @on-click="handleCheck"
                        />
                      </div>
                    </div>
                  </transition>
                </div>

                <div v-if="spaceLoading" class="flex flex-col gap-1 px-2 py-1">
                  <BaseSkeleton
                    v-for="i in 6"
                    :key="i"
                    class="rounded-5"
                    height="3rem"
                    :length="1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-show="showEditor"
          ref="inlineEditor"
          class="fixed bottom-0 left-0 right-0 z-[1] bg-[#060606] py-2"
        >
          <div class="relative w-full p-2">
            <LazyBaseEditor
              ref="editor"
              v-model="message"
              type="area"
              area-height="6.25rem"
              :options="{
                placeholder: $t('flux.message.write'),
              }"
              :auto-clear="false"
              :get-tag-list="getTagList"
              :is-action="false"
              :is-share="true"
              :uniform-bg="true"
              :show-gif="true"
              :auto-send-gif="true"
              @send-gif="socialStore.setGif"
              @change="onChange"
              @send="onSend"
            />
          </div>
        </div>
      </div>
    </div>
  </client-only>
</template>
<script>
export default {
  props: {
    open: Boolean,
    item: Object,
  },
  setup() {
    const globalStore = useGlobalStore();
    const socialStore = useSocialStore();
    const authStore = useAuthStore();
    const hubChatStore = useHubChatStore();
    const fluxesStore = useFluxesStore();
    const profileStore = useProfileStore();

    const showEditor = ref(false);
    const inlineEditor = ref(null);

    return {
      authStore,
      socialStore,
      globalStore,
      hubChatStore,
      showEditor,
      inlineEditor,
      fluxesStore,
      profileStore,
    };
  },
  data() {
    return {
      name: '',
      message: '',
      checkedItems: [],
      loading: false,
      profiles: [],
      next: null,
      timer: null,
      showSpace: false,
      spaceRoom: null,
      spaceList: [],
      spaceLoading: false,
      spaceNext: null,
      selectedFolder: [],
    };
  },

  computed: {
    user() {
      return this.authStore.context;
    },
    defaultActions() {
      return [
        {
          type: 'copy',
          label: 'index.copy.title',
          icon: 'fa-light fa-link',
          action: this.handleCopyLink,
        },
        {
          type: 'repost',
          label: 'flux.post.redo',
          icon: 'fa-light fa-arrows-retweet',
          action: this.handleRepost,
        },
      ];
    },
    roomsList() {
      const pinList = this.hubChatStore.roomsList
        .filter((r) => r.preferences?.pin === true)
        .sort(
          (a, b) =>
            new Date(b.lastMessageCreatedAt) - new Date(a.lastMessageCreatedAt),
        );
      const unPinList = this.hubChatStore.roomsList
        .filter((r) => r.preferences?.pin === false)
        .sort(
          (a, b) =>
            new Date(b.lastMessageCreatedAt) - new Date(a.lastMessageCreatedAt),
        );
      return [...pinList, ...unPinList];
    },
    current_user() {
      return this.profileStore.myProfileDetail;
    },
  },
  watch: {
    name() {
      this.loading = true;
      this.profiles = [];
      this.next = null;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.load();
      }, 300);
    },

    'fluxesStore.isShareContentVisible': {
      handler() {
        if (
          this.profiles.length === 0 &&
          this.fluxesStore.isShareContentVisible
        ) {
          this.load();
        }
      },
      immediate: true,
    },
  },

  methods: {
    isOpenFolder(room) {
      return room.type === 'folder' && this.selectedFolder.includes(room.id);
    },
    isShopping(item) {
      return item.entityId === this.current_user.shoppingSpace;
    },
    handleCopyLink() {
      const fullPath = this.$route.fullPath;
      const link = `${window.location.origin}${fullPath}`;
      this.$copyText(link).then(() => {
        this.$toast.success(this.$t('flux.copy.success'));
      });
    },
    handleRepost() {
      // TODO : Repost story
    },
    handleCheck(item) {
      const isChecked = this.checkedItems.some((user) => user.id === item.id);
      if (isChecked) {
        this.checkedItems = this.checkedItems.filter(
          (list) => list.id !== item.id,
        );
      } else {
        if (!item.fullName) {
          item = {
            ...item,
            fullName: item.name,
          };
        }
        this.checkedItems.push(item);
      }
      this.showEditor = this.checkedItems.length > 0;
    },
    async getTagList(searchTerm) {
      const { data } = await this.globalStore.searchProfile({
        limit: 50,
        text: searchTerm || undefined,
      });
      return data;
    },
    onChange() {},
    async onSpace(room) {
      if (room.type === 'space') {
        this.showSpace = true;
        this.spaceRoom = room;
        this.spaceList = [];
        this.getSpaceRoom(room);
      } else if (room.type === 'folder') {
        // Find the folder in spaceList or main roomList
        const folder = this.findFolderInList(room);
        if (folder?.open) {
          folder.open = false;
          this.selectedFolder = this.selectedFolder.filter(
            (id) => id !== folder.id,
          );
        } else if (folder) {
          this.getFolderRoom(folder);
          this.selectedFolder.push(folder.id);
        }
      }
    },
    findFolderInList(room) {
      // If we have showSpace = true, we are currently showing spaceList
      if (this.showSpace) {
        return this.spaceList.find((r) => r.id === room.id);
      } else {
        return this.roomsList.find((r) => r.id === room.id);
      }
    },

    async getSpaceRoom(room) {
      this.spaceLoading = true;
      const { data } = await this.hubChatStore.getRoomsByEntityId({
        space: room.entityId,
        limit: 100,
      });
      // Initialize folder properties
      data.forEach((r) => {
        if (r.type === 'folder') {
          r.open = false;
          r.loading = false;
          r.courses = [];
        }
      });
      this.spaceList = [...data];
      this.spaceLoading = false;
    },

    async getFolderRoom(folder) {
      folder.loading = true;
      const { data } = await this.hubChatStore.getRoomsByEntityId({
        folder: folder.entityId,
        limit: 100,
      });
      folder.open = true;
      folder.courses = data;
      folder.loading = false;
    },
    async onSend(_content, _files, _taggedUsers, _text, _loomFiles) {
      const profiles = [];
      const rooms = [];

      this.checkedItems.forEach((item) => {
        if (item.isProfile) {
          profiles.push(item);
        } else {
          rooms.push(item.id);
        }
      });

      try {
        this.sendLoading = true;
        await this.hubChatStore.shareStory(
          this.item.id,
          _content,
          _text,
          rooms,
          profiles,
          _files,
        );
      } catch (error) {
        console.log(error);
      }

      this.$refs.editor.clear();
      this.$toast.success('Shared successfully');
      this.$emit('shared', this.checkedItems.length);
      this.onClose();
      this.checkedItems = [];
    },

    async load() {
      try {
        this.loading = true;

        const isSearchingByName = this.name.length > 0;

        if (isSearchingByName) {
          await this.handleNameSearch();
        } else {
          if (this.profiles.length === 0) {
            await this.loadDefaultRooms();
          }
          await this.loadProfiles();
        }
      } finally {
        this.loading = false;
      }
    },

    async handleNameSearch() {
      this.profiles = [];
      await this.hubChatStore.searchRooms(this.name);
      const searchList = this.transformProfiles(
        this.hubChatStore.searchRoomsList,
      );

      if (searchList.length) {
        this.profiles = [...searchList];
        return;
      }
      const { organizations, profiles } =
        await this.socialStore.searchProfilesAndOrganizations({
          limit: 3,
          text: this.name,
        });
      organizations.forEach((organization) => {
        organization.type = 'one-to-one';
        organization.image = organization?.picture;
        organization.isProfile = true;
      });
      profiles.forEach((profile) => {
        profile.type = 'one-to-one';
        profile.image = profile?.picture;
        profile.isProfile = true;
      });
      this.profiles = [...organizations, ...profiles];
    },

    async loadDefaultRooms() {
      await this.hubChatStore.getListRooms();
      const roomList = this.transformProfiles(this.roomsList);
      this.profiles = [...roomList];
    },

    async loadProfiles() {
      const {
        data,
        cursor: { next, totalItems },
      } = await this.globalStore.searchProfile({
        next: this.next,
        limit: 10,
        text: this.name,
      });

      data.forEach((profile) => {
        profile.type = 'one-to-one';
        profile.isProfile = true;
        profile.oneToOnePeer = {
          id: profile.id,
        };
      });

      this.profiles = [...this.profiles, ...data];
      this.next = next;
      this.totalItems = totalItems;
    },

    transformProfiles(list) {
      return cloneDeep(list).map((profile) => ({
        ...profile,
        picture: profile.image,
        isProfile: false,
      }));
    },

    onChecked(id) {
      const index = this.checkedItems.indexOf(id);
      if (index === -1) {
        this.checkedItems.push(id);
      } else {
        this.checkedItems.splice(index, 1);
      }
    },
    onClose() {
      this.$emit('close');
      this.name = '';
      this.profiles = [];
      this.checkedItems = [];
      this.socialStore.gif = '';
      this.showEditor = false;
    },
  },
};
</script>
<style scoped>
.hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
