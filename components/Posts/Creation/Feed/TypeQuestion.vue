<!--
注意：以下文件的行为类似：
- TypePost.vue
- TypeQuestion.vue

在修改其中一个文件时，请检查是否需要同步修改其他类似文件。
-->

<template>
  <div class="relative flex flex-col gap-4">
    <div class="flex gap-3">
      <BaseAvatarSwitch
        :right-offset="'0px'"
        :show-drop-down="isFeedPage"
        :bottom-offset="'0px'"
      />
      <div class="flex w-full flex-col overflow-hidden">
        <div class="truncate text-sm font-medium text-[#D9D9D9]">
          {{ profileStore.myProfileDetail.fullName }}
        </div>
        <div
          class="flex justify-between pt-1"
          :class="$device.isMobile ? 'flex-col' : 'items-center'"
        >
          <div class="flex items-center">
            <PostsItemWidgetsQuestionStatus status="not-answered" class="h-7" />
            <span class="px-2 text-sm text-[#B0B0B0]">•</span>
            <PostsCreationVisibility
              :active="visibility"
              @select="handleSelectVisible"
            />
          </div>
          <div
            class="flex items-center gap-2 leading-4"
            :class="$device.isMobile ? 'mt-4 justify-end' : 'items-center'"
          >
            <div
              class="flex cursor-pointer items-center gap-2 rounded-[0.3125rem] bg-[#E2E2E2]/[0.03] p-[0.375rem] text-[#FAFAFA] transition-all duration-300 hover:bg-[#E2E2E2]/[0.1]"
              data-cy="1a314ab8db0fc552"
              @click="showCategory = true"
            >
              <span class="flex h-4 w-4 items-center justify-center">
                <img
                  v-if="socialStore.categoryImg"
                  class="h-full w-full rounded-[0.3125rem] object-cover"
                  :src="socialStore.categoryImg"
                />
                <i v-else class="fa-regular fa-grid" />
              </span>
              <span>{{ socialStore.category }}</span>
            </div>
            <span
              class="cursor-pointer px-2 transition-all duration-300 hover:rotate-180 hover:bg-[#E2E2E2]/[0.03]"
              data-cy="3a93b9b8f52a14ff"
              @click="showCategory = true"
            >
              <i class="fa-solid fa-arrows-rotate" />
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="relative min-h-[23.875rem] w-full p-2">
      <BaseEditor
        ref="editor"
        v-model="message"
        type="area"
        :options="{
          placeholder: $t('post.placeholder'),
          showMedia: true,
        }"
        :auto-clear="false"
        :get-tag-list="getTagList"
        :uniform-bg="true"
        :init-files="initFiles"
        :init-loom-files="initLoomFiles"
        :show-gif="true"
        :tool-tip-content="$t('post.update.tooltip')"
        :hide-gif-picker="hasAttachments"
        :with-action-tool-tip="true"
        :auto-send-gif="true"
        :enter-to-save="false"
        limit-character
        :characters-limit="63200"
        @change="onChange"
        @send="onSend"
        @send-gif="socialStore.setGif"
        @upload="onUpload"
        @loom="onLoom"
        @remove-loom="onRemoveLoom"
        @remove-file="onRemoveFile"
      />
    </div>
    <Transition name="slide-fade-in" mode="out-in">
      <PostsCreationCategorySelect
        v-if="showCategory"
        :active="socialStore.categoryId"
        @back="showCategory = false"
        @select="onSelectCategories"
      />
    </Transition>
  </div>
</template>

