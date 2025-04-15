<template>
  <div class="hide-scrollbar flex w-full gap-2.5 overflow-x-auto p-[0.9375rem]">
    <div
      v-for="item in dataList"
      :key="item.id"
      class="h-[4.375rem] w-[4.375rem] shrink-0 cursor-pointer rounded-md border border-transparent bg-yellow-400 transition-all hover:brightness-[0.2]"
      :class="
        item.id === hubChatStore.previewId
          ? 'border-white/50 brightness-50'
          : 'brightness-[0.25]'
      "
      data-cy="174b9cf2627a1ecb"
      @click="hubChatStore.previewId = item.id"
    >
      <img
        v-if="item.mimetype.includes('image')"
        :src="item.url"
        class="h-full w-full rounded-md object-cover"
        alt=""
      />
      <iframe
        v-else-if="item.mimetype.includes('loom')"
        :src="item.url"
        class="h-full w-full rounded-md"
      />
      <video
        v-else
        :src="item.url"
        class="h-full w-full rounded-md object-cover"
      />
    </div>
  </div>
</template>
<script>
export default {
  setup() {
    const hubChatStore = useHubChatStore();
    return { hubChatStore };
  },
  computed: {
    dataList() {
      return this.hubChatStore.previewData;
    },
  },
};
</script>
