<template>
  <div
    class="group flex h-24 items-center gap-4 bg-[#0c0c0c] p-4 text-white/50"
    :class="
      isGroupRoom && canEdit
        ? 'cursor-pointer hover:bg-[#252525] hover:text-white'
        : ''
    "
    data-cy="OrganizationHubChatRightSideInfoHeader-edit-room"
    @click="onEdit"
  >
    <div
      class="flex"
      :class="[
        !isO2ORoom && !isFolderRoom ? 'rounded-5' : '',
        isGroupRoom ? 'group-hover:border-white' : '',
        !isO2ORoom && !isFolderRoom && !room?.image
          ? 'border-[0.0625rem] border-dashed border-white/50'
          : '',
      ]"
    >
      <BaseAvatarNext
        v-if="isO2ORoom"
        :picture="room?.image"
        :story="room.oneToOnePeer?.story"
        :online="room.oneToOnePeer?.isOnline"
        :user-id="room.oneToOnePeer?.id"
        size="lg"
      />
      <div
        v-else-if="isSpaceRoom"
        class="flex size-16 items-center justify-center"
      >
        <i
          v-if="isShopping && !room?.image"
          class="fa-solid fa-book-open-reader text-2xl"
        />
        <BaseAvatarGroup
          v-else-if="room?.image"
          :picture="room.image"
          class="!size-16"
        />
        <i
          v-else-if="room?.icon"
          class="fa-solid text-2xl"
          :class="{
            [room.icon]: true,
          }"
          :style="{ color: room.color }"
        />
        <i
          v-else
          class="fa-hexagon fa-solid text-2xl"
          :style="{ color: room.color }"
        />
      </div>
      <BaseIconFolder v-else-if="isFolderRoom" class="size-16" />
      <BaseAvatarGroup v-else :picture="room?.image" class="!size-16" />
    </div>
    <div v-if="isO2ORoom" class="flex flex-col truncate">
      <div
        class="cursor-pointer truncate text-[1.125rem] text-white underline-offset-2 hover:underline"
        @click="visitProfile(room.oneToOnePeer)"
      >
        {{ room.name }}
      </div>
      <div class="text-xs text-white/30">
        <span v-if="room?.oneToOnePeer?.isOnline" class="text-[#E4B53D]/80">
          {{ $t('base.member.online').toLowerCase() }}
        </span>
        <span v-else>{{ timeAgo3(room?.lastAccessAt) }}</span>
      </div>
    </div>
    <div v-else class="flex flex-col gap-1">
      <div class="truncate text-base text-white">
        {{ room?.name }}
      </div>
      <div
        class="line-clamp-2 text-xs text-white/30"
        v-html="room?.description"
      />
    </div>
  </div>
</template>
<script>
export default {
  setup() {
    const hubChatStore = useHubChatStore();
    const authStore = useAuthStore();
    const fluxesStore = useFluxesStore();
    const profileStore = useProfileStore();
    return { hubChatStore, authStore, fluxesStore, profileStore };
  },
  data() {
    return {
      uploadLoading: false,
      saveLoading: false,
      isEdit: false,
      editType: '',
      editValue: '',
    };
  },
  computed: {
    user() {
      return this.authStore.user;
    },
    room() {
      return this.hubChatStore.roomInfo;
    },
    isO2ORoom() {
      return this.room?.type === 'one-to-one';
    },
    isGroupRoom() {
      return this.room?.type === 'group';
    },
    isSpaceRoom() {
      return this.room?.type === 'space';
    },
    isFolderRoom() {
      return this.room?.type === 'folder';
    },
    isCourseRoom() {
      return this.room?.type === 'course';
    },
    isShopping() {
      return this.room?.entityId === this.user.shoppingSpace;
    },
    canEdit() {
      return (
        this.room?.userRole === 'chat-room-owner' ||
        this.room?.userRole === 'chat-room-admin'
      );
    },
  },
  methods: {
    onEdit() {
      if (!this.isGroupRoom || !this.canEdit) {
        return;
      }
      this.hubChatStore.rightSiderType = 'edit';
    },
    visitProfile(item) {
      this.profileStore.gotoProfilePage(item);
    },
  },
};
</script>
