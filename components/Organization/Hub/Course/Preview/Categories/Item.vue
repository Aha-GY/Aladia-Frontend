<template>
  <div
    class="mb-2 flex w-[25%] justify-center px-3 md:w-[12.5%]"
    :class="hubCourse.versionViewing ? 'pointer-events-none' : ''"
  >
    <div
      class="animate__animated group/category relative inline-flex cursor-pointer flex-col items-center gap-0.5 rounded px-1 py-1.5 transition-all duration-300 active:scale-90"
      :class="
        active
          ? 'animate__shake border-white/20 bg-black/50'
          : 'border-transparent bg-transparent'
      "
      data-cy="3643c93869b1bcee"
      @click="onClick"
    >
      <BaseCategoryIcon :image="category.image?.url" size="xl" />
      <div class="line-clamp-2 text-center text-xs text-white" v-html="name" />
      <div
        v-if="active"
        class="absolute -right-1.5 -top-1.5 z-20 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 transition-all hover:rotate-180 hover:scale-125"
        data-cy="5e627b298f97e333"
        @click.stop.prevent="onClose"
      >
        <i class="fa-regular fa-xmark text-xs text-white" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    category: {
      type: Object,
      required: true,
    },
    row: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const hubCourse = useHubCoursesStore();
    return { hubCourse };
  },
  computed: {
    course() {
      return this.hubCourse.detail;
    },
    active() {
      return this.course.subCategories.find((id) => id === this.category.id);
    },
    search() {
      return this.hubCourse.categorySearch;
    },
    name() {
      return this.search
        ? highlightKeywords(this.category.name, [this.search])
        : this.category.name;
    },
  },
  methods: {
    onClick() {
      if (this.course.subCategories.length < 3 && !this.active) {
        this.course.categories.push(this.category.parentId);
        this.course.subCategories.push(this.category.id);
      }
    },
    onClose() {
      const index = this.course.subCategories.findIndex(
        (item) => item === this.category.id,
      );
      this.course.categories.splice(index, 1);
      this.course.subCategories.splice(index, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.animate__animated.animate__shake {
  animation-timing-function: ease-in-out;
  animation-name: shake;
}

@keyframes shake {
  0% {
    transform: translateY(0);
  }

  6.5% {
    transform: translateY(-6px) rotateY(-9deg);
  }

  18.5% {
    transform: translateY(5px) rotateY(7deg);
  }

  31.5% {
    transform: translateY(-3px) rotateY(-5deg);
  }

  43.5% {
    transform: translateY(2px) rotateY(3deg);
  }

  50% {
    transform: translateY(0);
  }
}
</style>
