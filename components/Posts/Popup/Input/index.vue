<template>
  <div
    ref="input"
    class="__post-popup-input mb-4 flex w-full items-end gap-2 px-4 py-3"
    :class="[logged ? '' : 'pointer-events-none']"
  >
    <PostsPopupInputInfo />
    <div class="relative flex-1">
      <PostsPopupInputEditor ref="editor" data-cy="post-popup-comment" />
      <PostsPopupInputTop />
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const input = ref(null);
    const editor = ref(null);
    const socialStore = useSocialStore();
    const authStore = useAuthStore();

    onClickOutside(input, async () => {
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
    });
    return { input, socialStore, editor, authStore };
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
  },
  unmounted() {
    this.socialStore.gif = '';
  },
  // beforeUnmount() {
  //   this.socialStore.answerReset();
  // },
};
</script>
