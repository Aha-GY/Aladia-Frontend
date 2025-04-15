<template>
  <div
    class="fixed bottom-0 left-1/2 z-[2000] flex h-12 -translate-x-1/2 items-center gap-3 rounded-t-5 bg-[#141617] px-2 transition-all"
    :class="animate ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'"
  >
    <div class="w-[11rem] pl-2 text-sm text-[#f1f1f1]">
      {{ !isUndo ? $t('base.notification.save') : title }}
    </div>
    <BaseButton
      v-if="isUndo"
      label="$t:base.notification.undo"
      type="red-cancel"
      data-cy="ad8a3ce4b31d8701"
      @click="onUndo"
    />
    <BaseIconClose data-cy="737a6ebe41d9002d" @click.stop="onHide" />
  </div>
</template>
<script>
export default {
  props: {
    title: String,
    isUndo: Boolean,
  },
  data() {
    return {
      animate: false,
    };
  },
  mounted() {
    setTimeout(() => {
      this.animate = true;
    }, 100);
    setTimeout(() => {
      this.onHide();
    }, 15000);
  },
  methods: {
    async onHide() {
      this.animate = false;
      await sleep(200);
      this.$emit('onHide');
    },
    async onUndo() {
      this.$emit('onUndo');
      this.onHide();
    },
  },
};
</script>
