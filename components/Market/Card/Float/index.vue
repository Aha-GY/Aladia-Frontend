<template>
  <div
    id="float"
    class="absolute z-10 flex flex-col overflow-hidden rounded bg-black/70 backdrop-blur transition-all"
    :class="[
      fade ? 'opacity-0' : 'opacity-100',
      isProfile && 'z-20 sm:ml-20 xl:ml-0',
    ]"
    :style="{
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
    }"
    @mouseenter="onCardHover(true)"
    @mouseleave="onCardHover(false)"
    @mousemove="onCardHover(true)"
  >
    <div
      class="relative mb-4 shrink-0 transition-all"
      :class="delay ? 'h-48' : 'h-40'"
    >
      <MarketCardFloatPlayer :course="course" />
      <BaseCourseThumbnail
        class="pointer-events-none !absolute inset-0 z-10 h-full w-full rounded-b-none rounded-t bg-black text-4xl transition-all delay-500 duration-500"
        :class="delay ? 'opacity-0' : 'opacity-100'"
        :url="course?.thumbnail?.url"
      />
      <div
        class="absolute left-2 top-2 z-20 flex h-6 items-center overflow-hidden rounded bg-black/70 px-1 text-xs backdrop-blur-sm transition-all duration-300"
        :class="delay ? 'max-w-28' : 'max-w-6'"
      >
        <BaseCourseType :type="course.type" />
      </div>
    </div>
    <NuxtLink
      :to="url"
      class="flex flex-col gap-3 px-4 transition-all delay-100 duration-300"
      :class="delay ? 'opacity-100' : 'opacity-0'"
    >
      <div class="flex h-12 items-center gap-2">
        <div class="relative flex items-center justify-center rounded-full">
          <BaseAvatarNext
            :picture="course.owner?.picture"
            size="md"
            :show-online="false"
          />
        </div>
        <div class="w-0 flex-1">
          <div class="h-4 gap-1 truncate text-13 text-white/50">
            {{ course.owner.name }}
          </div>
          <div class="line-clamp-2 text-13 leading-4">
            {{ course.title }}
          </div>
        </div>
      </div>
      <div class="flex h-6 items-center justify-between text-sm">
        <div class="flex shrink-0 items-center gap-1.5">
          <i class="fa-solid fa-star" />
          {{ rating }}
        </div>
        <div class="flex shrink-0 items-center gap-1.5">
          <i class="fa-solid fa-clock" />
          {{ duration }}
        </div>
        <div class="flex shrink-0 items-center gap-1.5">
          <i class="fa-solid fa-bookmark" />
          {{ chapters }} {{ $t('base.courses.chapters') }}
        </div>
        <div class="flex shrink-0 items-center gap-1.5">
          <i class="fa-solid fa-bookmark" />
          {{ lectures }} {{ $t('base.courses.lectures') }}
        </div>
      </div>
      <div class="line-clamp-5 h-24 break-words text-13" v-html="description" />
      <div class="flex h-8 items-center justify-between text-sm">
        <div class="flex cursor-pointer items-center gap-2">
          <i class="fa-solid fa-heart-circle-plus" />
          {{ $t('base.courses.add.favorite') }}
        </div>
        <div class="flex cursor-pointer items-center gap-2">
          <i class="fa-solid fa-cart-shopping" />
          ${{ moneyFormat(course.billing?.totalPrice || 0) }}
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script>
export default {
  props: {
    isProfile: {
      type: Boolean,
      required: false,
    },
  },

  setup() {
    const marketStore = useMarketStore();
    return { marketStore };
  },
  data() {
    const { floatRect } = this.marketStore;
    return {
      timer: null,
      hover: false,
      delay: false,
      isClose: false,
      loading: false,
      fade: false,
      rect: {
        left: floatRect.left,
        top: floatRect.top,
        width: floatRect.width,
        height: floatRect.height,
      },
    };
  },
  computed: {
    course() {
      return this.marketStore.floatCourse;
    },
    element() {
      return this.marketStore.floatElement;
    },
    type() {
      return this.marketStore.floatType;
    },
    url() {
      return this.marketStore.floatUrl;
    },
    rating() {
      return this.course.review?.globalRating?.toFixed?.(1);
    },
    duration() {
      return secondsToHours(this.course.chaptersDuration || 0);
    },
    description() {
      return stripHtml(this.course.description);
    },
    completion() {
      return (
        this.course.completion ||
        this.marketStore.completions.find(
          (completion) => completion.courseId === this.course.id,
        )?.average ||
        0
      );
    },
    chapters() {
      return this.course.version?.numberOf?.chapters;
    },
    lectures() {
      return (
        this.course.version?.numberOf?.onDemandLectures +
        this.course.version?.numberOf?.liveLectures
      );
    },
  },
  watch: {
    course() {
      this.init();
    },
  },
  beforeMount() {
    clearTimeout(this.timer);
    document.body.removeEventListener('mousemove', this.onMouseMove);
  },
  mounted() {
    this.init();
    document.body.addEventListener('mousemove', this.onMouseMove);
  },
  methods: {
    async init() {
      this.delay = false;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        if (!this.element) {
          return;
        }

        const rect = this.element.getBoundingClientRect();
        const { clientWidth } = document.body;
        if (rect.left < rect.width) {
          this.rect.top = rect.top + window.scrollY - 40;
          if (this.isProfile) {
            this.rect.left = rect.left - 258;
            this.rect.top = rect.top + window.scrollY - 800;
          }
          this.rect.width = rect.width + 112;
          this.rect.height = 450;
        } else if (clientWidth - (rect.left + rect.width) < rect.width) {
          this.rect.left = rect.left - 112;
          this.rect.top = rect.top + window.scrollY - 40;
          if (this.isProfile) {
            this.rect.left = rect.left - 258;
            this.rect.top = rect.top + window.scrollY - 800;
          }
          this.rect.width = rect.width + 112;
          this.rect.height = 450;
        } else {
          this.rect.left = rect.left - 40;
          this.rect.top = rect.top + window.scrollY - 40;
          if (this.isProfile) {
            this.rect.left = rect.left - 258;
            this.rect.top = rect.top + window.scrollY - 800;
          }
          this.rect.width = rect.width + 112;
          this.rect.height = 450;
        }

        if (this.type === 'top') {
          this.rect.left = rect.left - 112;
          if (this.isProfile) {
            this.rect.left = rect.left - 258;
          }
        }

        this.delay = true;
      }, 100);
    },
    async close() {
      if (!this.element || this.isClose) {
        return;
      }
      this.isClose = true;
      const rect = this.element.getBoundingClientRect();
      this.rect.left = rect.left;
      this.rect.top = rect.top + window.scrollY;
      this.rect.width = rect.width;
      this.rect.height = rect.height;
      this.delay = false;
      await sleep(150);
      this.fade = true;
      await sleep(100);
      this.marketStore.floatCourse = null;
      this.marketStore.floatElement = null;
    },
    async onCardHover(state) {
      this.hover = state;
      if (!state) {
        this.close();
      }
    },
    onMouseMove(event) {
      if (event.target && !event.target.closest('#float')) {
        this.close();
      }
    },
  },
};
</script>
