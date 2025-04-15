<template>
  <div id="course-info" class="relative">
    <div class="relative flex translate-y-[1rem] items-end gap-4">
      <div
        class="w-44 overflow-hidden rounded bg-black/50 transition-all duration-500"
        :class="
          collapse ? 'h-0 opacity-0' : 'h-24 border border-white/20 opacity-100'
        "
      >
        <BaseCourseThumbnail
          class="h-full w-full"
          :suspend="suspend"
          :url="course.thumbnail?.url"
        >
          <CourseInfoPastDue
            v-if="isOrgAdmin"
            :cover="true"
            :suspend="suspend"
            @click="handleRetryPayment"
          />
        </BaseCourseThumbnail>
      </div>

      <div
        class="flex h-36 translate-y-[2.3rem] flex-col justify-end transition-all duration-500"
        :class="
          collapse ? 'translate-y-[2.3rem] gap-0.5' : 'translate-y-0 gap-1.5'
        "
      >
        <div :class="!collapse ? 'h-0 opacity-0' : ''">
          <CourseInfoPastDue
            v-if="isOrgAdmin"
            :cover="false"
            :suspend="suspend"
            @click="handleRetryPayment"
          />
        </div>

        <div
          class="flex items-center gap-4 text-sm transition-all duration-500"
          :class="collapse ? 'max-h-0 opacity-0' : 'max-h-12 opacity-100'"
        >
          <div class="flex items-center gap-1">
            <BaseAvatarNext
              size="sm"
              :picture="course.owner?.picture"
              :show-online="false"
              :user-id="course.owner?.id"
              :story="course.owner?.story"
            />
            <NuxtLink
              class="max-w-72 gap-2 truncate text-white/80"
              :to="`/profile/${course.owner?.id}`"
            >
              {{ course.owner?.name }}
            </NuxtLink>
          </div>
          <div class="h-1.5 w-1.5 rounded-full bg-white/50" />
          <div class="text-white/80">
            {{ $t('course.date.update') }}
            {{ formatDate(course.updatedAt, 'DD MMM YYYY') }}
          </div>
          <div
            v-if="course.type === 'live'"
            class="h-1.5 w-1.5 rounded-full bg-white/50"
          />
          <div
            v-if="course.type === 'live'"
            class="flex items-center gap-2 text-white/80"
          >
            Start date
            <PaymentCheckoutCompsSelectCycles
              v-if="!purchased"
              ref="cycles"
              show-seat
              :course="course"
              :read-only="purchased"
              placement="top"
              @change="onCycleChange"
            />
            <PaymentCheckoutCompsFixedCycles
              v-else
              ref="cycles"
              show-seat
              :cycle="cycle"
              :read-only="purchased"
              placement="top"
            />
          </div>
        </div>
        <div class="text-2xl font-bold">
          {{ course.title }}
        </div>
        <div class="flex items-center gap-4 text-sm text-white/50">
          <div class="flex items-center gap-2">
            <BaseStars :value="course.review?.globalRating" />
            <span class="text-white">{{ ranking }}</span>
            <span>
              ({{ moneyFormat(course.review?.totalReviews || 0, 0) }}
              {{ $t('course.review.title.lower') }})
            </span>
          </div>
          <div v-if="course.languageId" class="flex items-center gap-1">
            <i class="fa-regular fa-globe" />
            <span class="text-white">{{ language }}</span>
          </div>
          <div v-if="course.type === 'live'" class="flex items-center gap-2">
            <i class="fa-solid fa-users-rays text-white" />
            <span class="text-white">
              <template v-if="cycle">
                {{ cycle.purchases }} /
                {{ cycle.seatCount === -1 ? 'unlimited' : cycle.seatCount }}
              </template>
            </span>
            <span>Available seats</span>
          </div>
          <div v-if="course.type === 'live'" class="flex items-center gap-2">
            <i class="fa-light fa-calendars text-white" />
            <span class="text-white">{{ lectures }}</span>
            <span>{{ $t('base.courses.liveLessons') }}</span>
          </div>
          <div v-else class="flex items-center gap-2">
            <i class="fa-light fa-bookmark text-white" />
            <span class="text-white">{{ lectures }}</span>
            <span>{{ $t('base.courses.lectures') }}</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="fa-light fa-bookmark text-white" />
            <span class="text-white">{{ chapters }}</span>
            <span>{{ $t('base.courses.chapters') }}</span>
          </div>
          <div v-if="course.type !== 'live'" class="flex items-center gap-2">
            <i class="fa-solid fa-clock text-white" />
            <span class="text-white">{{ duration }}</span>
            <span>Hour</span>
          </div>
        </div>
        <div
          v-if="!collapse"
          class="flex items-center gap-2 text-sm transition-all duration-500"
          :class="collapse ? 'opacity-0' : 'translate-y-[0.35rem] opacity-100'"
        >
          <div
            v-for="(item, index) in skills"
            v-show="index <= 3"
            :key="index"
            class="rounded-sm bg-[#E5E5E514] px-2 py-1 text-[#D4D4D4]"
          >
            {{ item }}
          </div>

          <div
            v-if="skills.length > 4"
            class="cursor-pointer px-2 py-1 text-white hover:bg-white/5"
            @click="handleActiveSkills"
          >
            +{{ skills.length - 4 }} More
          </div>
        </div>
      </div>
    </div>
    <div class="flex h-14 items-end justify-between">
      <div class="flex w-44 justify-between text-white/80">
        <div class="flex cursor-pointer items-center gap-2">
          <i class="fa-light fa-share-nodes" />
          {{ $t('course.share') }}
        </div>
        <div class="flex cursor-pointer items-center gap-2">
          <i class="fa-light fa-heart-circle-plus" />
          {{ $t('course.fav') }}
        </div>
      </div>
      <CourseInfoBuy v-show="!buyed" />
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const authStore = useAuthStore();
    const courseStore = useCourseStore();
    const paymentStore = usePaymentStore();
    const profileStore = useProfileStore();
    const globalStore = useGlobalStore();
    return { authStore, courseStore, paymentStore, profileStore, globalStore };
  },
  computed: {
    course() {
      return this.courseStore.course;
    },
    player() {
      return this.courseStore.player;
    },
    dates() {
      return this.course.cycles[0]?.dates || {};
    },
    buyed() {
      return this.courseStore.buyed;
    },
    purchased() {
      return this.courseStore.course.purchased;
    },
    ranking() {
      return this.course.review?.globalRating?.toFixed?.(1) || '0.0';
    },
    lectures() {
      return (
        this.course.version?.numberOf.liveLectures +
        this.course.version?.numberOf.onDemandLectures
      );
    },
    chapters() {
      return this.course.version?.numberOf.chapters;
    },
    collapse() {
      return this.player.collapse;
    },
    duration() {
      return secondsToHours(this.course.chaptersDuration || 0);
    },
    suspend() {
      return this.course.suspend;
    },
    user() {
      return this.profileStore.myProfileDetail;
    },
    isOrgAdmin() {
      return this.authStore.isOrgAdmin;
    },
    cyclesOptions() {
      const { cycles } = handleCourseAvailableAndCycles(this.course);
      return cycles;
    },
    cycle() {
      if (this.purchased) {
        const purchasedCycles = this.cyclesOptions.filter((cycle) =>
          (this.course.purchasedCycles || []).includes(cycle.id),
        );
        return purchasedCycles && purchasedCycles[0];
      } else {
        return this.cyclesOptions.find(
          (item) => item.id === this.paymentStore.cyclesId,
        );
      }
    },
    language() {
      return (
        this.globalStore.languages.find(
          (language) => language.id === this.course.languageId,
        )?.name || ''
      );
    },
    skills() {
      return this.courseStore.course.skills || [];
    },
  },
  mounted() {
    document.body.addEventListener('mousemove', this.onMouseMove);
  },
  beforeUnmount() {
    clearTimeout(this.timer);
    document.body.removeEventListener('mousemove', this.onMouseMove);
  },
  methods: {
    onMouseMove({ target }) {
      this.player.collapse = false;
      clearTimeout(this.timer);
      if (
        !target.closest('#course-info') &&
        !target.closest('#cycles-popover')
      ) {
        this.timer = setTimeout(() => {
          this.player.collapse = true;
          this.$refs.cycles?.hide();
        }, 2000);
      }
    },
    async onCycleChange() {
      const courseId = this.course.id;

      if (!this.authStore.logged) {
        this.authStore.popup = true;
        this.courseStore.popup.state = false;
        return;
      }

      if (this.courseStore.purchasing) {
        return;
      }

      if (this.buyed) {
        return;
      }

      try {
        this.courseStore.purchasing = true;
        await this.paymentStore.onCheckout(this.course.id);
        this.courseStore.purchasing = false;
      } catch (error) {
        this.courseStore.purchasing = false;
        throw error;
      }

      await this.courseStore.getChapters({ courseId });
      this.courseStore.chapter.state = false;
      this.courseStore.chapter.index = null;
    },
    async handleActiveSkills() {
      this.courseStore.popup.type = 'description';
      this.courseStore.popup.state = true;

      await sleep(200);
      const $dialog = document.querySelector(
        '#data-course-popup-description-skills',
      );
      $dialog.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    },
    handleRetryPayment() {
      if (this.isOrgAdmin && this.suspend) {
        // TODO: 唤起支付组件
      }
    },
  },
};
</script>
