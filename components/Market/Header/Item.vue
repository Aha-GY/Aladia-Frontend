<template>
  <div
    class="mb-2 flex w-[25%] items-center justify-center text-center text-xs sm:w-[10%]"
  >
    <div
      ref="item"
      class="animate__animated relative flex w-24 cursor-pointer flex-col items-center justify-center rounded border px-0.5 py-2"
      :class="
        active
          ? 'animate__shake border-white/20 bg-black/50'
          : 'border-transparent bg-transparent'
      "
    >
      <BaseCategoryIcon
        :image="item.image?.url"
        class="mb-2 !size-16"
        data-cy="4089c7bd0ec505e8"
        @click="onClick"
      />
      <div class="line-clamp-2 h-8">{{ item.name }}</div>
      <div
        v-if="active"
        class="absolute -right-[0.5rem] -top-[0.5rem] flex h-[1.1rem] w-[1.1rem] items-center justify-center rounded-full bg-red-600 transition-all hover:rotate-180 hover:scale-125"
        data-cy="d056f8537a4823e3"
        @click="onCloseClick"
      >
        <i class="fa-solid fa-xmark" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
    index: Number,
    categoryId: String,
  },
  setup() {
    const marketStore = useMarketStore();
    return { marketStore };
  },
  computed: {
    active() {
      return this.item.id === this.$route.query?.subCategoryId;
    },
  },
  methods: {
    async onClick() {
      if (this.active) {
        this.$router.push(`/marketplace?categoryId=${this.categoryId}`);
      } else {
        this.$router.push(
          `/marketplace?categoryId=${this.categoryId}&subCategoryId=${this.item.id}`,
        );
      }
    },
    onCloseClick() {
      this.$router.push(`/marketplace?categoryId=${this.categoryId}`);
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
