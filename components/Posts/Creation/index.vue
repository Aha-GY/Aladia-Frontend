<template>
  <client-only>
    <el-dialog
      v-model="socialStore.creatorVisible"
      :show-close="false"
      align-center
      destroy-on-close
      append-to-body
      :close-on-click-modal="false"
      :z-index="1070"
      width="45.75rem"
      class="!rounded-[0.3125rem] !shadow-none"
    >
      <div
        v-if="editId"
        class="flex items-center justify-between rounded-t-5 bg-[#121212] p-4 text-xl text-white/80"
      >
        <div class="flex items-baseline gap-5 px-2">
          <i class="fa-regular fa-edit" />
          {{ editType === 'question' ? 'Edit Question' : 'Edit Post' }}
        </div>

        <BaseIconClose @click="handleClose" />
      </div>
      <div v-else class="flex items-center justify-between gap-2 px-4 pt-3">
        <div class="flex items-center gap-2">
          <div
            v-if="isTypeReview"
            class="ml-3 flex items-center gap-3 pb-4 text-xl text-[#B0B0B0]"
          >
            <i class="fa-regular fa-star" />
            <span>
              {{ $t('post.review.make') }}
            </span>
          </div>
          <div
            v-else-if="isTypeQuestion"
            class="ml-3 flex items-center gap-3 pb-4 text-xl text-[#B0B0B0]"
          >
            <i class="fa-regular fa-comment-dots" />
            <span>
              {{ $t('course.question.ask') }}
            </span>
          </div>
          <div v-else-if="isQuestionOnlyTab">
            <div
              class="flex cursor-pointer items-center justify-center border-b border-[#E9C238] px-6 pb-2 text-base font-semibold text-[#E9C238] transition-all"
            >
              {{ $t('course.question.make') }}
            </div>
          </div>
          <div v-else class="flex items-center gap-2 pt-3">
            <div
              v-for="menu in menus"
              :key="menu.type"
              class="flex cursor-pointer items-center justify-center border-b px-6 pb-2 text-base transition-all"
              :class="[
                socialStore.creatorTab === menu.type
                  ? 'border-[#E9C238] font-semibold text-[#E9C238]'
                  : 'hover:font-meduim border-transparent text-[#D9D9D9]/80 hover:border-[#D9D9D9] hover:text-[#D9D9D9]',
                $device.isMobile ? '!p-2' : '',
              ]"
              data-cy="825a9ddf1cf877a0"
              @click="socialStore.creatorTab = menu.type"
            >
              {{ $t(menu.label) }}
            </div>
          </div>
        </div>

        <BaseIconClose
          v-if="!editId"
          data-cy="8e8a67266b01045d"
          @click="handleClose"
        />
      </div>

      <div class="p-4">
        <template v-if="isTypeReview">
          <PostsCreationReview @send="$emit('send')" />
        </template>
        <template v-if="isTypeQuestion">
          <PostsCreationCourseQuestion @send="$emit('send')" />
        </template>
        <template v-if="isTypeFeed">
          <PostsCreationFeedTypePost
            v-show="socialStore.creatorTab === 'post'"
            @send="(type) => $emit('send', type)"
          />
          <PostsCreationFeedTypeQuestion
            v-show="socialStore.creatorTab === 'question'"
            @send="(type) => $emit('send', type)"
          />
        </template>
        <template v-if="isQuestionOnlyTab">
          <PostsCreationFeedTypeQuestion
            @send="(type) => $emit('send', type)"
          />
        </template>
      </div>
    </el-dialog>
  </client-only>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'feed', // question, review, feed, question-only-tab
    },
  },
  setup() {
    const socialStore = useSocialStore();
    return { socialStore };
  },
  computed: {
    isTypeReview() {
      return this.type === 'review';
    },
    isTypeQuestion() {
      return this.type === 'question';
    },
    isTypeFeed() {
      return this.type === 'feed';
    },
    isQuestionOnlyTab() {
      return this.type === 'question-only-tab';
    },
    editId() {
      return this.socialStore.editPostData.id;
    },
    editType() {
      return this.socialStore.editPostData.type;
    },
    menus() {
      return [
        {
          label: 'post.create.label',
          type: 'post',
        },
        {
          label: 'course.question.make',
          type: 'question',
        },
      ];
    },
    creatorVisible() {
      return this.socialStore.creatorVisible;
    },
  },
  watch: {
    creatorVisible(val) {
      if (!val) {
        this.socialStore.creatorTab = 'post';
      }
    },
  },
  beforeMount() {
    if (this.type === 'feed') {
      this.socialStore.creatorTab = 'post';
    }
  },
  methods: {
    handleClose() {
      this.socialStore.creatorVisible = false;
      this.socialStore.answerReplying = false;
      this.socialStore.answerEditId = null;
      this.socialStore.mentionItem = null;
      this.socialStore.gif = '';
    },
  },
};
</script>
