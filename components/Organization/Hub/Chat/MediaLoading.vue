<template>
  <div
    ref="containerRef"
    class="relative flex max-h-[18.75rem] items-center justify-center object-fill"
    :style="{
      height: containerHeight ? `${containerHeight}px` : 'auto',
      aspectRatio: `${width}/${height}`,
    }"
  >
    <div
      v-if="loading && isHeight && !media.loaded"
      class="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center rounded-5 bg-white/10"
    >
      <i
        v-if="isHeight"
        class="fa-regular fa-spinner animate-spin text-xl text-white/60"
      />
    </div>
    <img
      v-if="isImage"
      class="mb-1 cursor-pointer rounded-5 object-cover transition-all duration-300"
      :class="isHeight ? 'h-full w-full' : 'max-h-[18.75rem]'"
      :src="media.url"
      :style="{ opacity: loading ? 0 : 1 }"
      async
      @load="onLoad"
      @click="preview"
    />
    <video
      v-if="isVideo"
      class="mb-1 h-full w-full cursor-pointer rounded-5 object-cover transition-all duration-300"
      :class="isHeight ? 'h-full w-full' : 'max-h-[18.75rem]'"
      :style="{ opacity: loading ? 0 : 1 }"
      :src="media.url"
      async
      controls
      @loadeddata="onLoad"
      @click="preview"
    />
  </div>
</template>
<script>
export default {
  props: {
    media: Object,
    isPopup: Boolean,
    containerWidth: Number,
  },
  setup() {
    const hubChatStore = useHubChatStore();
    return {
      hubChatStore,
    };
  },
  data() {
    return {
      loading: true,
    };
  },
  computed: {
    isHeight() {
      return this.media?.height || 0;
    },
    height() {
      return this.media?.height || 0;
    },
    width() {
      return this.media?.width || 0;
    },
    isImage() {
      return this.media?.mimetype.startsWith('image/');
    },
    isVideo() {
      return this.media?.mimetype.startsWith('video/');
    },
    containerHeight() {
      if (!this.containerWidth) {
        return 0;
      }
      const minWidth = Math.min(this.containerWidth, this.width);
      const aspectRatio = this.height / this.width;
      return minWidth * aspectRatio;
    },
  },
  methods: {
    async onLoad() {
      this.loading = false;
    },
    preview() {
      this.hubChatStore.previewMedia(this.media.id, this.hubChatStore.chatId);
    },
  },
};
</script>
