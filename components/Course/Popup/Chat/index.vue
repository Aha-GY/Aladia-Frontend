<template>
  <div class="h-full">
    <OrganizationHubChat v-if="buyed" class="h-full" :course-id="courseId" />
    <div v-else class="relative h-full">
      <img
        src="~/assets/images/chat.png"
        class="h-full w-full object-contain"
      />
      <div
        class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/10 backdrop-blur-sm"
      >
        <i class="fa-solid fa-lock mb-4 text-[10rem] text-white/50" />
        <div class="mb-4 text-13 font-light">
          {{ $t('course.membership.subscribe.description') }}
        </div>
        <BaseButton
          type="primary"
          class="w-48 justify-center"
          data-cy="78b564354f779e26"
          @click="handleClickToBuy"
        >
          <i
            v-if="courseStore.purchasing"
            class="fa-solid fa-spinner animate-spin text-xs"
          />
          {{ $t('course.membership.subscribe.title') }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const authStore = useAuthStore();
    const courseStore = useCourseStore();
    const paymentStore = usePaymentStore();
    return { authStore, courseStore, paymentStore };
  },
  computed: {
    courseId() {
      return this.$route.params.name;
    },
    buyed() {
      return this.courseStore.buyed;
    },
  },
  methods: {
    async handleClickToBuy() {
      if (!this.authStore.logged) {
        this.authStore.popup = true;
        this.courseStore.popup.state = false;
        return;
      }

      if (this.courseStore.purchasing) {
        return;
      }

      try {
        this.courseStore.purchasing = true;
        await this.paymentStore.onCheckout(this.courseId);
        this.courseStore.purchasing = false;
      } catch (error) {
        this.courseStore.purchasing = false;
        throw error;
      }
    },
  },
};
</script>
