<template>
  <div class="flex w-full items-start justify-between">
    <div class="flex flex-col justify-center gap-0.5 overflow-hidden">
      <div class="flex items-end gap-1 text-sm font-medium text-[#D9D9D9]">
        <span
          data-action="toProfile"
          class="min-w-0 flex-1 cursor-pointer truncate whitespace-nowrap text-sm text-[#D9D9D9] underline-offset-2 transition-all hover:underline"
        >
          {{ ownerName }}
        </span>
        <div class="flex-none shrink-0">
          <PostsCreationLocation
            v-if="item.location"
            :location-item="item.location"
            :is-mine="isMinePost"
          />
        </div>
      </div>

      <div class="flex items-center text-xs text-[#B0B0B0]">
        <span>{{ timeAgo(item?.createdAt) }}</span>
        <span class="px-2 text-sm">•</span>
        <PostsItemWidgetsVisibility
          :visibility="item.visibility"
          show-visibility
        />
      </div>
    </div>

    <div class="flex gap-2">
      <div
        v-if="isCreatedByVisible"
        class="flex items-center gap-[6px] text-[#707070]"
      >
        <div v-if="!$device.isMobile" class="text-xs">
          {{ $t('post.creator') }}
        </div>

        <div
          class="flex items-center gap-3 rounded-[6rem] bg-white/5 p-[0.4rem] pr-[0.6rem] text-sm"
        >
          <BaseAvatarOrgUser
            :user-picture="createdBy?.picture ?? ''"
            :org-picture="owner?.picture ?? ''"
            class="size-7"
          />

          <span class="max-w-32 truncate font-light text-[#D4D4D4]">
            {{ createdBy?.name }}
          </span>
        </div>
      </div>

      <div v-if="!isRepost" class="flex items-center gap-4">
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
              <!-- <i
              v-if="socialStore.optionId === item.id"
              class="transition-all duration-300 fa-light fa-xmark group-hover:rotate-90"
            />
            <i v-else class="z-10 fa-light fa-ellipsis" /> -->
              <i class="fa-light fa-ellipsis z-10" />
            </div>
          </template>
          <div class="popupborder bg-[#060606] p-[0.375rem]">
            <ul class="leading-5">
              <BaseMenuItem
                v-if="isMinePost"
                icon-class="fa-regular fa-edit"
                :data-cy="`${dataCy}-edit-menu`"
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
                @click="handleHide"
              >
                <span v-if="isClickHidden">
                  {{ $t('post.undo') }}
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

        <BaseIconClose
          v-if="isPopup"
          data-cy="959f1963ce53ed97"
          @click="socialStore.hidePostsPopup"
        />
      </div>
    </div>

    <template v-if="comfirmShow">
      <BaseComfirm
        v-model:dialog-show="comfirmShow"
        :title="$t('post.warning.title')"
        :message="$t('post.warning.delete')"
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
    isRepost: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const authStore = useAuthStore();
    const socialStore = useSocialStore();
    const searchStore = useSearchStore();
    return { authStore, socialStore, searchStore };
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
      return this.owner?.type === 'organization' && this.item.createdBy;
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

        this.$toast.success('Post deleted sucessfully');
        this.handleClose();
      } finally {
        this.deleteLoading = false;
      }
    },
    async handleEditPost() {
      this.socialStore.optionId = null;
      this.isPopup && this.handleClose();
      this.popoverVisible = false;

      this.socialStore.resetCatefories();
      this.socialStore.resetPostEditData();

      this.socialStore.editPostData.title = this.item.title;
      this.socialStore.editPostData.content = this.item.content;

      if (this.item.files && this.item.files.length) {
        this.socialStore.editPostData.files = this.item.files.map((file) => ({
          id: file.fileId,
          url: file.url,
          preview: file.url,
          file: {
            name: file.metadata.name || '',
            size: file.metadata.size,
          },
          isEdit: true,
          size: file.metadata.size,
          mimetype: file.metadata.mimetype,
          progress: 100,
        }));
      }
      this.socialStore.editPostData.mentions = this.item.mentions.map(
        (mention) => ({
          id: mention.id,
          type: mention.type,
        }),
      );
      this.socialStore.editPostData.location = this.item.location;
      this.socialStore.editPostData.loomFiles = this.item.loomUrls;
      this.socialStore.editPostData.id = this.item.id;
      this.socialStore.editPostData.type = this.item.type;
      this.socialStore.editPostData.visibility = this.item.visibility;

      this.socialStore.answerCollapse = true;
      this.socialStore.answerReplying = true;

      this.socialStore.creatorVisible = true;
      if (this.item.gif) {
        this.socialStore.gif = this.item?.gif;
      }
      this.socialStore.mentionItem = this.item?.parent;
    },
  },
};
</script>
