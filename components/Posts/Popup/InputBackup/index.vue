<template>
  <div
    ref="input"
    class="mb-0.5 flex w-full items-start gap-2 bg-black p-1.5"
    :class="logged ? '' : 'pointer-events-none'"
  >
    <PostsPopupInputInfo />
    <!-- <PostsPopupInputTags />
    <PostsPopupInputEmoji /> -->
    <div
      class="relative min-h-[2.2rem] flex-1 rounded bg-black py-1.5 pl-2 pr-1"
    >
      <PostsPopupInputEditor ref="editor" @on-enter="handleEditorEnter" />
      <!-- <PostsPopupInputReset /> -->
      <PostsPopupInputTop />
      <!-- <PostsPopupInputLine /> -->
      <!-- <PostsPopupInputBorder /> -->
      <div
        class="relative z-0 flex cursor-pointer items-center justify-end text-13"
        data-cy="848e5721c3ae2993"
        @click="socialStore.answerReplying = true"
      >
        <PostsPopupInputToolbar />
        <PostsPopupInputSend ref="send" @on-tag-click="handleTagClick" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const input = ref(null);
    const socialStore = useSocialStore();
    const authStore = useAuthStore();
    onClickOutside(
      input,
      async () => {
        if (socialStore.answerReplying) {
          const body = socialStore.answer.body.trim();
          const files = socialStore.answerFiles;
          if ((body === '' || body === '<p><br></p>') && files.length === 0) {
            socialStore.answerReset();
          } else {
            if (input.value.clientHeight > 100) {
              socialStore.answerCollapse = true;
            }
          }
        }
      },
      {
        ignore: ['.answer-mention'],
      },
    );
    return { input, socialStore, authStore };
  },
  computed: {
    postItem() {
      return this.socialStore.postItem;
    },
    logged() {
      return this.authStore.logged;
    },
  },
  mounted() {
    this.socialStore.answerTo = this.postItem;
    document.addEventListener('paste', this.onPaste);
  },
  beforeUnmount() {
    this.socialStore.answerReset();
    document.removeEventListener('paste', this.onPaste);
  },
  methods: {
    onPaste(event) {
      if (this.socialStore.answerReplying) {
        const file = event.clipboardData.files[0];
        this.socialStore.onAnswerFileUpload(file);
      }
    },
    async handleTagClick() {
      this.socialStore.answerReplying = true;
      await this.$nextTick();
      this.$refs.editor?.addTag();
    },
    handleEditorEnter() {
      this.$refs.send?.onSend();
    },
  },
};
</script>
