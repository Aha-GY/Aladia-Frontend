<template>
  <div
    ref="input"
    class="mb-0.5 flex w-full items-end gap-[0.375rem] px-4 py-3"
    :class="[logged ? '' : 'pointer-events-none']"
  >
    <SocialCommentInputInfo />
    <div class="relative flex-1 bg-black">
      <SocialCommentInputEditor ref="editor" :type="type" />
      <SocialCommentInputTop v-if="isCommentSelected" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  setup() {
    const input = ref(null);
    const editor = ref(null);
    const socialStore = useSocialStore();
    const authStore = useAuthStore();
    onClickOutside(
      input,
      async () => {
        if (socialStore.answerReplying) {
          const currContent = editor.value?.getEditorContent?.();
          if (
            currContent.text.trim() === '' &&
            currContent.files.length === 0 &&
            currContent.loomFiles.length === 0
          ) {
            socialStore.answerReset();
          }
        }
      },
      {
        ignore: ['.self'],
      },
    );
    return { input, socialStore, editor, authStore };
  },
  computed: {
    postItem() {
      return this.socialStore.postItem;
    },
    logged() {
      return this.authStore.logged;
    },
    isCommentSelected() {
      if (this.type === 'reel') {
        return !!this.socialStore.answerTo && this.answerTo?.type !== 'reel';
      }
      return this.socialStore.answerTo;
    },
  },
  mounted() {
    this.socialStore.answerTo = this.postItem;
  },
  beforeUnmount() {
    this.socialStore.answerReset();
    this.socialStore.git = '';
  },
};
</script>
