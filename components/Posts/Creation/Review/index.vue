<template>
  <div class="flex flex-col gap-4">
    <div class="flex gap-2">
      <BaseAvatarSwitch :right-offset="'0px'" :bottom-offset="'0px'" />
      <div class="flex flex-col overflow-hidden">
        <div class="truncate text-sm font-medium text-[#D9D9D9]">
          {{ profileStore.myProfileDetail.fullName }}
        </div>
        <div class="flex items-center gap-1">
          <span
            class="flex h-7 w-7 cursor-pointer items-center justify-center hover:bg-white/5"
            data-cy="afe3ed1e8fffb0ec"
            @click="rating = 0"
          >
            <i class="fa-solid fa-ban text-[#C62828]" />
          </span>
          <el-rate v-model="rating" :colors="colors" />
        </div>
      </div>
    </div>
    <div class="relative min-h-[23.875rem] w-full p-2">
      <LazyBaseEditor
        ref="editor"
        v-model="message"
        type="area"
        :is-action="false"
        :options="{
          placeholder: $t('post.review.placeholder'),
        }"
        :auto-clear="false"
        :send-whitespace="sendWhitespace"
        :get-tag-list="getTagList"
        :uniform-bg="true"
        :enter-to-save="false"
        limit-character
        @change="onChange"
        @send="onSend"
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
    const courseStore = useCourseStore();
    const profileStore = useProfileStore();
    return {
      authStore,
      globalStore,
      socialStore,
      courseStore,
      profileStore,
    };
  },
  data() {
    return {
      message: '',
      rating: 0,
      colors: ['#FAFAFA', '#FAFAFA', '#FAFAFA', '#FAFAFA', '#FAFAFA'],
      sendWhitespace: false,
    };
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
    onChange() {},
    async onSend(content, files, taggedUsers) {
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
          type: 'review',
          rating: this.rating,
          mentions: taggedUsers.map((item) => ({
            id: item,
            type: 'profile', // only profile type now
          })),
          entity: {
            id: this.courseStore.course.id,
            type: 'course',
            courseType: this.courseStore.course.type,
          },
        };

        await this.socialStore.createPosts(params);
        this.socialStore.answerSending = false;

        this.$refs.editor.clear();

        this.socialStore.creatorVisible = false;

        this.$emit('send');
      } catch (error) {
        this.socialStore.answerSending = false;
      } finally {
        this.globalStore.editorLoading = false;
      }
    },
  },
};
</script>
