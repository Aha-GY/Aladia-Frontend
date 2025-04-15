<template>
  <div
    class="rounded-[0.3125rem] bg-[#707070] bg-opacity-[0.03] px-[0.625rem] py-[0.375rem]"
  >
    <div class="flex items-center justify-between">
      <div
        class="flex items-center gap-2 py-[0.375rem] pl-[0.5rem] text-base text-white"
      >
        <i v-if="icon" class="text-sm text-[#B0B0B0]" :class="icon" />
        <div>{{ label }}</div>
        <div
          v-if="showTotalItems"
          class="flex size-[1.5rem] items-center justify-center rounded-[0.3125rem] bg-[#707070] bg-opacity-[0.03] p-[0.1875rem] text-sm"
        >
          {{ formatNumber(totalItems) }}
        </div>
      </div>

      <div
        v-if="expandable"
        class="cursor-pointer text-[0.75rem] text-[#CFA200] underline"
        @click="handleExpand"
      >
        {{ showMore ? $t('post.show.less') : $t('post.show.more') }}
      </div>
    </div>
    <slot />
  </div>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    totalItems: {
      type: Number,
      default: 0,
    },
    icon: {
      type: String,
      default: '',
    },
    expandable: {
      type: Boolean,
      default: false,
    },
    showTotalItems: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const socialStore = useSocialStore();
    return { socialStore };
  },
  data() {
    return {
      showMore: false,
    };
  },
  methods: {
    handleExpand() {
      this.showMore = !this.showMore;
      this.$emit('expand', this.showMore);
    },
  },
};
</script>
