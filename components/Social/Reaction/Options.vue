<template>
  <el-popover
    v-if="!isMe"
    v-model:visible="popoverVisible"
    trigger="click"
    :show-arrow="false"
    placement="bottom-end"
    :popper-style="popoverStyle"
    :inert="!popoverVisible"
  >
    <template #reference>
      <div @click="onOptionOpen">
        <div
          class="flex size-6 items-center justify-center rounded-5 p-[3px] hover:bg-white/5"
        >
          <i class="fa-light fa-ellipsis z-10 text-white" />
        </div>
      </div>
    </template>
    <div class="bg-[#060606] p-[0.375rem]">
      <ul class="leading-5">
        <BaseMenuItem
          v-if="!isMe"
          :icon-class="
            isFollowing ? 'fa-regular fa-user-minus' : 'fa-regular fa-user-plus'
          "
          data-cy="20ffe610a90a4a9a"
          @click="handleFollow"
        >
          {{ isFollowing ? 'Unfollow' : 'Follow' }}
        </BaseMenuItem>

        <BaseMenuItem
          v-if="isOwner"
          :icon-class="!isHidden ? 'fas fa-eye-slash' : 'fas fa-eye'"
          data-cy="d9f8d3bef238f424"
          @click="handleHide"
        >
          {{ isHidden ? unhideText : hideText }}
        </BaseMenuItem>

        <BaseMenuItem
          icon-class="fa-regular fa-message"
          data-cy="d9f8d3bef238f425"
          @click="handleChat"
        >
          Send a Message
        </BaseMenuItem>
      </ul>
    </div>
  </el-popover>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  user: Object,
  item: Object,
  source: String,
  ownerIdKey: {
    type: String,
    default: '',
  },
  isOwnerVisible: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['optionOpen', 'hide', 'chat', 'follow']);
const profileStore = useProfileStore();
const fluxesStore = useFluxesStore();
const popoverVisible = ref(false);
const isOwner = computed(
  () => profileStore.myProfileDetail.id === props.item?.owner?.id,
);
const isMe = computed(
  () => profileStore.myProfileDetail.id === props.user.viewer?.id,
);
const isHidden = computed(() => props.user?.isHidden);
const isFollowing = computed(() => props.user?.isFollowing);
const unhideText = computed(() =>
  props.source === 'reel' ? 'Unhide your Reel' : 'Unhide your Story',
);

const hideText = computed(() =>
  props.source === 'reel' ? 'Hide your Reel' : 'Hide your Story',
);

const popoverStyle = {
  border: 'none',
  background: 'transparent',
  boxShadow: 'none',
  padding: '0',
  borderRadius: '0.375rem',
  minWidth: '6.25rem',
  width: 'auto',
  zIndex: 10000,
};

const onOptionOpen = () => emit('optionOpen');

const handleChat = async () => {
  emit('chat', { item: { ...props.user.viewer } });
  fluxesStore.reelPreview.isReactionListPopupOpen = null;
  fluxesStore.reelPreview.visible = false;
  fluxesStore.reelPreview.isCommentPopupOpen = false;
  fluxesStore.isCommentPopupOpen = false;
  fluxesStore.reelPreview.data = [];
  await sleep(500);
  fluxesStore.reelPopup.state = false;
  fluxesStore.storyPopup.state = false;
};

const handleFollow = () => {
  emit('follow', props.user.viewer, isFollowing.value);
};

const handleHide = () => {
  emit('hide', props.user.viewer);
};
</script>
