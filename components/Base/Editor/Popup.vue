<template>
  <transition name="fade">
    <div
      v-show="show"
      ref="popup"
      class="__editor-popup absolute z-40 flex items-center rounded-5 border-[0.0313rem] border-white/20 bg-[#0D0D0D]"
      :class="$device.isMobile ? 'p-1' : 'p-2'"
    >
      <slot />
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    location: {
      type: Object,
      default: () => ({
        left: 0,
        top: 0,
        right: undefined,
      }),
    },
  },
  watch: {
    location(val) {
      if (this.show) {
        this.$refs.popup.style.top = `${val.top}px`;
        if (val.right === 0) {
          this.$refs.popup.style.right = `${val.right}px`;
          this.$refs.popup.style.left = `auto`;
        } else {
          this.$refs.popup.style.left = `${val.left}px`;
          this.$refs.popup.style.right = `auto`;
        }
      }
    },
  },
};
</script>
<style scoped>
.fade-enter-from {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
