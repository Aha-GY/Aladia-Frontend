<template>
  <div
    class="group/item flex h-[3.125rem] items-center gap-1 p-2 text-sm text-white/80"
  >
    <div class="flex h-11 w-11 items-center justify-center">
      <div
        class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-5 hover:bg-white/15 hover:text-white/80"
        data-cy="7b907876e4b0cd6c"
        @click="onBack"
      >
        <i class="fa-solid fa-angle-left" />
      </div>
    </div>
    <div>
      {{ title }}
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: String,
  },
  setup() {
    const hubChatStore = useHubChatStore();
    return { hubChatStore };
  },
  methods: {
    onBack() {
      this.$emit('onBack');
    },
  },
};
</script>
