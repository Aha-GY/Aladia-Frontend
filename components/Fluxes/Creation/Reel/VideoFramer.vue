<template>
  <div class="flex flex-col">
    <video
      ref="video"
      class="hidden"
      autoplay
      muted="true"
      crossorigin="anonymous"
      @loadeddata="onVideoLoaded"
    />

    <canvas ref="canvas" style="display: none" />

    <div v-if="frames.length > 0" class="flex">
      <div
        v-for="(frame, index) in frames"
        :key="index"
        class="flex cursor-grab"
      >
        <img
          :src="frame.url"
          :alt="'Frame ' + index"
          class="h-10 w-[1.375rem] rounded-br-sm rounded-tr-sm object-cover transition-transform duration-200"
          :class="[
            'h-10 w-[1.375rem] rounded-br-sm rounded-tr-sm object-cover transition-transform duration-200',
            {
              'hover:border-2 hover:border-white': !isActive(index),
              'border-2 border-[#E0B92C]': isActive(index) && !imageUploaded,
            },
          ]"
          @click="handleFrameClick(index)"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    videoUrl: {
      type: String,
      required: true,
    },
    imageUploaded: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      frames: [],
      activeIndex: null,
    };
  },
  watch: {
    videoUrl(newUrl) {
      this.loadVideoFromUrl(newUrl);
    },
  },
  mounted() {
    this.loadVideoFromUrl(this.videoUrl);
  },
  methods: {
    async extractFrames() {
      const video = this.$refs.video;

      if (!video || !video.duration) {
        console.error('Video is not loaded or unavailable.');
        return;
      }

      const offScreenCanvas = new OffscreenCanvas(
        video.videoWidth,
        video.videoHeight,
      );
      const context = offScreenCanvas.getContext('2d');
      const interval = 2;

      this.frames = [];

      for (let time = 0; time < video.duration; time += interval) {
        video.currentTime = time;

        await new Promise((resolve) => {
          video.onseeked = async () => {
            context.drawImage(
              video,
              0,
              0,
              offScreenCanvas.width,
              offScreenCanvas.height,
            );

            const blob = await offScreenCanvas.convertToBlob({
              type: 'image/png',
            });
            const frameUrl = URL.createObjectURL(blob);

            this.frames.push({
              url: frameUrl,
              blob,
              type: blob.type,
              size: blob.size,
              name: `frame-${Math.floor(video.currentTime)}.png`,
            });

            this.activeIndex = 0;
            resolve();
          };
        });
      }

      this.$emit('framesLoaded', this.frames);
    },
    isActive(index) {
      return this.activeIndex === index;
    },
    handleFrameClick(index) {
      this.activeIndex = index;
      this.$emit('frameSelected', this.frames[index]);
    },
    loadVideoFromUrl(url) {
      const videoElement = this.$refs.video;
      videoElement.src = url;
      videoElement.load();
    },
    onVideoLoaded() {
      console.log('Video loaded successfully.');
      this.extractFrames();
    },
  },
};
</script>
