<!--
注意：以下文件的行为类似：
- TypePost.vue
- TypeQuestion.vue

在修改其中一个文件时，请检查是否需要同步修改其他类似文件。
-->

<template>
  <div
    class="flex flex-col"
    :class="[isLocationPopupVisible ? 'gap-1' : 'gap-4']"
  >
    <div
      v-if="isLocationPopupVisible"
      class="tex-sm flex items-center gap-2 px-2 text-[#B0B0B0]"
    >
      <i
        class="fa-solid fa-arrow-left cursor-pointer text-xs"
        @click="closeDialog"
      />
      <span>{{ $t('post.create.back') }}</span>
    </div>
    <div v-else class="flex gap-3">
      <BaseAvatarSwitch
        :right-offset="'0px'"
        :show-drop-down="isFeedPage"
        :bottom-offset="'0px'"
      />
      <div class="flex flex-col overflow-hidden">
        <div class="flex items-end gap-1 text-sm font-medium text-[#D9D9D9]">
          <div class="flex-auto truncate">
            {{ profileStore.myProfileDetail.fullName }}
          </div>
          <div
            v-if="selectedLocation"
            class="flex flex-none items-end gap-1.5 whitespace-nowrap"
          >
            <PostsCreationLocation :location-item="selectedLocation" />
            <i
              v-if="!loading"
              class="fa-light fa-close mb-[0.075rem] cursor-pointer transition-all hover:rotate-180 hover:scale-125"
              @click="handleLocationSelected(null)"
            />
          </div>
        </div>
        <div class="pt-1" :class="width">
          <PostsCreationVisibility
            :active="visibility"
            @select="handleSelectVisible"
          />
        </div>
      </div>
    </div>
    <div
      class="relative min-h-[23.875rem] w-full"
      :class="[isLocationPopupVisible ? 'p-0' : 'p-2']"
    >
      <BaseEditorLocation
        v-if="isLocationPopupVisible"
        @location-selected="handleLocationSelected"
      />

      <BaseEditor
        v-else-if="!mentionItem"
        ref="posteditor"
        v-model="message"
        type="area"
        :options="{
          placeholder: $t('post.create.placeholder'),
          location: selectedLocation,
          showMedia: true,
        }"
        :auto-clear="false"
        :send-whitespace="sendWhitespace"
        :get-tag-list="getTagList"
        name="post-editor"
        :data-cy="`${socialStore.editPostData.id ? 'edit' : 'create'}-post`"
        :uniform-bg="true"
        :init-files="initFiles"
        :init-loom-files="initLoomFiles"
        :location-allowed="true"
        :show-gif="true"
        :auto-send-gif="true"
        :tool-tip-content="$t('post.update.tooltip')"
        :hide-gif-picker="hasAttachments"
        :with-action-tool-tip="true"
        :characters-limit="63200"
        :enter-to-save="false"
        limit-character
        @change="onChange"
        @send="onSend"
        @send-gif="socialStore.setGif"
        @upload="onUpload"
        @loom="onLoom"
        @remove-loom="onRemoveLoom"
        @remove-file="onRemoveFile"
      />

      <PostsItemMention
        v-if="mentionItem"
        v-model="message"
        :options="{
          placeholder: $t('post.create.placeholder'),
          location: selectedLocation,
          showMedia: true,
        }"
        :item="mentionItem"
        :auto-clear="false"
        :send-whitespace="sendWhitespace"
        :get-tag-list="getTagList"
        name="post-editor"
        :data-cy="`${socialStore.editPostData.id ? 'edit' : 'create'}-post`"
        :uniform-bg="true"
        :init-files="initFiles"
        :init-loom-files="initLoomFiles"
        :location-allowed="true"
        :show-gif="true"
        :auto-send-gif="true"
        :tool-tip-content="$t('post.update.tooltip')"
        :hide-gif-picker="hasAttachments"
        :with-action-tool-tip="true"
        :characters-limit="63200"
        limit-character
        @change="onChange"
        @send="onMentionSend"
        @send-gif="socialStore.setGif"
        @upload="onUpload"
        @loom="onLoom"
        @remove-loom="onRemoveLoom"
        @remove-file="onRemoveFile"
      />
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const socialStore = useSocialStore();
    const globalStore = useGlobalStore();
    const authStore = useAuthStore();
    const profileStore = useProfileStore();
    return { authStore, globalStore, socialStore, profileStore };
  },
  data() {
    return {
      message: '',
      visibility: 'public',
      sendWhitespace: false,
      initFiles: [],
      initLoomFiles: [],
      selectedLocation: null,
      hasFiles: false,
      hasLoomFiles: false,
    };
  },
  computed: {
    isFeedPage() {
      return this.$route.name.includes('feed');
    },
    isLocationPopupVisible() {
      return this.globalStore.editorLocationPickerVisible;
    },
    width() {
      return this.visibility === 'restricted' ? 'w-[8rem]' : 'w-[6rem]';
    },
    loading() {
      return this.globalStore.editorLoading;
    },
    hasAttachments() {
      return this.hasFiles || this.hasLoomFiles;
    },
    mentionItem() {
      return this.socialStore.mentionItem;
    },
  },
  watch: {
    'socialStore.answerReplying': {
      handler(state) {
        if (state) {
          this.$refs['posteditor']?.quill?.focus?.();
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
          this.selectedLocation =
            this.socialStore.editPostData.location || null;

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
    this.globalStore.editorLocationPickerVisible = false;
  },
  methods: {
    handleSelectVisible(menu) {
      this.visibility = menu;
    },
    handleLocationSelected(location) {
      this.selectedLocation = location;
    },
    closeDialog() {
      this.globalStore.editorLocationPickerVisible = false;
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
    onChange() {},
    async handlePost(
      type,
      subType,
      content,
      files,
      taggedUsers,
      text,
      loomFiles,
      showLocation,
    ) {
      const id = this.socialStore.addPostProgress(type === 'post');
      const timeout = setTimeout(() => {
        this.socialStore.creatorVisible = false;
        this.socialStore.updatePostProgress(
          id,
          { show: true },
          type === 'post',
        );
      }, 3000);

      try {
        const locationValidation = this.selectedLocation && showLocation;
        if (
          type === 'post' &&
          !content.trim() &&
          !files.length &&
          !loomFiles.length &&
          !locationValidation &&
          !this.socialStore.gif
        ) {
          this.$toast.error(this.$t('post.error.empty'));
          this.$refs.posteditor.clearLoading();
          clearTimeout(timeout);
          return;
        }

        const params = this.initializeParams(
          type,
          subType,
          content,
          taggedUsers,
          text,
          loomFiles,
          showLocation,
        );

        const fileUploadResult = await this.processFiles(files, id, type);
        if (fileUploadResult.error) {
          this.$refs.posteditor.clearLoading();
          clearTimeout(timeout);
          return;
        }

        params.files = fileUploadResult.files;

        let newPost;
        if (this.socialStore.editPostData.id) {
          params.type = undefined;
          newPost = await this.socialStore.updatePost({
            postId: this.socialStore.editPostData.id,
            ...params,
          });
          // console.log('edit post', newPost);
        } else {
          if (subType === 'mention') {
            params.parentId = this.socialStore.mentionItem.id;
          }
          newPost = await this.socialStore.createPosts(params);
          // console.log('create post', newPost);
        }

        this.$emit('send', 'post');
        this.socialStore.setNewPost(newPost);
        this.socialStore.updatePostsWithNewPost();

        this.$refs.posteditor?.clear();
        clearTimeout(timeout);
        this.socialStore.creatorVisible = false;
        this.socialStore.updatePostProgress(
          id,
          {
            success: true,
            progress: 100,
          },
          type === 'post',
        );
      } catch (e) {
        if (type === 'post') {
          this.socialStore.updatePostProgress(
            id,
            { failed: true },
            type === 'post',
          );
        }
      } finally {
        this.socialStore.mentionItem = null;
        this.socialStore.gif = '';
        this.globalStore.editorLoading = false;
      }
    },

    initializeParams(
      type,
      subType,
      content,
      taggedUsers,
      text,
      loomFiles,
      showLocation,
    ) {
      const params = {
        title: '',
        content,
        type,
        subType,
        visibility: this.visibility,
        mentions: taggedUsers.map((item) => ({
          id: item,
          type: 'profile',
        })),
        text,
        files: [],
        loomUrls:
          loomFiles?.map((item) => item.embedUrl || item.sharedUrl || item) ||
          [],
        location: this.selectedLocation
          ? {
              latitude: String(
                this.selectedLocation.lat || this.selectedLocation.latitude,
              ),
              longitude: String(
                this.selectedLocation.lon || this.selectedLocation.longitude,
              ),
              name:
                this.selectedLocation.formattedAddress ||
                this.selectedLocation.name,
              country: this.selectedLocation.country,
              city: this.selectedLocation.city,
              displayMap: showLocation,
            }
          : null,
        gif: this.socialStore.gif || null,
      };
      return params;
    },

    async processFiles(files, progressId, type) {
      const totalFilesToUpload = files.filter((item) => !item.fileId).length;
      const fileProgress = Array.from({ length: files.length }, () => 0);
      const uploadedFiles = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (file.fileId) {
          uploadedFiles.push({
            fileId: file.fileId,
            metadata: {
              mimetype: file.type,
              size: file.size,
              name: file.name,
            },
          });
          continue;
        }

        const error = this.validateFile(file);
        if (error) {
          this.$toast.error(error);
          return { error: true };
        }

        const { fileId } = await upload({
          file,
          onProgress: (progress) => {
            fileProgress[i] = progress;
            const totalProgress = Math.round(
              fileProgress.reduce((a, b) => a + b, 0) / totalFilesToUpload,
            );
            this.socialStore.updatePostProgress(
              progressId,
              {
                progress: totalProgress,
              },
              type === 'post',
            );
          },
        });

        uploadedFiles.push({
          fileId,
          metadata: {
            mimetype: file.type,
            size: file.size,
            name: file.name,
          },
        });
      }

      return { files: uploadedFiles };
    },

    validateFile(file) {
      if (
        /(\.jpg|\.jpeg|\.png|\.gif)$/i.test(file.name) &&
        file.size > 25 * 1024 * 1024
      ) {
        return 'photo maximum allowed size is 25MB';
      }

      if (
        /(\.mp4|\.mov|\.avi|\.flv|\.wmv|\.3gp|\.mkv|\.webm)$/i.test(file.name)
      ) {
        if (file.size > 1.7 * 1024 * 1024 * 1024) {
          return 'video maximum allowed size is 1.7GB';
        }
        if (file.size > 100 * 1024 * 1024) {
          return 'video maximum allowed size is 100MB';
        }
      }

      return null;
    },

    async onSend(content, files, taggedUsers, text, loomFiles, showLocation) {
      await this.handlePost(
        'post',
        null,
        content,
        files,
        taggedUsers,
        text,
        loomFiles,
        showLocation,
      );
    },

    async onMentionSend(
      content,
      files,
      taggedUsers,
      text,
      loomFiles,
      showLocation,
    ) {
      await this.handlePost(
        'repost',
        'mention',
        content,
        files,
        taggedUsers,
        text,
        loomFiles,
        showLocation,
      );
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
