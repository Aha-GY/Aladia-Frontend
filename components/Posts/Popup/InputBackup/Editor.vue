<template>
  <div
    id="reply-social"
    ref="reply"
    class="hide-scrollbar relative z-10 overflow-auto pr-8 transition-all duration-300"
    :class="{
      'mb-0 max-h-[2.5rem] min-h-[2.5rem] translate-y-0 pt-0.5':
        socialStore.answerReplying && collapse,
      'mb-0 max-h-48 min-h-[2.5rem] translate-y-0 pt-0.5':
        socialStore.answerReplying && !collapse,
      'pointer-events-none -mb-5 max-h-[2.5rem] translate-y-2 pt-0':
        !socialStore.answerReplying,
    }"
  >
    <LazyBaseEditor
      ref="editor"
      v-model="message"
      :options="{
        placeholder: $t('post.message.placeholder'),
      }"
      :auto-clear="true"
      :send-whitespace="false"
      :get-tag-list="getTagList"
      :uniform-bg="true"
      @change="onChange"
      @send="onSend"
    />
  </div>
</template>

<script>
export default {
  setup() {
    const socialStore = useSocialStore();
    const globalStore = useGlobalStore();
    return { globalStore, socialStore };
  },
  data() {
    return {
      editor: null,
      message: '',
    };
  },
  computed: {
    // question() {
    //   return this.courseStore.qaPopup;
    // },
    // answerTo() {
    //   return this.courseStore.answerTo;
    // },
    collapse() {
      return this.socialStore.answerCollapse;
    },
  },
  watch: {
    async 'socialStore.answerFiles.length'(length) {
      if (length) {
        await sleep(200);
        this.socialStore.answerReplying = true;
        this.socialStore.answerCollapse = false;
        this.$refs.reply.scrollTo({
          top: this.$refs.reply.scrollHeight,
          behavior: 'smooth',
        });
      }
    },
    'socialStore.answerReplying'(state) {
      if (state) {
        window['answer-quill']?.focus?.();
      } else {
        this.editor?.setHTML?.('');
      }
    },
    'socialStore.answerSending'(state) {
      if (!state) {
        this.editor?.setHTML?.('');
      }
    },
    'socialStore.answer.body'(val) {
      if (!val || val === '<p><br></p>') {
        this.editor?.setHTML?.('');
        this.socialStore.answer.body = '';
      }
    },
  },
  methods: {
    onFocus() {
      this.socialStore.answerCollapse = false;
    },
    async getTagList(searchTerm) {
      const { data } = await this.globalStore.searchProfile({
        limit: 50,
        text: searchTerm || undefined,
      });
      return data;
    },
    onChange() {},
    async onSend(content, files, taggedUsers, text, loomFiles) {
      console.log(
        'content, files, taggedUsers, text, loomFiles',
        content,
        files,
        taggedUsers,
        text,
        loomFiles,
      );
    },
  },
};
</script>
