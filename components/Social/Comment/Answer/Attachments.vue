<template>
  <div
    v-if="item.files?.length"
    class="__story-comment-attachments flex flex-wrap items-center gap-3 pb-3 pt-1"
  >
    <div
      v-for="img in item.files || []"
      :key="img.fileId"
      class="relative aspect-video h-24 rounded object-cover"
    >
      <div v-if="isVideo(img.metadata?.name)" class="relative">
        <video
          ref="video"
          :src="img.url"
          muted
          controls
          playsinline
          class="aspect-video h-24 rounded object-cover"
        />
        <span
          class="absolute left-0 top-0 z-[1] h-full w-full cursor-pointer"
          data-cy="9f9f8b97e727be5f"
          @click="handleImageClick(img.fileId)"
        />
      </div>

      <img
        v-else-if="isImg(img.metadata?.name)"
        :src="img.url"
        class="aspect-video h-24 cursor-pointer rounded object-cover"
        :alt="img.metadata?.name"
        data-cy="97227902eef2b814"
        @click="handleImageClick(img.fileId)"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
  },
  setup() {
    const hubChatStore = useHubChatStore();
    return { hubChatStore };
  },
  methods: {
    isVideo(name) {
      return /\.(mp4|avi|mov|wmv)$/i.test(name);
    },
    isImg(name) {
      return /\.(jpg|jpeg|png|gif)$/i.test(name);
    },
    handleImageClick(id) {
      const { open, post2MediaList } = useFullscreenPreview();
      const mediaList = post2MediaList(this.item);
      open(mediaList, id);
    },
  },
};
</script>
