<template>
  <div
    ref="player"
    class="relative z-10"
    :class="{ 'style-control-on': styleControl }"
  >
    <BasePlayer
      class="post-player aspect-video w-full overflow-hidden rounded"
      :option="option"
      @get-instance="getInstance"
    />
    <div
      class="absolute bottom-0 left-0 right-0 z-20 h-32 bg-gradient-to-t from-[#08090D]/90 via-[#08090D]/50 to-transparent"
    >
      <div
        class="absolute left-2.5 right-2.5 z-20 flex h-12 items-end justify-between transition-all duration-200"
        :class="control ? 'bottom-16' : 'bottom-2'"
      >
        <div class="flex items-center gap-2">
          <BaseAvatarNext
            :picture="item.owner?.picture"
            :show-online="false"
            size="md"
          />
          <div>
            <div class="line-clamp-1 text-13 text-white/80">
              {{ ownerName }}
            </div>
            <div class="line-clamp-1 text-sm text-white">
              {{ item.entity.title || item.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    video: {
      type: Object,
      default: () => ({}),
    },
    image: {
      type: Object,
      default: () => ({}),
    },
    styleControl: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      art: null,
      control: true,
      ended: false,
      observer: null,
      option: {
        playbackRate: true,
        aspectRatio: true,
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
  },
  beforeUnmount() {
    this.observer?.disconnect();
  },
  methods: {
    getInstance(art) {
      this.art = art;
      art.url = this.video?.url || '';
      art.poster = this.image?.url || '';

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
<style>
.style-control-on .art-control-progress {
  margin: 0 0.6rem !important;
}
.style-control-on .art-control-playAndPause {
  padding-left: 0 !important;
}
</style>