<script>
export default {
  setup() {
    const socialStore = useSocialStore();
    const authStore = useAuthStore();
    const profileStore = useProfileStore();
    const globalStore = useGlobalStore();
    return { socialStore, authStore, profileStore, globalStore };
  },
  data() {
    return {
      message: '',
      visibility: 'public',
      showCategory: false,
      initFiles: [],
      initLoomFiles: [],
      hasFiles: false,
      hasLoomFiles: false,
    };
  },
  computed: {
    isFeedPage() {
      return (
        this.$route.name.includes('feed') || this.$route.name.includes('qa')
      );
    },
    hasAttachments() {
      return this.hasFiles || this.hasLoomFiles;
    },
  },
  watch: {
    'socialStore.answerReplying': {
      handler(state) {
        if (state) {
          this.$refs['editor']?.quill?.focus?.();
        }
      },
      immediate: true,
      deep: true,
    },
    'socialStore.editPostData.id': {
      handler(val) {
        if (val) {
          this.message = this.socialStore.editPostData.content;
          this.visibility = this.socialStore.editPostData.visibility;
          this.initFiles = this.socialStore.editPostData.files.map((item) => ({
            name: item.file.name,
            url: item.url,
            type: item.mimetype,
            size: item.size,
            fileId: item.id,
          }));
          this.initLoomFiles = this.socialStore.editPostData.loomFiles;
        }
      },
      immediate: true,
      deep: true,
    },
  },
  unmounted() {
    this.socialStore.resetPostEditData();
    this.socialStore.resetCatefories();
  },
  methods: {
    handleSelectVisible(menu) {
      this.visibility = menu;
    },
    async getTagList(searchTerm) {
      const api = {
        global: this.globalStore.searchProfile,
      }['global'];

      const { data } = await api({
        limit: 50,
        text: searchTerm || undefined,
      });
      return (data || []).map((item) => ({
        ...item,
        image: item.picture || item.cover,
      }));
    },
    onSelectCategories(item) {
      if (!item) {
        return;
      }

      this.socialStore.category = item.name;
      this.socialStore.categoryId = item.id;
      this.socialStore.categoryImg = item.image?.url;
      this.showCategory = false;
    },
    onChange() {},
    async onSend(content, files, taggedUsers, text, loomFiles) {
      if (!content.trim()) {
        this.$toast.error(this.$t('post.error.empty'));
        this.$refs.editor.clearLoading();
        return;
      }

      const id = this.socialStore.addPostProgress();

      try {
        const timeout = setTimeout(() => {
          this.socialStore.creatorVisible = false;
          this.socialStore.updatePostProgress(id, { show: true });
        }, 3000);

        const params = {
          title: '',
          content,
          type: 'question',
          visibility: this.visibility,
          mentions: taggedUsers.map((item) => ({
            id: item,
            type: 'profile', // only profile type now
          })),
          text,
          files: [],
        };
        if (this.socialStore.gif) {
          params.gif = this.socialStore.gif;
        }
        const totalFilesToUpload = files.filter((item) => !item.fileId).length;
        const fileProgress = Array.from({ length: files.length }, () => 0);
        for (let i = 0; i < files.length; i++) {
          if (files[i].fileId) {
            params.files.push({
              fileId: files[i].fileId,
              metadata: {
                mimetype: files[i].type,
                size: files[i].size,
                name: files[i].name,
              },
            });
            continue;
          }

          if (
            /\.(jpg|jpeg|png|gif)$/i.test(files[i].name) &&
            files[i].size > 25 * 1024 * 1024
          ) {
            this.$toast.error('photo maximum allowed size is 25MB');
            this.$refs.posteditor.clearLoading();
            clearTimeout(timeout);
            return;
          }

          if (
            /\.(mp4|mov|avi|flv|wmv|3gp|mkv|webm)$/i.test(files[i].name) &&
            files[i].size > 1.7 * 1024 * 1024 * 1024
          ) {
            this.$toast.error('video maximum allowed size is 1.7GB');
            this.$refs.posteditor.clearLoading();
            clearTimeout(timeout);
            return;
          }
          if (files[i].size > 100 * 1024 * 1024) {
            this.$toast.error('video maximum allowed size is 100MB');
            this.$refs.posteditor.clearLoading();
            clearTimeout(timeout);
            return;
          }
          const { fileId } = await upload({
            file: files[i],
            onProgress: (progress) => {
              fileProgress[i] = progress;
              const p = Math.round(
                fileProgress.reduce((a, b) => a + b, 0) / totalFilesToUpload,
              );
              this.socialStore.updatePostProgress(id, { progress: p });
            },
          });
          params.files.push({
            fileId,
            metadata: {
              mimetype: files[i].type,
              size: files[i].size,
              name: files[i].name,
            },
          });
        }

        if (loomFiles && loomFiles.length) {
          params.loomUrls = loomFiles.map(
            (item) => item.embedUrl || item.sharedUrl,
          );
        }

        if (this.socialStore.categoryId) {
          params.entity = {
            id: this.socialStore.categoryId,
            type: 'category',
          };
        }

        let newPost;
        if (this.socialStore.editPostData.id) {
          params.type = undefined;
          newPost = await this.socialStore.updatePost({
            postId: this.socialStore.editPostData.id,
            ...params,
          });
          // console.log('edit question', newPost);
        } else {
          newPost = await this.socialStore.createPosts(params);
          // console.log('create question', newPost);
        }

        this.$refs.editor?.clear();
        clearTimeout(timeout);
        this.socialStore.creatorVisible = false;
        this.socialStore.updatePostProgress(id, {
          success: true,
          // 对于没有附件的帖子，progress 从来没有更新过
          // 因此这里直接设置为 100，以免进度条显示不正确
          progress: 100,
        });

        this.$emit('send', 'question');
        this.socialStore.setNewPost(newPost);
        this.socialStore.updatePostsWithNewPost();
      } catch (e) {
        this.socialStore.updatePostProgress(id, { failed: true });
      } finally {
        this.globalStore.editorLoading = false;
      }
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
