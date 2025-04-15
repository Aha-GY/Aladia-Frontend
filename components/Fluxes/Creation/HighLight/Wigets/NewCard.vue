<template>
  <div class="card relative w-full rounded-5">
    <div
      class="flex aspect-[9/16] w-full items-center justify-center overflow-hidden rounded-5"
    >
      <div
        v-if="item.loading"
        class="skeleton h-full w-full rounded-5 !bg-white"
      />
      <template v-else>
        <div class="h-full w-full">
          <FluxesCreationStoryMainWigetsVideo
            v-if="hasPlatformVideo"
            :video-source="platformVideo?.url"
            :video-cover="videoCover"
          />
          <FluxesCreationStoryMainWigetsImage
            v-else
            :image-src="platformImageCover.url"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
  },
  computed: {
    videoCover() {
      return this.item.cover.url;
    },
    platformImageCover() {
      return this.item.files.find((file) =>
        file?.metadata?.mimetype?.startsWith('image/'),
      );
    },
    platformVideo() {
      return this.item.files.find((file) =>
        file?.metadata?.mimetype?.startsWith('video/'),
      );
    },
    hasPlatformVideo() {
      return this.item.files.some((file) =>
        file?.metadata?.mimetype?.startsWith('video/'),
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@media (max-width: 768px) {
  .card {
    display: flex;
    align-items: center;
    height: 90%;
  }
}
</style>
