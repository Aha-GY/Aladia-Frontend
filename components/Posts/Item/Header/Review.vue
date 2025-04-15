<template>
  <div class="flex w-full items-center justify-between">
    <div class="flex flex-col">
      <div
        class="flex gap-1.5"
        :class="$device.isMobile ? 'flex-col' : 'items-center'"
      >
        <span class="flex items-center gap-1.5">
          <span
            data-action="toProfile"
            class="cursor-pointer truncate text-sm text-[#D9D9D9] underline-offset-2 transition-all hover:underline"
            :class="$device.isMobile ? 'max-w-24' : 'max-w-48'"
          >
            {{ ownerName }}
          </span>
          <span class="shrink-0 text-xs text-[#B0B0B0]">
            {{ $t('post.reviewed') }}
          </span>
        </span>

        <div
          class="group flex cursor-pointer items-center"
          data-cy="036cc98767da2dc0"
          @click="handleGoToCourse"
        >
          <span
            class="mr-1 inline-block h-4 w-7 overflow-hidden rounded-sm bg-cover bg-center bg-no-repeat"
          >
            <BaseCourseThumbnail class="h-full" :url="entity?.thumbnail?.url" />
          </span>
          <span
            class="cursor-pointer truncate text-xs text-[#D9D9D9] group-hover:underline group-hover:underline-offset-2"
            :class="$device.isMobile ? 'max-w-[10rem]' : 'max-w-[16rem]'"
          >
            {{ entity.title }}
          </span>
        </div>
      </div>

      <div class="mt-1 flex items-center text-xs text-[#B0B0B0]">
        <div>
          <BaseStarsHalf
            :rating="item.rating"
            size="small"
            :disabled="true"
            :primary-color="true"
          />
        </div>
        <span class="text-sm" :class="$device.isMobile ? 'px-1' : 'px-2'">
          •
        </span>
        <span>{{ timeAgo(item?.createdAt) }}</span>
        <template v-if="item.owner?.numberOfReviews">
          <span class="text-sm" :class="$device.isMobile ? 'px-1' : 'px-2'">
            •
          </span>
          <span>
            {{ $t('post.reviews', { count: item.owner.numberOfReviews }) }}
          </span>
        </template>
      </div>
    </div>

    <div
      v-if="!isRepost"
      class="flex items-center gap-4"
      :class="$device.isMobile ? 'absolute right-0 top-0 bg-black' : ''"
    >
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
            class="group relative z-10 ml-3 flex h-6 w-6 cursor-pointer items-center justify-center rounded-md transition-all hover:bg-white/5 active:scale-95"
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
              @click="alert('/* FIXME: action missing */')"
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
              data-cy="b2a968d4b88467a7"
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
              data-cy="77b7b3fb945135dd"
              @click="handleHide"
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
              data-cy="afb1fbe6f42ca3dc"
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
              data-cy="8d8b5ab70c5f2cbf"
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
        data-cy="1cbf8153e37331ba"
        @click="socialStore.hidePostsPopup"
      />
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
              data-cy="4f1458a35b367e2e"
              @click="comfirmShow = false"
            />
            <BaseButton
              type="tertiary"
              class="ml-3 bg-[#190e0d]"
              data-cy="4aa49a2cadc12e6f"
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
    user() {
      return this.authStore.context;
    },
    isMinePost() {
      return this.user === this.owner?.id;
    },
    ownerName() {
      if (this.user === this.owner?.id) {
        return 'You';
      }

      return this.owner?.name ?? 'Aladia User';
    },
    entity() {
      return this.item.entity || {};
    },
    isPostSaved() {
      return !!this.item.isPostSaved;
    },
    isNotificationOff() {
      return !!this.item.isNotificationOff;
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
        this.$emit('delete', this.item);
        this.comfirmShow = false;

        this.$toast.success('Review deleted sucessfully');

        this.handleClose();
      } finally {
        this.deleteLoading = false;
      }
    },
    handleGoToCourse() {
      this.isPopup && this.socialStore.hidePostsPopup();

      if (['lecture', 'course'].includes(this.entity.type)) {
        // lecture 和 course 获取 courseId 的方法不同，需要兼容一下
        const courseId = this.entity?.courseId || this.entity?.entityId;
        return this.$router.push(`/courses/${courseId}`);
      }

      if (this.entity.ownerId && this.entity.type === 'category') {
        return this.$router.push(
          `/marketplace?categoryId=${this.entity.ownerId}`,
        );
      }

      this.$router.push(`/marketplace`);
    },
  },
};
</script>
