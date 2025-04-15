<template>
  <div class="w-[80%] shrink-0 p-2 md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5">
    <div
      class="group/course relative flex flex-col rounded bg-black"
      @mouseleave="hover = false"
      @mouseenter="hover = true"
      @mousemove="hover = true"
    >
      <div class="relative h-40 rounded-t">
        <MarketCardFloatPlayer
          v-if="hover || $device.isMobile"
          :autoplay="false"
          :course="course"
        />
        <BaseCourseThumbnail
          v-if="!$device.isMobile"
          class="pointer-events-none absolute inset-0 z-10 h-full w-full rounded-b-none rounded-t text-4xl"
          :url="course?.thumbnail?.url"
          :class="hover ? 'opacity-0' : 'opacity-100'"
        />
        <div
          v-if="!$device.isMobile"
          class="pointer-events-none absolute left-2 top-2 z-20 flex h-6 max-w-6 items-center overflow-hidden rounded bg-black/70 px-1 text-xs backdrop-blur-sm transition-all duration-300 group-hover/course:max-w-28"
        >
          <BaseCourseType :type="course.type" />
        </div>
        <div
          v-if="!$device.isMobile"
          class="pointer-events-none absolute bottom-2 right-2 z-20 flex items-center gap-1.5 rounded bg-black/70 px-2 py-1 text-xs text-white/80 shadow-md backdrop-blur transition-all duration-300"
          :class="hover ? 'opacity-0' : 'opacity-100'"
        >
          <i class="fa-regular fa-cart-shopping text-xs" />
          {{ moneyFormat(billing.totalPrice || 0) }} $
        </div>
      </div>
      <NuxtLink :to="url" class="flex h-16 items-center gap-2 p-2">
        <BaseAvatarProgress :member="course.owner" :completion="completion" />
        <div class="w-0 flex-1">
          <div class="mb-0.5 h-4 truncate text-13 text-white/50">
            {{ course.owner.name }}
          </div>
          <div class="line-clamp-2 max-w-48 text-13 leading-4">
            {{ course.title }}
          </div>
        </div>
      </NuxtLink>
      <div
        class="pointer-events-none absolute inset-0 rounded border-b-2 transition-all"
        :style="{
          borderColor: hover ? course.color : 'transparent',
        }"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
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
    };
  },
  computed: {
    owner() {
      return this.course.owner;
    },
    isFloat() {
      return this.marketStore.floatCourse === this.course;
    },
    billing() {
      return this.course.billing || {};
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

      result += `&type=continue`;

      return result;
    },
  },
};
</script>
