<template>
  <div
    class="absolute right-0 top-0 z-50 flex h-full w-full flex-col rounded border border-white/10 bg-black font-light md:right-[calc(60vw-34rem)] md:w-[32rem]"
  >
    <div
      class="!z-[100] mb-2 flex h-12 items-center justify-between bg-white/5 px-4"
    >
      <div class="text-sm">Set Up Your AI Course Creation</div>
      <div class="flex items-center gap-8">
        <BaseIconClose data-cy="f121749306cdd987" @click="onAiClose" />
      </div>
    </div>
    <div
      class="hide-scrollbar h-0 flex-1 flex-col gap-2 overflow-y-auto px-1 text-[#D9D9D9]"
    >
      <OrganizationHubCourseAiCourse />
      <OrganizationHubCourseAiChapters />
      <OrganizationHubCourseAiSubject />
      <div
        v-if="ai.loading"
        class="absolute inset-0 !z-50 flex flex-col items-center justify-center bg-black/10 backdrop-blur-sm"
      >
        <i
          v-if="ai.done"
          class="fa-solid fa-check-circle mb-2 text-xl text-[#02826B]"
        />
        <i v-else class="fa-solid fa-sparkles mb-2 text-xl text-white" />
        <div v-if="ai.done" class="mb-8">
          {{ $t('course.ai.generate') }}
        </div>
        <div
          v-else
          class="mb-8 flex flex-col items-center justify-center gap-2 px-8"
        >
          <div class="text-base font-medium text-white">
            {{ $t('course.ai.generating') }}
          </div>
          <div>
            You can close this window and continue browsing. A notification will
            keep you informed about the progress.
          </div>
        </div>
        <el-progress
          class="w-4/5"
          :percentage="100"
          status="success"
          :color="ai.done ? '#02826B' : '#7C27B2'"
          :duration="ai.done ? 0 : 2"
          :indeterminate="true"
          :show-text="false"
        />
      </div>
    </div>
    <div class="!z-[100] flex h-12 items-center justify-end bg-white/5 px-2">
      <OrganizationHubCourseAiButton
        data-cy="99ad44d535693ba9"
        @click="onGenerate"
      >
        <i v-if="ai.loading" class="fa-solid fa-spinner animate-spin text-xs" />
        <i v-else class="fa-solid fa-sparkles" />
        {{ $t('course.ai.action') }}
      </OrganizationHubCourseAiButton>
    </div>
    <OrganizationHubCourseEditCategoriesSuggestionDialog
      v-if="hubCourse.ai.suggestSubCategoriesDialog"
    />
  </div>
</template>

<script>
import WebSocketService from '~/utils/websocket';

export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    const hubSubject = useHubSubjectStore();
    const websocket = WebSocketService.getInstance();
    const hubSpaces = useHubSpacesStore();
    const paymentStore = usePaymentStore();
    return { hubCourse, hubSubject, websocket, hubSpaces, paymentStore };
  },
  data() {
    return {
      done: false,
      startDate: null,
    };
  },
  computed: {
    ai() {
      return this.hubCourse.ai;
    },
    course() {
      return this.hubCourse.detail;
    },
  },
  methods: {
    onAiClose() {
      this.hubCourse.ai.open = false;
      if (this.ai.loading) {
        this.hubCourse.ai.backgroundAILoad = true;
      }
    },
    async onGenerate() {
      if (this.ai.loading) {
        return;
      }

      const token = this.hubSpaces.statistics.billings.find(
        (bill) => bill.type === 'tokens',
      );
      const aiFreeTierFinished = token?.freeTierPercentage === 100;
      const hasPaymentMethod = this.paymentStore.paymentMethods.length > 0;

      if (!hasPaymentMethod && aiFreeTierFinished) {
        this.hubCourse.ai.suggestSubCategoriesDialog = true;
        return;
      }

      if (this.course.status === 'generating') {
        this.$toast.error(this.$t('course.ai.error.generating'));
        return;
      }

      this.ai.info.subjects = this.hubSubject.detail.subjects
        .filter((subject) => subject.selected === true)
        .map((subject) => ({
          id: subject.id,
          lecturesPerChapter: subject.lecturesPerChapter,
          teachersId: subject.teachers,
        }));

      if (!this.ai.info.subjects || this.ai.info.subjects.length === 0) {
        this.ai.info.subjects = null;
      }

      this.startDate = new Date();
      this.ai.loading = true;

      try {
        this.ai.info.courseId = this.course.id;
        await this.hubCourse.generateAi();
      } catch (error) {
        this.done = false;
        // this.ai.loading = false;
        throw error;
      }
    },
  },
};
</script>
