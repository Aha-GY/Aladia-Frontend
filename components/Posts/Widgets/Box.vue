<template>
  <div
    class="w-[20rem] p-4 max-2xl:w-[16rem]"
    :class="{ 'rounded-[0.3125rem] border-[1px] border-[#3D3D3D]': border }"
  >
    <div
      v-if="showHeader"
      class="mb-[0.625rem] flex items-center justify-between py-[0.375rem]"
    >
      <div class="text-sm font-medium text-[#D9D9D9]">{{ label }}</div>
      <slot name="toolbar" />
    </div>
    <slot />
  </div>
</template>
<script>
export default {
  props: {
    showHeader: {
      type: Boolean,
      default: true,
    },
    label: String,
    border: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const socialStore = useSocialStore();
    return { socialStore };
  },
  beforeMount() {
    const { postId } = this.$route.query;

    !postId && this.resetPopup();
  },
  methods: {
    resetPopup() {
      this.socialStore.commentsPopup = false;
      this.socialStore.questionPopup = false;
      this.socialStore.sharePopup = false;
      this.socialStore.postItem = null;
    },
  },
};
</script>
