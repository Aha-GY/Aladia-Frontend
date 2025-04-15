<template>
  <div
    class="flex w-full items-center justify-between border-b-[1px] border-[#3D3D3D]"
  >
    <div class="flex items-center gap-2 pb-[0.625rem]">
      <BaseAvatarNext
        :picture="item?.owner?.picture"
        :story="item?.owner?.story"
        :user-id="item?.owner?.id"
        :online="item?.owner?.online"
        size="sm"
      />
      <p class="line-clamp-1 flex-1 text-[14px] font-medium text-[#D9D9D9]">
        {{ item.owner?.name }}
      </p>
      <p class="mt-1 text-[12px] font-medium text-[#b0b0b0]">Reposted this</p>
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
            <i class="fa-light fa-ellipsis z-10" />
          </div>
        </template>
        <div class="popupborder bg-[#060606] p-[0.375rem]">
          <ul class="leading-5">
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
            data-cy="268508a6d73265e8"
            @click="comfirmShow = false"
          />
          <BaseButton
            type="tertiary"
            class="ml-3 bg-[#190e0d]"
            data-cy="0b960952bf55bd33"
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
</template>
<script>
export default {
  props: {
    item: Object,
    isPopup: {
      type: Boolean,
      default: false,
    },
    isRepost: {
      type: Boolean,
      default: false,
    },
    dataCy: {
      type: String,
      default: '',
    },
  },
  emits: ['hide', 'delete'],
  setup() {
    const authStore = useAuthStore();
    const socialStore = useSocialStore();
    return { authStore, socialStore };
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
    user() {
      return this.authStore.context;
    },
    owner() {
      return this.item.owner;
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
  },
  methods: {
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
      } finally {
        this.hideLoading = false;
      }
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
    handleDeleteClick() {
      this.comfirmShow = true;
      this.popoverVisible = false;
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
        const index = this.socialStore.posts.posts.findIndex(
          (post) => post.id === this.item.parent.id,
        );
        if (index > -1) {
          this.socialStore.posts.posts[index].isReposted = false;
        }
        this.$emit('delete', this.item);
        this.comfirmShow = false;
        this.$toast.success('Post deleted successfully');
      } finally {
        this.deleteLoading = false;
      }
    },
  },
};
</script>
