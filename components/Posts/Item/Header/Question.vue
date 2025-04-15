<template>
  <div class="flex w-full items-start justify-between">
    <div class="flex flex-col gap-0.5">
      <div
        class="flex gap-0.5"
        :class="$device.isMobile || isChat ? 'flex-col' : 'items-center'"
      >
        <span class="flex items-center gap-1.5">
          <span
            data-action="toProfile"
            class="cursor-pointer truncate text-sm text-[#D9D9D9] underline-offset-2 transition-all hover:underline"
            :class="
              $device.isMobile || isChat ? 'max-w-40' : 'max-w-56 2xl:max-w-72'
            "
          >
            {{ ownerName }}
          </span>
          <span
            v-if="!isChat"
            class="mr-2 text-xs text-[#B0B0B0]"
            :class="$device.isMobile || isChat ? 'shrink-0' : ''"
          >
            {{ $t('post.question.asked') }}
          </span>
        </span>

        <div class="flex items-center" :class="isChat ? 'gap-1 truncate' : ''">
          <span
            v-if="isChat"
            class="text-xs text-[#B0B0B0]"
            :class="$device.isMobile || isChat ? 'shrink-0' : ''"
          >
            {{ $t('post.question.asked') }}
          </span>
          <div
            class="group flex cursor-pointer items-center"
            data-cy="18519da34ccdcb66"
            @click="handleGoToCourse"
          >
            <span
              class="oBaseCourseThumbnailverflow-hidden mr-1 h-4 w-7 rounded-sm"
            >
              <BaseCourseThumbnail
                class="h-full"
                :url="entity.thumbnail?.url"
              />
            </span>

            <el-popover
              v-model:visible="entityVisible"
              trigger="hover"
              :show-arrow="true"
              :persistent="false"
              placement="bottom-start"
              :disabled="!(entity.type === 'lecture')"
            >
              <template #reference>
                <span
                  class="overflow-hidden truncate text-xs text-[#D9D9D9] group-hover:underline group-hover:underline-offset-2"
                  :class="$device.isMobile ? 'max-w-[10rem]' : 'max-w-[16rem]'"
                >
                  {{ entity.title }}
                </span>
              </template>

              <span class="inline-block p-2 text-xs font-medium text-[#FAFAFA]">
                {{
                  $t('course.index.chapter', { index: entity.chapterIndex + 1 })
                }}
                |
                {{
                  $t('course.index.chapter', { index: entity.lectureIndex + 1 })
                }}
              </span>
            </el-popover>
          </div>

          <el-popover
            v-if="!isPopup && !isChat"
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
                  data-cy="18aa919c507824f4"
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
                  data-cy="17189b27644ec326"
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
                  data-cy="f72bb84a437e1ccb"
                  @click="handleHide"
                >
                  <span v-if="isClickHidden">
                    {{ $t('post.undo', { countdown: countdown }) }}
                  </span>
                  <span v-else-if="hideLoading">{{ $t('post.hiding') }}</span>
                  <span v-else>
                    {{ $t('post.hide') }}
                  </span>
                </BaseMenuItem>

                <BaseMenuItem
                  v-if="isMinePost"
                  icon-class="fa-regular fa-trash"
                  data-cy="5438e69e7eb2fa6b"
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
                  data-cy="9feb22f25d9afefe"
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
        </div>
      </div>

      <div class="mt-1 flex flex-1 items-center text-xs text-[#B0B0B0]">
        <div class="shrink-0">
          <PostsItemWidgetsQuestionStatus :status="item.status" />
        </div>
        <span class="px-2 text-sm">•</span>
        <div class="shrink-0">
          <i class="fa-solid fa-messages-question" />
          {{ $t('course.header.qa') }}
        </div>
        <span class="px-2 text-sm">•</span>
        <span class="shrink-0">{{ timeAgo(item?.createdAt) }}</span>
        <span class="px-2 text-sm">•</span>
        <PostsItemWidgetsVisibility
          :visibility="item.visibility"
          show-visibility
        />
      </div>
    </div>

    <div>
      <div v-if="!isPopup && !isChat" class="h-11 w-11">
        <img
          v-if="item.status === 'solved'"
          src="~/assets/social/success.png"
          class="object-contain"
          alt=""
        />
        <img
          v-else
          src="~/assets/social/fail.png"
          class="object-contain"
          alt=""
        />
      </div>

      <div
        v-if="isPopup && !isRepost"
        class="flex items-center gap-2"
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
            minWidth: '6.25rem',
            width: 'auto',
          }"
          @show="socialStore.optionId = item.id"
          @hide="socialStore.optionId = null"
        >
          <template #reference>
            <div
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
                data-cy="de3dbfb4ab5b21a3"
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
                data-cy="7c42b669e1e10e59"
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
                data-cy="c956e7c4852276c6"
                @click="handleHide"
              >
                <span v-if="isClickHidden">
                  {{ $t('post.undo', { countdown: countdown }) }}
                </span>
                <span v-else-if="hideLoading">{{ $t('post.hiding') }}</span>
                <span v-else>
                  {{ $t('post.hide') }}
                </span>
              </BaseMenuItem>

              <BaseMenuItem
                v-if="isMinePost"
                icon-class="fa-regular fa-trash"
                data-cy="2d76fd0b66b1f2a8"
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
                data-cy="7dd5f56ea382bb58"
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

        <span
          v-if="!$device.isMobile"
          data-cy="917253fdaf95b0ac"
          @click="socialStore.popupExpand = !socialStore.popupExpand"
        >
          <i
            v-if="!socialStore.popupExpand"
            class="fa-light fa-expand cursor-pointer text-sm transition-all hover:scale-125"
          />
          <i
            v-if="socialStore.popupExpand"
            class="fa-light fa-compress cursor-pointer text-sm transition-all hover:scale-75"
          />
        </span>

        <BaseIconClose data-cy="4fabc62bd3adec04" @click="handleClose" />
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
              data-cy="579c031bb6963371"
              @click="comfirmShow = false"
            />
            <BaseButton
              type="tertiary"
              class="ml-3 bg-[#190e0d]"
              data-cy="341a89b5b41b2965"
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
import CategoryImg from '~/assets/icons/category.svg';

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
    isChat: {
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
      entityVisible: false,
      notificationLoading: false,
      saveLoading: false,
      hideLoading: false,
      deleteLoading: false,
      comfirmShow: false,
      popoverVisible: false,
      CategoryImg,
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
    entity() {
      if (!this.item.entity) {
        return {
          title: 'General',
          thumbnail: {
            id: 'General',
            url: this.CategoryImg,
          },
        };
      }

      return this.item.entity;
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
        this.handleClose();
      } finally {
        this.deleteLoading = false;
      }
    },
    async handleEditPost() {
      this.socialStore.optionId = null;
      this.popoverVisible = false;
      this.isPopup && this.handleClose();

      this.socialStore.resetCatefories();
      this.socialStore.resetPostEditData();

      // Echo data
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
      console.log('question', this.item);
      this.socialStore.editPostData.id = this.item.id;
      this.socialStore.editPostData.type = this.item.type;
      this.socialStore.editPostData.loomFiles = this.item.loomUrls;
      this.socialStore.editPostData.visibility = this.item.visibility;
      if (this.item.entity) {
        this.socialStore.category = this.item.entity.title;
        this.socialStore.categoryId = this.item.entity?.categoryId;
        this.socialStore.categoryImg = this.item.entity.thumbnail?.url;
      }

      this.socialStore.answerCollapse = true;
      this.socialStore.answerReplying = true;
      this.socialStore.creatorTab = 'question';
      this.socialStore.creatorVisible = true;
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
