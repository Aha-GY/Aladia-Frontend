<template>
  <div class="px-2 transition-all duration-500 md:px-0">
    <div
      class="relative w-full overflow-hidden rounded-md pb-[32%] md:pb-[18.75%]"
    >
      <div class="absolute left-0 top-0 h-full w-full">
        <img
          v-if="detail.cover"
          :src="detail.cover"
          class="pointer-events-none h-full w-full object-cover"
          alt=""
        />
        <div
          v-else
          class="flex h-full w-full items-center justify-center bg-[#060606]"
        >
          <div class="rounded-md bg-[#1C1C1C] px-7 py-3">
            <i class="fa-solid fa-panorama text-[2.5rem] text-[#505050]" />
          </div>
        </div>
      </div>
    </div>
    <div
      class="ml-auto mr-auto flex max-w-[75rem] flex-col items-start md:flex-row"
    >
      <div
        class="relative -mt-14 cursor-pointer rounded-full border-4 border-[#101010] bg-[#101010] transition-all md:-mt-16"
      >
        <BaseAvatarNext
          :picture="detail.picture"
          :story="detail?.story"
          :user-id="detail?.id"
          size="xl"
          :online="detail.online"
          source="feed"
          :show-online="isMe === false"
          :show-story="detail?.story?.status !== 'no-story'"
          :default-icon="
            detail.entityType === 'organization'
              ? 'fa-solid fa-building'
              : 'fa-solid fa-user'
          "
          :show-work="detail.status && detail.entityType !== 'organization'"
          :work="detail.status"
        >
          <template v-if="isMe" #button>
            <div
              class="flex size-full cursor-pointer items-center justify-center rounded-full bg-[#E0B92C] text-[#101010] transition-all duration-300 hover:text-[#101010]/50"
              data-cy="edit-profile-avatar-image-button"
              @click.stop="handleClickEdit"
            >
              <i class="fa-regular fa-pen-to-square text-base" />
            </div>
          </template>
        </BaseAvatarNext>
      </div>
      <div class="flex-1 flex-col gap-2 md:ml-6">
        <ProfileDetailHeaderName :detail="detail" />
        <ProfileDetailHeaderContent :detail="detail" />
        <ProfileDetailHeaderFollower :detail="detail" />
        <ProfileDetailHeaderWebsite
          v-if="detail.entityType === 'organization'"
          :detail="detail"
        />
      </div>
    </div>
  </div>
  <BaseDrawer v-if="isMobile" v-model="showMobileProfileSetting">
    <ProfileSettingDrawer />
  </BaseDrawer>
</template>

<script setup>
import WebSocketService from '~/utils/websocket';

const props = defineProps({
  detail: {
    type: Object,
    required: true,
  },
});
const websocket = WebSocketService.getInstance();
const profileStore = useProfileStore();
const { isMobile } = useDevice();
const showMobileProfileSetting = ref(false);
const online = ref(false);
const route = useRoute();

const isMe = computed(
  () => route.params.name === profileStore.myProfileDetail.id,
);

onMounted(() => {
  websocket.on('broadcast', handleUserConnectStatus);
  nextTick(() => {
    online.value = props.detail.online;
  });
});

onUnmounted(() => {
  websocket.off('broadcast', handleUserConnectStatus);
});

const handleUserConnectStatus = (data) => {
  if (!data || !data.data) {
    return;
  }
  if (props.detail.id === data.data?.userId) {
    online.value = data.data?.online;
  }
};

const handleClickEdit = () => {
  if (isMobile) {
    showMobileProfileSetting.value = true;
  } else {
    profileStore.openDialog();
    nextTick(() => {
      profileStore.updateActiveMenu(
        profileStore.orgMenuConst.AccountMenu[0].id,
      );
    });
  }
};
</script>
