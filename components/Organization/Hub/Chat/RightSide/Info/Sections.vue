<template>
  <div class="flex flex-col gap-2 bg-[#0c0c0c]">
    <div
      class="flex h-14 cursor-pointer items-center justify-between px-[1.375rem] pr-7 hover:bg-[#252525]"
      data-cy="9e999c06a616698f"
      @click="hubChatStore.rightSiderType = 'messages'"
    >
      <div class="flex gap-1">
        <div class="flex w-12 items-center justify-center">
          <i class="fa-solid fa-bookmark text-xl" />
        </div>
        {{ $t('org.activity.message.saved') }}
      </div>
      <div class="flex items-center">{{ room?.numberOf?.savedMessages }}</div>
    </div>
    <!-- <div
      class="px-[1.375rem h flex h-14 items-center justify-between px-[1.375rem] pr-7"
    >
      <div class="flex gap-1">
        <div class="flex w-12 items-center justify-center">
          <i class="fa-solid fa-bell text-xl" />
        </div>
        {{ $t('org.activity.chat.setting.notification') }}
      </div>
      <div class="flex items-center">
        <OrganizationHubChatSwitcher
          :active="!(room?.preferences?.mute || false)"
          @change="onMute"
        />
      </div>
    </div> -->
  </div>
  <div class="flex flex-col gap-2 bg-[#0c0c0c] p-4">
    <div
      class="flex h-14 cursor-pointer items-center justify-between rounded-5 p-[0.375rem] pr-[0.75rem] hover:bg-[#252525]"
      data-cy="7212782c9107e354"
      @click="hubChatStore.rightSiderType = 'media'"
    >
      <div class="flex gap-1">
        <div class="flex w-12 items-center justify-center">
          <i class="fa-solid fa-grid text-xl" />
        </div>
        {{ $t('org.media.photoVideo') }}
      </div>
      <div class="flex items-center">
        <div
          v-for="item in mediaPreviewList"
          :key="item.id"
          class="-ml-2 h-10 w-10 rounded-md border-2 border-[#0c0c0c] transition-all"
        >
          <img
            v-if="item.mimetype.includes('image')"
            :src="item.url"
            class="h-full w-full rounded-md object-cover"
            alt=""
          />
          <video
            v-else
            :src="item.url"
            class="h-full w-full rounded-md object-cover"
          />
        </div>
        <BaseSkeleton
          v-if="mediaLoading && mediaCount"
          height="2.5rem"
          :length="1"
          class="-ml-2 h-10 w-32 rounded-md"
        />
        <div
          class="-ml-2 flex h-10 w-10 items-center justify-center rounded-md border-[0.0313rem] border-dashed border-[#505050] bg-[#000]/20 backdrop-blur-sm transition-all"
        >
          {{ mediaCount }}
        </div>
      </div>
    </div>
    <div
      class="flex h-14 cursor-pointer items-center justify-between rounded-5 p-[0.375rem] pr-[0.75rem] hover:bg-[#252525]"
      data-cy="af4cf127fc12fb10"
      @click="hubChatStore.rightSiderType = 'file'"
    >
      <div class="flex gap-1">
        <div class="flex w-12 items-center justify-center">
          <i class="fa-solid fa-file text-xl" />
        </div>
        {{ $t('org.media.files') }}
      </div>
      <div class="flex items-center">{{ room?.numberOf?.media.files }}</div>
    </div>
    <div
      class="flex h-14 cursor-pointer items-center justify-between rounded-5 p-[0.375rem] pr-[0.75rem] hover:bg-[#252525]"
      data-cy="b882b780eedfad4f"
      @click="hubChatStore.rightSiderType = 'link'"
    >
      <div class="flex gap-1">
        <div class="flex w-12 items-center justify-center">
          <i class="fa-solid fa-link text-xl" />
        </div>
        {{ $t('org.media.shared.links') }}
      </div>
      <div class="flex items-center">{{ room?.numberOf?.media.links }}</div>
    </div>
  </div>
</template>
<script>
export default {
  setup() {
    const hubChatStore = useHubChatStore();
    const hubSpacesStore = useHubSpacesStore();
    return { hubChatStore, hubSpacesStore };
  },
  data() {
    return {
      mediaTotalItems: null,
      mediaLoading: false,
      mediaPreviewList: [],
    };
  },
  computed: {
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
      return ['space', 'course', 'folder'].includes(this.room?.type);
    },
    mediaCount() {
      return this.mediaTotalItems === null
        ? this.room?.numberOf?.media?.media
        : this.mediaTotalItems;
    },
  },

  watch: {
    'room.id'(val) {
      if (val) {
        this.onInit();
      }
    },
  },
  mounted() {
    if (this.room?.id) {
      this.onInit();
    }
  },
  methods: {
    async onInit() {
      this.mediaLoading = true;
      const {
        data,
        cursor: { totalItems },
      } = await this.hubChatStore.getRoomMedia({
        roomId: this.room.id,
        limit: 4,
      });
      this.mediaPreviewList = data;
      this.mediaTotalItems = totalItems;
      this.mediaLoading = false;
    },
    // async onMute() {
    //   await this.hubChatStore.muteRoom({
    //     roomId: this.room.id,
    //     value: !this.room.preferences?.mute,
    //   });
    // },
  },
};
</script>
