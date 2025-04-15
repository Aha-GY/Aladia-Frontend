<template>
  <div>
    <video
      v-for="vd in realVideos"
      :key="vd.fileId"
      :src="vd.url"
      playsinline
      class="m-auto w-full object-cover"
      @play="isPlaying"
      @loadedmetadata="onLoadedMetadata"
    />
  </div>
</template>
<script>
export default {
  props: {
    realVideos: Array,
  },
  methods: {
    isPlaying() {
      this.$emit('isPlaying', true);
    },
    onLoadedMetadata(event) {
      const video = event.target;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              video.play();
            } else {
              video.pause();
            }
          });
        },
        {
          threshold: 0.5, // 50% 可见时触发
        },
      );
      observer.observe(video);
    },
  },
};
</script>
