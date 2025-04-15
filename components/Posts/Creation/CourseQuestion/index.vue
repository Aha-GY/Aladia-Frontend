<template>
  <div class="relative flex flex-col gap-4">
    <div class="flex gap-3">
      <BaseAvatarSwitch :right-offset="'0px'" :bottom-offset="'0px'" />
      <div class="flex w-full flex-col overflow-hidden">
        <div class="truncate text-sm font-medium text-[#D9D9D9]">
          {{ profileStore.myProfileDetail.fullName }}
        </div>
        <div
          class="flex justify-between pt-1"
          :class="$device.isMobile ? 'flex-col' : 'items-center'"
        >
          <PostsItemWidgetsQuestionStatus status="not-answered" class="h-7" />

          <div
            class="flex items-center gap-2 leading-4"
            :class="$device.isMobile ? 'mt-4 justify-end' : 'items-center'"
          >
            <div
              class="flex cursor-pointer items-center gap-2 rounded-[0.3125rem] bg-[#E2E2E2]/[0.03] p-[0.375rem] text-[#FAFAFA] transition-all duration-300 hover:bg-[#E2E2E2]/[0.1]"
              data-cy="3b84255a73c92414"
              @click="handleShowLecture"
            >
              <div class="flex items-center gap-2">
                <span class="flex h-4 w-4 items-center justify-center">
                  <BaseCourseThumbnail
                    v-if="socialStore.selectedLecture.thumbnail"
                    :url="socialStore.selectedLecture.thumbnail"
                    class="h-full w-full"
                  />
                  <i v-else class="fa-solid fa-image text-white/50" />
                </span>

                <template v-if="socialStore.selectedLecture.realteToCourse">
                  <span>{{ $t('course.related') }}</span>
                </template>
                <span v-else>
                  {{
                    $t('course.index.lecture', {
                      index: socialStore.selectedLecture.lectureIndex + 1,
                    })
                  }}
                  -
                  {{
                    $t('course.index.chapter', {
                      index: socialStore.selectedLecture.chapterIndex + 1,
                    })
                  }}
                </span>
              </div>
            </div>
            <span
              class="cursor-pointer px-2 transition-all duration-300 hover:rotate-180 hover:bg-[#E2E2E2]/[0.03]"
              data-cy="088062b8ed4416c5"
              @click="handleShowLecture"
            >
              <i class="fa-solid fa-arrows-rotate" />
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="relative min-h-[23.875rem] w-full p-2">
      <LazyBaseEditor
        ref="editor"
        v-model="message"
        type="area"
        :options="{
          placeholder: $t('post.placeholder'),
        }"
        :auto-clear="false"
        :get-tag-list="getTagList"
        :uniform-bg="true"
        @change="onChange"
        @send="onSend"
      />
    </div>
    <Transition name="slide-fade-in" mode="out-in">
      <PostsCreationLecture
        v-if="showLecture"
        @back="handleCancelLecture"
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
    const courseStore = useCourseStore();
    const profileStore = useProfileStore();
    const globalStore = useGlobalStore();
    return { socialStore, authStore, courseStore, profileStore, globalStore };
  },
  data() {
    return {
      message: '',
      showLecture: false,
      backupSelectedLecture: null,
    };
  },
  unmounted() {
    this.socialStore.resetSelectLecture();
  },
  methods: {
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
    handleShowLecture() {
      this.showLecture = true;
      this.backupSelectedLecture = cloneDeep(this.socialStore.selectedLecture);
    },
    onSelectCategories() {
      this.showLecture = false;
    },
    handleCancelLecture() {
      this.showLecture = false;
      this.socialStore.selectedLecture = this.backupSelectedLecture;
    },
    onChange() {},
    async onSend(content, files, taggedUsers, text, loomFiles) {
      try {
        this.socialStore.answerSending = true;

        if (!content.trim()) {
          this.$toast.error(this.$t('post.error.empty'));
          this.socialStore.answerSending = false;
          this.$refs.editor.clearLoading();
          return;
        }

        const params = {
          title: '',
          content,
          type: 'question',
          // visibility: this.socialStore.answerVisibility,
          mentions: taggedUsers.map((item) => ({
            id: item,
            type: 'profile', // only profile type now
          })),
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
            const { fileId } = await upload({
              file: RemainingFiles[i],
            });
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

        if (this.socialStore.selectedLecture.realteToCourse) {
          params.entity = {
            id: this.socialStore.selectedLecture.id,
            type: 'course',
          };
        } else {
          params.entity = {
            id: this.socialStore.selectedLecture.id,
            type: 'lecture',
          };
        }

        await this.socialStore.createPosts(params);
        this.socialStore.answerSending = false;
        this.$refs.editor.clear();

        this.socialStore.creatorVisible = false;

        this.$emit('send');
      } catch (error) {
        this.socialStore.answerSending = false;
        throw error;
      } finally {
        this.globalStore.editorLoading = false;
      }
    },
  },
};
</script>
