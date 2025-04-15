<template>
  <div class="z-[15] flex w-full items-center justify-between">
    <div class="flex flex-col justify-center gap-0.5 overflow-hidden">
      <div class="flex items-end gap-1 text-sm font-medium text-[#D9D9D9]">
        <span
          data-action="toProfile"
          class="text-shadow cursor-pointer truncate text-sm text-[#D9D9D9] underline-offset-2 transition-all hover:underline"
          :class="$device.isMobile ? 'max-w-24' : 'max-w-48'"
        >
          {{ ownerName }}
        </span>
      </div>

      <div class="text-shadow flex items-center text-xs text-[#B0B0B0]">
        <span>{{ timeAgo(item?.createdAt) }}</span>
      </div>
    </div>

    <div class="flex gap-2">
      <div
        v-if="isCreatedByVisible"
        class="flex items-center gap-[0.375rem] text-[#707070]"
      >
        <div v-if="!$device.isMobile" class="text-xs">
          {{ $t('event.create.by') }}
        </div>

        <div
          class="flex items-center gap-3 rounded-[6rem] bg-white/5 p-[0.4rem] pr-[0.6rem] text-sm"
        >
          <BaseAvatarOrgUser
            :user-picture="createdBy?.picture ?? ''"
            :org-picture="owner?.picture ?? ''"
            class="z-10 size-7"
          />

          <span class="text-shadow max-w-32 truncate font-light text-[#D4D4D4]">
            {{ createdBy?.name }}
          </span>
        </div>
      </div>

      <div class="mr-2 flex items-center gap-2">
        <el-popover
          v-model:visible="popoverVisible"
          trigger="click"
          :show-arrow="false"
          placement="bottom-start"
          :popper-style="{
            border: 'none',
            background: 'transparent',
            'box-shadow': 'none',
            padding: '0',
            borderRadius: '0.375rem',
            minWidth: isMinePost ? '12rem' : '6.25rem',
          }"
          @show="socialStore.optionId = item.id"
          @hide="socialStore.optionId = null"
        >
          <template #reference>
            <div
              :data-cy="`${dataCy}-menu-button`"
              class="group relative z-10 ml-3 flex h-6 w-6 cursor-pointer items-center justify-center rounded-[0.3125rem] transition-all hover:bg-white/5 active:scale-95"
            >
              <i class="fa-light fa-ellipsis text-shadow z-10" />
            </div>
          </template>
          <div class="popupborder bg-[#060606] p-[0.375rem]">
            <ul class="leading-5">
              <BaseMenuItem
                v-if="isMinePost"
                icon-class="fa-regular fa-edit"
                data-cy="4efead9e18af300b"
                @click="handleEditPost"
              >
                {{ $t('post.edit') }}
              </BaseMenuItem>

              <BaseMenuItem
                v-if="!isMinePost"
                :icon-class="
                  saveLoading
                    ? 'fa-solid fa-spinner animate-spin text-xs'
                    : 'fa-regular fa-bookmark'
                "
                data-cy="fa695df150f52153"
                @click="handleSave"
              >
                {{ isPostSaved ? $t('post.unSave') : $t('post.save') }}
              </BaseMenuItem>

              <BaseMenuItem
                v-if="!isMinePost"
                :icon-class="
                  hideLoading
                    ? 'fa-solid fa-spinner animate-spin text-xs'
                    : 'fa-regular fa-eye-slash'
                "
                data-cy="a21b40d0c084814a"
                @click="clickHide"
              >
                <span v-if="isClickHidden">
                  {{ $t('post.undo', { countdown: countdown }) }}
                </span>
                <span v-else-if="hideLoading">
                  {{ $t('post.hiding') }}
                </span>
                <span v-else>
                  {{ $t('post.hide') }}
                </span>
              </BaseMenuItem>

              <BaseMenuItem
                v-if="isMinePost"
                icon-class="fa-regular fa-trash"
                :data-cy="`${dataCy}-delete-menu`"
                @click="handleDeleteClick"
              >
                {{ $t('post.delete') }}
              </BaseMenuItem>

              <BaseMenuItem
                v-if="isMinePost"
                :icon-class="
                  notificationLoading
                    ? 'fa-solid fa-spinner animate-spin text-xs'
                    : isNotificationOff
                      ? 'fa-regular fa-bell'
                      : 'fa-regular fa-bell-slash'
                "
                data-cy="7624cdbc086f231a"
                @click="handleNotification"
              >
                {{
                  isNotificationOff
                    ? $t('post.notification.new.on')
                    : $t('post.notification.new.off')
                }}
              </BaseMenuItem>
            </ul>
          </div>
        </el-popover>
        <BaseButton
          type="tertiary"
          class="text-shadow !text-[#d9d9d9] !opacity-100"
          @click="handleFullScreen"
        >
          <i class="fa-solid fa-expand text-shadow text-[#d9d9d9]" />
        </BaseButton>
        <BaseIconClose
          type="tertiary"
          class="text-shadow text-[#d9d9d9]"
          @click="socialStore.hidePostsPopup"
        />
      </div>
    </div>

    <template v-if="comfirmShow">
      <BaseComfirm
        v-model:dialog-show="comfirmShow"
        title="Warning"
        message="Are you sure to delete this post?"
        @close="comfirmShow = false"
      >
        <template #footer>
          <div class="flex justify-end p-4">
            <BaseButton
              type="tertiary"
              label="$t:base.upload.cancel"
              data-cy="170ab9f14d5bfc0f"
              @click="comfirmShow = false"
            />
            <BaseButton
              type="tertiary"
              class="ml-3 bg-[#190e0d]"
              data-cy="delete-post-confirm-button"
              @click="handleDeletePost"
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
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
    isPopup: {
      type: Boolean,
      default: false,
    },
    dataCy: {
      type: String,
      default: '',
    },
  },
  setup() {
    const authStore = useAuthStore();
    const socialStore = useSocialStore();
    const searchStore = useSearchStore();
    const fluxesStore = useFluxesStore();
    const router = useRouter();
    return { authStore, socialStore, searchStore, fluxesStore, router };
  },
  data() {
    return {
      notificationLoading: false,
      saveLoading: false,
      hideLoading: false,
      deleteLoading: false,
      comfirmShow: false,
      popoverVisible: false,
      isClickHidden: false,
      hiddenTimer: null,
      countdown: 0,
    };
  },
  computed: {
    owner() {
      return this.item.owner;
    },
    createdBy() {
      return this.item.createdBy;
    },
    isCreatedByVisible() {
      return this.owner.type === 'organization' && this.item.createdBy;
    },
    user() {
      return this.authStore.context;
    },
    isMinePost() {
      return this.user === this.owner?.id;
    },
    isPostSaved() {
      return !!this.item.isPostSaved;
    },
    isNotificationOff() {
      return !!this.item.isNotificationOff;
    },
    ownerName() {
      if (this.user === this.owner?.id) {
        return 'You';
      }

      return this.owner?.name ?? 'Aladia User';
    },
  },
  methods: {
    handleFullScreen() {
      this.fluxesStore.reelPopup.reel_Id = this.item.id;
      this.fluxesStore.reelPreview.previousRoute =
        this.router.currentRoute.value.fullPath;
      const url = `/reels/${this.item.id}`;
      history.pushState(null, '', url);
      this.fluxesStore.reelPopup.state = true;
    },
    handleClose() {
      if (!this.isPopup) {
        return;
      }

      this.$nextTick(() => {
        this.socialStore.optionId = null;
        this.socialStore.hidePostsPopup();
      });
    },
    handleDeleteClick() {
      this.comfirmShow = true;
      this.popoverVisible = false;
    },
    async handleNotification() {
      if (this.notificationLoading) {
        return;
      }

      const isNotificationOff = this.isNotificationOff;
      const targetNotification = !isNotificationOff;

      try {
        this.notificationLoading = true;
        await this.socialStore.updatePostNotification(this.item.id);
        this.item.isNotificationOff = targetNotification;
      } finally {
        this.notificationLoading = false;
      }
    },
    async handleSave() {
      if (this.saveLoading) {
        return;
      }

      const isPostSaved = this.isPostSaved;
      const targetSaveStatus = !isPostSaved;

      try {
        this.saveLoading = true;
        await this.socialStore.savePosts(this.item.id);
        this.item.isPostSaved = targetSaveStatus;
      } finally {
        this.saveLoading = false;
      }
    },
    clickHide() {
      if (this.isClickHidden) {
        this.isClickHidden = false;
        this.hiddenTimer && clearInterval(this.hiddenTimer);
        return;
      }

      this.isClickHidden = true;
      this.countdown = 5;
      this.hiddenTimer = setInterval(() => {
        this.countdown -= 1;
        if (this.countdown === 0) {
          clearInterval(this.hiddenTimer);
          this.isClickHidden = false;
          this.handleHide();
        }
      }, 1000);
    },
    async handleHide() {
      if (this.hideLoading) {
        return;
      }

      try {
        this.hideLoading = true;
        await this.socialStore.hidePost({
          userId: this.authStore.context,
          postId: this.item.id,
        });
        this.popoverVisible = false;
        this.$emit('hide', this.item);
        this.handleClose();
      } finally {
        this.hideLoading = false;
      }
    },
    async handleDeletePost() {
      if (this.deleteLoading) {
        return;
      }
      try {
        this.deleteLoading = true;
        await this.socialStore.removePost({
          postId: this.item.id,
        });
        this.$emit('delete', this.item);
        this.comfirmShow = false;
        this.handleClose();
      } finally {
        this.deleteLoading = false;
      }
    },
    async handleEditPost() {
      this.fluxesStore.currReelItem = this.item;
      this.fluxesStore.creationTab = 'reel';
      this.fluxesStore.creationVisibility = 'public';
      this.fluxesStore.creationVisible = true;
      this.fluxesStore.createMediaReel = {
        uploadOpen: true,
        content: this.item.content,
        file: this.item.files[0],
        loading: false,
        metadata: {
          name: this.item.files[0].metadata.name,
          size: this.item.files[0].metadata.size,
          mimetype: this.item.files[0].metadata.mimetype,
        },
      };
      this.fluxesStore.isCreatingReal = true;
      this.fluxesStore.isEditingReel = true;
      //     this.socialStore.optionId = null;
      //     this.isPopup && this.handleClose();
      //     this.popoverVisible = false;

      //     this.socialStore.resetCatefories();
      //     this.socialStore.resetPostEditData();

      //     this.socialStore.editPostData.title = this.item.title;
      //     this.socialStore.editPostData.content = this.item.content;

      //     if (this.item.files && this.item.files.length) {
      //       this.socialStore.editPostData.files = this.item.files.map((file) => {
      //         return {
      //           id: file.fileId,
      //           url: file.url,
      //           preview: file.url,
      //           file: {
      //             name: file.metadata.name || '',
      //             size: file.metadata.size,
      //           },
      //           isEdit: true,
      //           size: file.metadata.size,
      //           mimetype: file.metadata.mimetype,
      //           progress: 100,
      //         };
      //       });
      //     }
      //     this.socialStore.editPostData.mentions = this.item.mentions.map(
      //       (mention) => {
      //         return {
      //           id: mention.id,
      //           type: mention.type,
      //         };
      //       },
      //     );
      //     this.socialStore.editPostData.location = this.item.location;
      //     this.socialStore.editPostData.loomFiles = this.item.loomUrls;
      //     this.socialStore.editPostData.id = this.item.id;
      //     this.socialStore.editPostData.type = this.item.type;
      //     this.socialStore.editPostData.visibility = this.item.visibility;

      //     this.socialStore.answerCollapse = true;
      //     this.socialStore.answerReplying = true;

      //     this.socialStore.creatorVisible = true;
    },
  },
};
</script>

<style scoped>
.text-shadow {
  text-shadow: 1px 2px 2px rgba(0, 0, 0, 0.5);
}
</style>
