<template>
  <div ref="wrapper" class="carousel relative mb-6 w-full overflow-hidden">
    <div
      ref="content"
      class="whitespace-nowrap text-[0] duration-300 ease-in-out will-change-transform"
      :style="{ transform: `translateX(${distance}px)` }"
    >
      <slot />
    </div>

    <div
      class="absolute left-2 top-1/2 z-10 -mt-[2.25rem] flex h-12 w-7 cursor-pointer items-center justify-center rounded-5"
      :class="isAtStart ? 'pointer-events-none opacity-0' : 'opacity-100'"
      data-cy="fae14076e4793066"
      @click="onLeftClick"
    >
      <div
        class="absolute inset-0 z-0 h-full w-full scale-100 rounded-lg border border-[#565656] bg-[#101010] transition-all hover:scale-[1.2] hover:border-white active:scale-100"
      />
      <i
        class="fa-light fa-chevron-left pointer-events-none relative z-10 text-base text-white"
      />
    </div>
    <div
      class="absolute right-2 top-1/2 z-10 -mt-[2.25rem] flex h-12 w-7 cursor-pointer items-center justify-center rounded-5"
      :class="isAtEnd ? 'pointer-events-none opacity-0' : 'opacity-100'"
      data-cy="3fbaa79c9848ee90"
      @click="onRightClick"
    >
      <div
        class="absolute inset-0 z-0 h-full w-full scale-100 rounded-full border border-white/50 bg-black/80 transition-all hover:scale-[1.2] hover:border-white active:scale-100"
      />
      <i
        v-if="loading"
        class="fa-solid fa-spinner relative z-10 animate-spin text-xl"
      />
      <div
        class="absolute inset-0 z-0 h-full w-full scale-100 rounded-lg border border-[#565656] bg-[#101010] transition-all hover:scale-[1.2] hover:border-white active:scale-100"
      />
      <i
        class="fa-light fa-chevron-right pointer-events-none relative z-10 text-base text-white"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    loadMore: Function,
  },
  data() {
    return {
      distance: 0,
      isAtStart: true,
      isAtEnd: false,
      loading: false,
    };
  },
  mounted() {
    window.addEventListener('resize', this.onResize);
    this.$nextTick(() => {
      this.updateButtons();
    });
  },
  unmounted() {
    window.removeEventListener('resize', this.onResize);
  },
  methods: {
    onResize() {},
    onLeftClick() {
      const containerWidth = this.$refs.wrapper.clientWidth;
      const currentTranslateX = this.distance;

      const scrollDistance = Math.min(
        containerWidth,
        Math.abs(currentTranslateX),
      ); // 确保不超过已经滚动的距离

      this.distance = currentTranslateX + scrollDistance; // 更新 translateX 值，向右移动
      this.updateButtons();
      this.$emit('left-click');
    },
    async onRightClick() {
      const containerWidth = this.$refs.wrapper.clientWidth;
      const totalContentWidth = this.$refs.content.scrollWidth;
      const currentTranslateX = this.distance;

      const remainingScrollDistance =
        totalContentWidth - containerWidth - Math.abs(currentTranslateX); // 剩余内容距离
      const scrollDistance = Math.min(containerWidth, remainingScrollDistance); // 确保不超过剩余内容

      if (remainingScrollDistance < containerWidth && this.loadMore) {
        this.loading = true;
        await this.loadMore();
        this.loading = false;
      }

      this.distance = currentTranslateX - scrollDistance; // 更新 translateX 值，向左移动
      this.$emit('right-click'); // 剩下的距离小于外部容器宽度时，触发加载事件
      this.updateButtons();
    },
    updateButtons() {
      const containerWidth = this.$refs.wrapper.clientWidth;
      const totalContentWidth = this.$refs.content.scrollWidth;
      const currentTranslateX = this.distance;

      // 判断是否在最左边
      this.isAtStart = Math.abs(currentTranslateX) < 1;

      // 判断是否在最右边
      const maxTranslateX = -(totalContentWidth - containerWidth);
      this.isAtEnd = currentTranslateX <= maxTranslateX;
    },
  },
};
</script>
