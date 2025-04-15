<template>
  <div class="flex items-center gap-4">
    <div
      class="group flex h-7 w-7 cursor-pointer items-center justify-center rounded border transition-all active:scale-95"
      :class="
        socialStore.answerShowTags
          ? 'border-[#F1F1F1]'
          : 'border-transparent hover:border-[#565656]'
      "
      data-cy="e5b2c56c46f8ab06"
      @click="onTagsClick"
    >
      <span
        class="text-base transition-all"
        :class="
          socialStore.answerShowTags
            ? 'opacity-100'
            : 'opacity-50 group-hover:opacity-100'
        "
      >
        <i class="fa-solid fa-at" />
      </span>
    </div>
    <div
      class="group flex h-7 w-7 cursor-pointer items-center justify-center rounded border transition-all active:scale-95"
      :class="
        socialStore.answerShowEmoji
          ? 'border-[#F1F1F1]'
          : 'border-transparent hover:border-[#565656]'
      "
      data-cy="e17b17c5406acbba"
      @click="onEmojiClick"
    >
      <img
        src="~/assets/icons/reply-emoji.svg"
        class="text-base transition-all"
        :class="
          socialStore.answerShowEmoji
            ? 'opacity-100'
            : 'opacity-50 group-hover:opacity-100'
        "
      />
    </div>
    <div
      v-if="socialStore.questionPopup"
      class="group relative flex h-7 w-7 cursor-pointer items-center justify-center rounded border border-transparent transition-all hover:border-[#565656]"
    >
      <img
        src="~/assets/icons/reply-attachment.svg"
        class="h-[0.9rem] opacity-50 transition-all group-hover:opacity-100"
      />
      <input
        type="file"
        class="absolute inset-0 opacity-0"
        data-cy="614ea619b89c9300"
        @change="socialStore.onAnswerFileChange"
      />
    </div>
    <div
      class="group flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-white/10 bg-white/5 transition-all hover:border-white/20 hover:bg-white/10 active:scale-95"
      data-cy="3ae95942efb8bba8"
      @click="onSend"
    >
      <i
        v-if="socialStore.answerSending"
        class="fa-solid fa-spinner text-l animate-spin"
      />
      <img
        v-else
        id="social-comment-input-send-btn"
        src="~/assets/icons/reply-send.svg"
        class="h-4 opacity-50 transition-all group-hover:opacity-100"
      />
    </div>
  </div>
</template>

<script>
import {
  _QUESTION_STATUS_NOTANSWER,
  _QUESTION_STATUS_ANSWERED,
} from '~/constant/social.js';

export default {
  setup() {
    const socialStore = useSocialStore();
    return { socialStore };
  },
  computed: {
    postItem() {
      return this.socialStore.postItem;
    },
    answerTo() {
      return this.socialStore.answerTo;
    },
  },
  methods: {
    async onEmojiClick() {
      this.socialStore.answerShowEmoji = !this.socialStore.answerShowEmoji;
      await this.$nextTick();
      if (this.socialStore.answerShowEmoji) {
        this.socialStore.answerReplying = true;
      }
    },
    async onTagsClick() {
      this.$emit('onTagClick');
    },
    async onSend() {
      if (this.socialStore.answerSending) {
        return;
      }
      const body = this.socialStore.answer.body.trim();

      const bodyContent = body
        .replace(/<p><br><\/p>/g, '')
        .replace(/&nbsp;/g, '')
        .replace(/<[^>]*>/g, '')
        .trim();

      if (bodyContent === '') {
        return this.$toast.error('Please enter content');
      }

      try {
        this.socialStore.answerSending = true;
        this.socialStore.tempData = {
          skeleton: true,
        };
        const params = {
          content: this.socialStore.answer.body,
          entity: {
            id: this.postItem.id,
            type: this.postItem.type,
          },
          parentId: this.answerTo?.id,
          mentions: this.socialStore.answerMention.map((item) => ({
            id: item,
            type: 'profile', // only profile type now
          })),
          files: this.socialStore.answerFiles
            .filter((item) => !!item.id)
            .map((item) => ({
              fileId: item.id,
              metadata: {
                size: item.size,
                mimetype: item.mimetype,
              },
            })),
        };
        if (this.answerTo?.id === this.postItem.id) {
          this.socialStore.commentsData.unshift(this.socialStore.tempData);
          // If you are replying to a root comment, you do not need to pass parentId
          delete params.parentId;
        }
        await this.socialStore.createComments(params);

        if (this.answerTo?.id === this.postItem.id) {
          await this.socialStore.getComments();
        } else {
          this.socialStore.answerToId = this.answerTo.id;
        }
        if (
          this.postItem.type === 'question' &&
          this.postItem.numberOf.comments === 0 &&
          this.postItem.status === _QUESTION_STATUS_NOTANSWER
        ) {
          this.socialStore.postItem.status = _QUESTION_STATUS_ANSWERED;
        }
        this.socialStore.postItem.numberOf.comments += 1;
        // this.postItem.numberOfUsers += 1;
        this.socialStore.answerReset();
        this.socialStore.answerSending = false;
      } catch (error) {
        this.socialStore.answerSending = false;
        this.globalStore.editorLoading = false;
      }
    },
  },
};
</script>
