<template>
  <div class="flex h-0 flex-1 flex-col px-2 text-sm">
    <div class="flex h-0 flex-1 flex-col gap-2 py-2">
      <OrganizationHubChatInput v-model="name" class="mx-3 pl-2" />
      <div
        class="mx-1 mt-2 flex h-[3.75rem] cursor-pointer items-center justify-between rounded-5 bg-[#0c0c0c] px-1 hover:bg-[#1A1A1A]"
        data-cy="OrganizationHubChatRightSideCreate-create-group"
        @click="createRoom('group')"
      >
        <div class="flex items-center gap-2">
          <div class="flex size-14 items-center justify-center">
            <div
              class="flex size-12 items-center justify-center rounded-full bg-[#252525]"
            >
              <i class="fa-light fa-users text-base" />
            </div>
          </div>
          {{ $t('org.activity.group.room.new') }}
        </div>
        <i class="fa-solid fa-angle-right mr-2" />
      </div>
      <div class="flex h-9 items-center px-[0.75rem] py-[0.375rem]">
        {{ $t('org.activity.group.suggested') }}
      </div>
      <div class="relative h-0 flex-1 pt-1">
        <div
          v-infinite-scroll="load"
          :infinite-scroll-disabled="listLoading || !isMore"
          class="hide-scrollbar mx-1 flex h-full flex-col gap-1 overflow-y-auto bg-[#0c0c0c] transition-all"
        >
          <OrganizationHubChatRightSideCreateMember
            v-for="item in profiles"
            :key="item.id"
            :item="item"
            :title="name"
            @create="createRoom('one-to-one', $event)"
          />
          <div v-if="listLoading" class="flex flex-col gap-2">
            <div v-for="n in 6" :key="n" class="flex items-center gap-0.5">
              <div class="flex w-[3.875rem] items-center justify-center">
                <BaseSkeleton
                  :length="1"
                  height="3rem"
                  class="w-12 [&_div]:rounded-full"
                />
              </div>
              <BaseSkeleton :length="1" height="2rem" class="flex-1" />
            </div>
          </div>
        </div>
        <div
          v-if="isMore && !listLoading"
          class="pointer-events-none absolute bottom-0 left-0 z-10 h-12 w-full bg-gradient-to-b from-[rgba(2,2,2,0)] to-[#020202]"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hubChatStore = useHubChatStore();
    const authStore = useAuthStore();
    const globalStore = useGlobalStore();
    const fluxesStore = useFluxesStore();
    return { hubChatStore, authStore, globalStore, fluxesStore };
  },
  data() {
    return {
      name: '',
      listLoading: false,
      list: [],
      next: null,
      nextType: 'followers',
      isMore: false,
      chatNewRoomSearchList: [],
      chatNewRoomList: [],
      timer: null,
    };
  },
  computed: {
    profiles() {
      if (this.name) {
        return this.chatNewRoomSearchList;
      } else {
        return this.chatNewRoomList;
      }
    },
  },
  watch: {
    name(val) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        if (val) {
          this.search();
        } else {
          this.next = null;
        }
      }, 500);
    },
  },
  mounted() {
    this.load();
  },
  unmounted() {
    this.unLoad();
  },
  methods: {
    async load() {
      if (this.name) {
        return;
      }
      this.listLoading = true;
      if (this.nextType === 'followers') {
        const {
          data,
          cursor: { next },
        } = await this.hubChatStore.getFollowers({
          followerId: this.authStore.context,
          next: this.next,
        });
        this.chatNewRoomList = [...this.chatNewRoomList, ...data];
        this.next = next;
        if (this.next) {
          this.isMore = true;
          this.nextType = 'followers';
        } else {
          const {
            data,
            cursor: { next },
          } = await this.hubChatStore.getSuggestions({
            text: '',
            // followSuggestion: true,
          });
          this.chatNewRoomList = [...this.chatNewRoomList, ...data];
          this.chatNewRoomList = uniqBy(this.chatNewRoomList, 'id');
          this.next = next;
          if (next) {
            this.nextType = 'suggestions';
            this.isMore = true;
          } else {
            this.isMore = false;
          }
        }
      } else {
        const {
          data,
          cursor: { next },
        } = await this.hubChatStore.getSuggestions({
          next: this.next,
          text: '',
          // followSuggestion: true,
        });
        this.chatNewRoomList = [...this.chatNewRoomList, ...data];
        if (next) {
          this.next = next;
          this.nextType = 'suggestions';
          this.isMore = true;
        } else {
          this.isMore = false;
        }
      }
      this.listLoading = false;
    },
    async search() {
      this.listLoading = true;
      this.chatNewRoomSearchList = [];
      const { organizations, profiles } = await this.hubChatStore.searchProfile(
        {
          text: this.name.trim(),
          limit: 100,
        },
      );
      const query = this.name.trim().toLowerCase();
      this.chatNewRoomSearchList = [...profiles, ...organizations];
      this.chatNewRoomSearchList = [
        ...this.chatNewRoomSearchList
          .filter(
            (m) =>
              m.fullName?.toLowerCase().includes(query) ||
              m.name?.toLowerCase().includes(query),
          )
          .sort((a, b) => {
            const aMatches = a.fullName
              ? a.fullName.toLowerCase().indexOf(query)
              : a.name?.toLowerCase().indexOf(query);
            const bMatches = b.fullName
              ? b.fullName.toLowerCase().indexOf(query)
              : b.name?.toLowerCase().indexOf(query);
            if (aMatches < bMatches) {
              return -1;
            }
            if (aMatches > bMatches) {
              return 1;
            }
            return 0;
          }),
        ...this.chatNewRoomSearchList.filter((m) =>
          m.email?.toLowerCase().includes(query),
        ),
      ];
      this.chatNewRoomSearchList = uniqBy(this.chatNewRoomSearchList, 'id');
      this.listLoading = false;
    },
    async createRoom(type, user) {
      try {
        this.hubChatStore.roomInfo = {};
        this.hubChatStore.rightSiderType = 'info';
        this.hubChatStore.infoLoading = true;
        await this.hubChatStore.createRoom(
          {
            name: !user ? this.$t('org.activity.room.new') : null,
            type,
            members: user
              ? [
                  {
                    id: user.id,
                    role: 'chat-room-admin',
                    type: user.entityType,
                  },
                ]
              : [],
          },
          true,
        );
        this.hubChatStore.infoLoading = false;
      } catch (e) {
        console.log(e);
        this.hubChatStore.rightSiderType = 'create';
        this.hubChatStore.infoLoading = false;
      }
    },
    async unLoad() {
      this.chatNewRoomList = [];
      this.chatNewRoomSearchList = [];
    },
  },
};
</script>
