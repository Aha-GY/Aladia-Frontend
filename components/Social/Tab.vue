<template>
  <div
    class="fixed left-1/2 top-24 z-20 flex h-12 w-[34.25rem] -translate-x-1/2 cursor-pointer rounded border border-[#565656]/40 bg-black/60 text-[#707070]"
  >
    <div
      v-for="(type, index) in types"
      :key="type"
      class="group relative flex flex-1 items-center justify-center overflow-hidden transition-all active:scale-95"
      :class="socialStore.tabIndex === index ? 'font-semibold text-white' : ''"
      data-cy="1fda822c82476eb6"
      @click="onChangeTab(index)"
    >
      {{ $t(type) }}
      <div
        class="absolute -bottom-5 left-1/2 z-10 h-5 w-2/3 -translate-x-1/2 rounded-[50%/50%] bg-black shadow-[0px_6px_25px_rgba(255,255,255,0.6)] transition-all duration-300 group-hover:opacity-100"
        :class="socialStore.tabIndex === index ? 'opacity-100' : 'opacity-0'"
      />
    </div>
    <div
      class="bg-gradient-top absolute bottom-0 left-0 h-px w-1/3 transition-all duration-300"
      :style="{ transform: `translateX(${socialStore.tabIndex * 100}%)` }"
    />
  </div>
</template>

<script>
export default {
  setup() {
    const socialStore = useSocialStore();
    return { socialStore };
  },
  data() {
    return {
      types: ['post.general', 'post.social', 'post.question.label'],
    };
  },
  methods: {
    onChangeTab(index) {
      this.$emit('change-tab', index);
    },
  },
};
</script>
