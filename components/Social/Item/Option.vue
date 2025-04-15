<template>
  <div
    class="absolute left-0 top-0 z-10 w-[16rem] overflow-hidden rounded border border-[#565656]/40 transition-all duration-300"
    :class="socialStore.optionId === item.id ? 'max-h-52' : 'max-h-0 border-0'"
  >
    <div class="flex items-center justify-between bg-black px-4 py-1">
      <div class="flex items-center font-semibold">
        <img
          src="~/assets/social/option-more.svg"
          class="mr-4 h-4 w-4"
          alt=""
        />
        {{ $t('meet.options.label') }}
      </div>
      <!-- <div
        @click="socialStore.optionId = null"
        class="group border border-[#565656]/20 bg-[#070707] shadow-[0px_4px_4px_rgba(0,0,0,0.6)] rounded p-2 cursor-pointer transition-all duration-300 hover:border-white" data-cy="5402066987e55385">
        <img
          src="~/assets/social/option-close.svg"
          class="w-3 h-3 transition-all duration-300 group-hover:rotate-90 group-hover:scale-125"
          alt=""
        />
      </div> -->
    </div>
    <div class="relative bg-black px-2 py-1 text-xs backdrop-blur">
      <div
        class="relative mb-1 flex h-7 cursor-pointer items-center transition-all after:absolute after:-z-10 after:h-2 after:w-full after:rounded after:bg-[#0B0B0B] after:opacity-0 after:transition-all after:duration-300 hover:after:h-full hover:after:opacity-100 active:scale-95"
        data-cy="64eab8813e609dd8"
        @click="onSave"
      >
        <img
          v-if="!saveKey && !saveLoading"
          src="~/assets/social/option-save.svg"
          class="mx-3 h-3 w-3"
          alt=""
        />
        <img
          v-if="saveKey && !saveLoading"
          src="~/assets/social/option-saved.svg"
          class="mx-3 h-3 w-3"
          alt=""
        />
        <img
          v-if="saveLoading"
          src="~/assets/social/option-loading.svg"
          class="rotate-animation mx-3 h-3 w-3"
          alt=""
        />

        <div :class="saveLoading ? 'loading' : ''">
          {{
            saveLoading
              ? $t('post.saving')
              : saveKey
                ? $t('post.saved')
                : $t('post.bookmark')
          }}
        </div>
      </div>
      <div
        v-if="!isMine"
        class="relative mb-1 flex h-7 cursor-pointer items-center transition-all after:absolute after:-z-10 after:h-2 after:w-full after:rounded after:bg-[#0B0B0B] after:opacity-0 after:transition-all after:duration-300 hover:after:h-full hover:after:opacity-100 active:scale-95"
        data-cy="37cc3fd8f30af4f1"
        @click="onFollow"
      >
        <img
          v-if="!followKey && !followLoading"
          src="~/assets/social/option-follow.svg"
          class="mx-3 h-3 w-3"
          alt=""
        />
        <img
          v-if="followKey && !followLoading"
          src="~/assets/social/option-unfollow.svg"
          class="mx-3 h-3 w-3"
          alt=""
        />
        <img
          v-if="followLoading"
          src="~/assets/social/option-loading.svg"
          class="rotate-animation mx-3 h-3 w-3"
          alt=""
        />
        <div
          :class="[
            followLoading ? 'loading' : '',
            followKey && !followLoading ? 'text-[#C40303]' : '',
          ]"
        >
          {{
            followLoading
              ? followKey
                ? $t('base.member.unFollowing')
                : $t('base.member.following')
              : followKey
                ? $t('base.member.unFollow')
                : $t('base.member.follow')
          }}
        </div>
      </div>
      <div
        v-if="isMine"
        class="relative mb-1 flex h-7 cursor-pointer items-center after:absolute after:-z-10 after:h-2 after:w-full after:rounded after:bg-[#0B0B0B] after:opacity-0 after:transition-all after:duration-300 hover:after:h-full hover:after:opacity-100"
        data-cy="8214ddc030df67b4"
        @click="handleEditPost"
      >
        <i class="fa-light fa-pen-to-square mx-3 h-3 w-3" />
        {{ $t('post.edit') }}
      </div>
      <div
        class="relative mb-1 flex h-7 cursor-pointer items-center after:absolute after:-z-10 after:h-2 after:w-full after:rounded after:bg-[#0B0B0B] after:opacity-0 after:transition-all after:duration-300 hover:after:h-full hover:after:opacity-100"
      >
        <img
          src="~/assets/social/option-hide.svg"
          class="mx-3 h-3 w-3"
          alt=""
        />
        {{ $t('post.hide') }}
      </div>
      <div
        v-if="isMine"
        class="relative mb-1 flex h-7 cursor-pointer items-center after:absolute after:-z-10 after:h-2 after:w-full after:rounded after:bg-[#0B0B0B] after:opacity-0 after:transition-all after:duration-300 hover:after:h-full hover:after:opacity-100"
        data-cy="4cb2ae32a61b1002"
        @click="handleDeleteClick"
      >
        <img
          v-if="deleteLoading"
          src="~/assets/social/option-loading.svg"
          class="rotate-animation mx-3 h-3 w-3"
          alt=""
        />
        <i v-else class="fa-light fa-trash-can mx-3 h-3 w-3" />
        {{ $t('post.delete') }}
      </div>
      <div
        class="relative flex h-7 items-center after:absolute after:-z-10 after:h-2 after:w-full after:rounded after:bg-[#0B0B0B] after:opacity-0 after:transition-all after:duration-300 hover:after:h-full hover:after:opacity-100"
      >
        <img
          src="~/assets/social/option-report.svg"
          class="mx-3 h-3 w-3"
          alt=""
        />
        {{ $t('post.report') }}
      </div>
    </div>
    <template v-if="comfirmShow">
      <BaseComfirm
        v-model:dialog-show="comfirmShow"
        :title="$('post.warning.title')"
        :message="$('post.warning.delete')"
        @close="handleClose"
      >
        <template #footer>
          <div class="flex justify-end p-4">
            <BaseButton
              type="tertiary"
              label="$t:base.upload.cancel"
              data-cy="497484dc79e2d78b"
              @click="handleClose"
            />
            <BaseButton
              type="tertiary"
              class="ml-3 bg-[#190e0d]"
              data-cy="b6d7847bc85018c1"
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
import { _REACT_USERLIST_CACHE } from '~/constant/social';

