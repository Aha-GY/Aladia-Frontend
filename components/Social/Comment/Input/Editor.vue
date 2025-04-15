<template>
  <div ref="reply">
    <LazyBaseEditor
      ref="editor"
      v-model="message"
      :options="{
        placeholder: $t('flux.comment.add'),
        moreThanOneLine: true,
        characters: 29,
        showStoryMedia: true,
      }"
      type="area"
      :auto-clear="false"
      :send-whitespace="false"
      :get-tag-list="getTagList"
      :uniform-bg="true"
      :is-popup-bg="true"
      :init-files="initFiles"
      :init-loom-files="initLoomFiles"
      :show-mic="false"
      :show-gif="true"
      :show-file="false"
      :with-max-height="true"
      max-area-height="10rem"
      limit-character
      :characters-limit="8000"
      name="answer-quill"
      :tool-tip-content="tooltipContent"
      :hide-gif-picker="hasAttachments"
      :with-action-tool-tip="true"
      :auto-send-gif="true"
      @focus="onFocus"
      @change="onChange"
      @send="onSend"
      @send-gif="socialStore.setGif"
      @upload="onUpload"
      @loom="onLoom"
      @remove-loom="onRemoveLoom"
      @remove-file="onRemoveFile"
    />
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
    const editor = ref(null);
    const socialStore = useSocialStore();
    const globalStore = useGlobalStore();
    return { globalStore, socialStore, editor };
  },
  data() {
    return {
      message: '',
      initFiles: [],
      initLoomFiles: [],
      tooltipContent: 'This can’t combine with your current input',
      hasFiles: false,
      hasLoomFiles: false,
    };
  },
  computed: {
    postItem() {
      return this.socialStore.postItem;
    },
    answerTo() {
      return this.socialStore.answerTo;
    },
    hasAttachments() {
      return this.hasFiles || this.hasLoomFiles;
    },
  },
  watch: {
    'socialStore.answerReplying'(state) {
      if (state) {
        this.$refs['editor']?.quill?.focus?.();
      }
    },
    'socialStore.commentEditData.commentId'(val) {
      if (val) {
        this.message = this.socialStore.commentEditData.comment.content;
        this.initFiles = this.socialStore.commentEditData.comment.files.map(
          (item) => ({
            name: item.metadata.name,
            url: item.url,
            type: item.metadata.mimetype,
            size: item.metadata.size,
            fileId: item.fileId,
          }),
        );
        this.initLoomFiles = this.socialStore.commentEditData.comment.loomUrls;
        this.socialStore.gif =
          this.socialStore.commentEditData.comment.gif || '';
      } else {
        this.message = '';
        this.initFiles = [];
        this.initLoomFiles = [];
      }
    },
  },
  methods: {
    onFocus() {
      this.socialStore.answerReplying = true;
    },
    async getTagList(searchTerm) {
      const { data } = await this.globalStore.searchProfile({
        limit: 50,
        text: searchTerm || undefined,
      });
      return (data || []).map((item) => ({
        ...item,
        image: item.picture || item.cover,
      }));
    },
    onChange() {},
    onSend(content, files, taggedUsers, text, loomFiles) {
      if (this.socialStore.commentEditData.commentId) {
        this.handleEdit(content, files, taggedUsers, text, loomFiles);
        return;
      }

      this.handleCreate(content, files, taggedUsers, text, loomFiles);
    },
    async handleCreate(content, files, taggedUsers, text, loomFiles) {
      if (this.socialStore.answerSending) {
        return;
      }

      try {
        this.socialStore.answerSending = true;

        this.socialStore.tempData = {
          skeleton: true,
        };

        const params = {
          content,
          entity: {
            id: this.postItem.id,
            type: this.type,
          },
          parentId: this.answerTo?.id,
          mentions: taggedUsers.map((item) => ({
            id: item,
            type: 'profile',
          })),
          gif: this.socialStore.gif || undefined, // Add GIF
        };

        if (files && files.length) {
          const RemainingFiles = files.filter(
            (r) =>
              /\.(jpg|jpeg|png|gif)$/i.test(r.name) ||
              /\.(mp4|avi|mov|wmv)$/i.test(r.name),
          );

          if (RemainingFiles.length < files.length) {
            this.$toast.error(this.$t('base.upload.error'));
            this.$refs.editor.clearLoading();
            return;
          }

          if (RemainingFiles.length) {
            params.files = [];
          }

          for (let i = 0; i < RemainingFiles.length; i++) {
            const { fileId } = await upload({ file: RemainingFiles[i] });
            params.files.push({
              fileId,
              metadata: {
                mimetype: RemainingFiles[i].type,
                size: RemainingFiles[i].size,
                name: RemainingFiles[i].name,
              },
            });
          }
        }

        if (loomFiles && loomFiles.length) {
          params.loomUrls = loomFiles.map(
            (item) => item.embedUrl || item.sharedUrl,
          );
        }

        if (this.answerTo?.id === this.postItem.id) {
          this.socialStore.commentsData.unshift(this.socialStore.tempData);
          delete params.parentId; // Root comment doesn't need parentId
        }

        await this.socialStore.createComments(params);

        if (this.answerTo?.id === this.postItem.id) {
          await this.socialStore.getComments();
        } else {
          this.socialStore.answerToId = this.answerTo.id;
        }

        this.socialStore.postItem.numberOf.comments += 1;
        this.socialStore.answerSending = false;

        this.$refs.editor.clear();
        this.socialStore.gif = '';

        this.$emit('send');
      } catch (error) {
        this.socialStore.answerSending = false;
        this.globalStore.editorLoading = false;
      }
    },
    async handleEdit(content, files, taggedUsers, text, loomFiles) {
      if (this.socialStore.answerSending) {
        return;
      }

      try {
        this.socialStore.answerSending = true;

        const params = {
          content,
          mentions: taggedUsers.map((item) => ({
            id: item,
            type: 'profile',
          })),
          gif: this.socialStore.gif || null,
          files: [],
        };

        if (files && files.length) {
          const RemainingFiles = files.filter(
            (r) =>
              /\.(jpg|jpeg|png|gif)$/i.test(r.name) ||
              /\.(mp4|avi|mov|wmv)$/i.test(r.name),
          );

          if (RemainingFiles.length < files.length) {
            this.$toast.error(this.$t('base.upload.error'));
            this.$refs.editor.clearLoading();
            return;
          }

          for (let i = 0; i < RemainingFiles.length; i++) {
            if (RemainingFiles[i].fileId) {
              params.files.push({
                fileId: RemainingFiles[i].fileId,
                metadata: {
                  mimetype: RemainingFiles[i].type,
                  size: RemainingFiles[i].size,
                  name: RemainingFiles[i].name,
                },
              });
              continue;
            }

            const { fileId } = await upload({ file: RemainingFiles[i] });
            params.files.push({
              fileId,
              metadata: {
                mimetype: RemainingFiles[i].type,
                size: RemainingFiles[i].size,
                name: RemainingFiles[i].name,
              },
            });
          }
        }

        if (loomFiles && loomFiles.length) {
          params.loomUrls = loomFiles.map(
            (item) => item.embedUrl || item.sharedUrl || item,
          );
        }

        await this.socialStore.updateComment({
          commentId: this.socialStore.commentEditData.commentId,
          ...params,
        });

        this.socialStore.answerSending = false;

        this.$emit('edit');
        this.socialStore.resetEditComment();
        this.$refs.editor.clear();
        this.socialStore.gif = '';
      } catch (error) {
        this.socialStore.answerSending = false;
        this.globalStore.editorLoading = false;
      }
    },
    resetEditor() {
      this.$refs.editor.clear();
    },
    getEditorContent() {
      if (!this.$refs.editor) {
        return;
      }
      const editor = this.$refs.editor;
      const text = editor.quill.getText()?.replace(/\s$/g, '');

      return {
        text,
        content: editor.content,
        files: editor.files,
        taggedUsers: editor.taggedUsers,
        loomFiles: editor.loomFiles,
      };
    },
    onSendGif(gif) {
      this.socialStore.gif = gif;
    },
    onUpload() {
      this.hasFiles = true;
    },
    onLoom() {
      this.hasLoomFiles = true;
    },
    onRemoveLoom() {
      this.hasLoomFiles = false;
    },
    onRemoveFile() {
      this.hasFiles = false;
    },
  },
};
</script>
<style scoped>
:deep(.__editor-popup) {
  left: -50px !important;
}

@media screen and (min-width: 1200px) and (max-width: 1280px) {
  :deep(.__editor-popup) {
    left: -75px !important;
  }
}
</style>
