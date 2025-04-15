<template>
  <div class="shrink-0 pr-4">
    <NuxtLink
      :to="url"
      class="relative flex items-start md:items-center"
      @mouseleave="hover = false"
      @mouseenter="hover = true"
      @mousemove="hover = true"
    >
      <div
        class="text-stroke flex items-center font-bold leading-none text-black"
        :class="{
          'justify-end text-[11rem]': !$device.isMobile,
          '-mt-2.5 justify-center text-[7rem]': $device.isMobile,
        }"
      >
        {{ index + 1 }}
      </div>
      <div class="group/course relative flex flex-col rounded bg-black">
        <div ref="card" class="relative aspect-video h-40 cursor-pointer">
          <BaseCourseThumbnail
            class="pointer-events-none absolute inset-0 z-10 h-full w-full rounded bg-black text-4xl"
            :url="course?.thumbnail?.url"
          />
          <div
            class="pointer-events-none absolute left-2 top-2 z-20 flex h-6 max-w-6 items-center overflow-hidden rounded bg-black/70 px-1 text-xs backdrop-blur-sm transition-all duration-300"
          >
            <BaseCourseType :type="course.type" />
          </div>
          <div
            class="pointer-events-none absolute bottom-2 right-2 z-20 flex items-center gap-1.5 rounded bg-black/70 px-2 py-1 text-xs text-white/80 shadow-md backdrop-blur"
          >
            <i class="fa-regular fa-cart-shopping text-xs" />
            {{ moneyFormat(billing.totalPrice || 0) }} $
          </div>
        </div>
        <div
          v-if="$device.isMobile"
          class="flex h-16 w-full items-center gap-2 p-2"
        >
          <div
            class="relative flex size-10 items-center justify-center rounded-full bg-white/10"
          >
            <BaseAvatarNext
              :show-online="false"
              :story="course.owner?.story"
              size="md"
              :user-id="course.owner?.id"
              :picture="course.owner?.picture"
              class="absolute inset-0 z-10 size-10 !rounded-full !bg-black !text-2xl"
            />
          </div>
          <div class="flex-1">
            <div class="flex h-4 items-center gap-1 text-13 text-white/50">
              {{ course.owner.name }}
            </div>
            <div class="line-clamp-2 max-w-48 text-13 leading-4">
              {{ course.title }}
            </div>
          </div>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script>
export default {
  props: {
    index: {
      type: Number,
    },
    course: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const marketStore = useMarketStore();
    return { marketStore };
  },
  data() {
    return {
      hover: false,
      timer: null,
    };
  },
  computed: {
    billing() {
      return this.course.billing || {};
    },
    isFloat() {
      return this.marketStore.floatCourse === this.course;
    },
    categoryId() {
      try {
        return this.course.categories[0].id;
      } catch {
        return '';
      }
    },
    subCategoryId() {
      try {
        return this.course.subCategories[0].id;
      } catch {
        return '';
      }
    },
    url() {
      let result = `/courses/${this.course.id}?from=marketplace`;

      if (this.categoryId) {
        result += `&categoryId=${this.categoryId}`;
      }

      if (this.subCategoryId) {
        result += `&subCategoryId=${this.subCategoryId}`;
      }

      result += `&type=top`;

      return result;
    },
  },
  watch: {
    hover(state) {
      if (state) {
        this.init();
      } else {
        clearTimeout(this.timer);
      }
    },
  },
  beforeUnmount() {
    clearTimeout(this.timer);
  },
  methods: {
    init() {
      if (this.$device.isMobile) {
        return;
      }
      if (!isElementFullyInViewport(this.$el)) {
        return;
      }
      const cardRect = this.$refs.card.getBoundingClientRect();
      this.marketStore.floatRect.left = cardRect.left;
      this.marketStore.floatRect.top = cardRect.top + window.scrollY;
      this.marketStore.floatRect.width = cardRect.width;
      this.marketStore.floatRect.height = cardRect.height;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        if (this.hover) {
          this.marketStore.floatType = 'top';
          this.marketStore.floatUrl = this.url;
          this.marketStore.floatCourse = this.course;
          this.marketStore.floatElement = this.$refs.card;
        }
      }, 300);
    },
  },
};
</script>

<style>
.text-stroke {
  --stroke-width: 3px;
  --stroke-color: #888;
  --fill-color: black;

  -webkit-text-stroke: var(--stroke-width) var(--stroke-color);
  text-shadow:
    calc(var(--stroke-width) * -0.5) calc(var(--stroke-width) * -0.5) 0
      var(--stroke-color),
    calc(var(--stroke-width) * 0.5) calc(var(--stroke-width) * -0.5) 0
      var(--stroke-color),
    calc(var(--stroke-width) * -0.5) calc(var(--stroke-width) * 0.5) 0
      var(--stroke-color),
    calc(var(--stroke-width) * 0.5) calc(var(--stroke-width) * 0.5) 0
      var(--stroke-color);
  color: var(--fill-color);
  paint-order: stroke fill;
}
</style>