export default {
  props: {
    item: Object,
  },
  setup() {
    const authStore = useAuthStore();
    const searchStore = useSearchStore();
    const socialStore = useSocialStore();
    const profileStore = useProfileStore();

    return {
      authStore,
      socialStore,
      searchStore,
      profileStore,
    };
  },
  data() {
    return {
      saveKey: false,
      followKey: false,
      saveLoading: false,
      followLoading: false,
      animation: false,
      deleteLoading: false,
      comfirmShow: false,
    };
  },
  computed: {
    user() {
      return this.item.owner;
    },
    isMine() {
      return this.profileStore.myProfileDetail.id === this.user.id;
    },
  },
  mounted() {
    this.followKey = this.item.isFollowing;
    setTimeout(() => {
      this.animation = true;
    }, 100);
  },
  methods: {
    async onSave() {
      this.saveLoading = true;
      await sleep(1000);
      this.saveLoading = false;
      this.saveKey = !this.saveKey;
    },
    async onFollow() {
      this.followLoading = true;
      const originFollowing = this.item.isFollowing;
      const targetFollowing = !originFollowing;
      await this.profileStore.follow(this.user).finally(() => {
        this.followLoading = false;
      });

      // Modify item data
      this.item.isFollowing = targetFollowing;
      this.followKey = targetFollowing;

      // Modify the data of _REACT_USERLIST_CACHE
      if (this.item[_REACT_USERLIST_CACHE]) {
        const cacheReactListIndex = this.item[_REACT_USERLIST_CACHE].findIndex(
          (user) => user.owner.id === this.user.id,
        );
        if (cacheReactListIndex !== -1) {
          this.item[_REACT_USERLIST_CACHE][cacheReactListIndex] &&
            (this.item[_REACT_USERLIST_CACHE][cacheReactListIndex].isFollowing =
              targetFollowing);
        }
      }

      this.socialStore.updatePostlistFollow({
        userId: this.user.id,
        status: targetFollowing,
        user: this.user,
      });
    },
    handleDeleteClick() {
      this.comfirmShow = true;
      this.socialStore.optionId = null;
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
        this.handleClose();
        this.$toast.success('Post deleted sucessfully');
      } finally {
        this.deleteLoading = false;
      }
    },
    async handleEditPost() {
      this.socialStore.optionId = null;

      const type = this.item.type === 'post' ? 'social' : 'question';
      this.searchStore.type = type;

      // Echo data
      this.socialStore.answer.title = this.item.title;
      this.socialStore.answer.body = this.item.content;
      if (this.item.files && this.item.files.length) {
        this.socialStore.answerFiles = this.item.files.map((file) => ({
          id: file.fileId,
          url: file.url,
          preview: file.url,
          file: {
            name: '',
            size: file.metadata.size,
          },
          isEdit: true,
          size: file.metadata.size,
          mimetype: file.metadata.mimetype,
          progress: 100,
        }));
      }
      this.socialStore.answerMention = this.item.mentions.map((mention) => ({
        id: mention.id,
        type: mention.type,
      }));
      this.socialStore.answerEditId = this.item.id;
      this.socialStore.answerEditType = this.item.type;

      if (type === 'question' && this.item.entity) {
        this.socialStore.categoryId = this.item.entity.id;
      }

      await sleep(400);
      this.searchStore.isFocus = true;
      await sleep(400);

      this.socialStore.answerCollapse = true;
      this.socialStore.answerReplying = true;
    },
    handleClose() {
      this.comfirmShow = false;
    },
  },
};
</script>

<style scoped>
.rotate-animation {
  animation: rotate 1s linear infinite;
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
