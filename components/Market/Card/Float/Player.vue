<template>
  <div
    class="relative z-0 h-full w-full cursor-pointer rounded-t-md bg-black text-white"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
    @mousemove="onMouseMove"
  >
    <div
      v-show="url"
      ref="player"
      class="absolute bottom-0 left-0 right-0 top-0 z-0 overflow-hidden rounded-t-md"
    >
      <video
        v-if="!videoEl"
        ref="video"
        :src="url"
        class="h-full w-full overflow-hidden rounded-t-md object-cover"
        :loop="loop"
        :autoplay="autoplay"
        @pause="$emit('pause')"
      />
    </div>
    <BaseCourseThumbnail
      v-if="!playing && !currentTime"
      class="pointer-events-none absolute inset-0 z-10 h-full w-full rounded-b-none rounded-t-md bg-black text-4xl"
      :url="poster"
    />
    <div
      v-if="url"
      class="absolute bottom-0 left-0 right-0 top-0 z-20"
      data-cy="7fd55715f2a59b60"
      @click.self="toggle"
    >
      <div
        class="absolute right-2 top-2 flex size-6 cursor-pointer items-center justify-center rounded bg-black/70 px-1 text-xs"
        data-cy="0ca2042518719cc1"
        @click.stop.prevent="toggleMuted"
      >
        <i v-if="muted" class="fa-solid fa-volume-slash" />
        <i v-else class="fa-solid fa-volume" />
      </div>
      <div
        class="pointer-events-none absolute bottom-0 left-0 right-0 z-0 h-16 bg-gradient-to-t from-black opacity-100 transition-opacity duration-300"
        :class="hideTime && !$device.isMobile ? 'opacity-0' : 'opacity-100'"
      />
      <div
        ref="progress"
        class="absolute -bottom-3 left-0 right-0 flex h-6 w-full cursor-pointer select-none items-center"
        data-cy="062a1c4558fe3223"
        @mousemove="onProgressMouseMove"
        @mouseout="isProgressHover = false"
        @click="onProgressClick"
        @mousedown="onProgressMouseDown"
      >
        <div
          class="relative h-0.5 w-full transition-all"
          :style="isProgressHover ? { height: '0.25rem' } : null"
        >
          <div
            class="absolute bottom-0 left-0 right-0 z-0 h-full w-full bg-white/20"
          />
          <div
            class="absolute bottom-0 left-0 right-0 z-10 h-full bg-white/20"
            :style="{ width: `${loaded * 100}%` }"
          />
          <div
            class="absolute bottom-0 left-0 right-0 z-20 h-full bg-white/20 transition-opacity"
            :style="{
              width: `${moved * 100}%`,
              opacity: isProgressHover ? 1 : 0,
            }"
          />
          <div
            class="absolute bottom-0 left-0 right-0 z-30 h-full bg-red-600"
            :style="{ width: `${played * 100}%` }"
          >
            <div
              class="absolute -right-2 -top-1.5 h-4 w-4 scale-50 rounded-full bg-red-600 opacity-0 transition-all"
              :style="
                isProgressHover
                  ? { opacity: 1, transform: 'scale(0.75)' }
                  : null
              "
            />
          </div>
        </div>
      </div>
      <div
        v-show="!isProgressHover"
        class="pointer-events-none absolute bottom-3 left-2 z-10 text-xs leading-none text-white/80 opacity-100 transition-opacity duration-300"
        :class="hideTime && !$device.isMobile ? 'opacity-0' : 'opacity-100'"
      >
        {{ secondToTime(currentTime) }} / {{ secondToTime(duration) }}
      </div>
      <div
        v-show="sprite.img && isProgressHover && duration"
        ref="sprite"
        class="pointer-events-none absolute bottom-10 z-20 flex origin-bottom select-none items-end justify-center rounded border-2 border-white bg-black bg-no-repeat shadow-md"
        :style="{
          backgroundImage: `url(${thumbnails})`,
          backgroundPosition: `${sprite.x}px ${sprite.y}px`,
          height: `${sprite.height}px`,
          width: `${sprite.width}px`,
          left: `${sprite.left}px`,
        }"
      >
        <div class="-mb-7 text-xs text-white/80">
          {{ secondToTime(sprite.time) }}
        </div>
      </div>
      <div
        v-show="(hover && duration) || $device.isMobile"
        class="pointer-events-none absolute inset-0 flex h-full w-full items-center justify-center text-3xl opacity-50"
      >
        <div
          class="flex h-10 w-10 items-center justify-center rounded-full bg-black/50"
        >
          <i
            class="fa-solid"
            :class="playing ? 'fa-circle-pause' : 'fa-circle-play'"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    course: {
      type: Object,
      required: true,
    },
    loop: {
      type: Boolean,
      default: true,
    },
    autoplay: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const marketStore = useMarketStore();
    return { marketStore };
  },
  data() {
    return {
      muted: true,
      timer: null,
      loaded: 0,
      played: 0,
      moved: 0,
      hover: false,
      playing: false,
      hideTime: false,
      lastTime: Date.now(),
      currentTime: 0,
      duration: 0,
      video: null,
      isProgressHover: false,
      sprite: {
        img: null,
        time: 0,
        width: 0,
        height: 0,
        left: 0,
        x: 0,
        y: 0,
      },
    };
  },
  computed: {
    url() {
      return this.course.trailer?.url;
    },
    poster() {
      return this.course.thumbnail?.url;
    },
    thumbnails() {
      return this.course.trailer?.metadata?.framingPath;
    },
    videoEl() {
      return this.marketStore.floatVideo;
    },
  },
  mounted() {
    console.log('video', this.url);
    console.log('thumbnails', this.thumbnails);
    document.addEventListener('mousemove', this.onDocMouseMove);
    document.addEventListener('mouseup', this.onDocMouseup);
    if (this.videoEl) {
      this.$refs.player.append(this.videoEl);
      this.video = this.videoEl;
    } else {
      this.video = this.$refs.video;
    }
    this.onTimeUpdate();
    if (this.autoplay) {
      this.tryPlay();
    }
    this.initSprite();
  },
  beforeUnmount() {
    cancelAnimationFrame(this.timer);
    document.removeEventListener('mousemove', this.onDocMouseMove);
    document.removeEventListener('mouseup', this.onDocMouseup);
  },
  methods: {
    getPosFromEvent(event) {
      const $progress = this.$refs.progress;
      const { left } = $progress.getBoundingClientRect();
      const width = clamp(event.pageX - left, 0, $progress.clientWidth);
      const second = (width / $progress.clientWidth) * this.duration;
      const time = secondToTime(second);
      const percentage = clamp(width / $progress.clientWidth, 0, 1);
      return { second, time, width, percentage };
    },
    async tryPlay() {
      if (this.video) {
        try {
          this.video.muted = true;
          await this.video.play();
        } catch (error) {
          const url = this.video.src;
          this.video.src = '';
          this.video.src = url;
          this.video.muted = true;
          await this.video.play();
        }
      }
    },
    onTimeUpdate() {
      this.timer = requestAnimationFrame(() => {
        if (this.video) {
          this.muted = this.video.muted;
          this.played = this.video.currentTime / this.video.duration;
          this.loaded =
            (this.video.buffered.length
              ? this.video.buffered.end(this.video.buffered.length - 1)
              : 0) / this.video.duration;
          this.currentTime = this.video.currentTime || 0;
          this.duration = this.video.duration || 0;
          this.playing = !!(
            this.video.currentTime > 0 &&
            !this.video.paused &&
            !this.video.ended &&
            this.video.readyState > 2
          );
          if (Date.now() - this.lastTime >= 3000 && !this.hideTime) {
            this.hideTime = true;
          }
        }

        this.$emit('playing', this.playing);
        this.onTimeUpdate();
      });
    },
    toggleMuted() {
      if (this.video) {
        this.video.muted = !this.muted;
      }
    },
    onMouseMove() {
      this.hover = true;
      this.hideTime = false;
      this.lastTime = Date.now();
    },
    async initSprite() {
      if (!this.thumbnails) {
        return;
      }
      this.sprite.img = await loadImg(this.thumbnails);
    },
    onProgressMouseMove(event) {
      this.isProgressHover = true;
      const { left: bottomLeft, width: bottomtWidth } =
        this.$refs.progress.getBoundingClientRect();
      const posWidth = event.pageX - bottomLeft;
      const moved = posWidth / bottomtWidth;
      this.moved = moved;
      if (!this.sprite.img) {
        return;
      }
      const number = 100;
      const column = 10;
      const width = this.sprite.img.naturalWidth / column;
      const height = this.sprite.img.naturalHeight / column;
      const perWidth = bottomtWidth / number;
      const perIndex = Math.floor(posWidth / perWidth);
      const yIndex = Math.ceil(perIndex / column) - 1;
      const xIndex = perIndex % column || column - 1;
      this.sprite.width = width;
      this.sprite.height = height;
      this.sprite.x = -(xIndex * width);
      this.sprite.y = -(yIndex * height);
      this.sprite.time = moved * this.video.duration;
      if (posWidth <= width / 2) {
        this.sprite.left = 0;
      } else if (posWidth > bottomtWidth - width / 2) {
        this.sprite.left = bottomtWidth - width;
      } else {
        this.sprite.left = posWidth - width / 2;
      }
    },
    toggle() {
      if (this.playing) {
        return this.video.pause();
      } else {
        return this.video.play();
      }
    },
    onProgressClick(event) {
      this.isProgressHover = true;
      const { second } = this.getPosFromEvent(event);
      this.video.currentTime = second;
    },
    onProgressMouseDown(event) {
      this.isProgressHover = true;
      const { second } = this.getPosFromEvent(event);
      this.video.currentTime = second;
      this.isDroging = event.button === 0;
    },
    onDocMouseMove(event) {
      if (this.isDroging) {
        const { second } = this.getPosFromEvent(event);
        this.video.currentTime = second;
      }
    },
    onDocMouseup() {
      if (this.isDroging) {
        this.isDroging = false;
      }
    },
  },
};
</script>
