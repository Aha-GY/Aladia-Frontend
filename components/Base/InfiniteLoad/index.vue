<template>
  <div>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    threshold: {
      type: Number,
      default: 40,
    },
  },
  data() {
    return {
      // hasLoadedOnce: false, // Mark whether it has been loaded once
      scrollListener: null,
    };
  },
  mounted() {
    this.scrollListener = throttle(this.handleScroll.bind(this), 200);
    window.addEventListener('scroll', this.scrollListener);

    // if (!this.disabled) {
    //   this.loadMore();
    // }
  },
  beforeUnmount() {
    // 移除滚动事件监听器
    window.removeEventListener('scroll', this.scrollListener);
  },
  methods: {
    handleScroll() {
      // if (this.scrollDisabled && this.hasLoadedOnce) return;
      if (this.disabled) {
        return;
      }

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      // Check if scrolled to the bottom
      if (scrollTop + clientHeight + this.threshold >= scrollHeight) {
        this.loadMore();
      }
    },
    loadMore() {
      this.$emit('load-more');
      // this.hasLoadedOnce = true;
    },
  },
};
</script>
