<template>
  <div class="flex w-full items-start justify-between">
    <div class="flex flex-col">
      <div
        class="flex gap-1.5"
        :class="$device.isMobile ? 'flex-col' : 'items-center'"
      >
        <span class="flex items-center gap-1.5">
          <span
            data-action="toProfile"
            class="cursor-pointer truncate text-sm text-[#D9D9D9] underline-offset-2 transition-all hover:underline"
            :class="
              $device.isMobile ? 'max-w-32' : 'max-w-72 2xl:max-w-[21.5rem]'
            "
          >
            {{ ownerName }}
          </span>
          <span class="shrink-0 text-xs text-[#B0B0B0]">
            <span v-if="isJoin">{{ $t('post.auto.join.label') }}</span>
            <span v-else-if="isBeTeacher">
              {{ $t('post.auto.beTeacher.label') }}
            </span>
            <span v-else-if="isPurchaseCourse">
              {{ $t('post.auto.purchase.label') }}
            </span>
            <span v-else-if="isPublishCourse">
              {{ $t('post.auto.publish.label') }}
            </span>
            <span v-else-if="isNewJob">
              {{ $t('post.auto.role.label') }}
            </span>
            <span v-else-if="isOneYearAnniversary">
              {{
                $t('post.auto.year.label', {
                  organizationName: organizationName,
                })
              }}
            </span>
            <span v-else-if="isCelebratingGraduation">
              {{ $t('post.auto.graduation.label') }}
            </span>
            <span v-else-if="isEarnedCertification">
              {{ $t('post.auto.certificate.label') }}
            </span>
            <span v-else-if="isCourseCertificate">
              {{ $t('post.auto.CourseCertificate.label') }}
            </span>
          </span>
        </span>

        <div
          v-if="isPurchaseCourse || isPublishCourse"
          class="group flex cursor-pointer items-center"
          data-cy="be361aff15a1a1f0"
          @click="handleGoToCourse"
        >
          <span
            class="inline-block h-4 w-7 overflow-hidden rounded-sm bg-cover bg-center bg-no-repeat"
          >
            <BaseCourseThumbnail class="h-full" :url="entity?.thumbnail?.url" />
          </span>
          <span
            class="ml-2 mt-0.5 cursor-pointer truncate text-xs text-[#D9D9D9] group-hover:underline group-hover:underline-offset-2"
            :class="$device.isMobile ? 'max-w-[4rem]' : 'max-w-[5rem]'"
          >
            {{ entity?.title || '---' }}
          </span>
        </div>
        <div
          v-if="isCourseCertificate"
          class="group flex cursor-pointer items-center"
          data-cy="be361aff15a1a1f0"
          @click="handleGoToOrg"
        >
          <span
            class="inline-block overflow-hidden rounded-sm bg-cover bg-center bg-no-repeat"
          >
            <BaseAvatarNext
              :picture="entity?.picture"
              :show-online="false"
              :show-story="false"
              size="sm"
            />
          </span>
          <span
            class="ml-2 mt-0.5 cursor-pointer truncate text-xs text-[#D9D9D9] group-hover:underline group-hover:underline-offset-2"
            :class="$device.isMobile ? 'max-w-[4rem]' : 'max-w-[5rem]'"
          >
            {{ entity?.owner?.name || '---' }}
          </span>
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
            class="group relative z-10 ml-1.5 flex h-6 w-6 cursor-pointer items-center justify-center rounded-md transition-all hover:bg-white/5 active:scale-95"
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
              data-cy="3df94afd6928771f"
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
              data-cy="5b3c6f6c944f568b"
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
              data-cy="28271e4a0cf95204"
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
              data-cy="e1b3bcfdb35fd6ab"
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
        data-cy="cff3213c352a877e"
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
    const profileStore = useProfileStore();
    return { authStore, socialStore, searchStore, profileStore };
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
    ownerName() {
      if (this.user === this.owner?.id) {
        return 'You';
      }

      return this.owner?.name ?? 'Aladia User';
    },
    placeholder() {
      return this.item.placeholder;
    },
    organizationName() {
      return this.placeholder?.organizationName;
    },
    entity() {
      return this.item.entity;
    },
    isPostSaved() {
      return !!this.item.isPostSaved;
    },
    images() {
      return (this.item.files || []).filter((r) =>
        /(jpg|jpeg|png|gif)$/i.test(r.metadata.name),
      );
    },
    isNotificationOff() {
      return !!this.item.isNotificationOff;
    },
    isJoin() {
      return this.item.subType === 'joined-platform';
    },
    isBeTeacher() {
      return this.item.subType === 'became-teacher';
    },
    isPublishCourse() {
      return this.item.subType === 'published-course';
    },
    isPurchaseCourse() {
      return this.item.subType === 'enrolled-course';
    },
    isNewJob() {
      return this.item.subType === 'started-new_role';
    },
    isOneYearAnniversary() {
      return this.item.subType === 'one-year-anniversary';
    },
    isCelebratingGraduation() {
      return this.item.subType === 'graduation';
    },
    isEarnedCertification() {
      return this.item.subType === 'earned-certification';
    },
    isCourseCertificate() {
      return this.item.subType === 'course-certificate';
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
        this.$toast.success('Post deleted sucessfully');
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
    handleGoToOrg() {
      this.profileStore.gotoProfilePage({
        id: this.entity?.owner?.id,
        entityType: this.entity?.owner?.type,
      });
    },
  },
};
</script>
