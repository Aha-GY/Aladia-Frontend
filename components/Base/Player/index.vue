<template>
  <div ref="artRef" class="base-player" />
</template>

<script>
import Artplayer from 'artplayer';

Artplayer.USE_RAF = true;
Artplayer.LOG_VERSION = false;
Artplayer.CONTEXTMENU = false;
Artplayer.CONTROL_HIDE_TIME = 10000;
Artplayer.FULLSCREEN_WEB_IN_BODY = true;

export default {
  props: {
    option: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      art: null,
    };
  },
  mounted() {
    const art = new Artplayer({
      ...this.option,
      container: this.$refs.artRef,
    });

    art.on('ready', () => {
      if (this.option.linearGradient) {
        this.setLinearGradient(art);
      }
      if (this.option.portraitScreen) {
        this.setPortraitScreen(art);
      }
    });

    art.on('resize', () => {
      if (this.option.portraitScreen) {
        this.setPortraitScreen(art);
      }
    });

    this.art = art;
    this.$nextTick(() => {
      this.$emit('get-instance', art);
    });
  },
  beforeUnmount() {
    if (this.art && this.art.destroy) {
      this.art.destroy(false);
    }
  },
  methods: {
    async setLinearGradient(art) {
      if (this.art.isDestroy) {
        return;
      }
      await sleep(200);
      const { $player, $video } = art.template;
      const color = getAverageColor($video);
      if (color) {
        if (color === 'rgb(0, 0, 0)') {
          this.setLinearGradient(art);
        } else {
          $video.style.backgroundColor = 'transparent';
          $player.style.backgroundColor = color;
        }
      }
    },
    setPortraitScreen(art) {
      const { $player, $video } = art.template;

      const width = (9 / 16) * art.height;
      const padding = `0 ${(art.width - width) / 2}px`;
      $video.style.padding = padding;

      if (!art.template.$background) {
        const $background = document.createElement('div');
        const $inner = document.createElement('div');
        $inner.style.width = '100%';
        $inner.style.height = '100%';
        $inner.style.backgroundColor = 'black';
        $background.style.position = 'absolute';
        $background.style.inset = '0';
        $background.style.zIndex = '9';
        $background.appendChild($inner);
        $player.insertBefore($background, $video);
        art.template.$background = $background;
      }

      const { $background } = art.template;
      $background.style.padding = padding;
      $background.style.background = `linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%)`;
    },
  },
};
</script>

<style lang="scss">
.base-player {
  .art-video-player {
    text-shadow: none !important;
  }

  .art-video-player {
    background-color: #000;
    transition: background-color 0.3s ease;
  }

  .art-poster {
    background-color: #000;
  }

  .art-notice {
    opacity: 0;
  }
}
</style>
