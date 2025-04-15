<template>
  <el-popover
    v-model:visible="popoverVisible"
    trigger="click"
    :show-arrow="false"
    placement="bottom-end"
    :popper-style="{
      border: 'none',
      background: 'transparent',
      'box-shadow': 'none',
      padding: '0',
      borderRadius: '0.375rem',
      width: '12.25rem',
      zIndex: 10000,
    }"
    :inert="!popoverVisible"
  >
    <template #reference>
      <div
        class="flex size-6 items-center justify-center rounded-5 hover:bg-white/5"
        :class="[popoverVisible ? 'bg-white/5' : '']"
        @click="onOptionOpen"
      >
        <i class="fa-light fa-ellipsis z-10 text-white" />
      </div>
    </template>
    <div class="bg-[#060606] p-[0.375rem]">
      <ul class="leading-5">
        <template v-if="isOwner">
          <BaseMenuItem
            icon-class="fa-regular fa-edit"
            data-cy="20ffe610a90a4a9a"
            @click="handleEditStory"
          >
            Edit {{ source === 'stories' ? 'Story' : 'Highlight' }}
          </BaseMenuItem>

          <BaseMenuItem
            icon-class="fa-regular fa-trash"
            data-cy="d9f7d3bef238f424"
            @click="handleDeleteComment"
          >
            Delete Story
          </BaseMenuItem>

          <BaseMenuItem
            :icon-class="!notificationOff ? 'fas fa-bell-slash' : 'fas fa-bell'"
            @click="toggleNotfication"
          >
            {{
              notificationOff
                ? 'Turn on notifications'
                : 'Turn off notifications'
            }}
          </BaseMenuItem>
        </template>
        <template v-else>
          <BaseMenuItem
            :icon-class="!isItemHidden ? 'fas fa-eye-slash' : 'fas fa-eye'"
            data-cy="20ffe610a90a4a9a"
            @click="handleHideStory"
          >
            {{ isItemHidden ? 'Unhide Story' : 'Hide Story' }}
          </BaseMenuItem>
        </template>
      </ul>
    </div>
  </el-popover>

  <template v-if="confirmShow">
    <BaseComfirm
      v-model:dialog-show="confirmShow"
      :title="$t('flux.comment.delete.warning')"
      :message="'Are you sure you want to delete this story?'"
      @close="confirmShow = false"
    >
      <template #footer>
        <div class="flex justify-end p-4">
          <BaseButton
            type="tertiary"
            label="$t:base.upload.cancel"
            data-cy="5d6a2219d5d3126f"
            @click="confirmShow = false"
          />
          <BaseButton
            type="tertiary"
            class="ml-3 bg-[#190e0d]"
            data-cy="718eacaedbfe8460"
            @click="handleComfirmDeleteComment"
          >
            <template #prefix>
              <i
                v-if="deleteLoading"
                class="fa-light fa-loader animate-spin text-base"
              />
              <i v-else class="fa-light fa-trash-can" />
            </template>
            {{ $t('base.editor.delete') }}
          </BaseButton>
        </div>
      </template>
    </BaseComfirm>
  </template>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

const props = defineProps({
  item: Object,
  stories: Array,
  highlightId: String,
  source: String,
});

const emit = defineEmits([
  'optionOpen',
  'deleted',
  'optionClose',
  'closeStory',
  'loading',
  'allDeleted',
  'hideStory',
]);

const { t } = useI18n();

const $toast = useToast();

const profileStore = useProfileStore();
const fluxesStore = useFluxesStore();

const deleteLoading = ref(false);
const confirmShow = ref(false);
const popoverVisible = ref(false);
const notificationOff = computed(() => props.item?.isNotificationOff);
const isOwner = computed(
  () => props.item?.owner?.id === profileStore.myProfileDetail.id,
);

function handleDeleteComment() {
  confirmShow.value = true;
}

const toggleNotfication = () => {
  props.item.isNotificationOff = !props.item.isNotificationOff;
  fluxesStore.toggleStoryNotification({ storyId: props.item.id });
};

async function handleComfirmDeleteComment() {
  if (deleteLoading.value) {
    return;
  }

  try {
    if (props.item.title && props.stories.length === 1) {
      $toast.error(t('flux.story.delete.last.error'));
      return;
    }
    const ownerId = props.item.owner.id;
    deleteLoading.value = true;

    await fluxesStore.deleteStories(props.item.id);
    emit('loading', true);

    const index = fluxesStore.storiesPreview.data.findIndex(
      (story) => story.owner.id === ownerId,
    );

    if (index !== -1) {
      const filteredStories = fluxesStore.storiesPreview.data[
        index
      ]._stories.filter((story) => story.id !== props.item?.id);
      if (filteredStories.length === 0) {
        emit('allDeleted', ownerId);
        return;
      }
    }

    if (props.item.title) {
      emit('deleted', props.highlightId);
    } else {
      emit('deleted', ownerId);
    }
    confirmShow.value = false;
  } catch (error) {
    console.error(error);
  } finally {
    deleteLoading.value = false;
  }
}

function handleEditStory() {
  fluxesStore.creationVisible = true;
  fluxesStore.editStory.fromStory = true;
  fluxesStore.editStory.visible = true;
  fluxesStore.editStory.item = props.item;
  fluxesStore.createMediaList.uploadOpen = true;
  fluxesStore.storyVisibility = props.item.visibility;
  fluxesStore.storyIsPublished = true;
  fluxesStore.storyPopup.state = false;

  const isPhoto =
    !props.item.cover || props.item.cover?.metadata?.mimetype.includes('image');
  const isVideo = props.item.cover?.metadata?.mimetype.includes('video');

  if (isPhoto || isVideo) {
    const mediaType = isPhoto ? 'image' : 'video';
    fluxesStore.createMediaStory.type = mediaType;
    fluxesStore.createMediaStory.file = props.item.files[0];
    fluxesStore.editStory.file = props.item.files[0];
    fluxesStore.editStory.type = mediaType;
  }

  fluxesStore.creationTab = props.item.title ? 'highlight' : 'story';

  if (props.item.title) {
    fluxesStore.createMediaList.title = props.item.title;
    fluxesStore.createMediaList.cover = props.item.cover;
    fluxesStore.createMediaList.data = cloneDeep(props.stories);
    fluxesStore.createMediaList.highlightCover = props.item.cover.url;
    fluxesStore.createMediaList.visibility = props.item.visibility;
    fluxesStore.createMediaList.editingHighlightId = props.highlightId;
  }
}

async function handleHideStory() {
  const userId = profileStore.myProfileDetail.id;
  const entityId = props.item?.id;
  if (isItemHidden.value) {
    unhideStory({ userId, entityId });
  } else {
    hideStory({ userId, entityId });
  }

  popoverVisible.value = false;
}

const onOptionOpen = () => {
  emit('optionOpen');
};

const unhideStory = async ({ userId, entityId }) =>
  await fluxesStore.unhideStory({ userId, entityId });
const hideStory = async ({ userId, entityId }) => {
  emit('hideStory');
  await fluxesStore.hideStory({ userId, entityId });
};
const isItemHidden = computed(() =>
  fluxesStore.hiddenStories.has(props.item?.id),
);

watch(popoverVisible, (newVal) => {
  if (!newVal) {
    if (!fluxesStore.creationVisible && !confirmShow.value) {
      emit('optionClose');
    }
  }
});
</script>
