<template>
  <div class="flex items-center gap-4">
    <div
      class="group flex h-7 w-7 cursor-pointer items-center justify-center rounded border transition-all active:scale-95"
      :class="
        socialStore.answerShowTags
          ? 'border-[#F1F1F1]'
          : 'border-transparent hover:border-[#565656]'
      "
      data-cy="13282bcf9835f4e3"
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
      data-cy="ace88adf81217241"
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
        data-cy="50bd11b026ae2e42"
        @change="socialStore.onAnswerFileChange"
      />
    </div>
    <div
      class="group flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-white/10 bg-white/5 transition-all hover:border-white/20 hover:bg-white/10 active:scale-95"
      data-cy="401b1b202e468aea"
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
        return this.$toast.error(this.$t('post.error.empty'));
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
          this.socialStore.postItem.numberOf.comments += 1;
          this.socialStore.postItem.numberOfUsers += 1;
          this.socialStore.getComments();
        } else {
          this.socialStore.answerToId = this.answerTo.id;
        }
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
