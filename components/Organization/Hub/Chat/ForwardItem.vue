<template>
  <div
    ref="forward"
    class="group/item rounded-xs relative flex w-full cursor-pointer items-center gap-2 rounded-md p-1 transition-all hover:bg-white/5"
    :class="
      room.type === 'folder' && room.open
        ? 'rounded-b-none bg-[#212121] hover:!bg-[#2c2c2c]'
        : ''
    "
    data-cy="1fc4b2508468242e"
    @click="$emit('select-room', room)"
  >
    <div class="relative">
      <OrganizationHubChatLeftSideMemberAvatar
        :item="room"
        :show-online="false"
        :show-folder="folderOpen"
      />
      <BaseCheckboxStyle
        :state="
          selectedRooms?.some((r) => r.id === room.id)
            ? 'correctChecked'
            : 'unchecked'
        "
        class="absolute bottom-1 right-0.5"
      />
    </div>
    <div class="flex flex-1 items-center justify-between truncate">
      <div
        class="flex flex-1 flex-col truncate text-white/60 transition-all group-hover/item:text-white/70"
      >
        <div class="truncate" v-html="roomName" />
        <div class="text-xs text-white/30">
          {{ timeAgo(room.lastAccessAt) }}
        </div>
      </div>
      <div
        v-if="['space', 'folder'].includes(room.type) && !folderLoading"
        class="mr-1 flex size-8 flex-shrink-0 items-center justify-center rounded-5 hover:bg-white/10"
        @click.stop="() => onSpace(room)"
      >
        <i
          v-if="!folderOpen"
          class="fa-regular fa-chevron-right text-white/60"
        />
        <i v-else class="fa-regular fa-chevron-up text-white/60" />
      </div>
      <div
        v-if="folderLoading"
        class="mr-1 flex size-8 flex-shrink-0 items-center justify-center rounded-5 hover:bg-white/10"
      >
        <i class="fa-light fa-loader animate-spin text-base" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    room: Object,
    spaceRoom: Object,
    folderRoom: Object,
    onSpace: Function,
    folderLoading: Boolean,
    folderOpen: Boolean,
    selectedRooms: Array,
    query: String,
  },
  emits: ['select-room'],
  setup() {
    const forward = ref();
    const hubChatStore = useHubChatStore();
    return { hubChatStore, forward };
  },
  data() {
    return {
      loaded: false,
      loading: false,
      showSpace: false,
      spaceRooms: [],
      timer: null,
    };
  },
  computed: {
    isShowSubRooms() {
      return (
        this.spaceRooms.length > 0 &&
        (this.room.type === 'space' || this.room.type === 'folder')
      );
    },
    roomName() {
      if (this.query) {
        return highlightKeywords(this.room.name || '', [this.query]);
      } else {
        return this.room.name;
      }
    },
  },
  methods: {
    async load(room) {
      this.timer = setTimeout(async () => {
        await this.loadRooms(room);
      }, 500);
    },
    async clear() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
    },
    async loadRooms(room) {
      if (
        ['space', 'folder'].includes(room.type) &&
        !this.loading &&
        !this.loaded
      ) {
        this.loading = true;
        this.loaded = true;
        const { data } = await this.hubChatStore.getRoomsByEntityId({
          [room.type]: room.entityId,
          limit: this.limit,
        });
        this.spaceRooms = [...data];
        if (room.type === 'space') {
          this.showSpace = true;
        }
        this.loading = false;
      }
    },
  },
};
</script>
