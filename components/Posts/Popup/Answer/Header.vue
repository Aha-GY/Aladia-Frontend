<template>
  <div class="mb-1 flex items-center justify-between gap-4 text-sm">
    <div class="flex items-center gap-2">
      <div
        class="inline-flex items-center gap-2 text-xs font-semibold text-[#D9D9D9] lg:text-sm"
      >
        <span
          class="line-clamp-1 cursor-pointer underline-offset-2 transition-all hover:underline"
          data-cy="2d946b123e5ac8f0"
          @click="onUserClick"
        >
          {{ item.owner.name || 'Aladia User' }}
        </span>
      </div>

      <div class="whitespace-nowrap text-[8px] text-[#707070] xl:text-xs">
        {{ timeAgo2(item.createdAt) }}
      </div>
      <div
        v-if="isBestAnswer"
        class="inline-flex items-center gap-1 rounded-[0.3125rem] bg-[#022C22] px-1 text-[0.75rem] leading-5 text-[#86EFAC]"
      >
        {{ $t('post.answer.best') }}
      </div>
    </div>

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
    >
      <template #reference>
        <div
          :data-cy="`${dataCy}-options-menu`"
          class="group relative z-10 ml-3 flex h-6 w-6 cursor-pointer items-center justify-center rounded-[0.3125rem] transition-all hover:bg-white/5 active:scale-95"
        >
          <i class="fa-light fa-ellipsis z-10" />
        </div>
      </template>
      <div class="popupborder bg-[#060606] p-[0.375rem]">
        <ul class="leading-5">
          <BaseMenuItem
            v-if="isMinePost && !isBestAnswer && isQuestionType"
            :icon-class="
              bestAnswerLoading
                ? 'fa-solid fa-spinner animate-spin text-xs'
                : 'fa-light fa-square-check'
            "
            data-cy="6b55de11fba655f8"
            @click="onMakeBestAnswer"
          >
            {{ $t('post.answer.mark') }}
          </BaseMenuItem>

          <BaseMenuItem
            v-if="isMinePost && isBestAnswer && isQuestionType"
            :icon-class="
              bestAnswerLoading
                ? 'fa-solid fa-spinner animate-spin text-xs'
                : 'fa-light fa-square-xmark'
            "
            data-cy="6bfafcb2c291cae9"
            @click="onUnmakeBestAnswer"
          >
            {{ $t('post.answer.unMark') }}
          </BaseMenuItem>

          <BaseMenuItem
            v-if="isMineComment"
            icon-class="fa-regular fa-edit"
            :data-cy="`${dataCy}-edit-menu`"
            @click="handleEditComment"
          >
            {{ $t('post.comment.edit') }}
          </BaseMenuItem>

          <BaseMenuItem
            v-if="isMineComment && !(item.numberOf && item.numberOf.replies)"
            icon-class="fa-regular fa-trash"
            :data-cy="`${dataCy}-delete-menu`"
            @click="handleDeleteComment"
          >
            {{ $t('post.comment.delete') }}
          </BaseMenuItem>

          <BaseMenuItem
            v-if="!isMineComment"
            icon-class="fa-regular fa-message"
            data-cy="d9f8d3bef238f428"
            @click="handleChat"
          >
            Send a Message
          </BaseMenuItem>
          <BaseMenuItem
            v-if="!isMineComment"
            :icon-class="
              isFollowing
                ? 'fa-regular fa-user-minus'
                : 'fa-regular fa-user-plus'
            "
            data-cy="20ffe610a90a4a7a"
            @click="handleFollow"
          >
            {{ isFollowing ? 'Remove' : 'Add' }} Follower
          </BaseMenuItem>

          <BaseMenuItem
            icon-class="fa-regular fa-flag"
            @click="alert('/* FIXME: action missing */')"
          >
            {{ $t('post.comment.report') }}
          </BaseMenuItem>
        </ul>
      </div>
    </el-popover>

    <template v-if="comfirmShow">
      <BaseComfirm
        v-model:dialog-show="comfirmShow"
        :title="$t('post.warning.title')"
        :message="$t('post.comment.dialog')"
        @close="comfirmShow = false"
      >
        <template #footer>
          <div class="flex justify-end p-4">
            <BaseButton
              type="tertiary"
              label="$t:base.upload.cancel"
              data-cy="e3d6c287638311d0"
              @click="comfirmShow = false"
            />
            <BaseButton
              type="tertiary"
              class="ml-3 bg-[#190e0d]"
              :data-cy="`${dataCy}-options-confirm-delete`"
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
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
    level: Number,
    dataCy: {
      type: String,
      default: 'default-comment',
    },
  },
  setup() {
    const authStore = useAuthStore();
    const socialStore = useSocialStore();
    return { socialStore, authStore };
  },
  data() {
    return {
      bestAnswerLoading: false,
      deleteLoading: false,
      comfirmShow: false,
      popoverVisible: false,
    };
  },
  computed: {
    user() {
      return this.authStore.context;
    },
    postItem() {
      return this.socialStore.postItem;
    },
    isBestAnswer() {
      return this.postItem?.answerId === this.item.id;
    },
    isOwner() {
      return this.item?.owner?.id === this.postItem?.owner?.id;
    },
    isMineComment() {
      return this.user === this.item.owner?.id;
    },
    isMinePost() {
      return this.user === this.postItem?.owner?.id;
    },
    isQuestionType() {
      return this.item.entity?.type === 'question';
    },
    isFollowing() {
      return this.item.isFollowing;
    },
  },
  methods: {
    onUserClick() {
      this.$emit('onUserClick');
    },
    async onMakeBestAnswer() {
      if (this.bestAnswerLoading) {
        return;
      }
      if (!this.isMinePost) {
        return;
      }
      /*
       *  NOT ANSWERED -> Trigger: Question posted
       *  ANSWERED -> Trigger: a comment in the question
       *  SOLVED -> Trigger: owner put a comment as the "best Answer"
       */
      try {
        this.bestAnswerLoading = true;
        await this.socialStore.solveAnswer({
          id: this.postItem.id,
          answerId: this.item.id,
        });
        this.bestAnswerLoading = false;
        this.popoverVisible = false;

        await this.$nextTick();
        this.postItem.status = 'solved';
        this.postItem.answerId = this.item.id;
      } catch (error) {
        this.bestAnswerLoading = false;
      }
    },
    async onUnmakeBestAnswer() {
      if (this.bestAnswerLoading) {
        return;
      }
      if (!this.isMinePost) {
        return;
      }
      /*
       *  NOT ANSWERED -> Trigger: Question posted
       *  ANSWERED -> Trigger: a comment in the question
       *  SOLVED -> Trigger: owner put a comment as the "best Answer"
       */
      try {
        this.bestAnswerLoading = true;
        await this.socialStore.solveAnswer({
          id: this.postItem.id,
          answerId: this.item.id,
        });
        this.bestAnswerLoading = false;
        this.popoverVisible = false;

        await this.$nextTick();
        this.postItem.status = 'answered';
        this.postItem.answerId = null;
      } catch (error) {
        this.bestAnswerLoading = false;
      }
    },
    handleDeleteComment() {
      this.comfirmShow = true;
      this.popoverVisible = false;
    },
    async handleComfirmDeleteComment() {
      if (this.deleteLoading) {
        return;
      }
      try {
        this.deleteLoading = true;
        await this.socialStore.deleteComment({
          commentId: this.item.id,
        });

        const { parentId, id } = this.item;

        this.$emit('delete', {
          commentId: id,
          parentId,
          subReplies: Math.max(0, this.item?.replies?.length || 0),
        });
        this.comfirmShow = false;
        await this.$nextTick();

        if (this.socialStore.commentsData.length === 0) {
          this.postItem.status = 'not-answered';
          this.postItem.answerId = null;
        } else if (this.isBestAnswer) {
          this.postItem.status = 'answered';
          this.postItem.answerId = null;
        }
      } finally {
        this.deleteLoading = false;
      }
    },
    handleEditComment() {
      this.$emit('edit', this.item);
      this.popoverVisible = false;
    },
    handleChat() {
      this.$emit('chat', {
        item: {
          ...this.item.owner,
        },
      });
    },
    async handleFollow() {
      this.$emit('follow', this.item);
    },
  },
};
</script>
<style scoped>
.line-clamp-1 {
  /*
    Tailwind's default `line-clamp-1` doesn't handle unbreakable text properly, 
    so we added `word-break: break-word` and `overflow-wrap: break-word` to 
    ensure proper text wrapping and truncation.
  */

  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word; /* Forces breaking of long words */
  overflow-wrap: break-word; /* Ensures wrapping works across browsers */
}
</style>
