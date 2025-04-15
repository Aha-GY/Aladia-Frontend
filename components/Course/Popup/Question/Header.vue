<template>
  <div
    class="mb-6 flex h-12 items-center justify-between rounded bg-white/5 px-3 font-light"
  >
    <div class="flex items-center gap-4 text-xs leading-none">
      <div
        v-for="item in status"
        :key="item.value"
        class="flex cursor-pointer items-center justify-center gap-3 border-b px-4 py-4 text-center"
        :class="
          question.status === item.value
            ? 'border-white/50'
            : 'border-transparent hover:border-white/20'
        "
        data-cy="37750db1d8c5edb5"
        @click="onQuestion(item.value)"
      >
        {{ $t(item.name) }}
      </div>
    </div>
    <div class="flex items-center gap-6">
      <div
        class="flex cursor-pointer items-center gap-2 rounded border border-white/50 px-2 py-1 text-xs font-semibold text-white transition-all hover:border-transparent hover:bg-white/10 hover:text-white/80"
        data-cy="d5a14357d367dde1"
        @click="onCreate"
      >
        <i
          v-if="!buyed && !courseStore.purchasing"
          class="fa-solid fa-lock text-10"
        />
        <i
          v-if="courseStore.purchasing"
          class="fa-solid fa-spinner animate-spin text-xs"
        />
        {{ $t('course.question.ask') }}
      </div>
      <div class="flex items-center gap-2">
        <div
          class="flex size-7 cursor-pointer items-center justify-center rounded"
          :class="{
            'bg-white/10': question.view === 'grid',
          }"
          data-cy="8f532288aacca63e"
          @click="courseStore.question.view = 'grid'"
        >
          <i class="fa-solid fa-grid-2" />
        </div>
        <div
          class="flex size-7 cursor-pointer items-center justify-center rounded"
          :class="{
            'bg-white/10': question.view === 'list',
          }"
          data-cy="58ce4f5d7a1aca6f"
          @click="courseStore.question.view = 'list'"
        >
          <i class="fa-solid fa-list" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const authStore = useAuthStore();
    const socialStore = useSocialStore();
    const courseStore = useCourseStore();
    const paymentStore = usePaymentStore();
    return { authStore, courseStore, socialStore, paymentStore };
  },
  data() {
    return {
      status: [
        {
          value: '',
          name: 'course.question.status.all',
        },
        {
          value: 'not-answered',
          name: 'course.question.status.notAnswered',
        },
        {
          value: 'answered',
          name: 'course.question.status.answered',
        },
        {
          value: 'answered-by-teacher',
          name: 'course.question.status.answeredByT',
        },
        {
          value: 'solved',
          name: 'course.question.status.solved',
        },
      ],
    };
  },
  computed: {
    buyed() {
      return this.courseStore.buyed;
    },
    question() {
      return this.courseStore.question;
    },
    course() {
      return this.courseStore.course;
    },
    player() {
      return this.courseStore.player;
    },
  },
  methods: {
    onQuestion(status) {
      this.courseStore.question.status = status;
      this.courseStore.getQuestions();
    },
    async onCreate() {
      if (!this.authStore.logged) {
        this.authStore.popup = true;
        this.courseStore.popup.state = false;
        return;
      }

      if (this.courseStore.purchasing) {
        return;
      }

      if (!this.buyed) {
        try {
          this.courseStore.purchasing = true;
          await this.paymentStore.onCheckout(this.course.id);
          this.courseStore.purchasing = false;
        } catch (error) {
          this.courseStore.purchasing = false;
          throw error;
        }
        return;
      }

      this.initDefaulSeleteChapter();
      this.socialStore.answerReset();
      this.socialStore.creatorVisible = true;
    },
    initDefaulSeleteChapter() {
      if (
        this.courseStore.lectureIndex === null &&
        this.courseStore.chapterIndex === null
      ) {
        const chapters = this.course.chapters;
        const lecture = chapters?.[0]?.lectures?.[0];
        if (lecture) {
          this.socialStore.setSelectLecture({
            chapterIndex: 0,
            lectureIndex: 0,
            thumbnail: lecture.thumbnail.url || this.course.thumbnail.url,
            id: lecture.id,
          });
        } else {
          this.socialStore.setSelectLecture({
            chapterIndex: null,
            lectureIndex: null,
            thumbnail: this.course.thumbnail.url,
            id: this.course.id,
            realteToCourse: true,
          });
        }
      }

      if (
        this.courseStore.lectureIndex !== null &&
        this.courseStore.chapterIndex !== null
      ) {
        const lecture = this.courseStore.current;
        this.socialStore.setSelectLecture({
          chapterIndex: this.courseStore.chapterIndex,
          lectureIndex: this.courseStore.lectureIndex,
          thumbnail: lecture.thumbnail.url || this.course.thumbnail.url,
          id: lecture.id,
        });
      }
    },
  },
};
</script>
