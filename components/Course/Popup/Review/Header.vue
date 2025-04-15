<template>
  <div
    class="mb-6 flex h-12 items-center justify-between rounded bg-white/5 px-3 font-light"
  >
    <div class="flex items-center gap-2 text-xs leading-none">
      <div
        v-for="item in status"
        :key="item.value"
        class="flex w-24 cursor-pointer items-center justify-center gap-3 border-b py-4 text-center"
        :class="
          review.rating === item.value
            ? 'border-white/50'
            : 'border-transparent hover:border-white/20'
        "
        data-cy="1d4cde2e90da870b"
        @click="onReview(item.value)"
      >
        <BaseStarsReview
          v-if="item.value > 0"
          :value="item.value"
          :active="review.rating === item.value"
        />
        {{ $t(item.name) }}
      </div>
    </div>
    <div class="flex items-center gap-6">
      <div
        class="flex cursor-pointer items-center gap-2 rounded border border-white/50 px-2 py-1 text-xs font-semibold text-white transition-all hover:border-transparent hover:bg-white/10 hover:text-white/80"
        data-cy="27f34ff5f4dd9cf8"
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
        {{ $t('course.review.create') }}
      </div>
      <div class="flex items-center gap-2">
        <div
          class="flex size-7 cursor-pointer items-center justify-center rounded"
          :class="{
            'bg-white/10': review.view === 'grid',
          }"
          data-cy="0c45b7b921570f16"
          @click="courseStore.review.view = 'grid'"
        >
          <i class="fa-solid fa-grid-2" />
        </div>
        <div
          class="flex size-7 cursor-pointer items-center justify-center rounded"
          :class="{
            'bg-white/10': review.view === 'list',
          }"
          data-cy="4fe00c98697425f3"
          @click="courseStore.review.view = 'list'"
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
          value: 0,
          name: 'course.review.star.all',
        },
        {
          value: 1,
          name: 'course.review.star.one',
        },
        {
          value: 2,
          name: 'course.review.star.two',
        },
        {
          value: 3,
          name: 'course.review.star.three',
        },
        {
          value: 4,
          name: 'course.review.star.four',
        },
        {
          value: 5,
          name: 'course.review.star.five',
        },
      ],
    };
  },
  computed: {
    buyed() {
      return this.courseStore.buyed;
    },
    review() {
      return this.courseStore.review;
    },
    course() {
      return this.courseStore.course;
    },
  },
  watch: {
    'review.rating': {
      handler() {
        this.courseStore.getReviews();
      },
      immediate: false,
    },
  },
  methods: {
    onReview(rating) {
      this.courseStore.review.rating = rating;
      this.courseStore.getReviews();
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

      this.socialStore.answerReset();
      this.socialStore.creatorVisible = true;
    },
  },
};
</script>
