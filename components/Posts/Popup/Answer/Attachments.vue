<!-- 用途：展示 Post 评论的附件 -->

<template>
  <div
    v-if="item.files?.length"
    class="__post-comment-attachments flex flex-wrap items-center gap-3 pb-3 pt-1"
  >
    <div
      v-for="(img, index) in (item.files || []).slice(0, 6)"
      :key="img.fileId"
      class="relative aspect-video h-24 rounded object-cover"
    >
      <div v-if="img.metadata?.mimetype?.includes('video')" class="relative">
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
          data-cy="6cfab371b688e9a3"
          @click="handleImageClick(img.fileId)"
        />
      </div>

      <img
        v-else-if="img.metadata?.mimetype?.includes('image')"
        :src="img.url"
        class="aspect-video h-24 cursor-pointer rounded object-cover"
        :alt="img.metadata?.name"
        data-cy="24de2e8f678e9cf5"
        @click="handleImageClick(img.fileId)"
      />

      <div
        v-if="index === 5 && item.files.length > 6"
        class="absolute inset-0 flex cursor-pointer items-center justify-center rounded-lg bg-black bg-opacity-50 text-2xl text-white"
        @click="handleImageClick(item.files[5].fileId)"
      >
        +{{ item.files.length - 6 }}
      </div>
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
