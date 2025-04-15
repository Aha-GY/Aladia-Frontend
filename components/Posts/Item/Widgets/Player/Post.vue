<!-- 用于在 Post Carousel 中展示视频附件 -->

<template>
  <div ref="player" class="relative z-10">
    <BasePlayer
      class="post-player size-full overflow-hidden rounded"
      :class="customStyle"
      :option="computedOptions"
      @get-instance="getInstance"
    />
  </div>
</template>

<script>
export default {
  props: {
    video: {
      type: Object,
      default: () => ({}),
    },
    customStyle: {
      type: String,
      default: '',
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      art: null,
      control: true,
      ended: false,
      observer: null,
      option: {
        playbackRate: false,
        aspectRatio: false,
        setting: true,
        pip: true,
        flip: true,
        muted: true,
        fullscreen: true,
        fullscreenWeb: true,
        miniProgressBar: true,
        lang: 'en',
        controls: [],
        linearGradient: true,
        portraitScreen: false,
        moreVideoAttr: {
          crossOrigin: 'anonymous',
        },
      },
    };
  },
  computed: {
    ownerName() {
      return this.item.owner?.name || 'Aladia User';
    },
    computedOptions() {
      return { ...this.option, ...this.options };
    },
  },
  beforeUnmount() {
    this.observer?.disconnect();
  },
  methods: {
    getInstance(art) {
      this.art = art;
      art.url = this.video?.url || '';

      art.on('control', (state) => {
        this.control = state;
      });

      art.on('video:play', () => {
        this.ended = false;
      });

      art.on('video:ended', () => {
        this.ended = true;
      });

      art.on('ready', () => {
        this.observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                art.play();
              } else {
                art.pause();
              }
            });
          },
          {
            threshold: 0.5,
          },
        );
        this.observer.observe(art.video);
      });
    },
  },
};
</script>
